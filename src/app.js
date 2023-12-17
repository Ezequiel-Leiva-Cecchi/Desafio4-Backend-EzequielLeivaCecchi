import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import exphbs from 'express-handlebars';
import path from 'path';
import fs from 'fs/promises';

import viewsRouters from './routes/views.routes.js';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);

let productos = [];

async function loadProductos() {
  try {
    const data = await fs.readFile('./src/data/productos.json', 'utf8');
    productos = JSON.parse(data);
  } catch (error) {
    console.error('Error loading productos:', error.message);
  }
}


loadProductos();

app.engine('handlebars', exphbs.engine);
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'handlebars');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.on('connection', (socket) => {
  console.log('Usuario conectado');


  socket.on('agregarProducto', (producto) => {
    productos.push(producto);
    io.emit('productos', productos);
  });

  socket.on('eliminarProducto', (indice) => {
    productos.splice(indice, 1);
    io.emit('productos', productos);
  });

  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
  });
});

app.use('/', viewsRouters(io, productos));

const PORT = 8080;

httpServer.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
