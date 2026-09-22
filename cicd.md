# ALTS — CI/CD Documentation

## What is CI/CD?

**CI (Continuous Integration)** means that every time a developer pushes code, an automated system immediately checks whether the code is correct — by linting it, running tests, and building it. If anything fails, the developer is notified before the broken code reaches production.

**CD (Continuous Deployment)** means that once the code passes all checks on the main branch, it is automatically deployed to production without any manual steps.

Together, CI/CD ensures that:
- Bad code is caught before it reaches users
- Deployments are consistent and repeatable
- The team can ship changes quickly and confidently

---

## ALTS Pipeline

```
Developer writes code
        │
        ▼
git push or pull request
        │
        ▼
GitHub receives the push
        │
        ▼
GitHub Actions triggered
        │
        ├─────── Checkout repository
        │
        ├─────── Set up Node.js 20
        │
        ├─────── npm ci  (clean install from package-lock.json)
        │
        ├─────── npm run lint
        │              │
        │              ├── PASS → continue
        │              └── FAIL → pipeline stops ❌ (developer notified)
        │
        ├─────── npm audit --audit-level=critical
        │              │
        │              ├── PASS → continue
        │              └── FAIL → advisory (pipeline continues with warning)
        │
        └─────── npm run build
                       │
                       ├── PASS → build artifact uploaded ✅
                       └── FAIL → pipeline stops ❌
                              │
                              [if on main branch and all steps passed]
                              ▼
                       Deploy to GitHub Pages
                              │
                              ▼
                       Live ALTS Application 🚀
```

---

## What Each Step Does

### `npm ci`
Installs exact package versions from `package-lock.json`. Unlike `npm install`, it never changes the lockfile — ensuring every CI run uses identical dependencies.

### `npm run lint`
Runs ESLint on all `.js` and `.jsx` files. Catches:
- Unused variables
- Missing dependencies in React hooks
- Invalid JSX
- Code style violations

If lint fails, the build does not proceed.

### `npm audit`
Checks all installed packages against the npm security advisory database. Reports known vulnerabilities. In ALTS:
- Critical severity → pipeline fails
- High/moderate → advisory warning only

### `npm run build`
Runs `vite build` which:
- Compiles all JSX to JavaScript
- Processes Tailwind CSS
- Creates an optimised production bundle in `dist/`
- Applies the GitHub Pages base path

---

## Deployment to GitHub Pages

When code is pushed to the `main` branch and all CI steps pass:

1. The `deploy.yml` workflow runs
2. It builds the production bundle with `GITHUB_PAGES=true`
3. Vite applies `/mini-project/` as the base URL (required for GitHub Pages subdirectory hosting)
4. The `dist/` folder is uploaded to GitHub Pages
5. The site is live at: `https://your-username.github.io/mini-project/`

### Setting Up GitHub Pages

1. Go to your GitHub repository → Settings → Pages
2. Set Source to: **GitHub Actions**
3. Push to main — the `deploy.yml` workflow handles the rest

### SPA Routing Fix

GitHub Pages serves static files. When a user refreshes on a deep route (e.g., `/mini-project/seating`), GitHub Pages returns a 404. ALTS fixes this with `public/404.html` — a redirect script that preserves the URL and sends the user to `index.html`.

---

## Environment Variables in CI

| Variable | Where Set | Used For |
|---|---|---|
| `VITE_SUPABASE_URL` | GitHub Secrets | Supabase database connection |
| `VITE_SUPABASE_ANON_KEY` | GitHub Secrets | Supabase anon read access |
| `VITE_ADMIN_PIN` | GitHub Secrets | Admin panel access PIN |
| `GITHUB_PAGES` | Workflow env | Tells Vite to use `/mini-project/` base |
| `GITHUB_TOKEN` | Automatic | GitHub Pages deployment (no setup needed) |

### Adding Secrets to GitHub

1. GitHub repository → Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add each secret with the exact name shown above

---

## Branching Strategy

```
main           ← production branch — always deployable
  │
  ├── develop  ← integration branch (optional)
  │
  └── feature/exam-seating    ← feature branch
      fix/mobile-navigation    ← bug fix branch
      style/glass-sidebar      ← design branch
```

**Workflow:**
1. Create a branch: `git checkout -b feature/your-feature`
2. Make commits with meaningful messages (see below)
3. Push: `git push origin feature/your-feature`
4. Open a Pull Request to `main`
5. GitHub Actions runs CI automatically on the PR
6. Review and merge when CI passes

---

## Commit Message Convention

```
feat: add exam seating lookup         ← new feature
fix: repair mobile nav active state   ← bug fix
style: redesign sidebar glass effect  ← visual change
ci: update node version to 20         ← CI/pipeline
docs: add architecture documentation  ← documentation
security: add dependency audit step   ← security
chore: update package dependencies    ← maintenance
```

---

## DevSecOps Summary

This pipeline demonstrates **DevSecOps** — integrating security into the development workflow:

| Stage | Security Measure |
|---|---|
| Source Code | No secrets committed (`.gitignore`, `.env.example`) |
| Pull Request | Lint + build must pass before merge |
| CI | `npm audit` scans for vulnerable dependencies |
| Build | Environment variables injected from GitHub Secrets |
| Deployment | Minimal GitHub Actions permissions (`contents: read`) |
| Runtime | Supabase RLS prevents unauthorised data access |
| Admin | PIN-protected admin panel |
| Data | No real student data in the repository |
