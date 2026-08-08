# El-Khedma (الخدمة)

A simple desktop app built to manage and print the daily duty roster used in military units — specifically the two recurring duty types: **Weapon Duty (خدمة سلاح)** and **Gate Duty (خدمة بوابة)**.

## About

In the army, every unit keeps a rotating daily duty roster split between two posts — weapon duty and gate duty — and these roles swap each day. Keeping track of who's on duty, printing it out, and saving a copy for later used to be a manual, repetitive, and error-prone process.

**El-Khedma** was built to solve exactly that problem. It was created out of a personal need while serving in the army — a small tool to make the daily process faster, keep the roster organized, and make sure nothing gets forgotten from one day to the next.

## The Problem It Solves

- **Speed** — generating and printing the daily roster used to take time; now it's a couple of clicks.
- **Organization** — one clear system for managing ٍٍٍSoldiers instead of loose notes or memory.
- **Continuity** — nothing gets forgotten between shifts, since every day's roster is saved and dated automatically.

## Features

- **Manage ٍٍٍSoldiers** — add, edit, and delete individuals, each with their rank/grade recorded.
- **Home Dashboard** — displays the officers' info for the day along with the names assigned to duty.
- **Switch Duty Button** — flips the roster for the next day: whoever was on weapon duty moves to gate duty and vice versa, and the app generates the new day's assignment (guard/غفرة) automatically.
- **Clean Single View** — the full roster is displayed on one screen for easy review before printing.
- **Print** — send the roster straight to the printer with one click.
- **Save as PDF** — captures the roster exactly as shown on screen and saves it as a PDF file, automatically named with the current date (e.g. `خدمة 08-08-2026.pdf`), so every day's roster is archived and easy to find later.

## Tech Stack

- **React** — UI framework
- **Material UI (MUI)** — components and styling
- **html2canvas-pro** — screen capture for PDF export
- **jsPDF** — PDF generation
- **react-hot-toast** — user feedback/notifications

## Usage

1. Add your ٍٍٍSoldiers with their ranks/grades from the management screen.
2. The home page shows today's duty roster automatically.
3. Use the **Switch Duty** button to flip the roster for the next day (weapon ↔ gate).
4. Review the roster on the single-screen view.
5. Click **Print** to print directly, or **Save PDF** to save a dated copy for your records.

## Author

Built by **Omar Ehab** — created while serving in the army, out of a real day-to-day need to make duty management faster and more reliable.

---

_© Omar Ehab, 2026_
