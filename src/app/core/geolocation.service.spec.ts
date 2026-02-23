import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GeolocationService } from './geolocation.service';

const mockCoords: GeolocationCoordinates = {
  latitude: 52.1,
  longitude: 4.3,
  altitude: null,
  accuracy: 10,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  toJSON: () => ({}),
};

const mockPosition: GeolocationPosition = {
  coords: mockCoords,
  timestamp: Date.now(),
  toJSON: () => ({}) as unknown as GeolocationPosition,
};

const originalNavigator = globalThis.navigator;

describe('GeolocationService', () => {
  beforeEach(() => {
    (globalThis as { navigator: Navigator }).navigator = {
      geolocation: {
        getCurrentPosition: vi.fn(
          (success: PositionCallback, _error: PositionErrorCallback, opts?: PositionOptions) => {
            success(mockPosition);
            expect(opts?.timeout).toBeGreaterThan(0);
            return undefined;
          },
        ),
        watchPosition: vi.fn(() => 1),
        clearWatch: vi.fn(),
      },
      // minimal Navigator fields to satisfy type, unused in tests
    } as unknown as Navigator;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    (globalThis as { navigator: Navigator }).navigator = originalNavigator;
  });

  it('reports availability when geolocation exists', () => {
    const service = new GeolocationService();
    expect(service.canUse()).toBe(true);
  });

  it('returns coordinates from the browser API', async () => {
    const service = new GeolocationService();
    const coords = await service.getCurrentPosition();
    expect(coords).toEqual({ latitude: 52.1, longitude: 4.3 });
  });

  it('throws when geolocation is unavailable', async () => {
    (globalThis as { navigator: Navigator }).navigator = {} as Navigator;
    const service = new GeolocationService();
    await expect(service.getCurrentPosition()).rejects.toThrow('Geolocation unavailable');
  });
});
