function llenarTablaListaVentas() {

    Promise.all([
        fetch('http://localhost:4000/ventas').then(response => response.json()),
        fetch('http://localhost:4000/clientes').then(response => response.json())
    ])
    .then(([ventas, dataClientes]) => {
        const tbody = document.querySelector('#table-listado-ventas tbody');
        const totalVentasCell = document.querySelector('#total-ventas');

        let totalVentas = 0;

        for (let i = 0; i < ventas.length; i++) {

        const fechaVenta = new Date(ventas[i].fecha_venta);
        const dia = fechaVenta.getDate().toString().padStart(2, '0');
        const mes = (fechaVenta.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaVenta.getFullYear();

        const horas = fechaVenta.getHours().toString().padStart(2, '0');
        const minutos = fechaVenta.getMinutes().toString().padStart(2, '0');

        const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
        let tr = `
            <tr>
            <td>
                <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                data-bs-target="#modal-detalle-venta" onclick="detalleVenta('${ventas[i].id_venta}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                </svg>
                </button>
            </td>
            <td>${ventas[i].numero_venta}</td>
            <td>${fechaFormateada}</td>
            <! -- que el cliente sea el nombre y apellido del cliente -->
            <td>${dataClientes.find((c) => c.cedula_cliente == ventas[i].cliente_id).nombres_cliente} 
                ${dataClientes.find((c) => c.cedula_cliente == ventas[i].cliente_id).apellidos_cliente}</td>
            <td>${ventas[i].forma_pago}</td>
            <td>$${ventas[i].total}</td>
            <td style="text-align:center">
                <button type="button" onclick="verDetalleVenta('${ventas[i].id_venta}')" title="Ver Detalle Venta" class="btn btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                    <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
                </svg>
                </button>
            </td>
            </tr>
        `;
        tbody.innerHTML += tr;
        totalVentas += parseFloat(ventas[i].total);
        }
        totalVentasCell.innerText = '$'+ totalVentas.toFixed(2);  
    });
}   
llenarTablaListaVentas();
  
function detalleVenta(idVenta) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/ventas').then(response => response.json()),
        fetch('http://localhost:4000/clientes').then(response => response.json())
    ])
    .then(([ventas, dataClientes]) => {

        if (ventas.error) {
            throw new Error(ventas.error);     
        }
        const venta = ventas.find((v) => v.id_venta == idVenta);

        if(venta) {
            
            const modal = document.querySelector('#modal-detalle-venta');

            modal.querySelector('#id-venta-detalle').value = venta.id_venta;
            modal.querySelector('#numero-venta-detalle').value = venta.numero_venta;
            //fecha formateada
            const fechaVenta = new Date(venta.fecha_venta);
            const dia = fechaVenta.getDate().toString().padStart(2, '0');
            const mes = (fechaVenta.getMonth() + 1).toString().padStart(2, '0');
            const año = fechaVenta.getFullYear();
        
            const horas = fechaVenta.getHours().toString().padStart(2, '0');
            const minutos = fechaVenta.getMinutes().toString().padStart(2, '0');
        
            const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
            modal.querySelector('#fecha-venta-detalle').value = fechaFormateada;
            // que muestre el nombre y apellido del cliente
            const cliente = dataClientes.find((c) => c.cedula_cliente == venta.cliente_id);
            modal.querySelector('#cliente-venta-detalle').value = cliente.nombres_cliente + ' ' + cliente.apellidos_cliente;
            modal.querySelector('#forma-pago-venta-detalle').value = venta.forma_pago;
            modal.querySelector('#total-venta-detalle').value = venta.total;

            modal.showModal();
        } else {
            alert('La venta no pudo ser encontrada');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}
  
// Función para mostrar los detalles de la venta en el modal
function mostrarDetallesVenta(detalles) {
    const tablaDetalle = document.querySelector('#table-listado-detalle-ventas tbody');
    tablaDetalle.innerHTML = '';
  
    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i];
      const fila = `
        <tr>
            <td>${detalle.venta_id}</td>
          <!-- que muestre el id y nombre del producto -->
          <td>${detalle.producto_id}</td>
          <td>${detalle.cantidad}</td>
          <td>$${detalle.precio_unitario}</td>
          <td>$${detalle.iva ? (detalle.precio_unitario * detalle.cantidad) * 0.12 : 0}</td>
          <td>$${detalle.precio_unitario * detalle.cantidad}</td>
        </tr>
      `;
      tablaDetalle.innerHTML += fila;
    }

    const modal = new bootstrap.Modal(document.querySelector('#modal-table-venta'));
    modal.show();
}
  
function verDetalleVenta(idVenta) {
    fetch(`http://localhost:4000/detalleventas/${idVenta}`)
      .then(response => response.json())
      .then(detalles => {
        if(detalles.error) {
          throw new Error(detalles.error);
        }
        mostrarDetallesVenta(detalles);
      })
      .catch(error => {
        throw new Error(error.message);
    });
}

