function llenarTablaListaCompras() {
  
  Promise.all([
    fetch('http://localhost:4000/compras').then(response => response.json()),
    fetch('http://localhost:4000/proveedores').then(response => response.json())
  ])
  .then(([compras, dataProveedores]) => {
    const tbody = document.querySelector('#table-listado-compras tbody');
    const totalComprasCell = document.querySelector('#total-compras');

    let totalCompras = 0;

    for (let i = 0; i < compras.length; i++) {

      const fechaCompra = new Date(compras[i].fecha_compra);
      const dia = fechaCompra.getDate().toString().padStart(2, '0');
      const mes = (fechaCompra.getMonth() + 1).toString().padStart(2, '0');
      const año = fechaCompra.getFullYear();

      const horas = fechaCompra.getHours().toString().padStart(2, '0');
      const minutos = fechaCompra.getMinutes().toString().padStart(2, '0');

      const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
      let tr = `
        <tr>
          <td>
            <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
              data-bs-target="#modal-detalle-compra" onclick="detalleCompra('${compras[i].id_compra}')">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
              </svg>
            </button>
          </td>
          <td>${compras[i].numero_compra}</td>
          <td>${fechaFormateada}</td>
          <td width="190px">${dataProveedores[compras[i].proveedor_id - 1].nombre_proveedor}</td>
          <td>$${compras[i].total}</td>
          <td style="text-align:center">
            <button type="button" onclick="verDetalleCompra('${compras[i].id_compra}')" title="Ver Detalle Compra" class="btn btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-table" viewBox="0 0 16 16">
                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 2h-4v3h4V4zm0 4h-4v3h4V8zm0 4h-4v3h3a1 1 0 0 0 1-1v-2zm-5 3v-3H6v3h4zm-5 0v-3H1v2a1 1 0 0 0 1 1h3zm-4-4h4V8H1v3zm0-4h4V4H1v3zm5-3v3h4V4H6zm4 4H6v3h4V8z"/>
              </svg>
            </button>
          </td>
        </tr>
      `;
      tbody.innerHTML += tr;
      totalCompras += parseFloat(compras[i].total);   
    }
    const totalComprasElement = document.querySelector('#total-compras');
    totalComprasElement.innerHTML = '$' + totalCompras.toFixed(2);
  });
}
llenarTablaListaCompras();

function detalleCompra(idCompra) {
  // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
  Promise.all([
    fetch('http://localhost:4000/compras').then(response => response.json()),
    fetch('http://localhost:4000/proveedores').then(response => response.json())
  ])
  .then(([compras, dataProveedores]) => {

      if (compras.error) {
          throw new Error(compras.error);     
      }
      const compra = compras.find((c) => c.id_compra == idCompra);

      if(compra) {
          
          const modal = document.querySelector('#modal-detalle-compra');

          modal.querySelector('#id-compra-detalle').value = compra.id_compra;
          modal.querySelector('#numero-compra-detalle').value = compra.numero_compra;
          //fecha formateada
          const fechaCompra = new Date(compra.fecha_compra);
          const dia = fechaCompra.getDate().toString().padStart(2, '0');
          const mes = (fechaCompra.getMonth() + 1).toString().padStart(2, '0');
          const año = fechaCompra.getFullYear();
    
          const horas = fechaCompra.getHours().toString().padStart(2, '0');
          const minutos = fechaCompra.getMinutes().toString().padStart(2, '0');
    
          const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
          modal.querySelector('#fecha-compra-detalle').value = fechaFormateada;
          modal.querySelector('#proveedor-compra-detalle').value = dataProveedores[compra.proveedor_id - 1].nombre_proveedor;
          modal.querySelector('#total-compra-detalle').value = compra.total;

          modal.showModal();
      } else {
          alert('La compra no pudo ser encontrada');
      
      }
  })
  .catch((error) => {
      throw new Error(error.message);
  });
}

// Función para mostrar los detalles de la compra en el modal
function mostrarDetallesCompra(detalles) {
  const tablaDetalle = document.querySelector('#table-listado-detalle-compras tbody');
  tablaDetalle.innerHTML = '';

  for (let i = 0; i < detalles.length; i++) {
    const detalle = detalles[i];
    const fila = `
      <tr>
        <td>${detalle.compra_id}</td>
        <td>${detalle.producto_id}</td>
        <td>${detalle.cantidad}</td>
        <td>$${detalle.precio_unitario}</td>
        <td>$${detalle.iva ? (detalle.precio_unitario * detalle.cantidad) * 0.12 : 0}</td>
        <td>$${detalle.precio_unitario * detalle.cantidad}</td>
      </tr>
    `;
    tablaDetalle.innerHTML += fila;

  }

  const modal = new bootstrap.Modal(document.querySelector('#modal-table-compra'));
  modal.show();
}

function verDetalleCompra(idCompra) {
  fetch(`http://localhost:4000/detallecompras/${idCompra}`)
    .then(response => response.json())
    .then(detalles => {
      if(detalles.error) {
        throw new Error(detalles.error);
      }
      mostrarDetallesCompra(detalles);
    })
    .catch(error => {
      throw new Error(error.message);
    });
}

function llenarTablaListaProductos() {
    Promise.all([fetch('http://localhost:4000/productos').then(response => response.json())])
      .then(([productos]) => {
        const tbody = document.querySelector('#table-compras tbody');
        //tbody.innerHTML = '';
        for (let i = 0; i < productos.length; i++) {
          let tr = `
            <tr>
              <td>${productos[i].id_producto}</td>
              <td>${productos[i].nombre_producto}</td>
              <td>${productos[i].descripcion_producto}</td>
              <td width="140px">$${productos[i].precio_unitario}</td>
              <td width="70px">
                <input id="cantidad-${productos[i].id_producto}" type="number" min="1" value="1" class="form-control">
              </td>
              <td style="text-align:center">
                <button type="button" onclick="agregarAlCarrito('${productos[i].id_producto}', '${productos[i].nombre_producto}', ${productos[i].precio_unitario}, ${productos[i].iva})" title="Agregar al Carrito" class="btn btn-success">
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

function agregarAlCarrito(id_producto, nombre_producto, precio_unitario, iva) {

    // comprobamos si el producto ya está en el carrito
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    let productoExistente = carrito.find(producto => producto.id === id_producto);
    
    //cantidad
    const cantidadInput = document.querySelector(`#cantidad-${id_producto}`);
    const cantidad = parseInt(cantidadInput.value);
    
    if (cantidad <=0)  {
        alert('La cantidad debe ser mayor a 0');
        return;
    }

    if (productoExistente) {
      // si el producto ya existe, aumentamos su cantidad
      productoExistente.cantidad += cantidad;
    } else {
      // si el producto no existe, lo añadimos al carrito

      let producto = {
        id: id_producto,
        nombre: nombre_producto,
        precio: precio_unitario,
        iva: iva,
        cantidad: cantidad
      };
      carrito.push(producto);
    }
    
    // actualizamos el carrito en el almacenamiento local
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    console.log(carrito);

    mostrarTablaCarrito();
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

  function registrarCompra() {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  
    if (carrito.length === 0) {
      alert('El carrito está vacío. No puede continuar con la compra.');
      return;
    }

    window.location.href = 'confirmar-compra.html';
  
}


        

 


                        



            



