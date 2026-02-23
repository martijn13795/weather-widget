export interface ForecastResponse {
  city: {
    name: string;
    country: string;
    coord: { lat: number; lon: number };
  };
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      temp_min: number;
      temp_max: number;
    };
    weather: { description: string; icon: string }[];
    wind: { speed: number };
  }>;
}

export interface CurrentResponse {
  name: string;
  sys: { country: string };
  dt: number;
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  coord: { lat: number; lon: number };
}
