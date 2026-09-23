# IPL Data Analysis Dashboard

A Next.js dashboard visualizing cleaned IPL match and ball-by-ball data
(2008–2019). All charts are driven by a static JSON file
(`public/data/ipl_stats.json`) generated from the raw CSVs by
[`../analysis/clean_and_analyze.py`](../analysis/clean_and_analyze.py) — there
is no backend or database, so it deploys as a fully static site.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Regenerating the data

If the source CSVs in `../analysis/data/` change, regenerate the dashboard's
data file from the repo root:

```bash
python3 analysis/clean_and_analyze.py
```

This overwrites `dashboard/public/data/ipl_stats.json`.

## Deploying to Vercel

This app lives in the `dashboard/` subdirectory of the repository, so when
importing the repo in Vercel:

1. Create a new Vercel project from this GitHub repository.
2. Set **Root Directory** to `dashboard`.
3. Framework preset: **Next.js** (auto-detected).
4. Build command / output directory: leave as default (`next build`).
5. Deploy.

No environment variables or external services are required.
