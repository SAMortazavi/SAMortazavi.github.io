# Seyed Abolfazl Mortazavi — Portfolio (GitHub Pages)

## Deploy (existing repository)

1. Download and extract the ZIP.
2. Copy **all contents** from the ZIP into the **root** of your existing `SAMortazavi.github.io` repository, replacing old `index.html`, `styles.css`, `script.js`, and `404.html` files.
3. **Keep the folder structure intact**, especially `assets/images/` and `Resumes/`.
4. Commit and push to the branch used by your GitHub Pages deployment (usually `main`).
5. If Pages is set to deploy from the branch root, the site will update at `https://samortazavi.github.io/` when GitHub finishes publishing.

```bash
# From the root of your already-cloned repository (after copying files):
git add .
git commit -m "Redesign portfolio: research, production AI and awards"
git push origin main
```

## What changed
- Complete responsive redesign with subtle motion, dark/light modes, functional project filters, and accessible navigation.
- Research, publications (marked **Under review**), honors/awards, industrial AI, and mentoring details.
- The **three original uploaded photos** used unchanged; no AI-generated/modified face appears in the published site.
- Industry resume and academic CV PDFs are bundled and linked.

## User-requested content choices
- The portfolio **intentionally retains previous website GPAs**: **19.02/20** (Sharif M.Sc.) and **19.07/20** (Amirkabir B.Sc.). The bundled academic CV contains different GPA figures, because it is a separate previously prepared document. Review and reconcile before using both for formal applications.
- Mentoring: **8 active (1 B.Sc., 6 M.Sc., 1 Ph.D.) + 3 completed B.Sc. theses** (20/20, 19/20, 20/20).
- The iAAA award is presented as the user's stated achievement. The two publications are not described as accepted or published.
- The domain, social links, and company references assume the existing GitHub Pages repository domain remains the same.

## Technologies
Static HTML, CSS and vanilla JavaScript; optional Google Fonts. No build process, Node installation, dependencies, API keys, or server required. Supports hosting at the repository root.

## Files
- `index.html`, `styles.css`, `script.js` — site
- `404.html`, `robots.txt`, `sitemap.xml` — site plumbing
- `assets/favicon.svg` — icon
- `assets/images/` — original user photos
- `Resumes/` — PDFs

© Seyed Abolfazl Mortazavi
