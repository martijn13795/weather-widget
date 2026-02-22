import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom, from, map } from 'rxjs';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

@Injectable({ providedIn: 'root' })
export class GeolocationService {
  canUse(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.geolocation;
  }

  async getCurrentPosition(): Promise<Coordinates> {
    if (!this.canUse()) {
      throw new Error('Geolocation unavailable');
    }

    return firstValueFrom(
      from(
        new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: environment.geolocationTimeoutMs,
          });
        }),
      ).pipe(map((pos) => ({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }))),
    );
  }
}
