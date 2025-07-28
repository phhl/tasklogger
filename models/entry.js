/**
 * Model für Aufgaben-Einträge (CRUD)
 * Nutzt die gemeinsame DB-Instanz.
 */
const db = require("./db");

function createEntry(entry) {
  const stmt = db.prepare(`
        INSERT INTO entries
        (user_id, date, activity, duration_h, duration_m, travel_h, travel_m, t1, t2, t3, t4, trip_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
  stmt.run(
    entry.user_id,
    entry.date,
    entry.activity,
    entry.duration_h,
    entry.duration_m,
    entry.travel_h,
    entry.travel_m,
    entry.t1,
    entry.t2,
    entry.t3,
    entry.t4,
    entry.trip_id || null
  );
}

function getEntriesByUserAndMonth(user_id, year, month) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-31`;
  return db
    .prepare(
      `
        SELECT * FROM entries
        WHERE user_id = ? AND date BETWEEN ? AND ?
        ORDER BY date ASC, created_at ASC
    `
    )
    .all(user_id, start, end);
}

function getEntryById(id) {
  return db.prepare("SELECT * FROM entries WHERE id = ?").get(id);
}

function updateEntry(id, entry) {
  db.prepare(
    `
        UPDATE entries
        SET date = ?, activity = ?, duration_h = ?, duration_m = ?, travel_h = ?, travel_m = ?,
            t1 = ?, t2 = ?, t3 = ?, t4 = ?, trip_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `
  ).run(
    entry.date,
    entry.activity,
    entry.duration_h,
    entry.duration_m,
    entry.travel_h,
    entry.travel_m,
    entry.t1,
    entry.t2,
    entry.t3,
    entry.t4,
    entry.trip_id || null,
    id
  );
}

function deleteEntry(id) {
  db.prepare("DELETE FROM entries WHERE id = ?").run(id);
}

module.exports = {
  createEntry,
  getEntriesByUserAndMonth,
  getEntryById,
  updateEntry,
  deleteEntry,
};
