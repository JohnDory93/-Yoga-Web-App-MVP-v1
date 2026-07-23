# Lina Studio — Yoga Web App MVP v2

A polished, minimalist, single-page yoga web app prototype.

## Main modules
- Home
- Explore
- Shop: Programs, Objects, Clothing, Beauty
- My Practice with activity overview
- Creator Access for classes, videos, images, shop items and brand image

## Run locally
```bash
python3 -m http.server 8000
```
Open http://localhost:8000

## Deploy
Upload the contents of this folder to GitHub and import the repository into Vercel.

## Prototype limitations
Uploaded files are stored in the current browser using IndexedDB/localStorage. A production version should connect authentication, cloud video storage, a database and payments.
