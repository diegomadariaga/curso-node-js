import express from 'express';
import logger from 'morgan';
import { Server } from 'socket.io';
import { createServer } from 'http';
import db from './db_conn.js';

const PORT = process.env.PORT || 3000;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(logger('dev'));

io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    socket.on('client-message', async (message) => {
        console.log('Message from client:', message);
        try {
            const sql = `INSERT INTO messages (message) VALUES (?)`;
            await db.run(sql, [message]);
        }
        catch (err) {
            console.error(err.message);
        }
        io.emit('server-message', message);
    });
});

app.get('/', (req, res) => {
    res.sendFile(process.cwd() + '/client/index.html');
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
