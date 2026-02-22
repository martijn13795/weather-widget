# Solution design — MP weather widget

**Authors:** Martijn Posthuma (Tech Lead)  
**Date:** 22 Feb 2026

## Table of contents

1. Sign-off
2. Related documentation
3. Affected components & modules
4. Affected external interfaces
5. Introduction
6. Planning concerns
7. Approach
8. Implementation plan
9. Testability
10. Backwards & forwards compatibility
11. Deployment plan
12. Security
13. Monitoring & observability

## 1) Sign-off

| Name             | Role                | Date        |
| ---------------- | ------------------- | ----------- |
| Martijn Posthuma | Tech Lead / Author  | 22 Feb 2026 |
| <stakeholder>    | Product / Architect | t.b.d.      |

## 2) Related documentation

- `docs/requirements.md`
- `docs/user-stories.md`
- OpenWeather API docs (2.5 weather + forecast)
- Angular 21 best practices

## 3) Affected components & modules

| Component     | Module                                                     | Affected | Not affected |
| ------------- | ---------------------------------------------------------- | -------- | ------------ |
| UI            | `features/*` (widget, search, current, forecast, settings) | X        |              |
| State         | `core/weather.store`                                       | X        |              |
| Data          | `core/weather-api.service`                                 | X        |              |
| Utility       | `core/icon-map`, `core/geolocation.service`                | X        |              |
| Env/Config    | `environments/environment.ts`                              | X        |              |
| Routing       | `app.routes.ts`                                            | X        |              |
| Global styles | `styles.scss`, `styles/theme.scss`                         | X        |              |
| Icons         | `public/icons/*`                                           | X        |              |

## 4) Affected external interfaces

| Interface                        | Affected | Notes                                  |
| -------------------------------- | -------- | -------------------------------------- |
| OpenWeather `/data/2.5/weather`  | X        | Current conditions by city/coords      |
| OpenWeather `/data/2.5/forecast` | X        | 5-day / 3-hour forecast by city/coords |
| Browser Geolocation API          | X        | Optional location lookup               |

## 5) Introduction

We will build a browser-based weather widget in Angular 21, OpenWeather 2.5 APIs, and a signals-based store. The goal: present current conditions plus 3-hourly and daily outlook with unit toggle, city search, and geolocation. This document defines the planned design, scope, and next steps before implementation begins.

## 6) Planning concerns

- API key must be supplied.
- OpenWeather free-tier rate limits (60 calls/min) — avoid aggressive refresh loops.
- Handle geolocation consent denials gracefully.
- Icons must exist under `public/icons` with filenames mapped in `core/icon-map.ts`.
- CI should run lint, test, and build once set up.

## 7) Approach

- **Framework:** Angular 21, standalone components, signals for state, router shell.
- **Architecture:** Feature-first (screaming architecture) naming and folders so the domain (weather, forecast, search) is obvious.
- **Data flow:** `weather.store` will fetch current + forecast (forkJoin) by city or coords, normalize to a view model, and expose a signal `vm` to the UI.
- **Formatting:** Use Prettier (with repo config) and provide an npm script to format the codebase.
- **Theming:** Introduce shared SCSS theme (`styles/theme.scss`) with palette and mixins; feature SCSS will import the theme.
- **Resilience:** Implement basic error capture; consider retry/backoff later.
- **Accessibility:** Use semantic sections, aria labels, alt-texts and good contrast.

## 8) Implementation plan

### Planned scope

- **Core:** Create `weather-api.service` to wrap OpenWeather current/forecast; build `weather.store` to manage state, units, geolocation, refresh.
- **Features (screaming architecture):** Build widget shell, search (city + geolocate), settings (unit toggle), current card, forecast (3-hourly/daily) in feature-named folders.
- **Icons:** Map OpenWeather icon codes to provided SVGs in `public/icons` via `core/icon-map.ts`.
- **Styles:** Add global `styles.scss` + `styles/theme.scss` mixins; per-feature SCSS for layout.
- **Tooling:** Include Prettier and a `format` script alongside ESLint.
- **Tests:** Add unit specs for store and widget; configure Angular ESLint.

### Near-term enhancements (post-MVP)

- **Resilience & UX:** Debounce searches; optional retry/backoff on transient failures; persist last payload + units in `localStorage`; add skeleton loaders; optional `lang` param for localized descriptions.
- **Testing:** Add specs for `forecast.component` rendering/alt text; error-path tests in `weather.store.spec.ts`; geolocation-denied scenario.
- **DX / CI:** Add `npm run ci` (lint + test + build); document env vars (API key, optional lang) in README; optional Prettier hook.

## 9) Testability

- Use Angular TestBed + Vitest spies (`vi`) for unit tests.
- Keep API access behind `weather-api.service` for straightforward mocking.
- Expand coverage per enhancements above after MVP.

## 10) Backwards & forwards compatibility

- Target OpenWeather 2.5; switching to One Call would require payload remap (out of scope for MVP and not free).

## 11) Deployment plan

- Build with `npm run build -- --configuration=production` once implemented.
- Configure `environment.apiKey`, `defaultUnits` and other values in the environment.ts file.
- Host static output from `dist/MP-weather-widget`.

## 12) Security

- Do not commit real API keys; inject via environment at build time.
- Do not expose secrets in client logs or error messages.

## 13) Monitoring & observability

- Client-only; limited to browser devtools. Optionally add lightweight console logging in dev mode or an in-app status banner for failures/rate limits after MVP.