function llenarTablaListaProductos() {
    Promise.all([fetch('http://localhost:4000/productos').then(response => response.json())])
    .then(([productos]) => {
        const tbody = document.querySelector('#table-ventas tbody');
        //tbody.innerHTML = '';
        for (let i = 0; i < productos.length; i++) {
            let stock = productos[i].stock_producto;
            let disabled = stock === 0 ? 'disabled' : ''; // Verificar si el stock es 0

        let tr = `
            <tr>
                <td>${productos[i].id_producto}</td>
                <td>${productos[i].nombre_producto}</td>
                <td>${productos[i].descripcion_producto}</td>
                <td>${stock}</td>
                <td width="140px">$${productos[i].precio_venta}</td>
                <td width="70px">
                    <input id="cantidad-${productos[i].id_producto}" type="number" min="1" value="1" class="form-control">
                </td>
                <td style="text-align:center">
                    <button type="button" onclick="agregarAlCarrito('${productos[i].id_producto}', '${productos[i].nombre_producto}', ${productos[i].precio_venta}, ${productos[i].iva})" title="Agregar al Carrito" class="btn btn-success" ${disabled}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1H.5zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0z"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += tr;
        }
    });
}
llenarTablaListaProductos();
  
function agregarAlCarrito(id_producto, nombre_producto, precio_venta, iva) {

    // obtenemos al stock del producto
    obtenerStock(id_producto)
    .then(stock => {
        // comprobamos si hay stock
        const stock_producto = stock;

        //cantidad
        const cantidadInput = document.querySelector(`#cantidad-${id_producto}`);
        const cantidad = parseInt(cantidadInput.value);
        
        // comprobamos si la cantidad es válida
        if (cantidad <=0)  {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        // Compruebas si el producto ya existe en el carrito
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        let productoExistente = carrito.find(producto => producto.id === id_producto);

        if (productoExistente) {
            // Calculas la cantidad total si se agregara el producto
            const cantidadTotal = productoExistente.cantidad + cantidad;

            if (cantidadTotal > stock_producto) {
                alert('La cantidad supera el stock disponible');
                return;
            }
            // Si el producto ya existe, aumentamos su cantidad
            productoExistente.cantidad += cantidad;

        } else {
            if (cantidad > stock_producto) {
                alert('La cantidad supera el stock disponible');
                return;
            }

            // Si el producto no existe, lo añadimos al carrito
            let producto = {
                id: id_producto,
                nombre: nombre_producto,
                precio: precio_venta,
                iva: iva,
                cantidad: cantidad
            };
            carrito.push(producto);
        }
        // Actualizamos el carrito en el almacenamiento local
        localStorage.setItem('carrito', JSON.stringify(carrito));

        console.log(carrito);

        mostrarTablaCarrito();
    })
    .catch(error => {
    console.error('Error al obtener el stock del producto:', error);
    });
}

async function obtenerStock(id_producto) {
    const response = await fetch(`http://localhost:4000/productos/${id_producto}`);
    const productos = await response.json();
    const prod = productos.find(producto => producto.id_producto === id_producto);
    return prod.stock_producto;
}

function mostrarTablaCarrito() {

    // Obtener el carrito del almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    // Obtener el elemento del DOM donde se mostrará la tabla del carrito
    const tbody = document.querySelector('#table-carrito tbody');
    const tfoot = document.querySelector('#table-carrito tfoot');
    tbody.innerHTML = '';
    tfoot.innerHTML = '';

    let total = 0;

    carrito.forEach(carro => {
        let subtotal = carro.precio * carro.cantidad;
        let iva = carro.iva ? subtotal * 0.12 : 0;
        total += subtotal + iva;
        let tr = `
            <tr>
                <td>${carro.id} - ${carro.nombre} </td>
                <td>${carro.cantidad}</td>
                <td>$${carro.precio.toFixed(2)}</td>
                <td>${carro.iva ? 'Sí' : 'No'}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button onclick="eliminarProducto('${carro.id}')" title="Eliminar del Carrito" class="btn btn-danger">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += tr;   
    });
    //tfoot para el total con id ="total"
    let trTotal = `
    <tr>
        <td colspan="4" style="text-align: right" ><b>Total:</b></td>
        <td><b>$${total.toFixed(2)}</br></td>
    </tr>
`;
tfoot.innerHTML = trTotal;
}

localStorage.removeItem('carrito');
  
function eliminarProducto(id_producto) {
    // Obtener el carrito del almacenamiento local
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    // Buscar el índice del producto en el carrito
    const indice = carrito.findIndex(producto => producto.id === id_producto);

    if (indice !== -1) {
    // Eliminar el producto del carrito utilizando splice
    carrito.splice(indice, 1);

    // Actualizar el carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));

    // Mostrar la tabla del carrito actualizada
    mostrarTablaCarrito();
    }
}
  
function registrarVenta() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    if (carrito.length === 0) {
    alert('El carrito está vacío. No puede continuar con la venta.');
    return;
    }

    window.location.href = 'confirmar-venta.html';

}
  
  
          
  
   
  
  
                          
  
  
  
              
  
  
  
  