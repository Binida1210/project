import { AddressLocation, AddressModel } from '@/models/warehouse.model';

const geoCache = new Map<string, AddressLocation>();

export function resolveAddress(address: string | undefined): string | undefined {
  if (!address) return;

  try {
    return (JSON.parse(address) as AddressModel).address;
  } catch {
    return address;
  }
}

export function resolveLocation(address: string | undefined): AddressLocation | undefined {
  if (!address) return;

  try {
    return (JSON.parse(address) as AddressModel).position;
  } catch {
    const coord = extractLatLngFromText(address);
    if (coord) return coord;
    return;
  }
}

export function extractLatLngFromText(text: string): AddressLocation | undefined {
  const regex = /(-?\d{1,2}\.\d+)\s*,?\s+(-?\d{1,3}\.\d+)/g; // captures lat, lng
  let match: RegExpExecArray | null = null;
  let last: RegExpExecArray | null = null;
  while ((match = regex.exec(text)) !== null) {
    last = match; // keep the last occurrence
  }
  if (!last) return undefined;
  const lat = parseFloat(last[1]);
  const lng = parseFloat(last[2]);
  if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  return undefined;
}

export function buildGeocodeQuery(address: string | undefined): string | undefined {
  const text = resolveAddress(address);
  if (!text) return undefined;
  return text.trim();
}

export async function geocodeAddress(addressText: string): Promise<AddressLocation | undefined> {
  const query = addressText.trim();
  if (!query) return undefined;
  if (geoCache.has(query)) return geoCache.get(query);

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=vi`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const json = (await res.json()) as { features?: Array<{ geometry?: { coordinates?: number[] } }> };
      const coord = json?.features?.[0]?.geometry?.coordinates; // [lng, lat]
      if (coord && coord.length >= 2) {
        const loc: AddressLocation = { lat: coord[1], lng: coord[0] };
        geoCache.set(query, loc);
        return loc;
      }
    }
  } catch {
    void 0;
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (res.ok) {
      const arr = (await res.json()) as Array<{ lat?: string; lon?: string }>;
      if (arr && arr.length) {
        const first = arr[0];
        const lat = Number(first.lat);
        const lng = Number(first.lon);
        if (Number.isFinite(lat) && Number.isFinite(lng)) {
          const loc: AddressLocation = { lat, lng };
          geoCache.set(query, loc);
          return loc;
        }
      }
    }
  } catch {
    void 0;
  }

  return undefined;
}

export function buildOsmSearchUrl(query: string): string {
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

export function removeDiacritics(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip combining accents
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function capitalizeWordsNoDiacritics(input: string): string {
  const base = removeDiacritics(input).toLowerCase();
  return base
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function stripDigits(input: string): string {
  return input
    .replace(/[0-9]+/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function extractProvinceFromAddress(address: string | undefined): string | undefined {
  const full = resolveAddress(address);
  if (!full) return undefined;

  const parts = full
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (!parts.length) return undefined;

  const normalized = parts.map((p) => removeDiacritics(p).toLowerCase());
  const idxVN = normalized.findIndex((p) => p === 'viet nam' || p === 'vietnam');

  let candidate: string;
  if (idxVN > 0) {
    candidate = parts[idxVN - 1];
  } else {
    candidate = parts[parts.length - 1];
  }

  const noDigits = stripDigits(candidate);
  return capitalizeWordsNoDiacritics(noDigits);
}
