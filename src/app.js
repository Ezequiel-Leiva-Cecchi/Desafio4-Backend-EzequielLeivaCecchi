// app.js
// Importación de módulos
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import fs from 'fs/promises';
import viewsRouters from './routes/views.routes.js';

// Obtención de la ruta del archivo actual y directorio
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

// Creación de instancias de Express, servidor HTTP y Socket.IO
const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

// Arreglo para almacenar datos de productos
let productos = [];

// Función asincrónica para cargar productos desde un archivo JSON
async function loadProductos() {
  try {
    const data = await fs.readFile('./src/data/productos.json', 'utf8');
    productos = JSON.parse(data);
    return productos;
    
  } catch (error) {
    console.error('Error loading productos:', error.message);
  }
}

// Cargar productos al iniciar el servidor
await loadProductos();

// Configuración del motor de plantillas Handlebars para Express
app.engine('handlebars', exphbs.engine());
app.set('views', path.join('src', 'views'));
app.set('view engine', 'handlebars');

// Configuración de middleware y gestión estática de archivos
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manejo de eventos de conexión y desconexión con Socket.IO
io.on('connection', (socket) => {
  console.log('Usuario conectado');

  // Evento para agregar un producto
  socket.on('agregarProducto', (producto) => {
    productos.push(producto);
    io.emit('productos', productos); // Emitir a todos los clientes la lista actualizada de productos
  });

  // Evento para eliminar un producto
  socket.on('eliminarProducto', (indice) => {
    productos.splice(indice, 1);
    io.emit('productos', productos); // Emitir a todos los clientes la lista actualizada de productos
  });

  // Evento de desconexión de un usuario
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

// Aplicación de enrutamiento con un enrutador de vistas
app.use('/', viewsRouters(io, productos));

// Configuración del número de puerto y arranque del servidor HTTP
const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
