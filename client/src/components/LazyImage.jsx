import { useState, useRef, useEffect } from "react";
import { ImageOff } from "lucide-react";

export default function LazyImage({
  src,
  alt,
  className = "",
  placeholder = null,
  fallback = null,
  onLoad,
  onError,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setHasError(true);
    onError?.(e);
  };

  if (hasError) {
    return fallback || (
      <div
        className={`flex items-center justify-center bg-muted ${className}`}
        role="img"
        aria-label={alt}
        {...props}
      >
        <ImageOff className="w-8 h-8 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div ref={imgRef} className={`relative ${className}`} {...props}>
      {!isLoaded && (
        placeholder || (
          <div className="absolute inset-0 bg-muted animate-pulse motion-reduce:animate-none rounded" />
        )
      )}
      
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
        />
      )}
    </div>
  );
}

export function LazyBackgroundImage({
  src,
  className = "",
  children,
  fallbackColor = "bg-muted",
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = src;
  }, [isInView, src]);

  return (
    <div
      ref={containerRef}
      className={`relative ${isLoaded ? "" : fallbackColor} ${className}`}
      style={isLoaded ? { backgroundImage: `url(${src})` } : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
