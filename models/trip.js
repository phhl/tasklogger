const db = require('./db');

function createTrip(trip) {
  const stmt = db.prepare(
    `INSERT INTO trips (user_id, start_date, end_date) VALUES (?, ?, ?)`
  );
  const info = stmt.run(trip.user_id, trip.start_date, trip.end_date);
  return info.lastInsertRowid;
}

module.exports = { createTrip };
