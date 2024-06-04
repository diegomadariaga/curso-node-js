import sqlite3 from 'sqlite3';
import * as sqlite from 'sqlite';
import dotenv from 'dotenv';

dotenv.config();

class Database {
  static db;

  static async connect() {
    if (!this.db) {
      try {
        this.db = await sqlite.open({
          filename: 'server/db.sqlite3',
          driver: sqlite3.Database
        });
        console.log('Connected to the SQLite database.');
        await this.createTables();
      } catch (err) {
        console.error(err.message);
      }
    }
    return this.db;
  }

  static async createTables() {
    try {
      await this.db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`);
    } catch (err) {
      console.error(err.message);
    }
  }

  static async getLastMessages(lastID = 0) {
    try {
      const messages = await this.db.all(`SELECT message FROM messages WHERE id > ?`, [lastID]);
      return messages;
    } catch (err) {
      console.error(err.message);
      return [];
    }
  }

  static async addMessage(message) {
    try {
      const result = await this.db.run(`INSERT INTO messages (message) VALUES (?)`, [message]);
      return result.lastID;
    } catch (err) {
      console.error(err.message);
      return null;
    }
  }
}

export default Database;

// Initialize the connection
(async () => {
  await Database.connect();
})();
