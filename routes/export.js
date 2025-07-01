/**
 * Export als Excel-Datei (xlsx)
 */
const express = require("express");
const router = express.Router();
const ExcelJS = require("exceljs");
const { getEntriesByUserAndMonth } = require("../models/entry");
const { sumTimes } = require("../utils/time");

// /export/xlsx?jahr=2024&monat=6
router.get("/xlsx", async (req, res) => {
  const userId = req.session.userId;
  const year = parseInt(req.query.jahr);
  const month = parseInt(req.query.monat);
  const entries = getEntriesByUserAndMonth(userId, year, month);

  const sums = sumTimes(entries);

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Monat");

  sheet.columns = [
    { header: "Datum", key: "date", width: 45 },
    { header: "Tätigkeit", key: "activity", width: 30 },
    { header: "Dauer", key: "dauer", width: 10 },
    { header: "Fahrzeit", key: "fahrzeit", width: 10 },
    { header: "Beg. DR", key: "t1", width: 8 },
    { header: "Beg. DG", key: "t2", width: 8 },
    { header: "Ende DG", key: "t3", width: 8 },
    { header: "Ende DR", key: "t4", width: 8 },
  ];

  entries.forEach((e) => {
    sheet.addRow({
      date: e.date,
      activity: e.activity,
      dauer: `${e.duration_h}:${e.duration_m.toString().padStart(2, "0")}`,
      fahrzeit: `${e.travel_h}:${e.travel_m.toString().padStart(2, "0")}`,
      t1: e.t1 || "",
      t2: e.t2 || "",
      t3: e.t3 || "",
      t4: e.t4 || "",
    });
  });

  // Summenzeile
  sheet.addRow({});
  sheet.addRow({
    date: "Summe",
    activity: "",
    dauer: sums.work,
    fahrzeit: sums.travel,
    t1: "",
    t2: "",
    t3: "",
    t4: "",
  });

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Monatsübersicht_${year}_${month}.xlsx`
  );

  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
