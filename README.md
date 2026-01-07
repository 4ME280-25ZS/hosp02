Personal Brand — Static Site

Overview

This is a minimal, responsive personal-brand website scaffold. It contains a hero, about, portfolio, services, and contact sections.

Files

- [index.html](index.html) — main HTML
- [styles.css](styles.css) — styles
- [script.js](script.js) — small JS helpers

How to use

1. Open `index.html` in your browser (double-click or serve with a static server).

2. Replace placeholder text and project cards with your content and images. Add assets to the `assets/` folder.

3. To deploy quickly, push to GitHub Pages, Netlify, or Vercel.

Next steps

- Add real project pages and images in `assets/`.
- Integrate a contact endpoint or service (Formspree, Netlify Forms, or custom server).
- Customize colors, fonts, and copy.

Deploying to GitHub Pages (automated)

1. Create a new repository on GitHub (for example `my-portfolio`).
2. From your project folder run these commands to push and trigger the workflow:

```bash
git init
git add .
git commit -m "Initial site"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

3. After the push, GitHub Actions will run the workflow `.github/workflows/pages.yml` and deploy the site to GitHub Pages.

Expected URL formats:

- If your repo is a user site named `<your-username>.github.io`, your site will be available at: https://<your-username>.github.io/
- For a project site (e.g. `my-portfolio`), your site will be available at: https://<your-username>.github.io/<your-repo>/

Notes:

- Replace `<your-username>` and `<your-repo>` in the commands above with your GitHub username and repository name.
- If you need a custom domain, add a `CNAME` file to the project root and configure DNS.
