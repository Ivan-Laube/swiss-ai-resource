# Cloudflare Pages deployment

## Build settings

| Setting | Value |
|---|---|
| Framework preset | None (or Next.js Static HTML Export) |
| Build command | `npm run build` |
| Build output directory | `out` |
| Node version | 20 |
| Root directory | `/` |

## Manual setup (~10 minutes)

1. Create a GitHub repository (e.g. `swiss-ai-resource`).
2. Add the remote and push:

   ```bash
   git remote add origin git@github.com:YOUR_USER/swiss-ai-resource.git
   git branch -M main
   git push -u origin main
   ```

3. In Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
4. Select the repository and apply the build settings above.
5. Deploy. The root path redirects to `/de/` via `public/_redirects`.
6. Optional: add a custom domain under the Pages project settings.

## Local verification

```bash
npm install
npm run dev
npm run build
```

A successful build writes static files to `out/`.
