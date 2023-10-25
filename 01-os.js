const os = require('node:os');

console.log("información del sistema operativo: ", os.platform());
console.log("Versión del sistema operativo: ", os.release());
console.log("Memoria total: ", os.totalmem() / 1024 / 1024 / 1024);
console.log("Memoria libre: ", Math.floor(os.freemem() / 1024 / 1024 / 1024));
console.log("uptime: ", os.uptime() / 60 / 60 / 24);

