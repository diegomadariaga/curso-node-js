const express = require('express');
const app = express();
app.disable('x-powered-by');
app.use(express.json());

app.use((req, res, next) => {
    console.log('your json body:', req.body);
    next();
});

app.get('/', (_req, res) => {
    res.send('Hello World!');
});

app.post('/', (req, res) => {
    const response = { message: 'Data received', data: req.body };
    res.json(response);
});

app.use((_req, res) => {
    res.status(404).send('Not Found');
});

module.exports = app;
