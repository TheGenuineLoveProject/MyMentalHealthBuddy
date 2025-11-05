/**
 * Optimized Image Component
 * Provides lazy loading, responsive images, and WebP support
 */

import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  'data-testid'?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  priority = false,
  sizes,
  objectFit = 'cover',
  onLoad,
  onError,
  placeholder = 'blur',
  'data-testid': testId,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const aspectRatio = width && height ? (height / width) * 100 : undefined;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        paddingBottom: aspectRatio ? `${aspectRatio}%` : undefined,
        width: !aspectRatio && width ? `${width}px` : '100%',
        height: !aspectRatio && height ? `${height}px` : aspectRatio ? 0 : 'auto',
      }}
      data-testid={testId}
    >
      {/* Blur Placeholder */}
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}

      {/* Image */}
      {!hasError && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleError}
          className={`
            ${aspectRatio ? 'absolute inset-0 w-full h-full' : ''}
            ${objectFit ? `object-${objectFit}` : ''}
            ${!isLoaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
          data-testid={`${testId}-img`}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400"
          data-testid={`${testId}-error`}
        >
          <div className="text-center p-4">
            <svg
              className="mx-auto h-12 w-12 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm">Failed to load image</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Responsive Image Component
 * Automatically generates srcset for different screen sizes
 */
interface ResponsiveImageProps {
  src: string;
  alt: string;
  sizes?: string;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  'data-testid'?: string;
}

export function ResponsiveImage({
  src,
  alt,
  sizes = '100vw',
  className,
  objectFit = 'cover',
  'data-testid': testId,
}: ResponsiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate srcset for different resolutions
  const srcSet = [320, 640, 768, 1024, 1280, 1536]
    .map((width) => `${src}?w=${width} ${width}w`)
    .join(', ');

  return (
    <div className={`relative ${className}`} data-testid={testId}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 skeleton animate-pulse bg-gray-200 dark:bg-gray-700" />
      )}
      {!hasError && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          className={`
            w-full h-full object-${objectFit}
            ${!isLoaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `}
          loading="lazy"
          data-testid={`${testId}-img`}
        />
      )}
      {hasError && (
        <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 p-8">
          <p className="text-sm">Failed to load image</p>
        </div>
      )}
    </div>
  );
}

/**
 * Avatar Image Component
 * Optimized for profile pictures with fallback
 */
interface AvatarImageProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallbackInitials?: string;
  className?: string;
  'data-testid'?: string;
}

export function AvatarImage({
  src,
  alt,
  size = 'md',
  fallbackInitials,
  className = '',
  'data-testid': testId,
}: AvatarImageProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  if (!src || hasError) {
    return (
      <div
        className={`
          ${sizeClasses[size]}
          rounded-full bg-gradient-to-br from-blue-400 to-purple-500
          flex items-center justify-center text-white font-semibold
          ${className}
        `}
        data-testid={testId}
      >
        {fallbackInitials || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`} data-testid={testId}>
      <OptimizedImage
        src={src}
        alt={alt}
        className="rounded-full"
        objectFit="cover"
        onError={() => setHasError(true)}
        data-testid={`${testId}-img`}
      />
    </div>
  );
}
