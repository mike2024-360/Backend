Parcel App - Supabase (Cleaned package)
======================================

What this package contains
- backend_supabase/: The 'supabase' folder from your Lovable project. It includes:
  - migrations/*.sql  (database schema)
  - functions/chat/*  (edge function to proxy chat to Lovable AI)
- frontend_plain/: A simple HTML + JS frontend that uses the Supabase JS client (CDN) to:
  - list parcels from the 'parcels' table
  - create new parcels
  - optionally call the 'chat' edge function at /functions/v1/chat
- .env.example: Replace with your project values locally (do NOT commit real keys to public repos)

Quick setup (manual steps - simple)
1. Create a copy of this folder on your PC.
2. Do NOT commit any real secret keys to GitHub. Use .env.example as template.
3. Open Supabase dashboard and choose your project (the one Lovable created).
4. Run the SQL migrations:
   - Go to SQL Editor in Supabase
   - Open each file in backend_supabase/migrations/*.sql and run them in order.
   - Confirm that tables 'parcels' and 'parcel_locations' exist.
5. (Optional) Deploy the Edge Function 'chat' if you want the AI chat:
   - Install Supabase CLI locally: https://supabase.com/docs/guides/cli
   - From this package root run: supabase login
   - Then: supabase functions deploy chat --project-ref YOUR_PROJECT_REF
   - In Supabase dashboard set the secret LOVABLE_API_KEY for the function (Project -> Settings -> API/Functions)
6. Frontend:
   - Open frontend_plain/index.html in a browser (serve via VS Code Live Server or simple HTTP server).
   - Edit frontend_plain/app.js and replace SUPABASE_URL and SUPABASE_ANON_KEY placeholders with your project's values.
   - Click "Refresh list" to fetch parcels, or create a parcel using the form.
7. To automate migrations and functions:
   - Connect your GitHub repo to Supabase (Project -> Settings -> Integrations -> GitHub) and set the relative path to backend_supabase
   - Push changes to the repo; Supabase can run migrations and deploy functions automatically.

Security notes
- Never expose the service_role key in client code.
- Use Row Level Security (RLS) policies to protect data when using anon keys in the browser.
- Store LOVABLE_API_KEY only as a server-side secret (Supabase function secret).

If you want, I can:
- Replace placeholders in frontend/app.js automatically with values you provide locally (I won't accept keys in chat).
- Deploy functions for you if you give a project-ref and set up a Supabase access token (I can't run that from here).
- Create a GitHub Actions workflow to automate deployments.

