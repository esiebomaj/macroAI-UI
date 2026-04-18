# Macro Tracker — React Frontend

React + Vite frontend with Supabase Auth (email/password + Google OAuth).

## Stack
- React 18 + Vite
- Supabase JS — auth + session management
- React Router v6
- Axios — API calls with auto Bearer token injection
- Tailwind CSS v3

## Project Structure
```
src/
├── context/AuthContext.jsx     # Global Supabase session state
├── hooks/useTracker.js         # All API calls (goals, log, library, history)
├── lib/
│   ├── supabase.js             # Supabase client singleton
│   └── api.js                  # Axios instance with auto token injection
├── pages/
│   ├── AuthPage.jsx            # Login / Register / Google OAuth
│   └── DashboardPage.jsx       # Main app shell + tab routing
└── components/
    ├── LogTab.jsx              # Today's food log
    ├── LibraryTab.jsx          # Food library with inline editing
    ├── HistoryTab.jsx          # Daily history summaries
    ├── GoalsTab.jsx            # Edit calorie/macro goals
    └── ChatPanel.jsx           # AI assistant sidebar
```

## 1. Setup

```bash
cp .env.example .env
# Fill in your Supabase URL, anon key, and API URL
npm install
npm run dev
```

## 2. Enable Google OAuth in Supabase

1. Supabase Dashboard → Authentication → Providers → Enable Google
2. Google Cloud Console → APIs & Services → Credentials → Create OAuth 2.0 Client ID
3. Add redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
4. Also add `http://localhost:5173` for local dev
5. Paste Client ID + Secret into Supabase

## 3. Environment Variables

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_API_URL=http://127.0.0.1:8000
```

## 4. Deploy

```bash
npm run build   # outputs to dist/
```

Deploy `dist/` to Vercel, Netlify, or Railway. Set `VITE_API_URL` to your deployed FastAPI URL.

## How Auth Works

- Email/password → Supabase Auth handles everything
- Google OAuth → `supabase.auth.signInWithOAuth({ provider: 'google' })` — Supabase handles the callback
- Sessions stored in localStorage automatically by Supabase
- Every API request automatically gets `Authorization: Bearer <token>` via Axios interceptor
- FastAPI validates tokens by calling `supabase.auth.get_user(token)` — no shared secret needed
