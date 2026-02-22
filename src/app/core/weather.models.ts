export type Units = 'metric' | 'imperial';

export interface CurrentConditions {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  description: string;
  iconCode: string;
  humidity: number;
  windSpeed: number;
  timestamp: Date;
}

export interface ForecastPeriod {
  time: Date;
  temperature: number;
  description: string;
  iconCode: string;
}

export interface DailyForecast {
  date: Date;
  minTemp: number;
  maxTemp: number;
  description: string;
  iconCode: string;
}

export interface WeatherState {
  current?: CurrentConditions;
  hourly: ForecastPeriod[];
  daily: DailyForecast[];
  units: Units;
  locationLabel: string;
  loading: boolean;
  error?: string;
  lastRefreshed?: Date;
}
