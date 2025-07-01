/**
 * Hilfsfunktionen für Zeitberechnungen
 */

// Summiert Arbeitszeit und Fahrzeit aus Entry-Liste
function sumTimes(entries) {
  let sumWorkMin = 0;
  let sumTravelMin = 0;
  entries.forEach((e) => {
    sumWorkMin +=
      (parseInt(e.duration_h) || 0) * 60 + (parseInt(e.duration_m) || 0);
    sumTravelMin +=
      (parseInt(e.travel_h) || 0) * 60 + (parseInt(e.travel_m) || 0);
  });
  return {
    work: minToHMin(sumWorkMin),
    travel: minToHMin(sumTravelMin),
    total: minToHMin(sumWorkMin + sumTravelMin),
  };
}

// Minutensumme als "h:mm"-String
function minToHMin(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}:${m.toString().padStart(2, "0")}`;
}

module.exports = { sumTimes, minToHMin };
