
function llenarTablaProducto() {

    Promise.all([
        fetch('http://localhost:4000/productos').then(response => response.json()),
        fetch('http://localhost:4000/categorias').then(response => response.json()),
        fetch('http://localhost:4000/marcas').then(response => response.json())
    ])
    .then(([data, dataCategorias, dataMarcas]) => {
        // Llenar la tabla
        let tbody = document.querySelector('#table-productos tbody');
        for (let i = 0; i < data.length; i++) {
            let tr = `
                <tr>
                    <td>
                        <button id="btn-editar" title="Editar" class="btn btn-warning mb-1" data-bs-toggle="modal"
                            data-bs-target="#modal-edicion-producto" onclick="cargarDatosEdicionProducto('${data[i].id_producto}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>                                           
                        </button>
                        <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                                data-bs-target="#modal-detalle-producto" onclick="detalleProducto('${data[i].id_producto}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                        <button id="btn-eliminar" title="Eliminar" class="btn btn-danger mb-1" onclick="eliminarProducto('${data[i].id_producto}');">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>   
                    </td>
                    <td>${data[i].id_producto}</td>
                    <td>${data[i].nombre_producto}</td>
                    <td>${dataMarcas[data[i].marca_id - 1].nombre_marca}</td>
                    <td>${data[i].descripcion_producto}</td>
                    <td>${data[i].precio_unitario}</td>
                    <td>${data[i].precio_venta}</td>
                    <!-- que sea vea de forma con visto si es true y con una x si es false -->
                    <td>${data[i].iva ? '<span class="text-success"><b>✔</b></span>' : 
                                '<span class="text-danger"><b>✘</b></span>'}</td>
                    <!-- si el stock esta en 0 saldra 'AGOTADO' en vez del 0, y en rojo -->
                    <td style="color: ${data[i].stock_producto == 0 ? 'red' : 'black'}">
                        <b>${data[i].stock_producto == 0 ? 'AGOTADO' : data[i].stock_producto}</b></td>
                    <td>${data[i].presentacion_producto}</td>
                    <td>${dataCategorias[data[i].categoria_id - 1].nombre_cat}</td>
                    
                </tr>
            `;
            tbody.innerHTML += tr;
        }
    })
    .catch((error) => {
        alert(error.message);
    });
}

llenarTablaProducto();

function seleccionarCategoria() {

    const categoria_id = document.querySelector('#categoria-producto');

    fetch('http://localhost:4000/categorias')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let option = `
                    <option value="${data[i].id_cat}">${data[i].nombre_cat}</option>
                `;
                categoria_id.innerHTML += option;
            }
        });
}
seleccionarCategoria();

function seleccionarMarca() {

    const marca_id = document.querySelector('#marca-producto');

    fetch('http://localhost:4000/marcas')
        .then(response => response.json())
        .then(data => {
            for (let i = 0; i < data.length; i++) {
                let option = `
                    <option value="${data[i].id_marca}">${data[i].nombre_marca}</option>
                `;
                marca_id.innerHTML += option;
            }
        });
}
seleccionarMarca();

function insertarProducto(dataProducto) {
    fetch('http://localhost:4000/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataProducto)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('El producto no pudo ser insertado');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Producto insertado');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formMarca = document.querySelector('#form-productos');
const btnInsertar = document.querySelector('#btn-guardar-producto');

formMarca.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre_producto = formMarca.querySelector('#nombre-producto').value;
    const descripcion_producto = formMarca.querySelector('#descripcion-producto').value;
    const precio_unitario = formMarca.querySelector('#precio-unitario-producto').value;
    const precio_venta = formMarca.querySelector('#precio-venta-producto').value;
    const iva = formMarca.querySelector('#iva-producto').value;
    const stock_producto = formMarca.querySelector('#stock-producto').value;
    const presentacion_producto = formMarca.querySelector('#presentacion-producto').value;
    const categoria_id = formMarca.querySelector('#categoria-producto').value;
    const marca_id = formMarca.querySelector('#marca-producto').value;

    const dataProducto = {
        nombre_producto: nombre_producto,
        descripcion_producto: descripcion_producto,
        precio_unitario: precio_unitario,
        precio_venta: precio_venta,
        iva: iva,
        stock_producto: stock_producto,
        presentacion_producto: presentacion_producto,
        categoria_id: categoria_id,
        marca_id: marca_id
    };

    if(formMarca.checkValidity()) {
        insertarProducto(dataProducto);
        // una vez insertado el producto, me devuelve a la pagina de productos
        window.location.href = 'index.html';
    } else {
        alert('Faltan campos por llenar');
    }
});

