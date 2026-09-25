const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const getUploadUrl = (path: string): URL | null => {
  try {
    const url = new URL(path, window.location.origin);
    if (!url.pathname.startsWith('/uploads/')) return null;
    if (/^https?:\/\//.test(API_URL)) {
      return new URL(url.pathname + url.search, API_URL);
    }
    return url;
  } catch {
    return null;
  }
};

export const resolveImageUrl = (url?: string | null, fallback?: string): string => {
  if (!url) return fallback || '';
  
  const trimmed = url.trim();
  if (!trimmed) return fallback || '';

  // Strip hardcoded localhost / 127.0.0.1 backend origins (e.g., http://localhost:5000/uploads/...)
  const cleaned = trimmed.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?/, '/');

  // If it's an external absolute URL or a data URI, return as-is
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('data:')) {
    return cleaned;
  }

  // If it's a relative path starting with uploads/, ensure it has a leading slash
  if (cleaned.startsWith('uploads/')) {
    const uploadUrl = getUploadUrl(`/${cleaned}`);
    return uploadUrl?.href || `/${cleaned}`;
  }

  if (cleaned.startsWith('/uploads/')) {
    const uploadUrl = getUploadUrl(cleaned);
    return uploadUrl?.href || cleaned;
  }

  return cleaned;
};

/**
 * Returns the optimized WebP URL for an uploaded asset if applicable.
 */
export const resolveOptimizedImageUrl = (url?: string | null, fallback?: string): string => {
  const resolved = resolveImageUrl(url, fallback);
  if (!resolved) return resolved;

  const uploadUrl = getUploadUrl(resolved);
  if (!uploadUrl) return resolved;

  // If already pointing to optimized, return as is
  if (uploadUrl.pathname.includes('/uploads/optimized/')) return uploadUrl.href;

  const parts = uploadUrl.pathname.split('/');
  const filename = parts.pop() || '';
  const dotIdx = filename.lastIndexOf('.');
  const baseName = dotIdx !== -1 ? filename.substring(0, dotIdx) : filename;

  uploadUrl.pathname = `/uploads/optimized/${baseName}.webp`;
  return uploadUrl.href;
};

/**
 * Derives a standard responsive srcset string for uploaded assets.
 */
export const resolveSrcSet = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const resolved = resolveImageUrl(url);
  if (!resolved) return undefined;

  const uploadUrl = getUploadUrl(resolved);
  if (!uploadUrl) return undefined;

  const parts = uploadUrl.pathname.split('/');
  const filename = parts.pop() || '';
  const dotIdx = filename.lastIndexOf('.');
  let baseName = dotIdx !== -1 ? filename.substring(0, dotIdx) : filename;

  // If filename already has a width suffix like image-800, strip only that width suffix
  baseName = baseName.replace(/-(?:400|800|1200|1600|1920)$/, '');

  const widths = [400, 800, 1200, 1600];
  const srcSetEntries = widths.map((w) => {
    const variantUrl = new URL(uploadUrl.href);
    variantUrl.pathname = `/uploads/optimized/${baseName}-${w}.webp`;
    return `${variantUrl.href} ${w}w`;
  });
  const masterUrl = new URL(uploadUrl.href);
  masterUrl.pathname = `/uploads/optimized/${baseName}.webp`;
  srcSetEntries.push(`${masterUrl.href} 1920w`);

  return srcSetEntries.join(', ');
};
