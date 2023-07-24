
function llenarTablaCategoria() {

    Promise.all([
        fetch('http://localhost:4000/categorias').then(response => response.json())
    ])
    .then(([dataCategorias]) => {
        // Llenar la tabla
        let tbodyCat = document.querySelector('#table-categorias tbody');
        for (let i = 0; i < dataCategorias.length; i++) {
            let tr = `
                <tr>
                    <td>
                        <button id="btn-editar" title="Editar" class="btn btn-warning mb-1" data-bs-toggle="modal"
                            data-bs-target="#modal-edicion-categoria" onclick="cargarDatosEdicionCategoria('${dataCategorias[i].id_cat}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>                                           
                        </button>
                        <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                                data-bs-target="#modal-detalle-categoria" onclick="detalleCategoria('${dataCategorias[i].id_cat}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                        <button id="btn-eliminar" title="Eliminar" class="btn btn-danger mb-1" onclick="eliminarCategoria('${dataCategorias[i].id_cat}');">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>   
                    </td>
                    <td>${dataCategorias[i].id_cat}</td>
                    <td>${dataCategorias[i].nombre_cat}</td>                    
                </tr>
            `;
            tbodyCat.innerHTML += tr;
        }
    })
    .catch((error) => {
        alert(error.message);
    });
}

llenarTablaCategoria();

function insertarCategoria(dataCategoria) {
    fetch('http://localhost:4000/categorias', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataCategoria)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('La categoria no pudo ser insertado');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Categoria insertado');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formCategoria = document.querySelector('#form-categorias');
const btnInsertar = document.querySelector('#btn-guardar-categoria');

formCategoria.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre_cat = formCategoria.querySelector('#nombre-categoria').value;

    const dataCategoria = {
        nombre_cat : nombre_cat
    };

    if(formCategoria.checkValidity()) {
        insertarCategoria(dataCategoria);
        // una vez insertado el producto, me devuelve a la pagina de categorias
        window.location.href = 'categorias.html';
    } else {
        alert('Faltan campos por llenar');
    }
});

function detalleCategoria(idCategoria) {

    Promise.all([
        fetch('http://localhost:4000/categorias').then(response => response.json())
    ])
    .then(([dataCategorias]) => {

        if (dataCategorias.error) {
            throw new Error(dataCategorias.error);     
        }
        const categoria = dataCategorias.find((c) => c.id_cat == idCategoria);

        if(categoria) {
            
            const modal = document.querySelector('#modal-detalle-categoria');

            modal.querySelector('#id-categoria-detalle').value = categoria.id_cat;
            modal.querySelector('#nombre-categoria-detalle').value = categoria.nombre_cat;

            modal.showModal();
        } else {
            alert('La categoria no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function cargarDatosEdicionCategoria(idCategoria) {
    // Obtener el ID de la categoria desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/categorias').then(response => response.json())
    ])
    .then(([dataCategorias]) => {

        if (dataCategorias.error) {
            throw new Error(dataCategorias.error);     
        }
        const categoria = dataCategorias.find((c) => c.id_cat == idCategoria);

        if(categoria) {
            
            const modal = document.querySelector('#modal-edicion-categoria');

            modal.querySelector('#id-categoria').value = categoria.id_cat;
            modal.querySelector('#nombre-categoria').value = categoria.nombre_cat;
         
            modal.showModal();
        } else {
            alert('La categoria no pudo ser encontrada');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}    

function actualizarCategoria(id_cat, dataCategoria) {
    fetch(`http://localhost:4000/categorias/${id_cat}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataCategoria)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('La categoria no pudo ser actualizado');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Categoria actualizado');
        // una vez actualizado el producto, me resetea la pagina
        location.reload();
        llenarTablaProducto();

    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formEdicionCategoria = document.querySelector('#form-edicion-categoria');
const btnEditarCategoria = document.querySelector('#btn-editar-categoria');

btnEditarCategoria.addEventListener('click', (event) => {
    event.preventDefault();

    // obtener el id del producto a editar
    const id_cat = formEdicionCategoria.querySelector('#id-categoria').value;

    // obtener los datos del formulario
    const nombre_cat = formEdicionCategoria.querySelector('#nombre-categoria').value;

    const dataCategoria = {
        nombre_cat: nombre_cat
    };

    if(formEdicionCategoria.checkValidity()) {
        actualizarCategoria(id_cat, dataCategoria);
        window.location.href = 'categorias.html';

    } else {
        alert('Por favor, complete los campos requeridos');
    }
});

function eliminarCategoria(id_cat) {

    if(confirm('¿Está seguro que desea eliminar la categoria?')) {
        fetch(`http://localhost:4000/categorias/${id_cat}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('La categoria no pudo ser eliminada');
            }
        }
        )
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }
            alert('Categoria eliminada');
            
        })
        .catch((error) => {
            throw new Error(error.message);
        });
        window.location.reload();
    }
}

