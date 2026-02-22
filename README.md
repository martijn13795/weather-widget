# MP weather widget

Angular weather widget that fetches current conditions plus 3-hourly and daily forecasts from OpenWeather, with unit toggle, geolocation, and accessibility-friendly UI.

## Prerequisites
- Node.js 18+
- OpenWeather API key in `src/environments/environment.ts` (`apiKey`)

## Install
```bash
npm install
```

## Run (dev)
```bash
npm start
```
Opens at `http://localhost:4200/` with hot reload.

## Lint and Format
- ESLint:
```bash
npm run lint
```
- Prettier (config in `.prettierrc`): use your editor or run:
```bash
npm run format
```

## Tests
Unit tests (Vitest via Angular CLI):
```bash
npm run test
```
Coverage output is written to `coverage/`.

## Build
```bash
npm run build
```
Outputs to `dist/`.

## Configuration
Key settings live in `src/environments/environment.ts`. You can override these with environment variables at build time.

## Architecture
- Angular with screaming architecture (feature-first structure in `src/app/features`)
- `WeatherStore` manages state via signals and encapsulates fetching/mapping
- `WeatherApiService` wraps OpenWeather endpoints
- Styles: feature-scoped SCSS plus shared theme in `src/styles/theme.scss`

## Icons
SVG icons are served from `public/icons` and mapped in `src/app/core/icon-map.ts`.
