/**
 * Security & IP Protection Utilities
 * Anti-copy, watermarking, and content protection
 * 
 * Goal: Deterrence + watermarking + legal clarity (not absolute prevention)
 */

/**
 * Disable text selection on an element (CSS-based)
 * @param element - DOM element to protect
 */
export function disableTextSelection(element: HTMLElement): void {
  element.style.userSelect = 'none';
  element.style.webkitUserSelect = 'none';
}

/**
 * Enable text selection on an element
 * @param element - DOM element to unprotect
 */
export function enableTextSelection(element: HTMLElement): void {
  element.style.userSelect = 'auto';
  element.style.webkitUserSelect = 'auto';
}

/**
 * Disable right-click context menu on premium content
 * @param element - DOM element to protect
 * @returns Cleanup function
 */
export function disableContextMenu(element: HTMLElement): () => void {
  const handler = (e: MouseEvent) => {
    e.preventDefault();
    return false;
  };
  element.addEventListener('contextmenu', handler);
  return () => element.removeEventListener('contextmenu', handler);
}

/**
 * Add canvas watermark to an image or element
 * @param canvas - Canvas element
 * @param watermarkText - Text to watermark
 * @param options - Watermark styling options
 */
export function addCanvasWatermark(
  canvas: HTMLCanvasElement,
  watermarkText: string = 'mymentalhealthbuddy.com',
  options: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    opacity?: number;
    angle?: number;
  } = {}
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const {
    fontSize = 14,
    fontFamily = 'Arial, sans-serif',
    color = '#000000',
    opacity = 0.15,
    angle = -30
  } = options;

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = color;
  ctx.rotate((angle * Math.PI) / 180);

  const textWidth = ctx.measureText(watermarkText).width;
  const spacing = textWidth + 100;

  for (let y = -canvas.height; y < canvas.height * 2; y += 60) {
    for (let x = -canvas.width; x < canvas.width * 2; x += spacing) {
      ctx.fillText(watermarkText, x, y);
    }
  }

  ctx.restore();
}

/**
 * Generate a signed URL-like token (client-side, for display purposes)
 * Note: Real signed URLs should be generated server-side
 */
export function generateClientToken(userId: string, timestamp: number = Date.now()): string {
  const data = `${userId}-${timestamp}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

/**
 * Simple bot detection (basic UA check)
 * Note: This is basic deterrence, not foolproof
 */
export function isLikelyBot(): boolean {
  if (typeof navigator === 'undefined') return false;
  
  const botPatterns = [
    /bot/i,
    /crawl/i,
    /spider/i,
    /scrape/i,
    /headless/i,
    /phantom/i,
    /selenium/i
  ];
  
  const ua = navigator.userAgent;
  return botPatterns.some(pattern => pattern.test(ua));
}

/**
 * Log premium content access (for audit trails)
 */
export function logContentAccess(
  contentId: string,
  contentType: string,
  action: 'view' | 'download' | 'share'
): void {
  const logEntry = {
    contentId,
    contentType,
    action,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  };
  
  console.debug('[Content Access]', logEntry);
}

/**
 * CSS class names for protected content
 */
export const protectedContentClasses = {
  noSelect: 'select-none',
  noPrint: 'print:hidden',
  watermarked: 'relative after:absolute after:inset-0 after:pointer-events-none'
};

export default {
  disableTextSelection,
  enableTextSelection,
  disableContextMenu,
  addCanvasWatermark,
  generateClientToken,
  isLikelyBot,
  logContentAccess,
  protectedContentClasses
};
