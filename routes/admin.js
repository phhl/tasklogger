const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  deleteUser,
  getUserById,
  updatePassword,
} = require("../models/user");
const { requireAdmin } = require("../utils/auth");

// Alle Benutzer anzeigen
router.get("/benutzer", requireAdmin, (req, res) => {
  const users = getAllUsers();
  res.render("admin_users", {
    title: "Benutzerverwaltung",
    users,
    messages: req.flash(),
    user: res.locals.user,
  });
});

// Benutzer anlegen – Formular
router.get("/benutzer/neu", requireAdmin, (req, res) => {
  res.render("admin_user_new", {
    title: "Neuen Benutzer anlegen",
    messages: req.flash(),
    user: res.locals.user,
  });
});

// Benutzer anlegen – POST
router.post("/benutzer/neu", requireAdmin, (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash("error", "Benutzername und Passwort erforderlich.");
    return res.redirect("/admin/benutzer/neu");
  }
  if (getAllUsers().some((u) => u.username === username)) {
    req.flash("error", "Benutzername ist bereits vergeben.");
    return res.redirect("/admin/benutzer/neu");
  }
  createUser(username, password);
  req.flash("success", "Benutzer wurde angelegt.");
  res.redirect("/admin/benutzer");
});

// Löschen bestätigen
router.get("/benutzer/loeschen/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
    req.flash("error", "Admin kann nicht gelöscht werden.");
    return res.redirect("/admin/benutzer");
  }
  const delUser = getUserById(id);
  if (!delUser) {
    req.flash("error", "Benutzer nicht gefunden.");
    return res.redirect("/admin/benutzer");
  }
  res.render("admin_user_delete", {
    title: "Benutzer löschen",
    delUser,
    messages: req.flash(),
    user: res.locals.user,
  });
});

// Benutzer löschen – POST
router.post("/benutzer/loeschen/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
    req.flash("error", "Admin kann nicht gelöscht werden.");
    return res.redirect("/admin/benutzer");
  }
  const delUser = getUserById(id);
  if (!delUser) {
    req.flash("error", "Benutzer nicht gefunden.");
    return res.redirect("/admin/benutzer");
  }
  deleteUser(id);
  req.flash("success", "Benutzer wurde gelöscht.");
  res.redirect("/admin/benutzer");
});

// Passwort zurücksetzen – Formular
router.get("/benutzer/reset/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  if (id === 1) {
    req.flash(
      "error",
      "Admin-Passwort kann nicht auf diesem Weg zurückgesetzt werden."
    );
    return res.redirect("/admin/benutzer");
  }
  const resetUser = getUserById(id);
  if (!resetUser) {
    req.flash("error", "Benutzer nicht gefunden.");
    return res.redirect("/admin/benutzer");
  }
  res.render("admin_user_reset", {
    title: "Passwort zurücksetzen",
    resetUser,
    messages: req.flash(),
    user: res.locals.user,
  });
});

router.post("/benutzer/reset/:id", requireAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  const { newPassword, repeatPassword } = req.body;
  if (id === 1) {
    req.flash(
      "error",
      "Admin-Passwort kann nicht auf diesem Weg zurückgesetzt werden."
    );
    return res.redirect("/admin/benutzer");
  }
  if (!newPassword || newPassword.length < 4) {
    req.flash("error", "Neues Passwort muss mindestens 4 Zeichen haben.");
    return res.redirect(`/admin/benutzer/reset/${id}`);
  }
  if (newPassword !== repeatPassword) {
    req.flash("error", "Die Passwörter stimmen nicht überein.");
    return res.redirect(`/admin/benutzer/reset/${id}`);
  }
  const resetUser = getUserById(id);
  if (!resetUser) {
    req.flash("error", "Benutzer nicht gefunden.");
    return res.redirect("/admin/benutzer");
  }
  updatePassword(id, newPassword);
  req.flash(
    "success",
    `Das Passwort von ${resetUser.username} wurde zurückgesetzt.`
  );
  res.redirect("/admin/benutzer");
});

module.exports = router;
