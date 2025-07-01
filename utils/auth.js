/**
 * Authentifizierungs- und Autorisierungs-Middleware
 * - requireLogin: Blockiert nicht eingeloggte User
 * - injectUser: Legt eingeloggten User in res.locals.user für Views bereit
 */
const { getUserById } = require("../models/user");

// Middleware für Login-Zwang
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.flash("error", "Bitte melde dich zuerst an.");
    // Session speichern vor Redirect!
    return req.session.save(() => res.redirect("/login"));
  }
  next();
}

// User für Views bereitstellen
function injectUser(req, res, next) {
  if (req.session && req.session.userId) {
    const user = getUserById(req.session.userId);
    if (user) {
      res.locals.user = user;
    }
  } else {
    res.locals.user = null;
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.session.userId || req.session.userId !== 1) {
    req.flash("error", "Zugriff nur für Admin.");
    return res.redirect("/uebersicht");
  }
  next();
}

module.exports = { requireLogin, injectUser, requireAdmin };
