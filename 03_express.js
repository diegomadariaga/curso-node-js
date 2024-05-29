const express = require('express');
const app = express();
app.disable('x-powered-by');

app.get('/', (_req, res) => {
    res.send('Hello World!');
});

module.exports = app;
