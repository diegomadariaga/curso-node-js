const fs = require("node:fs/promises");

(async () => {
    const stats = await fs.stat("./hola.txt");

    const isFile = stats.isFile();
    const isDir = stats.isDirectory();
    const isSymLink = stats.isSymbolicLink();
    const size = stats.size;

    console.log("isFile: ", isFile);
    console.log("isDir: ", isDir);
    console.log("isSymLink: ", isSymLink);
    console.log("size: ", size);

    const file = await fs.readFile("./hola.txt", "utf-8");
    console.log(file);
})();
