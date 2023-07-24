function seleccionarCliente() {

    const cliente_id = document.querySelector('#cliente-venta');

    fetch('http://localhost:4000/clientes')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let option = `
                    <option value="${data[i].cedula_cliente}">${data[i].nombres_cliente} 
                                                                ${data[i].apellidos_cliente} </option>
                `;
                cliente_id.innerHTML += option;
            }
        });
}
seleccionarCliente();

function tableResumenVenta() {

    // Obtener los datos del carrito de compras y la cabecera de la compra
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Obtener el elemento tbody de la tabla
    const tablaResumenVenta = document.querySelector('#tabla-resumen-venta');

    // Calcular el total de la compra
    let totalVenta = 0;
    let ivaT = 0;
    let sumaSubtotal = 0;

    // Llenar la tabla con los productos del carrito
    carrito.forEach(producto => {
        const { id, nombre, cantidad, precio, iva } = producto; 
        const subtotal = cantidad * precio;
        const ivaNum = iva ? subtotal *  0.12 : 0;

        // Crear una nueva fila en la tabla con los datos del producto
        const fila = document.createElement('tr');
        fila.innerHTML = `
        <td>${id} - ${nombre}</td>
        <td>${cantidad}</td>
        <td>$${precio}</td>
        <td>${iva ? 'Sí' : 'No'}</td>
        <td>$${subtotal}</td>
        `;

        // Agregar la fila a la tabla
        tablaResumenVenta.appendChild(fila);

        //suma de subtotales
        sumaSubtotal += subtotal;
        // Actualizar el total de la compra
        totalVenta += subtotal + ivaNum;
        ivaT = iva ? ivaT + ivaNum : ivaT;
    });
    // Mostrar el subtotal de la compra
    const subtotalVentaElement = document.querySelector('#subtotal-venta');
    subtotalVentaElement.textContent = `$${sumaSubtotal.toFixed(2)}`;
    // Mostrar el IVA de la compra
    const ivaVentaElement = document.querySelector('#iva-venta');
    ivaVentaElement.textContent = `$${ivaT.toFixed(2)}`;
    // Mostrar el total de la compra
    const totalVentaElement = document.querySelector('#total-venta');
    totalVentaElement.textContent = `$${totalVenta.toFixed(2)}`;     
}

tableResumenVenta();

function ingresarVenta(dataVenta) {
    fetch('http://localhost:4000/registrarventas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataVenta)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al ingresar la venta');
        }
    })
    .then((data) => {
        alert('Venta ingresada correctamente');
    })
    .catch((error) => {
        console.log(error);
    });
}

const formVenta = document.querySelector('#form-ventas');
const confirmarVentaBtn = document.querySelector('#confirmar-venta-btn');
formVenta.addEventListener('submit', (event) => {
    event.preventDefault();

    const fecha_venta = formVenta.querySelector('#fecha-venta').value;
    const cliente_id = formVenta.querySelector('#cliente-venta').value;
    const forma_pago = formVenta.querySelector('#forma-pago-venta').value;
    const id_venta = formVenta.querySelector('#id-venta').value;

    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const detallesVenta = carrito.map(producto => {
        const { id, cantidad, precio, iva } = producto;
        return {
            venta_id: id_venta,
            producto_id: id,
            cantidad: cantidad,
            precio_unitario: precio,
            iva: iva
        };
    });

    let totalVenta = 0;
    carrito.forEach(producto => {
        const { cantidad, precio, iva } = producto;
        const subtotal = cantidad * precio;
        const ivaNum = iva ? subtotal * 0.12 : 0;
        totalVenta += subtotal + ivaNum;
    });

    const dataVenta = {
        fecha_venta: fecha_venta,
        cliente_id: cliente_id,
        forma_pago: forma_pago,
        total: totalVenta,
        detalles: detallesVenta
    };

    if (formVenta.checkValidity()) {
        const opcion = confirm('¿Desea emitir la venta con factura?');

        if (opcion) {
            emitirVentaConFactura(dataVenta);
            ingresarVenta(dataVenta);
            
            // Almacenar la venta en localStorage
            localStorage.setItem('venta', JSON.stringify(dataVenta));
            
            // Redirigir a la página de factura
            location.href = 'factura.html';
        } else {
            ingresarVenta(dataVenta);

            // Redirigir a la página principal
            location.href = 'index.html';
        }
    } else {
        alert('Por favor, ingrese todos los datos');
    }
});

confirmarVentaBtn.addEventListener('click', () => {
    const venta = JSON.parse(localStorage.getItem('venta'));

    const fechaEmisionInput = document.querySelector('#fecha-emision');
    const clienteVentaInput = document.querySelector('#cliente-venta');
    const formaPagoVentaInput = document.querySelector('#forma-pago-venta');
    const idFacturaInput = document.querySelector('#id-factura');

    fechaEmisionInput.value = venta.fecha_venta;
    clienteVentaInput.value = venta.cliente_id;
    formaPagoVentaInput.value = venta.forma_pago;
    idFacturaInput.value = venta.id_venta;

    const tablaResumenFactura = document.querySelector('#tabla-resumen-factura tbody');
    const subtotalFactura = document.querySelector('#subtotal-factura');
    const ivaFactura = document.querySelector('#iva-factura');
    const totalFactura = document.querySelector('#total-factura');

    tablaResumenFactura.innerHTML = '';

    venta.detalles.forEach(detalle => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${detalle.producto_id}</td>
            <td>${detalle.cantidad}</td>
            <td>${detalle.precio_unitario}</td>
            <td>${detalle.iva ? 'Sí' : 'No'}</td>
            <td>${detalle.cantidad * detalle.precio_unitario}</td>
        `;
        tablaResumenFactura.appendChild(fila);
    });

    const subtotal = venta.detalles.reduce((total, detalle) => total + (detalle.cantidad * detalle.precio_unitario), 0);
    const iva = venta.detalles.reduce((total, detalle) => total + (detalle.iva ? detalle.cantidad * detalle.precio_unitario * 0.12 : 0), 0);
    const total = subtotal + iva;

    subtotalFactura.textContent = subtotal;
    ivaFactura.textContent = iva;
    totalFactura.textContent = total;

    const opcion = confirm('¿Desea emitir la venta con factura?');

    if (opcion) {
        location.href = 'factura.html';
    } else {
        location.href = 'index.html';
    }
});

function emitirVentaConFactura(dataFactura) {
    fetch('http://localhost:4000/registrarfactura', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFactura)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al ingresar la factura');
        }
    })
    .then((data) => {
        alert('Factura ingresada correctamente');
    })
    .catch((error) => {
        console.log(error);
    });
}
