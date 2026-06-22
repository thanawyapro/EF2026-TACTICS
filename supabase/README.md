# Supabase Production Setup for EF26 Tactics Labs

This document explains how to set up, secure, and maintain a production-grade Supabase project integrated with the EF26 Tactics Netlify web application.

---

## 1. Create a Supabase Project

1. Go to the [Supabase Dashboard](https://supabase.com/) and click **New Project**.
2. Select your organization, fill in the Project Name (e.g., `EF26 Tactics Labs`), set a secure Database Password, and choose your preferred cloud region.
3. Click **Create new project** and wait for provisioning to complete (this usually takes 1-2 minutes).

---

## 2. Run SQL Migrations

Once your project is ready, execute the schema definition to configure tables, row-level security policies, indexes, and automated triggers.

1. In the Supabase dashboard, click on the **SQL Editor** tab in the sidebar layout.
2. Click **New query** (or **New blank query**).
3. Open `supabase/migrations/202606230001_initial_schema.sql` from this repository, copy its entire contents, and paste it into the SQL editor window.
4. Click **Run** (or press CMD/CTRL + Enter) to construct tables, establish row-level security constraints, and instantiate triggers.

---

## 3. Enable Authentication Providers

The app relies on Supabase Auth to enable Cloud Mode.

1. Go to **Authentication** in the sidebar, then navigate to **Providers**.
2. **Email Sign-in**: Enabled by default. You can configure if Email Confirmation is required (under Auth Settings). For initial testing or quick onboarding, you can toggle email confirmation off.
3. **Optional OAuth (Google/etc.)**: Add credentials here if you wish to offer social logins. The profile-triggered hook automatically takes profile avatars and display names from oauth providers raw metadata.

---

## 4. Retrieve Credentials

1. Navigate to **Project Settings** (gear icon at bottom left), then select the **API** tab.
2. Locate the following keys under the **Project API keys** header:
   - **Project URL** (e.g. `https://your-proj-id.supabase.co`)
   - **anon public** (API key prefixed with `eyJ...`)
3. Keep these safe. Do **not** use the `service_role` key in any client-side files, as it bypasses all Row-Level Security rules.

---

## 5. Environment Configuration

### Local Development
Create a `.env` file in the root directory (using `.env.example` as a template):
```env
VITE_SUPABASE_URL=https://your-proj-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your_anon_public_key_here
GEMINI_API_KEY=AIzaSy...your_gemini_server_side_key
```

### Production Netlify Configuration
To connect your live netlify preview, navigate to your Netlify dashboard:
1. Go to **Site Configuration** > **Environment variables**.
2. Add the following variables:
   - `VITE_SUPABASE_URL` -> (Your Supabase Project URL)
   - `VITE_SUPABASE_ANON_KEY` -> (Your Supabase Anon/Public Key)
   - `GEMINI_API_KEY` -> (Your Gemini API key used in Netlify functions)

*Note: Frontend keys must start with `VITE_` to be bundled or loaded securely. Because they are public, RLS protects private user records from being read by unauthorized clients.*

---

## 6. Guest Mode vs. Cloud Mode

The application adopts a hybrid data tier structure:

| Dimension / Mode | Guest Mode | Cloud Mode |
| :--- | :--- | :--- |
| **Authentication** | None (Immediate Sandbox access) | Supabase Auth (Email / Password) |
| **Storage Engine** | Browser `localStorage` only | Remote PostgreSQL + local caching |
| **Backup Control** | Manual export/import JSON payloads | Automatic background sync on modification |
| **Device Portability**| Limited to current browser sandbox | Synchronized across any laptop, desktop, or phone |

---

## 7. Row Level Security (RLS) & Deep Policy Analysis

Row Level Security ensures that even if client-side parameters are modified, users can never access or manipulate another player's matches, tactical plans, or formations.

- The schema enforces `ALTER TABLE <name> ENABLE ROW LEVEL SECURITY;` on all tables.
- Standard client selectors are structured using `USING (user_id = (SELECT auth.uid()))` rather than basic unchecked parameters. This delegates authentications directly to the secure database core.
- The `handle_new_user()` trigger operates within trigger execution scopes to automatically populate initial schemas on email validation.

---

## 8. Sync Limitations & Rules

Due to client-side caching, the `supabaseSync.ts` wrapper coordinates local modifications:
1. **Timestamp Comparison**: If conflicts occur, local and remote modification dates are checked. The newer parameters take precedence.
2. **Bulk Synchronization**: Users can trigger manual upload/download overrides from the Account page.
3. **Graceful Failures**: If network access is lost, the client rolls back securely, operates in local mode, queueing modifications until connection is re-established.
