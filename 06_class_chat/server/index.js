import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import Database from './db_conn.js';

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(logger('dev'));

io.on('connection', async (socket) => {
    console.log('A user connected');
    if (!socket.recovered) {
        try {
            const messages = await Database.getLastMessages(socket.handshake.auth.serverOffset);
            messages.forEach((message) => {
                socket.emit('server-message', message.message);
            });
        } catch (err) {
            console.error(err.message);
        }
    }
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('client-message', async (message) => {
        console.log('Message from client:', message);
        let idMessage = null;
        try {
            idMessage = await Database.addMessage(message);
        } catch (err) {
            console.error(err.message);
        }
        io.emit('server-message', message, idMessage);
    });
});

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
