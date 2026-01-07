Wishlist — project starter

How to preview locally:

- From the workspace root run:
  python3 -m http.server 8000
  then open http://localhost:8000/Wishlist/

This folder contains a minimal static site (`index.html`, `styles.css`, `script.js`) you can customize.

Supabase setup (anonymous writes):

1. Create a Supabase project at https://app.supabase.com (free tier is fine).
2. In the SQL editor, run `supabase.sql` (this will create `items` and `claims` tables, enable RLS, create public SELECT and anonymous INSERT policy for `claims`, and seed the items).
3. Get your **Project URL** and **anon public key** (Settings → API).
4. Edit `Wishlist/script.js` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` at the top of the file.
5. Open `Wishlist/index.html` in the browser (or deploy to your site) and try adding names next to items.

Security note: the site allows anonymous names to be added to items. If you want to prevent spam later, we can add CAPTCHA, a simple auth (magic link), or rate limiting.