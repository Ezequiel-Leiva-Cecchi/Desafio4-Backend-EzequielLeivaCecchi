// Cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Crear una conexión de socket.io
    const socket = io();

    // Obtener referencia al botón de agregar producto
    const btnAgregarProducto = document.getElementById('btnAgregarProducto');

    // Obtener referencia a la lista de productos
    const listaProductos = document.getElementById('productos-lista');

    // Agregar evento al botón de agregar producto
    btnAgregarProducto.addEventListener('click', () => {
        // Obtener valores del formulario
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const precioInput = document.getElementById('precio');
        const stockInput = document.getElementById('stock');

        // Validar que el precio y el stock no sean negativos
        const precio = parseFloat(precioInput.value);
        const stock = parseInt(stockInput.value);

        if (isNaN(precio) || isNaN(stock) || precio < 0 || stock < 0) {
            // Mostrar mensaje de error si los valores no son válidos
            mostrarMensaje('Ingrese valores válidos para precio y stock');
            return;
        }

        // Crear un objeto de nuevo producto
        const nuevoProducto = {
            title: titulo,
            description: descripcion,
            price: precio,
            stock: stock
        };

        // Emitir un evento al servidor para agregar el producto
        socket.emit('agregarProducto', nuevoProducto);

        // Mostrar mensaje de producto agregado correctamente
        mostrarMensaje('Producto agregado correctamente');
    });

    // Agregar evento de delegación para eliminar productos
    listaProductos.addEventListener('click', (event) => {
        if (event.target.classList.contains('eliminar-producto')) {
            // Obtener el índice del producto a eliminar
            const indice = event.target.dataset.indice;

            // Emitir un evento al servidor para eliminar el producto
            socket.emit('eliminarProducto', indice);

            // Mostrar mensaje de producto eliminado correctamente
            mostrarMensaje('Producto eliminado correctamente');
        }
    });

    // Manejar la actualización de la lista de productos desde el servidor
    socket.on('productos', (productos) => {
        // Actualizar la interfaz con la lista de productos actualizada
        actualizarInterfaz(productos);
    });

    // Función para actualizar la interfaz con la lista de productos
    function actualizarInterfaz(productos) {
        // Limpiar la lista de productos
        listaProductos.innerHTML = '';

        // Iterar sobre la lista de productos y agregar elementos a la interfaz
        productos.forEach((producto, indice) => {
            const nuevoProducto = document.createElement('li');
            nuevoProducto.innerHTML = `
                <strong>${producto.title}</strong>
                <p>${producto.description}</p>
                <p>Precio: $${producto.price}</p>
                <p>Stock: ${producto.stock}</p>
                <button class="eliminar-producto" data-indice="${indice}">Eliminar</button>
            `;
            listaProductos.appendChild(nuevoProducto);
        });
    }

    // Función para mostrar un mensaje de notificación en la interfaz
    function mostrarMensaje(mensaje) {
        // Crear un elemento div para el mensaje
        const mensajeElemento = document.createElement('div');

        // Establecer el contenido del mensaje
        mensajeElemento.textContent = mensaje;

        // Agregar una clase al elemento para aplicar estilos
        mensajeElemento.classList.add('mensaje-notificacion');

        // Agregar el elemento al cuerpo del documento
        document.body.appendChild(mensajeElemento);

        // Desaparecer el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeElemento.remove();
        }, 3000);
    }
});