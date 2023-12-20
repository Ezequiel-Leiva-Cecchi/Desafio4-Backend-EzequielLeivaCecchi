document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const btnAgregarProducto = document.getElementById('btnAgregarProducto');
    const listaProductos = document.getElementById('productos-lista');

    // Agregar evento al botón de agregar producto
    btnAgregarProducto.addEventListener('click', () => {
        const titulo = document.getElementById('titulo').value;
        const descripcion = document.getElementById('descripcion').value;
        const precioInput = document.getElementById('precio');
        const stockInput = document.getElementById('stock');

        // Validar que el precio y el stock no sean negativos
        const precio = parseFloat(precioInput.value);
        const stock = parseInt(stockInput.value);

        if (isNaN(precio) || isNaN(stock) || precio < 0 || stock < 0) {
            mostrarMensaje('Ingrese valores válidos para precio y stock');
            return;
        }

        const nuevoProducto = {
            title: titulo,
            description: descripcion,
            price: precio,
            stock: stock
        };

        socket.emit('agregarProducto', nuevoProducto);

        // Mostrar mensaje de producto agregado
        mostrarMensaje('Producto agregado correctamente');
    });

    // Agregar evento de delegación para eliminar productos
    listaProductos.addEventListener('click', (event) => {
        if (event.target.classList.contains('eliminar-producto')) {
            const indice = event.target.dataset.indice;
            socket.emit('eliminarProducto', indice);

            // Mostrar mensaje de producto eliminado
            mostrarMensaje('Producto eliminado correctamente');
        }
    });

    // Manejar la actualización de la lista de productos desde el servidor
    socket.on('productos', (productos) => {
        actualizarInterfaz(productos);
    });

    function actualizarInterfaz(productos) {
        listaProductos.innerHTML = '';

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

    function mostrarMensaje(mensaje) {
        const mensajeElemento = document.createElement('div');
        mensajeElemento.textContent = mensaje;
        mensajeElemento.classList.add('mensaje-notificacion');

        document.body.appendChild(mensajeElemento);

        // Desaparecer el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeElemento.remove();
        }, 3000);
    }
});