function detalleProducto(idProducto) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/productos').then(response => response.json()),
        fetch('http://localhost:4000/categorias').then(response => response.json()),
        fetch('http://localhost:4000/marcas').then(response => response.json())
    ])
    .then(([productos, dataCategorias, dataMarcas]) => {

        if (productos.error) {
            throw new Error(productos.error);     
        }
        const producto = productos.find((p) => p.id_producto == idProducto);

        if(producto) {
            
            const modal = document.querySelector('#modal-detalle-producto');

            modal.querySelector('#id-producto-detalle').value = producto.id_producto;
            modal.querySelector('#nombre-producto-detalle').value = producto.nombre_producto;
            modal.querySelector('#descripcion-producto-detalle').value = producto.descripcion_producto;
            modal.querySelector('#precio-unitario-producto-detalle').value = producto.precio_unitario;
            modal.querySelector('#precio-venta-producto-detalle').value = producto.precio_venta;
            modal.querySelector('#iva-producto-detalle').value = producto.iva;
            modal.querySelector('#stock-producto-detalle').value = producto.stock_producto;
            modal.querySelector('#presentacion-producto-detalle').value = producto.presentacion_producto;
            modal.querySelector('#categoria-producto-detalle').value = dataCategorias[producto.categoria_id - 1].nombre_cat;
            modal.querySelector('#marca-producto-detalle').value = dataMarcas[producto.marca_id - 1].nombre_marca;

            modal.showModal();
        } else {
            alert('El producto no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function cargarDatosEdicionProducto(idProducto) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/productos').then(response => response.json()),
        fetch('http://localhost:4000/categorias').then(response => response.json()),
        fetch('http://localhost:4000/marcas').then(response => response.json())
    ])
    .then(([productos, dataCategorias, dataMarcas]) => {

        if (productos.error) {
            throw new Error(productos.error);     
        }
        const producto = productos.find((p) => p.id_producto == idProducto);

        if(producto) {
            
            const modal = document.querySelector('#modal-edicion-producto');

            modal.querySelector('#id-producto').value = producto.id_producto;
            modal.querySelector('#nombre-producto').value = producto.nombre_producto;
            modal.querySelector('#descripcion-producto').value = producto.descripcion_producto;
            modal.querySelector('#iva-producto').value = producto.iva;
            modal.querySelector('#precio-unitario-producto').value = producto.precio_unitario;
            modal.querySelector('#precio-venta-producto').value = producto.precio_venta;
            modal.querySelector('#presentacion-producto').value = producto.presentacion_producto;

            //Agregar opciones de categorias
            const categoriaSelect = modal.querySelector('#categoria-producto');
            categoriaSelect.innerHTML = '';
            dataCategorias.forEach((categoria) => {
                const option = document.createElement('option');
                option.text = categoria.nombre_cat;
                option.value = categoria.id_cat;
                categoriaSelect.add(option);
            });
            categoriaSelect.value = producto.categoria_id;

            // Agregar opciones de marcas
            const marcaSelect = modal.querySelector('#marca-producto');
            marcaSelect.innerHTML = '';
            dataMarcas.forEach((marca) => {
                const option = document.createElement('option');
                option.text = marca.nombre_marca;
                option.value = marca.id_marca;
                marcaSelect.add(option);
            });
            marcaSelect.value = producto.marca_id;
            
            modal.showModal();
        } else {
            alert('El producto no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}    

function actualizarProducto(id_producto, dataProducto) {
    fetch(`http://localhost:4000/productos/${id_producto}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataProducto)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('El producto no pudo ser actualizado');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Producto actualizado');
        // una vez actualizado el producto, me resetea la pagina
        location.reload();
        llenarTablaProducto();

    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formEdicionCategoria = document.querySelector('#form-edicion-producto');
const btnEditarCategoria = document.querySelector('#btn-editar-producto');

btnEditarCategoria.addEventListener('click', (event) => {
    event.preventDefault();

    // obtener el id del producto a editar
    const id_producto = formEdicionCategoria.querySelector('#id-producto').value;

    // obtener los datos del formulario
    const nombre_producto = formEdicionCategoria.querySelector('#nombre-producto').value;
    const descripcion_producto = formEdicionCategoria.querySelector('#descripcion-producto').value;
    const precio_unitario = formEdicionCategoria.querySelector('#precio-unitario-producto').value;
    const precio_venta = formEdicionCategoria.querySelector('#precio-venta-producto').value;
    const presentacion_producto = formEdicionCategoria.querySelector('#presentacion-producto').value;
    const categoria_id = formEdicionCategoria.querySelector('#categoria-producto').value;
    const marca_id = formEdicionCategoria.querySelector('#marca-producto').value;
    const iva = formEdicionCategoria.querySelector('#iva-producto').value;

    const dataProducto = {
        nombre_producto: nombre_producto,
        descripcion_producto: descripcion_producto,
        precio_unitario: precio_unitario,
        precio_venta: precio_venta,
        presentacion_producto: presentacion_producto,
        categoria_id: categoria_id,
        marca_id: marca_id,
        iva: iva
    };

    if(formEdicionCategoria.checkValidity()) {
        actualizarProducto(id_producto, dataProducto);
        window.location.href = 'index.html';

    } else {
        alert('Por favor, complete los campos requeridos');
    }
});

function eliminarProducto(id_producto) {

    if(confirm('¿Está seguro que desea eliminar el producto?')) {
        fetch(`http://localhost:4000/productos/${id_producto}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('El producto no pudo ser eliminado');
            }
        }
        )
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }
            alert('Producto eliminado');
            
        })
        .catch((error) => {
            throw new Error(error.message);
        });
        window.location.reload();
    }
}

