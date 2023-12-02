import express from 'express';
import morgan from 'morgan';
import { Server as SocketServer } from 'socket.io';
import http from 'http';
import cors from 'cors';
import { PORT } from './config.js';

// Prueba cambiando origin
const app = express();

const server = http.createServer(app);

// por medio del socket estoy dando permisos al origin de mi cliente
const io = new SocketServer(server, {
  cors: {
    origin: "*",
  }
});

// Usar middlewares
app.use(cors());
app.use(morgan('dev'));

// método que puede ejecutarse eventualmente
io.on('connection', (socket) => {  
  // console.log(`user id: ${socket.id}`);
  // Cuando el socket reciba un evento
  // El parámetro msg ya es el mensaje que llega
  socket.on('message', (msg) => {
    // console.log(`Message: ${msg}`);
    //Enviaremos el mensaje recibido a otros clientes
    socket.broadcast.emit('message', { body: msg.body, user:msg.user });
  })
});

server.listen(PORT);
console.log("Server started on port: "+PORT);