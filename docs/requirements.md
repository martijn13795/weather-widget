# Weather widget requirements and user stories for code assessment.

## Context

- Angular 21 browser widget displaying current and forecast weather.
- Data from OpenWeatherMap; API key configurable.
- Use bundled icons from `public/icons/`.
- Target: code assessment.

## High-level functional requirements

- Current conditions: location name, temperature, feels-like, condition text, icon, humidity, wind.
- Forecasts: short-term (3-hourly next 6–8 periods) and multi-day (3–5 days min/max temps, icon/text).
- Location: detect via geolocation (permissioned) with manual city search fallback.
- Units: °C/°F toggle; preference persists (localStorage).
- Refresh: manual refresh control; optional auto-refresh interval respecting API limits.
- Error/empty states: geolocation denied, invalid city, network/API/rate-limit errors show friendly message and retry; keep prior data if available.
- Accessibility: keyboard focusable controls, visible focus states, semantic headings/lists, alt/aria-label for icons, aria-live for updates.

## Non-functional requirements

- Performance: fast initial render; consider lazy-loading forecast section; show timestamp of freshness.
- Responsiveness: adaptive layout.
- Configurability: API key, base URL, default city, refresh interval via environment config.
- Testing: unit tests.
