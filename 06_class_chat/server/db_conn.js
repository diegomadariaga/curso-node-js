import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();
// Create a new database connection
// si no existe la base de datos, la crea
let db;
(async () => {
    try {
        db = await sqlite.open({
            filename: 'server/db.sqlite3',
            driver: sqlite3.Database
        });
        console.log('Connected to the SQLite database.');
    } catch (err) {
        console.error(err.message);
    }
})();

// si no existe la tabla messages, la crea
(async () => {
    try {
        await db.run(`CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);
    } catch (err) {
        console.error(err.message);
    }
})();
// export the database connection
export default db;
