## User stories (with acceptance criteria)

- As a visitor, I want to see the current weather for my location.
  - AC: If geolocation allowed use that city; if denied/unavailable, searching for a city should be possible.
- As a visitor, I want a short forecast so I can plan the next hours.
  - AC: Show 3-hourly cards with time, temp, icon for at least 6 upcoming periods.
- As a visitor, I want a multi-day forecast so I can plan the next days.
  - AC: Show 5 daily entries with day label, min/max temps, condition icon/text.
- As a visitor, I want to toggle between °C and °F so I see familiar units.
  - AC: Toggle updates all temperatures immediately and persists choice on reload.
- As a visitor, I want clear errors and retries when something fails so I am not stuck.
  - AC: Network/API failures surface a concise message.
- As a visitor, I want to refresh data on demand so I can trust it is current.
  - AC: Refresh control triggers refetch and avoids rapid repeat calls.
- As a keyboard-only user, I want to operate the widget without a mouse.
  - AC: All interactive elements are focusable, have visible focus states, and work via Enter/Space.
- As a low-vision user, I want readable text and distinguishable icons.
  - AC: Good contrast; icons have alt/aria-label; text resizes without breaking layout.
