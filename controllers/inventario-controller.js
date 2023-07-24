function llenarTablaKardex() {

    Promise.all([
        fetch('http://localhost:4000/inventario').then(response => response.json()),
        fetch('http://localhost:4000/productos').then(response => response.json())
    ])
    .then(([dataInventario, dataProducto]) => {
        // Llenar la tabla
        let tbody = document.querySelector('#table-inventario tbody');
        for (let i = 0; i < dataInventario.length; i++) {

            const fechaInventario = new Date(dataInventario[i].fecha_inventario);
            const dia = fechaInventario.getDate().toString().padStart(2, '0');
            const mes = (fechaInventario.getMonth() + 1).toString().padStart(2, '0');
            const año = fechaInventario.getFullYear();
            const horas = fechaInventario.getHours().toString().padStart(2, '0');
            const minutos = fechaInventario.getMinutes().toString().padStart(2, '0');
            const segundos = fechaInventario.getSeconds().toString().padStart(2, '0');

            const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
            
            // Obtener el nombre del producto
            const nombreProducto = dataProducto.find(producto => producto.id_producto == dataInventario[i].producto_id).nombre_producto;
            let tr = `
                <tr>
                    <td>
                        <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                                data-bs-target="#modal-detalle-inventario" onclick="detalleInventario('${dataInventario[i].id_inventario}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>  
                    </td>
                    <td>${dataInventario[i].id_inventario}</td>
                    <!-- que la fecha se muestre en formato dd/mm/yyyy HH:mm:ss -->
                    <td>${fechaFormateada}</td>
                    <!-- que se muestre el nombre del producto -->
                    <td>${dataInventario[i].producto_id} - ${nombreProducto}</td>
                    <td style="text-align:center">${dataInventario[i].cantidad}</td>
                    <td>${dataInventario[i].operacion}</td>                
                </tr>
            `;
            tbody.innerHTML += tr;
        }
    })
    .catch((error) => {
        alert(error.message);
    });
}

llenarTablaKardex();

function detalleInventario(idInventario) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/inventario').then(response => response.json()),
        fetch('http://localhost:4000/productos').then(response => response.json())
    ])
    .then(([dataInventario, productos]) => {

        if (dataInventario.error) {
            throw new Error(dataInventario.error);     
        }
        const inventario = dataInventario.find((i) => i.id_inventario == idInventario);

        if(inventario) {            
            
            const modal = document.querySelector('#modal-detalle-inventario');

            modal.querySelector('#id-inventario-detalle').value = inventario.id_inventario;
            //fecha en formato dd/mm/yyyy HH:mm:ss
            const fechaInventario = new Date(inventario.fecha_inventario);
            const dia = fechaInventario.getDate().toString().padStart(2, '0');
            const mes = (fechaInventario.getMonth() + 1).toString().padStart(2, '0');
            const año = fechaInventario.getFullYear();
            const horas = fechaInventario.getHours().toString().padStart(2, '0');
            const minutos = fechaInventario.getMinutes().toString().padStart(2, '0');
            const segundos = fechaInventario.getSeconds().toString().padStart(2, '0');
            const fechaFormateada = `${dia}/${mes}/${año} ${horas}:${minutos}:${segundos}`;
            modal.querySelector('#fecha-inventario-detalle').value = fechaFormateada;
            // que se muestre el id y el nombre del producto
            const producto = productos.find((p) => p.id_producto == inventario.producto_id);
            const productoInfo = `${producto.id_producto} - ${producto.nombre_producto}`;           
            modal.querySelector('#producto-inventario-detalle').value = productoInfo;
            modal.querySelector('#cantidad-inventario-detalle').value = inventario.cantidad;
            modal.querySelector('#operacion-inventario-detalle').value = inventario.operacion;

            modal.showModal();
        } else {
            alert('El detalle kardex no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function imprimirReporte() {
    const table = document.querySelector('#table-inventario');
    
    // Crear el encabezado personalizado
    const encabezado = document.createElement('div');
    encabezado.innerHTML = '<h1 align="center">Reporte KARDEX</h1>';
    
    // Obtener las columnas que deseas mostrar en el reporte (por índice)
    //todas las columnas menos la primera
    const columnasMostradas = [1, 2, 3, 4, 5];
  
    // Ocultar el botón de impresión durante la impresión
    const imprimirBtn = document.querySelector('#imprimir-btn');
    imprimirBtn.style.display = 'none'; 
    
    // Crear un contenedor para el encabezado y la tabla
    const contenedor = document.createElement('div');
    contenedor.appendChild(encabezado);

    // Clonar la tabla y mostrar solo las columnas deseadas
    const tablaImpresion = table.cloneNode(true);
    const filas = tablaImpresion.rows;

    for (let i = 0; i < filas.length; i++) {
        const celdas = filas[i].cells;
        
        for (let j = celdas.length - 1; j >= 0; j--) {
            if (!columnasMostradas.includes(j)) {
                filas[i].deleteCell(j);
            }
        }
    }

    contenedor.appendChild(tablaImpresion);
     
    // Mostrar solo el contenedor durante la impresión
    document.head.innerHTML = encabezado.outerHTML;
    document.body.innerHTML = contenedor.outerHTML;
  
    // Llamar a la función de impresión del navegador
    window.print();
  
    // Recargar la página después de la impresión para restaurar el contenido original
    location.reload();
  }

function toggleFechas() {
const reporteFechas = document.querySelector('#reporte-fechas');
reporteFechas.style.display = (reporteFechas.style.display === 'none') ? 'block' : 'none';
}

  
  
  
  
  



  
  
  