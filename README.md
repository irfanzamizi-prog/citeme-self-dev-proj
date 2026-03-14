# CiteMe

A fast, clean citation generator that supports **APA**, **MLA**, and **Harvard** styles. Paste a URL to auto-fill citation details, or fill in the fields manually.

## Features

- **Auto-fill from URL** — paste any webpage, YouTube video, or article URL and the app extracts the author, title, year, and publisher automatically
- **Three citation styles** — APA, MLA, and Harvard, switchable in one click
- **Four source types** — Website, Book, Journal Article, YouTube
- **Bibliography builder** — save multiple citations and copy them all at once
- **Live preview** — citation updates as you type

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- [Microlink API](https://microlink.io/) — metadata extraction from URLs
- [YouTube oEmbed](https://oembed.com/) — channel and video title for YouTube sources

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── App.jsx       # Main component — all citation logic and UI
├── index.css     # All styles
└── main.jsx      # React entry point
```

## How Auto-fill Works

When you paste a URL, the app runs a three-layer extraction:

1. **Microlink** — fetches page metadata (title, author, date, publisher)
2. **YouTube oEmbed** — for YouTube URLs, gets the channel name and video title
3. **AI gap-filler** — calls the Claude API to fill in any fields that Microlink couldn't extract

Any auto-filled fields are highlighted in green and can be freely edited.

## Deployment

Deployed on [Vercel](https://vercel.com/). Every push to `master` triggers an automatic redeploy.
