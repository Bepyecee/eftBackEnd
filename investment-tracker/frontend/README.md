# Investment Tracker — Frontend

React SPA for managing ETF portfolios, assets, transactions, tax planning, and application settings.

## Quick Start

```bash
npm install
npm start
# Opens at http://localhost:3000
```

Requires the backend running on `http://localhost:8080`.

## Project Structure

```
src/
├── components/           # UI components
│   ├── Login.js          # JWT + Google OAuth2 login
│   ├── Dashboard.js      # Landing page with portfolio overview
│   ├── EtfList.js        # ETF management with inline transactions
│   ├── EtfForm.js        # ETF create/edit form
│   ├── AssetList.js      # Asset portfolio with versioning
│   ├── AssetForm.js      # Asset create/edit form
│   ├── TaxManager.js     # Deemed disposal tracker + Excel export
│   ├── Settings.js       # Runtime app configuration
│   ├── Navigation.js     # Top nav bar with theme toggle
│   ├── TransactionForm.js
│   ├── TransactionList.js
│   └── PrivateRoute.js   # Auth guard
├── services/             # API layer (all use shared Axios instance)
│   ├── authService.js    # Login, logout, Axios interceptors
│   ├── etfService.js     # ETF CRUD
│   ├── assetService.js   # Asset CRUD
│   ├── transactionService.js
│   ├── etfPriceService.js
│   ├── settingsService.js
│   └── userService.js
├── constants/
│   └── messages.js       # All UI strings (externalized)
├── contexts/
│   └── ThemeContext.js    # Light/dark theme state
└── App.js                # Routing configuration
```

## Architecture

### Key Principles

- **Shared HTTP client** — all services import `axiosInstance` from `authService.js`, which handles JWT injection and 401 redirects automatically
- **Externalized strings** — all user-facing text lives in `constants/messages.js` for easy maintenance and future i18n
- **Configurable API URL** — set `REACT_APP_API_URL` env variable or defaults to `http://localhost:8080/api`
- **Theme support** — light and dark modes via `ThemeContext`

### Authentication Flow

1. User logs in via credentials or Google OAuth2
2. JWT stored in `localStorage`
3. Axios request interceptor attaches `Authorization: Bearer <token>` to every request
4. Axios response interceptor catches 401 → clears token → redirects to `/login`

## Routes

| Path | Component | Auth Required |
|------|-----------|:---:|
| `/login` | Login | No |
| `/` | Dashboard | Yes |
| `/etfs` | EtfList | Yes |
| `/etfs/new` | EtfForm | Yes |
| `/etfs/edit/:id` | EtfForm | Yes |
| `/assets` | AssetList | Yes |
| `/assets/new` | AssetForm | Yes |
| `/assets/edit/:id` | AssetForm | Yes |
| `/tax` | TaxManager | Yes |
| `/settings` | Settings | Yes |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REACT_APP_API_URL` | `http://localhost:8080/api` | Backend API base URL |

## Scripts

```bash
npm start    # Dev server with hot reload
npm test     # Run tests
npm run build  # Production build → build/
```
