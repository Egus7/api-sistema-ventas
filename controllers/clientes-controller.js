function llenarTablaCliente() {

    Promise.all([
        fetch('http://localhost:4000/clientes').then((response) => response.json())
    ]).then(([clientes]) => {
        //Llenar tabla
        let tbodyCliente = document.querySelector('#table-clientes tbody');
        for (let i=0; i< clientes.length; i++) {
            let tr = `
                <tr>
                    <td>
                        <button id="btn-editar" title="Editar" class="btn btn-warning mb-1" data-bs-toggle="modal"
                            data-bs-target="#modal-edicion-cliente" onclick="cargarDatosEdicionCliente('${clientes[i].cedula_cliente}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>                                           
                        </button>
                        <button id="btn-detalle" title="Ver Detalle" class="btn btn-info mb-1" data-bs-toggle="modal" 
                                data-bs-target="#modal-detalle-cliente" onclick="detalleCliente('${clientes[i].cedula_cliente}')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-card-list" viewBox="0 0 16 16">
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8zm0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zM4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>
                        <button id="btn-eliminar" title="Eliminar" class="btn btn-danger mb-1" onclick="eliminarCliente('${clientes[i].cedula_cliente}');">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                            </svg>
                        </button>   
                    </td>
                    <td>${clientes[i].cedula_cliente}</td>
                    <td>${clientes[i].nombres_cliente}</td>
                    <td>${clientes[i].apellidos_cliente}</td>
                    <td>${clientes[i].direccion}</td>
                    <td>${clientes[i].telefono}</td>
                </tr>
            `;
            tbodyCliente.innerHTML += tr;
        }
    })
    .catch(error => {
        console.log(error);
    });
}

llenarTablaCliente();

//insertar cliente
function insertarCliente(dataCliente) {
    fetch('http://localhost:4000/clientes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataCliente)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('El cliente no pudo ser insertado');
        }
    })
    .then((dataCliente) => {
        alert('Cliente insertado correctamente');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formCliente = document.querySelector('#form-clientes');
const btnInsertarCliente = document.querySelector('#btn-guardar-cliente');

formCliente.addEventListener('submit', (event) => {
    event.preventDefault();

    const cedula_cliente = document.querySelector('#cedula-cliente').value;
    const nombres_cliente = document.querySelector('#nombres-cliente').value;
    const apellidos_cliente = document.querySelector('#apellidos-cliente').value;
    const direccion = document.querySelector('#direccion-cliente').value;
    const telefono = document.querySelector('#telefono-cliente').value;

    const dataCliente = {
        cedula_cliente : cedula_cliente,
        nombres_cliente : nombres_cliente,
        apellidos_cliente : apellidos_cliente,
        direccion : direccion,
        telefono : telefono
    };

    if(formCliente.checkValidity()) {
        insertarCliente(dataCliente);
        window.location.href = 'clientes.html';
    } else {
        alert('Todos los campos son obligatorios');
    }
});

// ver detalle cliente
function detalleCliente(cedulaCliente) {

    Promise.all([
        fetch('http://localhost:4000/clientes').then((response) => response.json())
    ])
    .then(([clientes]) => {

        if (clientes.error) {
            throw new Error(clientes.error);
        }

        const cliente = clientes.find((c) => c.cedula_cliente == cedulaCliente);

        if (cliente) {

            const modal = document.querySelector('#modal-detalle-cliente');

            modal.querySelector('#cedula-cliente-detalle').value = cliente.cedula_cliente;
            modal.querySelector('#nombres-cliente-detalle').value = cliente.nombres_cliente;
            modal.querySelector('#apellidos-cliente-detalle').value = cliente.apellidos_cliente;
            modal.querySelector('#direccion-cliente-detalle').value = cliente.direccion;
            modal.querySelector('#telefono-cliente-detalle').value = cliente.telefono;


            modal.showModal();
        } else {
            throw new Error('El cliente no existe');
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

// cargar datos al form de editar cliente
function cargarDatosEdicionCliente(cedulaCliente) {

    Promise.all([
        fetch('http://localhost:4000/clientes').then((response) => response.json())
    ])
    .then(([clientes]) => {

        if (clientes.error) {
            throw new Error(clientes.error);
        }

        const cliente = clientes.find((c) => c.cedula_cliente == cedulaCliente);

        if (cliente) {

            const modal = document.querySelector('#modal-edicion-cliente');

            modal.querySelector('#cedula-cliente').value = cliente.cedula_cliente;
            modal.querySelector('#nombres-cliente').value = cliente.nombres_cliente;
            modal.querySelector('#apellidos-cliente').value = cliente.apellidos_cliente;
            modal.querySelector('#direccion-cliente').value = cliente.direccion;
            modal.querySelector('#telefono-cliente').value = cliente.telefono;

            modal.showModal();
        } else {
            throw new Error('El cliente no existe');
        }
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

// editar cliente
function actualizarCliente(cedulaCliente, dataCliente) {
    fetch(`http://localhost:4000/clientes/${cedulaCliente}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataCliente)
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('El cliente no pudo ser actualizado');
        }
    })
    .then((data) => {
        if (data.error) {
            throw new Error(data.error);
        }
        alert('Cliente actualizado correctamente');
        location.reload();
    })
    .catch((error) => {
        throw new Error(error.message);
    });
}

const formEdicionCliente = document.querySelector('#form-edicion-cliente');
const btnEditarCliente = document.querySelector('#btn-editar-cliente');

btnEditarCliente.addEventListener('click', (event) => {
    event.preventDefault();

    const cedulaCliente = formEdicionCliente.querySelector('#cedula-cliente').value;

    const nombres_cliente = formEdicionCliente.querySelector('#nombres-cliente').value;
    const apellidos_cliente = formEdicionCliente.querySelector('#apellidos-cliente').value;
    const direccion = formEdicionCliente.querySelector('#direccion-cliente').value;
    const telefono = formEdicionCliente.querySelector('#telefono-cliente').value;

    const dataCliente = {
        nombres_cliente : nombres_cliente,
        apellidos_cliente : apellidos_cliente,
        direccion : direccion,
        telefono : telefono
    };

    if(formEdicionCliente.checkValidity()) {
        actualizarCliente(cedulaCliente, dataCliente);
        window.location.href = 'clientes.html';
    } else {
        alert('Todos los campos son obligatorios');
    }
});

// eliminar cliente
function eliminarCliente(cedulaCliente) {

    if(confirm('¿Está seguro que desea eliminar el cliente?')) {
        fetch(`http://localhost:4000/clientes/${cedulaCliente}`, {
            method: 'DELETE'
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                alert('El cliente no pudo ser eliminado');
            }
        }
        )
        .then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }
            alert('Cliente eliminado');
            
        })
        .catch((error) => {
            throw new Error(error.message);
        });
        window.location.reload();
    }
}











