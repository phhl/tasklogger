/**
 * Initialisiert die SQLite-Datenbank und legt alle benötigten Tabellen an.
 * Setzt beim ersten Start einen Default-Admin-User (admin / password).
 * Nutzt die gemeinsame DB-Instanz.
 */

const db = require("./db");
const bcrypt = require("bcrypt");

const DEFAULT_ADMIN = {
  username: "admin",
  password: "password",
};

function initDbAndSeed() {
  console.log("==> Starte initDbAndSeed ...");

  try {
    db.prepare(
      `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            );
        `
    ).run();
    console.log("==> Tabelle 'users' angelegt/überprüft.");
  } catch (err) {
    console.error("==> FEHLER beim Anlegen der Tabelle 'users':", err);
  }

  // Tabelle für Aufgaben-Einträge
  try {
    db.prepare(
      `
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                date TEXT,            -- YYYY-MM-DD
                activity TEXT,        -- Freitext Tätigkeit
                duration_h INTEGER,   -- Stunden
                duration_m INTEGER,   -- Minuten
                travel_h INTEGER,     -- Fahrzeit Stunden
                travel_m INTEGER,     -- Fahrzeit Minuten
                t1 TEXT,              -- Beginn Dienstreise (HH:MM) optional
                t2 TEXT,              -- Beginn Dienstgeschäft (HH:MM) optional
                t3 TEXT,              -- Ende Dienstgeschäft (HH:MM) optional
                t4 TEXT,              -- Ende Dienstreise (HH:MM) optional
                trip_id INTEGER,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
        `
    ).run();
    console.log("==> Tabelle 'entries' angelegt/überprüft.");
  } catch (err) {
    console.error("==> FEHLER beim Anlegen der Tabelle 'entries':", err);
  }

  // Neue Tabelle für mehrtägige Dienstreisen
  try {
    db.prepare(
      `
            CREATE TABLE IF NOT EXISTS trips (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                start_date TEXT,
                end_date TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES users(id)
            );
        `
    ).run();
    console.log("==> Tabelle 'trips' angelegt/überprüft.");
  } catch (err) {
    console.error("==> FEHLER beim Anlegen der Tabelle 'trips':", err);
  }

  // Prüfen, ob Spalte trip_id existiert (für Updates alter DBs)
  try {
    const cols = db.prepare("PRAGMA table_info(entries)").all();
    const hasTrip = cols.some((c) => c.name === "trip_id");
    if (!hasTrip) {
      db.prepare("ALTER TABLE entries ADD COLUMN trip_id INTEGER").run();
      console.log("==> Spalte 'trip_id' zu 'entries' hinzugefügt.");
    }
  } catch (err) {
    console.error("==> FEHLER beim Prüfen/Hinzufügen von 'trip_id':", err);
  }

  // Anzahl der vorhandenen User prüfen
  let userCount = 0;
  try {
    const row = db.prepare("SELECT COUNT(*) as count FROM users").get();
    userCount = row ? row.count : 0;
    console.log("==> Es gibt aktuell", userCount, "User in der Datenbank.");
  } catch (err) {
    console.error("==> FEHLER beim Zählen der User:", err);
  }

  // Admin anlegen, wenn kein User existiert
  if (userCount === 0) {
    try {
      const hash = bcrypt.hashSync(DEFAULT_ADMIN.password, 10);
      db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(
        DEFAULT_ADMIN.username,
        hash
      );
      console.log("==> Admin-User (admin/password) wurde angelegt.");
    } catch (err) {
      console.error("==> FEHLER beim Einfügen des Admin-Users:", err);
    }
  } else {
    console.log("==> Kein Seed-Admin nötig, User existieren bereits.");
  }
}

module.exports = { initDbAndSeed };
