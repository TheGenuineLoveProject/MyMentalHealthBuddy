import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Optimized Image Component
 * Provides lazy loading, responsive images, and WebP support
 */
import { useState, useRef } from 'react';
export function OptimizedImage({ src, alt, width, height, className = '', loading = 'lazy', priority = false, sizes, objectFit = 'cover', onLoad, onError, placeholder = 'blur', 'data-testid': testId, }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);
    const handleLoad = () => {
        setIsLoaded(true);
        onLoad?.();
    };
    const handleError = () => {
        setHasError(true);
        onError?.();
    };
    const aspectRatio = width && height ? (height / width) * 100 : undefined;
    return (_jsxs("div", { className: `relative overflow-hidden ${className}`, style: {
            paddingBottom: aspectRatio ? `${aspectRatio}%` : undefined,
            width: !aspectRatio && width ? `${width}px` : '100%',
            height: !aspectRatio && height ? `${height}px` : aspectRatio ? 0 : 'auto',
        }, "data-testid": testId, children: [placeholder === 'blur' && !isLoaded && !hasError && (_jsx("div", { className: "absolute inset-0 skeleton animate-pulse bg-gray-200 dark:bg-gray-700" })), !hasError && (_jsx("img", { ref: imgRef, src: src, alt: alt, width: width, height: height, loading: priority ? 'eager' : loading, sizes: sizes, onLoad: handleLoad, onError: handleError, className: `
            ${aspectRatio ? 'absolute inset-0 w-full h-full' : ''}
            ${objectFit ? `object-${objectFit}` : ''}
            ${!isLoaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `, "data-testid": `${testId}-img` })), hasError && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400", "data-testid": `${testId}-error`, children: _jsxs("div", { className: "text-center p-4", children: [_jsx("svg", { className: "mx-auto h-12 w-12 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" }) }), _jsx("p", { className: "text-sm", children: "Failed to load image" })] }) }))] }));
}
export function ResponsiveImage({ src, alt, sizes = '100vw', className, objectFit = 'cover', 'data-testid': testId, }) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    // Generate srcset for different resolutions
    const srcSet = [320, 640, 768, 1024, 1280, 1536]
        .map((width) => `${src}?w=${width} ${width}w`)
        .join(', ');
    return (_jsxs("div", { className: `relative ${className}`, "data-testid": testId, children: [!isLoaded && !hasError && (_jsx("div", { className: "absolute inset-0 skeleton animate-pulse bg-gray-200 dark:bg-gray-700" })), !hasError && (_jsx("img", { src: src, srcSet: srcSet, sizes: sizes, alt: alt, onLoad: () => setIsLoaded(true), onError: () => setHasError(true), className: `
            w-full h-full object-${objectFit}
            ${!isLoaded ? 'opacity-0' : 'opacity-100'}
            transition-opacity duration-300
          `, loading: "lazy", "data-testid": `${testId}-img` })), hasError && (_jsx("div", { className: "flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 p-8", children: _jsx("p", { className: "text-sm", children: "Failed to load image" }) }))] }));
}
export function AvatarImage({ src, alt, size = 'md', fallbackInitials, className = '', 'data-testid': testId, }) {
    const [hasError, setHasError] = useState(false);
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-sm',
        lg: 'w-16 h-16 text-base',
        xl: 'w-24 h-24 text-xl',
    };
    if (!src || hasError) {
        return (_jsx("div", { className: `
          ${sizeClasses[size]}
          rounded-full bg-gradient-to-br from-blue-400 to-purple-500
          flex items-center justify-center text-white font-semibold
          ${className}
        `, "data-testid": testId, children: fallbackInitials || alt.charAt(0).toUpperCase() }));
    }
    return (_jsx("div", { className: `${sizeClasses[size]} ${className}`, "data-testid": testId, children: _jsx(OptimizedImage, { src: src, alt: alt, className: "rounded-full", objectFit: "cover", onError: () => setHasError(true), "data-testid": `${testId}-img` }) }));
}
