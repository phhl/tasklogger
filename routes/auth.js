/**
 * Authentifizierungs-Routen: Login, Logout, Passwort ändern
 */
const express = require("express");
const router = express.Router();
const {
  getUserByUsername,
  verifyPassword,
  updatePassword,
  updateUsername,
} = require("../models/user");

// Login-Formular GET
router.get("/login", (req, res) => {
  res.render("login", { title: "Login", messages: req.flash() });
});

// Login POST
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!verifyPassword(username, password)) {
    req.flash(
      "error",
      "Login fehlgeschlagen. Prüfe Benutzername und Passwort."
    );
    return req.session.save(() => res.redirect("/login"));
  }
  // User holen
  const user = getUserByUsername(username);
  req.session.userId = user.id;
  req.flash("success", "Erfolgreich angemeldet.");
  req.session.save(() => res.redirect("/eintrag/neu"));
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// Benutzer ändern
router.get("/account", (req, res) => {
  res.render("account", {
    title: "Account-Einstellungen",
    layout: "layout",
    messages: req.flash(),
  });
});

// POST: Benutzername und/oder Passwort ändern
router.post("/account", (req, res) => {
  const { newUsername, oldPassword, newPassword, repeatPassword } = req.body;
  const user = getUserByUsername(res.locals.user.username);

  // Passwort bestätigen
  if (!verifyPassword(user.username, oldPassword)) {
    req.flash("error", "Altes Passwort stimmt nicht.");
    return req.session.save(() => res.redirect("/account"));
  }

  // Passwort-Felder vergleichen
  if (newPassword && newPassword.length > 0) {
    if (newPassword !== repeatPassword) {
      req.flash("error", "Die neuen Passwörter stimmen nicht überein.");
      return req.session.save(() => res.redirect("/account"));
    }
    updatePassword(user.id, newPassword);
  }

  // Benutzername ändern
  let usernameChanged = false;
  if (newUsername && newUsername !== user.username) {
    // Prüfe, ob der neue Name schon existiert
    if (getUserByUsername(newUsername)) {
      req.flash("error", "Der Benutzername ist bereits vergeben.");
      return req.session.save(() => res.redirect("/account"));
    }
    updateUsername(user.id, newUsername);
    req.session.userId = user.id;
    usernameChanged = true;
  }

  // Erfolgs-/Infomeldung setzen
  if (usernameChanged && newPassword && newPassword.length > 0) {
    req.flash("success", "Benutzername und Passwort wurden geändert.");
  } else if (usernameChanged) {
    req.flash("success", "Benutzername wurde geändert.");
  } else if (newPassword && newPassword.length > 0) {
    req.flash("success", "Passwort wurde geändert.");
  } else {
    req.flash("info", "Keine Änderungen vorgenommen.");
  }
  req.session.save(() => res.redirect("/uebersicht"));
});

router.get("/flashtest", (req, res) => {
  req.flash("error", "Test-Error!");
  req.session.save(() => res.redirect("/account"));
});

module.exports = router;
