function llenarTablaMarca() {
    
    Promise.all([
        fetch('http://localhost:4000/marcas').then(response => response.json())
    ])
    .then(([dataMarcas]) => {
        // Llenar la tabla con los datos de la marca
        let tbody = document.querySelector('#table-marcas tbody');
        //tbody.innerHTML = '';
        for (let i = 0; i < dataMarcas.length; i++) {
            let tr = `
                <tr>
                    <td>
                        <button id="btn-editar" title="Editar" class="btn btn-warning mb-1" data-bs-toggle="modal"
                            data-bs-target="#modal-edicion-marca" onclick="cargarDatosEdicionMarca('${dataMarcas[i].id_marca}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>                                           
                        </button>
                        <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                                data-bs-target="#modal-detalle-marca" onclick="detalleMarca('${dataMarcas[i].id_marca}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                        <button id="btn-eliminar" title="Eliminar" class="btn btn-danger mb-1" onclick="eliminarMarca('${dataMarcas[i].id_marca}');">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>   
                    </td>     
                    <td>${dataMarcas[i].id_marca}</td>
                    <td>${dataMarcas[i].nombre_marca}</td>
                </tr>
            `;
            tbody.innerHTML += tr;
        }
    })
    .catch((error) => {
        alert(error.message);
    });
}

llenarTablaMarca();

function insertarMarca(dataMarca) {
    fetch('http://localhost:4000/marcas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataMarca)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('La marca no pudo ser insertado');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Marca insertada');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formMarca = document.querySelector('#form-marcas');
const btnInsertarMarca = document.querySelector('#btn-guardar-marca');

formMarca.addEventListener('submit', (event) => {
    event.preventDefault();

    const nombre_marca = formMarca.querySelector('#nombre-marca').value;

    const dataMarca = {
        nombre_marca : nombre_marca
    };

    if(formMarca.checkValidity()) {
        insertarMarca(dataMarca);
        // una vez insertado el producto, me devuelve a la pagina de categorias
        window.location.href = 'marcas.html';
    } else {
        alert('Faltan campos por llenar');
    }
});

function detalleMarca(idMarca) {

    Promise.all([
        fetch('http://localhost:4000/marcas').then(response => response.json())
    ])
    .then(([dataMarcas]) => {

        if (dataMarcas.error) {
            throw new Error(dataMarcas.error);     
        }
        const marca = dataMarcas.find((m) => m.id_marca == idMarca);

        if(marca) {
            
            const modal = document.querySelector('#modal-detalle-marca');

            modal.querySelector('#id-marca-detalle').value = marca.id_marca;
            modal.querySelector('#nombre-marca-detalle').value = marca.nombre_marca;

            modal.showModal();
        } else {
            alert('La marca no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function cargarDatosEdicionMarca(idMarca) {
    // Obtener el ID de la categoria desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/marcas').then(response => response.json())
    ])
    .then(([dataMarcas]) => {

        if (dataMarcas.error) {
            throw new Error(dataMarcas.error);     
        }
        const marca = dataMarcas.find((m) => m.id_marca == idMarca);

        if(marca) {
            
            const modal = document.querySelector('#modal-edicion-marca');

            modal.querySelector('#id-marca').value = marca.id_marca;
            modal.querySelector('#nombre-marca').value = marca.nombre_marca;
         
            modal.showModal();
        } else {
            alert('La marca no pudo ser encontrada');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}    

function actualizarMarca(id_marca, dataMarcas) {
    fetch(`http://localhost:4000/marcas/${id_marca}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataMarcas)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            alert('La marca no pudo ser actualizada');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Marca actualizada');
        // una vez actualizado el producto, me resetea la pagina
        location.reload();
        llenarTablaMarca();

    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formEdicionMarca = document.querySelector('#form-edicion-marca');
const btnEditarMarca = document.querySelector('#btn-editar-marca');

btnEditarMarca.addEventListener('click', (event) => {
    event.preventDefault();

    // obtener el id del producto a editar
    const id_marca = formEdicionMarca.querySelector('#id-marca').value;

    // obtener los datos del formulario
    const nombre_marca = formEdicionMarca.querySelector('#nombre-marca').value;

    const dataMarcas = {
        nombre_marca: nombre_marca
    };

    if(formEdicionMarca.checkValidity()) {
        actualizarMarca(id_marca, dataMarcas);
        window.location.href = 'marcas.html';

    } else {
        alert('Por favor, complete los campos requeridos');
    }
});

function eliminarMarca(id_marca) {

    if(confirm('¿Está seguro que desea eliminar la marca?')) {
        fetch(`http://localhost:4000/marcas/${id_marca}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('La marca no pudo ser eliminada');
            }
        }
        )
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }
            alert('Marca eliminada');
            
        })
        .catch((error) => {
            throw new Error(error.message);
        });
        window.location.reload();
    }
}
