# Yoga con Rocío — Dark Studio v4

A responsive, static web-app prototype ready for GitHub and Vercel.

## Included
- Scrollable editorial homepage
- Dark modern wellness theme
- Mood-based discovery
- Stable Explore, Shop and My Practice modules
- Improved cinematic video page
- Creator dashboard
- Upload/replace cover images
- Upload local demo videos (stored in IndexedDB)
- Add/edit classes and shop items

## Run locally
Open `index.html`, or run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy
Upload the contents of this folder to a GitHub repository and import it into Vercel as an “Other” framework project.

## Prototype limitation
Creator uploads are saved only in the browser used for testing. Production sharing requires Supabase plus Cloudflare Stream or Mux.
