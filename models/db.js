// models/db.js
const Database = require("better-sqlite3");
const DB_PATH = process.env.DB_PATH || "./db/logger.sqlite";
const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
module.exports = db;
