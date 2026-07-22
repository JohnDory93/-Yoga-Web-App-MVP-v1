# Yoga with Lina — Browser MVP

A responsive, no-build web app prototype for selling yoga videos and programs.

## Run it

For reliable video uploads, serve the folder through a local web server rather than opening `index.html` directly.

### Mac / Windows / Linux with Python

```bash
cd yoga_webapp_mvp
python3 -m http.server 8000
```

Open: http://localhost:8000

### Phone or iPad testing

Upload this folder to any static host such as Netlify Drop, Vercel, or Cloudflare Pages.

## Admin

Open **Admin** in the top navigation, or go to `#admin`.

The prototype supports:

- Changing the homepage hero picture
- Adding and replacing cover images
- Uploading real video files
- Creating free, paid, or membership classes
- Publishing or saving drafts
- Editing and deleting classes
- Watching uploaded videos
- Course pages, favourites and progress

## Important prototype limitation

Images and metadata are stored in browser localStorage. Video files are stored in the browser using IndexedDB. Content therefore stays only on that browser/device and is not yet shared online.

For production, replace local storage with Supabase, Cloudflare Stream and Stripe.
