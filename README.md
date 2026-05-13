# Quran Pace

Quran Pace is a Ramadan Quran planner that helps readers complete the Quran using Ruku-based progress tracking. It calculates daily targets, records reading sessions, shows where to resume, and provides quick reference pages for Ruku and Juz relationships.

## Features

- Onboarding for Ramadan length, current day, target finish day, and pacing strategy
- Balanced, front-loaded, back-loaded, Taraweeh, and custom schedule modes
- Daily Ruku target calculation based on remaining progress
- Reading session logging by Surah and Ruku
- Progress ring, streak tracking, estimated finish day, and recent session history
- Undo for the most recent reading session
- Guide for finding Ruku numbers in a Quran
- Juz-wise Ruku reference table
- It also has a feature for longer target periods like 60 - 90 days, etc.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- shadcn/ui and Radix UI
- Vitest

## Getting Started

Install dependencies:

```sh
npm install
```

Start the development server:

```sh
npm run dev
```

Run a production build:

```sh
npm run build
```

Run tests:

```sh
npm run test
```

## Deployment

This app is ready to deploy on Vercel as a standard Vite project.

Recommended Vercel settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Data Storage

User progress is stored locally in the browser using `localStorage`. No backend or external database is required.
