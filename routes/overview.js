/**
 * Übersicht über alle Einträge eines Monats, Summenberechnung
 */
const express = require("express");
const router = express.Router();
const { getEntriesByUserAndMonth } = require("../models/entry");
const { sumTimes } = require("../utils/time");

// Monatsübersicht
router.get("/", (req, res) => {
  // Standard: aktueller Monat, Jahr
  const today = new Date();
  const year = parseInt(req.query.jahr) || today.getFullYear();
  const month = parseInt(req.query.monat) || today.getMonth() + 1;

  const entries = getEntriesByUserAndMonth(req.session.userId, year, month);
  const sums = sumTimes(entries);

  res.render("overview", {
    ...res.locals,
    title: "Monatsübersicht",
    entries,
    year,
    month,
    sums,
    messages: req.flash(),
  });
});

module.exports = router;
