# CiteMe

**CiteMe** is a smart, browser-based citation generator that formats academic references instantly. Paste a URL to auto-extract metadata, or fill in the fields manually — and get a perfectly formatted citation in APA, MLA, or Harvard style within seconds.

**Live Demo:** [citeme.vercel.app](https://citeme.vercel.app)

---

## What It Does

Academic citations are tedious to format correctly. CiteMe eliminates that friction:

- Paste a URL — the app automatically extracts the author, title, publication year, publisher, and more
- Select your citation style (APA, MLA, or Harvard)
- Get a ready-to-use citation, copy it, or save it to a bibliography

No sign-up. No ads. No bloat.

---

## Features

- **3 citation styles** — APA, MLA, and Harvard, switchable with one click with live preview
- **4 source types** — Website, Book, Journal Article, and YouTube
- **3-layer auto-fill** — paste any URL and the app intelligently extracts citation metadata
- **Live citation preview** — citation updates in real time as you fill in or edit fields
- **Progress tracker** — shows how many required fields have been completed
- **Bibliography builder** — save multiple citations and copy them all as a numbered list
- **Auto-fill indicators** — auto-filled fields are highlighted in green; manually edited fields clear the highlight
- **Fully responsive** — works on desktop and mobile

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev/) |
| Build Tool | [Vite 8](https://vite.dev/) |
| Styling | Plain CSS (no framework) |
| Metadata Extraction | [Microlink API](https://microlink.io/) |
| YouTube Data | [YouTube oEmbed API](https://oembed.com/) |
| AI Gap-filling | [Claude API](https://www.anthropic.com/) |
| Deployment | [Vercel](https://vercel.com/) |

---

## How the 3-Layer Auto-fill Works

When you paste a URL and click **Auto-fill**, the app runs three extraction layers in sequence:

### Layer 1 — Microlink
Sends the URL to the [Microlink API](https://microlink.io/), which scrapes the page and returns structured metadata: title, author name, publication date, and publisher/site name. This handles most standard websites and articles.

### Layer 2 — YouTube oEmbed
For YouTube URLs, the app additionally calls the [YouTube oEmbed endpoint](https://www.youtube.com/oembed) to reliably retrieve the video title and channel name — data that Microlink may not always capture accurately for video content.

### Layer 3 — AI Gap-filler
If required fields are still missing after layers 1 and 2, the app calls the **Claude API** with a structured prompt asking it to infer the missing metadata (e.g. journal name, volume, city of publication) from the URL and context. Only fields the model is confident about are used.

Any auto-filled value can be freely edited. The citation preview updates immediately on every change.

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# 1. Clone the repository
git clone https://github.com/irfanzamizi-prog/citeme.git
cd citeme

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Deploying to Vercel

### Option A — Vercel Dashboard (recommended)

1. Push the project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **Add New → Project** and import the repository
4. Vercel auto-detects Vite — no configuration needed
5. Click **Deploy**

Every subsequent push to `master` triggers an automatic redeploy.

### Option B — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. Vercel will detect the Vite framework and configure the build automatically.

---

## Project Structure

```
citeme/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx         # All citation logic, auto-fill, and UI
│   ├── index.css       # All styles
│   └── main.jsx        # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## License

MIT
