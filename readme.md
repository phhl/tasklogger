# TaskLogger

Ein moderner Aufgaben-Logger für Projekte und Arbeitszeiten mit Mehrbenutzerverwaltung und SQLite.

## Features

- Aufgaben, Arbeitszeiten und Fahrzeiten schnell protokollieren (mobilfreundlich)
- Tätigkeitsbeschreibung, Arbeits- und Fahrzeit, optionale Reise-/Terminzeiten
- Monatsübersicht mit Summen & Excel-Export
- Bearbeiten/Löschen von Einträgen
- Ansprechendes, responsives Design mit Bulma CSS
- Nutzerverwaltung durch den Admin (User anlegen/löschen, Passwort-Reset)
- Eigene Account-Einstellungen für alle Nutzer

## Installation

1. Repository klonen und wechseln:

   ```bash
   git clone https://github.com/<deinuser>/tasklogger.git
   cd tasklogger
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. `.env` Datei anlegen (optional):

   ```env
   SESSION_SECRET=dein_geheimes_session_secret
   DB_PATH=./db/logger.sqlite
   PORT=3000
   ```

4. Starten:

   ```bash
   npm start
   ```

   Die App läuft auf [http://localhost:3000](http://localhost:3000)

Beim ersten Start wird automatisch ein Admin-Account (Benutzer: `admin`, Passwort: `admin123`) angelegt, sofern keine Benutzer existieren.

## Benutzerverwaltung

- Der erste User (ID 1) ist Admin
- Admin kann weitere User anlegen, löschen und Passwörter zurücksetzen
- Admin kann sich nicht selbst löschen
- Alle Nutzer können eigene Accountdaten ändern

## Technik

- Node.js ≥ 18
- SQLite (db/logger.sqlite)
- Sessions persistent im SQLite-Store
- Frontend mit Bulma & EJS

## Lizenz

MIT License

---

**Version:** 1.0.0 (26.06.2025)
