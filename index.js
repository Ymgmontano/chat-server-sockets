import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { PORT } from './config.js';

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  }
});

app.use(cors());
app.use(morgan('dev'));



// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.setMaxListeners(50);
  // Manejar eventos de notificación
  io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Envía una notificación al cliente que se ha conectado
    socket.emit('conexionExitosa', 'Nuevo Cliente Conectado');

    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
  });
  // Cuando el socket reciba un evento "message"
  socket.on('message', (msg) => {
    // Enviaremos el mensaje recibido a otros clientes
    socket.broadcast.emit('message', { body: msg.body, user: msg.user });
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });
});

// Iniciar el servidor
server.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
