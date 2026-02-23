export const environment = {
  production: false,
  apiBaseUrl: 'https://api.openweathermap.org/data/2.5',
  apiKey: 'c9fc2c3f94d6305e0c678afbca942413', // Should normally be injected during build time
  defaultCity: 'Province of Groningen, NL',
  defaultUnits: 'metric' as const,
  maxHourlyPeriods: 8,
  maxDailyPeriods: 5,
  defaultIconCode: '04d',
  geolocationTimeoutMs: 8000,
  minRefreshIntervalMs: 2000,
  autoUpdateIntervalMs: 60000, // Should be greater than minRefreshIntervalMs
};
