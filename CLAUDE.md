● User answered Claude's questions:
  ⎿  · How is the hex grid encoded in the Google Sheet? What data does each row represent? → Each row = one hex
     · What information should be displayed on or around each hex? → Owner / faction
     · Do you need a background map image behind the hex grid (like the mod3-ai project has)? → Yes, map image

● Updated plan
  ⎿  /plan to preview

● User approved Claude's plan
  ⎿  Plan saved to: ~/.claude/plans/federated-kindling-kahan.md · /plan to edit
     Tech Stack Analysis: Hex Grid Web App (40klegue)

     Context

     New project at /home/jirka/projects/40klegue/ — a read-only hex grid viewer that renders
     Warhammer 40k league data from a Google Spreadsheet. No user state, no backend. Deploy via GitHub.

     ---
     Core Requirements

     ┌────────────────────┬─────────────────────────────────────────────────────┐
     │    Requirement     │                       Detail                        │
     ├────────────────────┼─────────────────────────────────────────────────────┤
     │ Hex grid rendering │ Flat-top SVG hexes, similar to mod3-ai project      │
     ├────────────────────┼─────────────────────────────────────────────────────┤
     │ Data source        │ Google Sheets (specific spreadsheet already exists) │
     ├────────────────────┼─────────────────────────────────────────────────────┤
     │ State              │ None — pure render on load                          │
     ├────────────────────┼─────────────────────────────────────────────────────┤
     │ Deployment         │ GitHub-native (GitHub Pages)                        │
     └────────────────────┴─────────────────────────────────────────────────────┘

     ---
     Recommended Stack

     1. Frontend: React + TypeScript + Vite

     Why this over alternatives:
     - The existing mod3-ai project already has production-quality hex math (hexMath.ts, hexGrid.ts) in React/TS — reuse directly, no rewrite
     - Vite builds to a static dist/ folder that GitHub Pages serves with zero config
     - TypeScript ensures correct hex geometry calculations
     - Alternatives considered:
       - Plain HTML/JS — no build step, but loses TS safety and can't reuse existing hex code cleanly
       - Svelte/Vue — good options but require rewriting hex math; no benefit here

     2. Data: Google Sheets → Published CSV

     How it works:
     - In Google Sheets: File → Share → Publish to web → CSV
     - Produces a public URL like:
     https://docs.google.com/spreadsheets/d/{ID}/export?format=csv&gid={GID}
     - Fetch with fetch() on app load → parse with a CSV parser (e.g., papaparse) → render
     - No API key needed, no backend, works from any static host
     - Data refreshes on every page load (always current)

     Alternatives considered:
     - Google Sheets API v4 — requires API key, more complex setup, overkill for read-only
     - Manual JSON file in repo — requires manual updates on every data change

     3. Deployment: GitHub Pages + GitHub Actions

     How it works:
     1. Push to main triggers a GitHub Actions workflow
     2. Workflow: npm ci → npm run build → deploy dist/ to gh-pages branch
     3. GitHub Pages serves the gh-pages branch at https://{user}.github.io/40klegue/

     Action used: peaceiris/actions-gh-pages or the official actions/deploy-pages
     — both free, well-maintained, zero cost

     ---
     Architecture

     Google Sheets (published CSV)
             ↓ fetch() on load
     src/
     ├── core/
     │   ├── hexMath.ts       ← copy from mod3-ai (hex geometry)
     │   └── hexGrid.ts       ← copy from mod3-ai (grid ops)
     ├── data/
     │   └── sheetsLoader.ts  ← fetch + papaparse CSV → typed row objects
     ├── ui/
     │   ├── HexGrid.tsx      ← SVG container
     │   └── HexCell.tsx      ← individual hex (simplified, no animations needed)
     └── App.tsx              ← fetch on mount, pass data to HexGrid

     No Zustand needed (no state). No Framer Motion needed (no interactions).
     Can strip the existing mod3-ai components down significantly.

     ---
     Key Files to Create/Reuse

     ┌──────────────────────────────┬────────────────────────┬───────────────────────────────────────┐
     │             File             │         Action         │                Source                 │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ src/core/hexMath.ts          │ Copy & reuse           │ mod3-ai/src/core/hexMath.ts           │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ src/core/hexGrid.ts          │ Copy & reuse           │ mod3-ai/src/core/hexGrid.ts           │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ src/ui/HexCell.tsx           │ Adapt (simplify)       │ mod3-ai/src/ui/components/HexCell.tsx │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ src/ui/HexGrid.tsx           │ Adapt (simplify)       │ mod3-ai/src/ui/components/HexGrid.tsx │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ src/data/sheetsLoader.ts     │ New                    │ —                                     │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ .github/workflows/deploy.yml │ New                    │ —                                     │
     ├──────────────────────────────┼────────────────────────┼───────────────────────────────────────┤
     │ vite.config.ts               │ New (base path needed) │ —                                     │
     └──────────────────────────────┴────────────────────────┴───────────────────────────────────────┘

     ---
     Vite Config Note

     GitHub Pages serves from a subdirectory path (/40klegue/).
     Must set base: '/40klegue/' in vite.config.ts for asset paths to resolve correctly.

     ---
     Verification

     1. npm run dev → hex grid renders in browser with data from Sheet
     2. npm run build → no TypeScript errors, dist/ produced
     3. Push to main → GitHub Actions runs, Pages URL shows the app
     4. Edit a cell in Google Sheets → refresh the page → change appears

     ---
     Confirmed Requirements (from user)

     - Sheet layout: Each row = one hex. Columns include col/row coordinates + hex data
     - Hex display: Owner / faction — shown as fill color and/or text label
     - Background map: Yes — use map from https://lh3.googleusercontent.com/sitesv/APaQ0SR_wiwuWd3zugohGmZVNzee3lxLYqrX2oFsMZKaXSvrBurX6HQ_FhOpH106GRsolBbOAXTXYdFjdbM_Y5vT9zvsbXUc581lwGDK7jSvzi0TM-Zutat9PT23Ok
     46x6_NFEo8zIUvAp2-JCUlQ0lBYmFZ2qsC7b8gxQWWpQQRGQyJnI_0vGGL4wpWx_YlPff9Dcz5iSIncRcDyJWMZsgvAz_QqSdSjpXDHWQFTj0=w1280

     Expected Sheet Schema (to confirm during implementation)

     ┌─────┬─────┬─────────┬─────────┬─────┐
     │ col │ row │ faction │  color  │ ... │
     ├─────┼─────┼─────────┼─────────┼─────┤
     │ 3   │ 5   │ Tau     │ #3399ff │ ... │
     └─────┴─────┴─────────┴─────────┴─────┘

     The sheetsLoader.ts will map each CSV row → HexRecord-like object with faction + color.
     Hex fill color driven by faction field.