const codeToIcon: Record<string, string> = {
  '01d': 'Sun.svg',
  '01n': 'Moon.svg',
  '02d': 'Cloud-Sun.svg',
  '02n': 'Cloud-Moon.svg',
  '03d': 'Cloud.svg',
  '03n': 'Cloud.svg',
  '04d': 'Cloud.svg',
  '04n': 'Cloud.svg',
  '09d': 'Cloud-Drizzle.svg',
  '09n': 'Cloud-Drizzle.svg',
  '10d': 'Cloud-Drizzle.svg',
  '10n': 'Cloud-Drizzle.svg',
  '11d': 'Cloud-Hail.svg',
  '11n': 'Cloud-Hail.svg',
  '13d': 'Cloud-Snow-Alt.svg',
  '13n': 'Cloud-Snow-Alt.svg',
  '50d': 'Cloud-Fog.svg',
  '50n': 'Cloud-Fog.svg',
};

export const iconForCode = (code: string): string => `/icons/${codeToIcon[code] ?? 'Cloud.svg'}`;
