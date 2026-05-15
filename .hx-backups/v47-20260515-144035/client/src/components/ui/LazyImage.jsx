/**
 * LazyImage.jsx - Optimized lazy loading image component
 * Uses native lazy loading with fallback, blur-up effect, and error handling
 */

import { useState, useRef, useEffect } from 'react';

export function LazyImage({ 
  src, 
  alt = '', 
  className = '', 
  wrapperClassName = '',
  width, 
  height, 
  placeholder = 'blur',
  fallbackSrc,
  onLoad,
  onError,
  ...props 
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;
    
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { rootMargin: '100px' }
      );
      
      observer.observe(imgRef.current);
      return () => observer.disconnect();
    } else {
      setIsInView(true);
    }
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      e.target.src = fallbackSrc;
    }
    onError?.(e);
  };

  if (!src) {
    return (
      <div 
        className={`bg-sage/10 flex items-center justify-center ${wrapperClassName}`}
        style={{ width, height, minHeight: height || '100px' }}
        role="img"
        aria-label={alt || 'Image placeholder'}
      >
        <span className="text-sage/40 text-sm">No image</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`relative overflow-hidden ${wrapperClassName}`}
      style={{ width, height, minHeight: height || 'auto' }}
    >
      {placeholder === 'blur' && !isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-br from-sage/20 to-sage/10 animate-pulse motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
      
      {hasError && !fallbackSrc && (
        <div 
          className="absolute inset-0 bg-sage/10 flex items-center justify-center"
          role="img"
          aria-label={alt || 'Image failed to load'}
        >
          <span className="text-sage/50 text-xs">Failed to load</span>
        </div>
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`transition-opacity duration-300 w-full h-full object-cover ${
            isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          {...props}
        />
      )}
    </div>
  );
}

export function OptimizedImage({ src, alt = '', className = '', sizes, ...props }) {
  if (!src) return null;
  
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      sizes={sizes}
      {...props}
    />
  );
}

export default LazyImage;
