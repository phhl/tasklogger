/**
 * Model für User-Operationen (anlegen, suchen, Passwort prüfen/ändern)
 * Nutzt die gemeinsame DB-Instanz.
 */
const db = require("./db");
const bcrypt = require("bcrypt");

function getUserByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

function getUserById(id) {
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

function createUser(username, password) {
  const hash = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(
    "INSERT INTO users (username, password) VALUES (?, ?)"
  );
  try {
    stmt.run(username, hash);
    return true;
  } catch (err) {
    return false;
  }
}

function updatePassword(id, newPassword) {
  const hash = bcrypt.hashSync(newPassword, 10);
  db.prepare("UPDATE users SET password = ? WHERE id = ?").run(hash, id);
}

function verifyPassword(username, password) {
  const user = getUserByUsername(username);
  if (!user) return false;
  return bcrypt.compareSync(password, user.password);
}

function updateUsername(id, newUsername) {
  db.prepare("UPDATE users SET username = ? WHERE id = ?").run(newUsername, id);
}

function getAllUsers() {
  return db.prepare("SELECT * FROM users").all();
}

function deleteUser(id) {
  db.prepare("DELETE FROM users WHERE id = ?").run(id);
}

module.exports = {
  getUserByUsername,
  getUserById,
  createUser,
  updatePassword,
  verifyPassword,
  updateUsername,
  getAllUsers,
  deleteUser,
};
