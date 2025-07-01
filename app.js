require("dotenv").config();
const path = require("path");
const express = require("express");
const session = require("express-session");
const flash = require("express-flash");
const SQLiteStore = require("connect-sqlite3")(session);

const app = express();

// Auth-Middleware für Login-Status (vorher einbinden, damit du sie unten verwenden kannst)
const { requireLogin, injectUser } = require("./utils/auth");

// DB-Pfad aus .env laden
const DB_PATH = process.env.DB_PATH || "./db/logger.sqlite";

// Statische Dateien (Bulma, eigenes CSS, Icons etc.)
app.use(express.static(path.join(__dirname, "public")));

// EJS als Template Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Formulardaten und JSON parsen
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Session-Handling (mit SQLite-Store)
app.use(
  session({
    store: new SQLiteStore({
      db: path.basename(DB_PATH),
      dir: path.dirname(DB_PATH),
    }),
    secret: process.env.SESSION_SECRET || "fallback_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }, // 8h
  })
);

app.use(flash());

// User in res.locals bereitstellen (VOR Routern!)
app.use(injectUser);

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layout"); // layout.ejs als Standard für alle Views

// Datenbank und Models laden
const { initDbAndSeed } = require("./models/dbinit");
initDbAndSeed(DB_PATH);

// Routen einbinden
const authRoutes = require("./routes/auth");
const loggerRoutes = require("./routes/logger");
const overviewRoutes = require("./routes/overview");
const exportRoutes = require("./routes/export");
const adminRoutes = require("./routes/admin");

app.use("/", authRoutes);
app.use("/eintrag", requireLogin, loggerRoutes);
app.use("/uebersicht", requireLogin, overviewRoutes);
app.use("/export", requireLogin, exportRoutes);
app.use("/admin", requireLogin, adminRoutes);

// Startseite (bei Login Weiterleitung zur Eintragsmaske)
app.get("/", (req, res) => {
  if (req.session.userId) {
    return res.redirect("/eintrag/neu");
  }
  res.redirect("/login");
});

// Error Handler (z. B. 404)
app.use((req, res) => {
  res.status(404).render("404", { title: "Seite nicht gefunden" });
});

// Serverstart
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Logger-App läuft auf http://localhost:${PORT}`);
});
