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
    return `/${cleaned}`;
  }

  return cleaned;
};

/**
 * Returns the optimized WebP URL for an uploaded asset if applicable.
 */
export const resolveOptimizedImageUrl = (url?: string | null, fallback?: string): string => {
  const resolved = resolveImageUrl(url, fallback);
  if (!resolved || !resolved.startsWith('/uploads/')) return resolved;

  // If already pointing to optimized, return as is
  if (resolved.includes('/uploads/optimized/')) return resolved;

  const parts = resolved.split('/');
  const filename = parts.pop() || '';
  const dotIdx = filename.lastIndexOf('.');
  const baseName = dotIdx !== -1 ? filename.substring(0, dotIdx) : filename;

  return `/uploads/optimized/${baseName}.webp`;
};

/**
 * Derives a standard responsive srcset string for uploaded assets.
 */
export const resolveSrcSet = (url?: string | null): string | undefined => {
  if (!url) return undefined;
  const resolved = resolveImageUrl(url);
  if (!resolved || !resolved.startsWith('/uploads/')) return undefined;

  const parts = resolved.split('/');
  const filename = parts.pop() || '';
  const dotIdx = filename.lastIndexOf('.');
  let baseName = dotIdx !== -1 ? filename.substring(0, dotIdx) : filename;

  // If filename already has a width suffix like image-800, strip only that width suffix
  baseName = baseName.replace(/-(?:400|800|1200|1600|1920)$/, '');

  const widths = [400, 800, 1200, 1600];
  const srcSetEntries = widths.map(
    (w) => `/uploads/optimized/${baseName}-${w}.webp ${w}w`
  );
  srcSetEntries.push(`/uploads/optimized/${baseName}.webp 1920w`);

  return srcSetEntries.join(', ');
};
