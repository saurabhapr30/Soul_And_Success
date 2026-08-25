import React, { useState } from 'react';
import { resolveImageUrl, resolveOptimizedImageUrl, resolveSrcSet } from '@/utils';

export interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet'> {
  src?: string | null;
  srcSet?: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  aspectRatio?: string;
  priority?: boolean;
  fallback?: string;
  objectFit?: React.CSSProperties['objectFit'];
  objectPosition?: React.CSSProperties['objectPosition'];
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  srcSet,
  sizes,
  alt,
  width,
  height,
  aspectRatio,
  priority = false,
  fallback,
  className,
  style,
  objectFit,
  objectPosition,
  loading: customLoading,
  decoding: customDecoding = 'async',
  onError,
  ...restProps
}) => {
  const [hasError, setHasError] = useState(false);
  const [useOriginal, setUseOriginal] = useState(false);

  const rawUrl = src || fallback;
  
  let initialUrl = '';
  if (hasError) {
    initialUrl = fallback || '';
  } else if (useOriginal) {
    initialUrl = resolveImageUrl(rawUrl, fallback);
  } else {
    initialUrl = resolveOptimizedImageUrl(rawUrl, fallback) || resolveImageUrl(rawUrl, fallback);
  }

  // Auto derive responsive srcset if not explicitly provided and it's an uploaded asset in optimized mode
  const derivedSrcSet =
    !hasError && !useOriginal
      ? srcSet || (initialUrl.startsWith('/uploads/') ? resolveSrcSet(rawUrl) : undefined)
      : undefined;

  const combinedStyle: React.CSSProperties = {
    ...style,
    ...(aspectRatio && { aspectRatio }),
    ...(objectFit && { objectFit }),
    ...(objectPosition && { objectPosition }),
  };

  const loadingMode: 'eager' | 'lazy' =
    customLoading || (priority ? 'eager' : 'lazy');

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!useOriginal && initialUrl.includes('/uploads/optimized/')) {
      // First fallback: attempt direct original unoptimized file
      setUseOriginal(true);
    } else if (!hasError && fallback) {
      // Second fallback: use default fallback image
      setHasError(true);
    }
    if (onError) onError(e);
  };

  return (
    <img
      src={initialUrl}
      srcSet={derivedSrcSet}
      sizes={sizes || (derivedSrcSet ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' : undefined)}
      alt={alt}
      width={width}
      height={height}
      loading={loadingMode}
      decoding={customDecoding}
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={combinedStyle}
      onError={handleError}
      {...restProps}
    />
  );
};

export default OptimizedImage;
