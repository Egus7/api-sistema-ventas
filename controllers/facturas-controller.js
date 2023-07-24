function llenarTablaListaFactura() {

    Promise.all([
        fetch('http://localhost:4000/facturas').then(response => response.json()),
        fetch('http://localhost:4000/clientes').then(response => response.json())
    ])
    .then(([facturas, dataClientes]) => {
        const tbody = document.querySelector('#table-listado-facturas tbody');
        const totalFacturaCell = document.querySelector('#total-facturas');

        let totalVentasConFactura = 0;

        for (let i = 0; i < facturas.length; i++) {

        const fechaEmision = new Date(facturas[i].fecha_emision);
        const dia = fechaEmision.getDate().toString().padStart(2, '0');
        const mes = (fechaEmision.getMonth() + 1).toString().padStart(2, '0');
        const año = fechaEmision.getFullYear();

        const horas = fechaEmision.getHours().toString().padStart(2, '0');
        const minutos = fechaEmision.getMinutes().toString().padStart(2, '0');

        const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
        let tr = `
            <tr>
            <td>${facturas[i].numero_factura}</td>
            <td>${fechaFormateada}</td>
            <! -- que el cliente sea el nombre y apellido del cliente -->
            <td>${dataClientes.find((c) => c.cedula_cliente == facturas[i].cliente_id).nombres_cliente} 
                ${dataClientes.find((c) => c.cedula_cliente == facturas[i].cliente_id).apellidos_cliente}</td>
            <td>${facturas[i].forma_pago}</td>
            <td>$${facturas[i].total}</td>
            <td style="text-align:center">
                <a class="btn btn-primary sm" title="Ver Detalle" href="detalle-factura.html?numeroFactura=${facturas[i].id_factura}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-file-earmark-plus" viewBox="0 0 16 16">
                        <path d="M8 6.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V11a.5.5 0 0 1-1 0V9.5H6a.5.5 0 0 1 0-1h1.5V7a.5.5 0 0 1 .5-.5z"/>
                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                    </svg>
                </a>
            </td>
            </tr>
        `;
        tbody.innerHTML += tr;
        totalVentasConFactura += parseFloat(facturas[i].total);
        }
        totalFacturaCell.innerText = '$'+ totalVentasConFactura.toFixed(2);  
    });
}   
llenarTablaListaFactura();
  
function detalleFactura(idFactura) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/facturas').then(response => response.json()),
        fetch('http://localhost:4000/clientes').then(response => response.json())
    ])
    .then(([facturas, dataClientes]) => {

        if (facturas.error) {
            throw new Error(facturas.error);     
        }
        const factura = facturas.find((f) => f.id_factura == idFactura);

        if(factura) {
            
            const modal = document.querySelector('#modal-detalle-factura');

            modal.querySelector('#id-factura-detalle').value = factura.id_factura;
            modal.querySelector('#numero-factura-detalle').value = factura.numero_factura;
            //fecha formateada
            const fechaEmision = new Date(factura.fecha_emision);
            const dia = fechaEmision.getDate().toString().padStart(2, '0');
            const mes = (fechaEmision.getMonth() + 1).toString().padStart(2, '0');
            const año = fechaEmision.getFullYear();
        
            const horas = fechaEmision.getHours().toString().padStart(2, '0');
            const minutos = fechaEmision.getMinutes().toString().padStart(2, '0');
        
            const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}`;
            modal.querySelector('#fecha-factura-detalle').value = fechaFormateada;
            // que muestre el nombre y apellido del cliente
            const cliente = dataClientes.find((c) => c.cedula_cliente == factura.cliente_id);
            modal.querySelector('#cliente-factura-detalle').value = cliente.nombres_cliente + ' ' + cliente.apellidos_cliente;
            modal.querySelector('#forma-pago-factura-detalle').value = factura.forma_pago;
            modal.querySelector('#total-factura-detalle').value = factura.total;

            modal.showModal();
        } else {
            alert('La factura no pudo ser encontrada');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}
  
// Función para mostrar los detalles de la venta en el modal
function mostrarDetallesFactura(detalles) {
    const tablaFactura= document.querySelector('#table-listado-detalle-facturas tbody');
    tablaFactura.innerHTML = '';
  
    for (let i = 0; i < detalles.length; i++) {
      const detalle = detalles[i];
      const fila = `
        <tr>
            <td>${detalle.factura_id}</td>
          <!-- que muestre el id y nombre del producto -->
          <td>${detalle.producto_id}</td>
          <td>${detalle.cantidad}</td>
          <td>$${detalle.precio_unitario}</td>
          <td>$${detalle.iva ? (detalle.precio_unitario * detalle.cantidad) * 0.12 : 0}</td>
          <td>$${detalle.precio_unitario * detalle.cantidad}</td>
        </tr>
      `;
      tablaFactura.innerHTML += fila;
    }

    const modal = new bootstrap.Modal(document.querySelector('#modal-table-factura'));
    modal.show();
}
  
function verDetalleFactura(idFactura) {
    fetch(`http://localhost:4000/detallefacturas/${idFactura}`)
      .then(response => response.json())
      .then(detalles => {
        if(detalles.error) {
          throw new Error(detalles.error);
        }
        mostrarDetallesFactura(detalles);
      })
      .catch(error => {
        throw new Error(error.message);
    });
}