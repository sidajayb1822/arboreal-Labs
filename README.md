# Arboreal Labs website

The site at [arboreallabs.com](https://arboreallabs.com). Plain HTML, CSS and JavaScript, deployed by Vercel from the `master` branch. Every page is a file, and its address is its path without `.html` (`custom-solutions.html` is `/custom-solutions`).

## What is in this folder

| Path | What it is | Live? |
|---|---|---|
| `*.html` (top level) | Main pages: home, services, case studies, contact, legal, 404 | Yes |
| `websites/` | Website portfolio: `/websites` and one page per site | Yes |
| `blog/` | Blog listing and articles | Yes |
| `proposals/smaya/` | SMAYA proposal, shared as `/smaya` (hidden from search) | Yes |
| `assets/` | Shared CSS, JavaScript, images, video and vendor libraries | Yes |
| `sitemap.xml`, `robots.txt`, `llms.txt` | Search engine and AI tool files | Yes |
| `vercel.json` | Clean URLs, redirects, the `/smaya` short link and no-index headers | Config |
| `tools/` | Generators for the blog, portfolio and SEO, plus the blog-post command's helpers | No, local only |
| `_private/` | Brand masters, Search Console exports, recordings, drafts, notes, reference libraries | No, local only |

## Rules that keep the site safe

- Never rename or move a live page or image: its address would break. Add a redirect in `vercel.json` if one must move.
- Blog, portfolio and SEO pages are generated. Edit the sources in `tools/` and rebuild, not the HTML:
  - `python tools/blog/build.py` (blog, then SEO)
  - `python tools/portfolio/build.py` (portfolio)
  - `python tools/seo/apply_seo.py` (titles, structured data, sitemap, llms.txt)
- Preview locally with `python tools/blog/serve.py`, then open `http://localhost:8000`.
- Anything private goes in `_private/`, which is never committed.
