
function seleccionarProveedor() {

    const proveedor_id = document.querySelector('#proveedor-compra');

    fetch('http://localhost:4000/proveedores')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let option = `
                    <option value="${data[i].id_proveedor}">${data[i].nombre_proveedor}</option>
                `;
                proveedor_id.innerHTML += option;
            }
        });
}
seleccionarProveedor();

function tableResumenCompra() {

    // Obtener los datos del carrito de compras y la cabecera de la compra
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Obtener el elemento tbody de la tabla
    const tablaResumenCompra = document.querySelector('#tabla-resumen-compra');

    // Calcular el total de la compra
    let totalCompra = 0;
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
        tablaResumenCompra.appendChild(fila);

        //suma de subtotales
        sumaSubtotal += subtotal;
        // Actualizar el total de la compra
        totalCompra += subtotal + ivaNum;
        ivaT = iva ? ivaT + ivaNum : ivaT;
    });
    // Mostrar el subtotal de la compra
    const subtotalCompraElement = document.querySelector('#subtotal-compra');
    subtotalCompraElement.textContent = `$${sumaSubtotal.toFixed(2)}`;
    // Mostrar el IVA de la compra
    const ivaCompraElement = document.querySelector('#iva-compra');
    ivaCompraElement.textContent = `$${ivaT.toFixed(2)}`;
    // Mostrar el total de la compra
    const totalCompraElement = document.querySelector('#total-compra');
    totalCompraElement.textContent = `$${totalCompra.toFixed(2)}`;     
}

tableResumenCompra();

function ingresarCompra(dataCompra) {
    fetch('http://localhost:4000/registrarcompras', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataCompra)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al ingresar la compra');
        }
    })
    .then((data) => {
       alert('Compra ingresada correctamente');
    })
    .catch((error) => {
        console.log(error);
    });
}

const formCompra = document.querySelector('#form-compras');
// Agregar evento de clic al botón de confirmar compra
const confirmarCompraBtn = document.querySelector('#confirmar-compra-btn');
formCompra.addEventListener('submit', (event) => {
    event.preventDefault();

    // Obtener los datos del formulario
    //cabecera
    const fecha_compra = formCompra.querySelector('#fecha-compra').value;
    const proveedor_id = formCompra.querySelector('#proveedor-compra').value;
    const id_compra = formCompra.querySelector('#id-compra').value;

    // obtener los detalles de la compra
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const detallesCompra = carrito.map(producto => {
        
        const { id, cantidad, precio, iva } = producto;
        return {
            compra_id: id_compra,
            producto_id: id,
            cantidad: cantidad,
            precio_unitario: precio,
            iva: iva
        };
    });

    //calcular el total de la compra
    let totalCompra = 0;
    carrito.forEach(producto => {
        const { cantidad, precio, iva } = producto;
        const subtotal = cantidad * precio;
        const ivaNum = iva ? subtotal *  0.12 : 0;
        totalCompra += subtotal + ivaNum;
    });

    const dataCompra = {
        fecha_compra: fecha_compra,
        proveedor_id: proveedor_id,
        total: totalCompra,
        detalles: detallesCompra
    };

    if(formCompra.checkValidity()) {
        ingresarCompra(dataCompra);
        location.href = 'index.html';
    } else {
        alert('Por favor, ingrese todos los datos');
    }
});
