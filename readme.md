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
   git clone https://github.com/phhl/tasklogger.git
   cd tasklogger
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. `.env.example` kopieren und anpassen (optional):

   ```bash
   cp .env.example .env
   ```

   Passe danach bei Bedarf die Werte in `.env` an.

4. Starten:

   ```bash
   npm start
   ```

   Die App läuft auf [http://localhost:3000](http://localhost:3000)

Beim ersten Start wird automatisch ein Admin-Account (Benutzer: `admin`, Passwort: `password`) angelegt, sofern keine Benutzer existieren.

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
