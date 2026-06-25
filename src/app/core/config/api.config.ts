import { environment } from '../../../environments/environment';

const productionBackendUrl = `${window.location.protocol}//${window.location.hostname}:9090`;
const knownBackendUrls = ['http://localhost:9090', 'http://localhost:8080', productionBackendUrl, environment.apiBaseUrl].filter(Boolean);

export const API_BASE_URL = environment.apiBaseUrl;
export const API_URL = `${environment.apiBaseUrl}/api`;

export function assetUrl(url?: string): string | undefined {
  if (!url) return undefined;
  const normalizedUrl = persistedAssetUrl(url);
  if (normalizedUrl.startsWith('http')) return normalizedUrl;
  return `${API_BASE_URL}${normalizedUrl}`;
}

export function persistedAssetUrl(url?: string): string {
  if (!url) return '';
  for (const backendUrl of knownBackendUrls) {
    if (url.startsWith(backendUrl)) return url.slice(backendUrl.length);
  }
  return url;
}
