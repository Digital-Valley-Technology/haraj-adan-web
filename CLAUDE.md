# web/ — Vue 3 SPA (Customer site + Admin dashboard)

Vue 3 + Vite app that serves **both** the public customer marketplace **and** the admin
dashboard (`src/dashboard/`). PrimeVue (Aura theme) for UI, Pinia for state, Vue Router (hash
history), Tailwind v4, vue-i18n (ar/en). See root `../CLAUDE.md` for platform context.

## Run / build

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # → dist/  (deploy by copying into ../web-prod/public)
npm run preview
```

Needs `.env` with `VITE_MAPBOX_TOKEN` (gitignored; `.env.example` present).

## Layout (`src/`)

- `main.js` — bootstraps Vue + PrimeVue + Pinia + Router + i18n + `SocketPlugin` + VueViewer.
- `App.vue`, `Layout/` — shells. Public `pages/` (Home, AdDetails, Post/EditAd, Login, VerifyOtp,
  Profile, Favoured, Search, Support, OAuthSuccess/Error, legal pages, etc.).
- `dashboard/` — admin area: `analytics`, `ads`, `categories` (+`attributes`), `banners`,
  `users`, `reports`, `support`, `CustomersChats`, `transactions`, `walletDepositRequests`,
  plus `ProfilePage.vue`, `SettingsPage.vue`.
- `store/` — one Pinia store per domain (`auth`, `ads`, `home`, `chat`, `customerChat`,
  `userChats`, `wallet`, `walletDepositsRequests`, `reports`, `users`, `category`, `banners`,
  `location`, `filters`, `notifications`, `adminStatistics`, `adminMonitorStore`, `general`,
  `product`).
- `services/` — `axios.js` (configured instance + 401 refresh-token retry queue), `api.js`
  (thin get/post/put/patch/delete wrapper), `api/` (authService, requestService),
  `SocketPlugin.js` (Socket.IO client as a Vue plugin).
- `router/index.js` — routes with `meta.requiresAuth` + `meta.permissions`; nav guard reads
  `useAuthStore`. `composables/`, `locale/` (vue-i18n + `i18.js`), `utils/constants.js`, `data/`.

## Conventions
- **Env/target via hardcoded constant.** `src/utils/constants.js` → `MODE = "PROD"` selects
  `PROD_*` vs `DEV_*` base/media/socket URLs. Change to `"DEV"` for a local API. (Same anti-pattern
  as the Flutter app — consider moving to `import.meta.env`.)
- **Auth:** access token in `localStorage` under key `token`; sent as `Bearer` by the axios
  request interceptor, which also sets `Accept-Language` from `localStorage.haraj_lang`.
  Refresh uses the httpOnly cookie via `withCredentials: true` calling `/auth/refresh`.
- **Permissions** are checked client-side in the router and sidebar (`sidebarItems` in
  `constants.js`) using permission codes like `dashboard.read`, `dashboard.categories.write`,
  `dashboard.reports.read`, etc. — these must match the API's `permissions.code` seed values.
  (Client checks are UX only; the API must enforce — see root CLAUDE.md §1–2, §5.)
- i18n keys are referenced as strings (`"sidebar.analytics"`, `"header.login"`); translations live in `src/locale/`.

## Gotchas / notes
- **Tokens/secrets via env:** both `VITE_MAPBOX_TOKEN` and `VITE_IPINFO_TOKEN` are read from
  `import.meta.env` (the ipinfo token used to be hardcoded — rotate the old value).
- Client token in `localStorage` is XSS-exposed (still a known gap).
- **Socket auth:** `SocketPlugin.js` sends the access token via `auth` (re-evaluated each
  connect) plus the `refresh_token` cookie (`withCredentials`). After login call
  `reauthenticateSocket()` so the server re-authenticates the socket — already wired into
  `VerifyOtp.vue` and `OAuthSuccess.vue`. Add it to any new login path.
- Uses **hash history** (`createWebHashHistory`), so URLs are `/#/...`; `web-prod` also has a
  history fallback for non-hash routing.
- Deploy is a manual `npm run build` → copy `dist/` into `../web-prod/public` (no CI wired).
</content>
