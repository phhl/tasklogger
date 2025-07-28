/**
 * Routen für neue Einträge, Bearbeiten, Löschen
 */
const express = require("express");
const router = express.Router();
const {
  createEntry,
  getEntryById,
  updateEntry,
  deleteEntry,
} = require("../models/entry");
const { createTrip } = require("../models/trip");

// Formular für neuen Eintrag (Standard: heutiges Datum)
router.get("/neu", (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  res.render("entry_form", {
    title: "Neue Aufgabe eintragen",
    entry: { date: today },
    edit: false,
    messages: req.flash(),
  });
});

// Eintrag anlegen
router.post("/neu", (req, res) => {
  if (req.body.multi && Array.isArray(req.body.days)) {
    const days = req.body.days;
    const tripId = createTrip({
      user_id: req.session.userId,
      start_date: days[0].date,
      end_date: days[days.length - 1].date,
    });
    days.forEach((d) => {
      const e = {
        user_id: req.session.userId,
        date: d.date,
        activity: d.activity,
        duration_h: d.duration_h,
        duration_m: d.duration_m,
        travel_h: d.travel_h,
        travel_m: d.travel_m,
        t1: d.t1,
        t2: d.t2,
        t3: d.t3,
        t4: d.t4,
        trip_id: tripId,
      };
      createEntry(e);
    });
    req.flash("success", "Einträge gespeichert.");
    return res.redirect("/uebersicht");
  }

  const entry = {
    user_id: req.session.userId,
    date: req.body.date,
    activity: req.body.activity,
    duration_h: req.body.duration_h,
    duration_m: req.body.duration_m,
    travel_h: req.body.travel_h,
    travel_m: req.body.travel_m,
    t1: req.body.t1,
    t2: req.body.t2,
    t3: req.body.t3,
    t4: req.body.t4,
    trip_id: null,
  };
  createEntry(entry);
  req.flash("success", "Eintrag gespeichert.");
  res.redirect("/uebersicht");
});

// Formular: Eintrag bearbeiten
router.get("/bearbeiten/:id", (req, res) => {
  const entry = getEntryById(req.params.id);
  if (!entry || entry.user_id !== req.session.userId) {
    req.flash("error", "Kein Zugriff!");
    return res.redirect("/uebersicht");
  }
  res.render("entry_form", {
    title: "Eintrag bearbeiten",
    entry,
    edit: true,
    messages: req.flash(),
  });
});

// Bearbeiten speichern
router.post("/bearbeiten/:id", (req, res) => {
  const oldEntry = getEntryById(req.params.id);
  if (!oldEntry || oldEntry.user_id !== req.session.userId) {
    req.flash("error", "Kein Zugriff!");
    return res.redirect("/uebersicht");
  }
  const entry = {
    date: req.body.date,
    activity: req.body.activity,
    duration_h: req.body.duration_h,
    duration_m: req.body.duration_m,
    travel_h: req.body.travel_h,
    travel_m: req.body.travel_m,
    t1: req.body.t1,
    t2: req.body.t2,
    t3: req.body.t3,
    t4: req.body.t4,
    trip_id: oldEntry.trip_id,
  };
  updateEntry(req.params.id, entry);
  req.flash("success", "Eintrag aktualisiert.");
  res.redirect("/uebersicht");
});

// Löschen
router.post("/loeschen/:id", (req, res) => {
  const entry = getEntryById(req.params.id);
  if (!entry || entry.user_id !== req.session.userId) {
    req.flash("error", "Kein Zugriff!");
    return res.redirect("/uebersicht");
  }
  deleteEntry(req.params.id);
  req.flash("success", "Eintrag gelöscht.");
  res.redirect("/uebersicht");
});

module.exports = router;
