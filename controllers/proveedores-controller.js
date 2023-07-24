function llenarTablaProveedor() {

    Promise.all([
        fetch('http://localhost:4000/proveedores').then((response) => response.json())
    ])
    .then(([proveedores]) => {
        //Llenar tabla
        let tbodyProveedor = document.querySelector('#table-proveedores tbody');
        for (let i = 0; i < proveedores.length; i++) {
            let tr = `
                <tr>
                    <td>
                        <button id="btn-editar" title="Editar" class="btn btn-warning mb-1" data-bs-toggle="modal"
                                data-bs-target="#modal-edicion-proveedor" onclick="cargarDatosEdicionProveedor('${proveedores[i].id_proveedor}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>                                           
                        </button>
                        <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                                    data-bs-target="#modal-detalle-proveedor" onclick="detalleProveedor('${proveedores[i].id_proveedor}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                        <button id="btn-eliminar" title="Eliminar" class="btn btn-danger mb-1" onclick="eliminarProveedor('${proveedores[i].id_proveedor}');">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>   
                    </td>
                    <td>${proveedores[i].id_proveedor}</td>
                    <td>${proveedores[i].ruc_proveedor}</td>
                    <td>${proveedores[i].nombre_proveedor}</td>
                    <td>${proveedores[i].direccion_proveedor}</td>
                    <td>${proveedores[i].telefono_proveedor}</td>
                    <td>${proveedores[i].email_proveedor}</td>
                </tr>
            `;
            tbodyProveedor.innerHTML += tr;
        }
    })
    .catch((error) => {
        alert(error.message);
    });
}

llenarTablaProveedor();

//Funcion para agregar un nuevo proveedor
function insertarProveedor(dataProveedor) {

    fetch('http://localhost:4000/proveedores', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataProveedor)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al insertar el proveedor');
        }
    })
    .then((data) => {
        if(data.error) {
            throw new Error(data.error);
        }
        alert('Proveedor agregado correctamente');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formProveedor = document.querySelector('#form-proveedores');
const btnAgregarProveedor = document.querySelector('#btn-guardar-proveedor');

formProveedor.addEventListener('submit', (event) => {
    event.preventDefault();

    const ruc_proveedor = document.querySelector('#cedula-proveedor').value;
    const nombre_proveedor = document.querySelector('#nombre-proveedor').value;
    const direccion_proveedor = document.querySelector('#direccion-proveedor').value;
    const telefono_proveedor = document.querySelector('#telefono-proveedor').value;
    const email_proveedor = document.querySelector('#email-proveedor').value;

    const dataProveedor = {
        ruc_proveedor : ruc_proveedor,
        nombre_proveedor : nombre_proveedor,
        direccion_proveedor : direccion_proveedor,
        telefono_proveedor : telefono_proveedor,
        email_proveedor : email_proveedor
    }

    if(formProveedor.checkValidity()) {
        insertarProveedor(dataProveedor);
        window.location.href = 'proveedores.html';
    } else {
        alert('Faltan campos por llenar');
    }
});

function detalleProveedor(idProveedor) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/proveedores').then(response => response.json())
    ])
    .then(([proveedores]) => {

        if (proveedores.error) {
            throw new Error(proveedores.error);     
        }
        const proveedor = proveedores.find((pr) => pr.id_proveedor == idProveedor);

        if(proveedor) {
            
            const modal = document.querySelector('#modal-detalle-proveedor');

            modal.querySelector('#cedula-proveedor-detalle').value = proveedor.ruc_proveedor;
            modal.querySelector('#nombre-proveedor-detalle').value = proveedor.nombre_proveedor;
            modal.querySelector('#direccion-proveedor-detalle').value = proveedor.direccion_proveedor;
            modal.querySelector('#telefono-proveedor-detalle').value = proveedor.telefono_proveedor;
            modal.querySelector('#email-proveedor-detalle').value = proveedor.email_proveedor;

            modal.showModal();
        } else {
            alert('El proveedor no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function cargarDatosEdicionProveedor(idProveedor) {
    // Obtener el ID del producto desde el atributo "data-id" del botón clickeado
    Promise.all([
        fetch('http://localhost:4000/proveedores').then(response => response.json())
    ])
    .then(([proveedores]) => {

        if (proveedores.error) {
            throw new Error(proveedores.error);     
        }
        const proveedor = proveedores.find((pr) => pr.id_proveedor == idProveedor);

        if(proveedor) {
            
            const modal = document.querySelector('#modal-edicion-proveedor');

            modal.querySelector('#id-proveedor').value = proveedor.id_proveedor;
            modal.querySelector('#cedula-proveedor').value = proveedor.ruc_proveedor;
            modal.querySelector('#nombre-proveedor').value = proveedor.nombre_proveedor;
            modal.querySelector('#direccion-proveedor').value = proveedor.direccion_proveedor;
            modal.querySelector('#telefono-proveedor').value = proveedor.telefono_proveedor;
            modal.querySelector('#email-proveedor').value = proveedor.email_proveedor;

            modal.showModal();
        } else {
            alert('El proveedor no pudo ser encontrado');
        
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

function actualizarProveedor(idProveedor, dataProveedor) {
    fetch(`http://localhost:4000/proveedores/${idProveedor}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataProveedor)
    })
    .then((response) => {
        if(response.ok) {
            return response.json();
        } else {
            throw new Error('Error al actualizar el proveedor');
        }
    })
    .then((data) => {
        if(data.error) {
            throw new Error(data.error);
        }
        alert('Proveedor actualizado correctamente');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formEdicionProveedor = document.querySelector('#form-edicion-proveedor');
const btnActualizarProveedor = document.querySelector('#btn-editar-proveedor');

btnActualizarProveedor.addEventListener('click', (event) => {
    event.preventDefault();

    const id_proveedor = formEdicionProveedor.querySelector('#id-proveedor').value;

    const ruc_proveedor = formEdicionProveedor.querySelector('#cedula-proveedor').value;
    const nombre_proveedor = formEdicionProveedor.querySelector('#nombre-proveedor').value;
    const direccion_proveedor = formEdicionProveedor.querySelector('#direccion-proveedor').value;
    const telefono_proveedor = formEdicionProveedor.querySelector('#telefono-proveedor').value;
    const email_proveedor = formEdicionProveedor.querySelector('#email-proveedor').value;

    const dataProveedor = {
        ruc_proveedor : ruc_proveedor,
        nombre_proveedor : nombre_proveedor,
        direccion_proveedor : direccion_proveedor,
        telefono_proveedor : telefono_proveedor,
        email_proveedor : email_proveedor
    }

    if(formEdicionProveedor.checkValidity()) {
        actualizarProveedor(id_proveedor, dataProveedor);
        window.location.href = 'proveedores.html';
    } else {
        alert('Faltan campos por llenar');
    }
});

function eliminarProveedor(idProveedor) {
    
    if(confirm('¿Está seguro que desea eliminar el proveedor?')) {
        fetch(`http://localhost:4000/proveedores/${idProveedor}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            } else {
                throw new Error('Error al eliminar el proveedor');
            }
        })
        .then((data) => {
            if(data.error) {
                throw new Error(data.error);
            }
            alert('Proveedor eliminado correctamente');
        })
        .catch((error) => {
            throw new Error(error.message);
        });
        location.reload();
    }
}


