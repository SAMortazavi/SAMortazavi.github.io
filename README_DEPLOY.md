# SAM Portfolio / Signature Edition (2026)

A responsive, dependency-light, English-only personal portfolio for Seyed Abolfazl Mortazavi, designed for both academic research opportunities and AI/ML engineering roles.

## Deployment (GitHub Pages)

1. Download and **extract** the ZIP.
2. Copy **everything inside the extracted folder**, not the folder itself, into the root of the existing `SAMortazavi.github.io` repository. Overwrite matching files.
3. Verify that `index.html`, `styles.css`, `script.js`, `assets/`, and `Resumes/` are directly inside the repository root.
4. From that repository, run:

```bash
git add --all
git commit -m "Launch signature AI research and engineering portfolio"
git push origin main
```

If your GitHub Pages site uses a different branch, push to the branch configured under Repository → Settings → Pages. The static site does **not** require npm, a build step, or a server-side backend.

Site address: https://samortazavi.github.io/

## Included

- Responsive landing page (dark default, user-selectable light mode)
- Separate Academic Research and Production AI sections
- iAAA 2026 competition recognition, publications **under review**, research, and industrial case studies
- Open-source project links, updated mentoring counts, teaching and education
- Original user-supplied photographs (`assets/images/`) and two existing résumé PDFs (`Resumes/`)
- Custom 404 page, favicon, sitemap, robots and `.nojekyll`
- `.gitattributes` to keep text line endings consistent on Windows

## Editorial notes

- Site education GPAs intentionally remain **19.02/20 (M.Sc.)**, **19.07/20 (B.Sc.)**, and **19.38/20 (additional coursework)**, as requested; the bundled academic CV has its own GPA values; only its mentorship section was refreshed.
- Mentoring reflects 8 current students (1 B.Sc., 6 M.Sc., 1 Ph.D.) and 3 completed B.Sc. theses (20/20, 19/20, 20/20).
- Both listed manuscripts are **under review**, not published or accepted.
- Performance metrics refer to specific tested datasets and conditions; they are not universal/generalization claims.
- The industry résumé is the original supplied PDF and may still reflect an earlier mentoring snapshot; website and updated Academic CV reflect the new counts.
- Original portraits are used directly, without AI face generation or facial changes. CSS adjusts only their on-page presentation/cropping.
- Google Fonts is used optionally, with system font fallbacks. There are no tracking scripts, frontend frameworks, or build tools.

## Site layout

```text
index.html
styles.css
script.js
404.html
.gitattributes
.nojekyll
robots.txt
sitemap.xml
README_DEPLOY.md
assets/
  favicon.svg
  images/
    portrait-hero.jpg
    graduation.jpg
    portrait-contact.jpg
Resumes/
  Seyed_Abolfazl_Mortazavi_Academic_CV.pdf
  Seyed_Abolfazl_Mortazavi_Resume.pdf
```
