// Frontend Bundle Optimizer Configuration
export const optimizerConfig = {
  // Code splitting configuration
  codeSplitting: {
    enabled: true,
    chunks: {
      vendor: ['react', 'react-dom', '@tanstack/react-query'],
      ui: ['@radix-ui', 'lucide-react', 'class-variance-authority'],
      utils: ['zod', 'react-hook-form', 'wouter']
    }
  },
  
  // Bundle size optimization
  bundleOptimization: {
    treeshaking: true,
    minification: true,
    compression: 'gzip',
    sourcemaps: process.env.NODE_ENV === 'development',
    
    // Target modern browsers for smaller bundles
    targets: [
      'last 2 Chrome versions',
      'last 2 Firefox versions',
      'last 2 Safari versions',
      'last 2 Edge versions'
    ]
  },
  
  // Resource hints for preloading
  resourceHints: {
    preconnect: [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com'
    ],
    dnsPrefetch: [
      'https://api.stripe.com',
      'https://api.openai.com'
    ]
  },
  
  // Performance budgets
  performanceBudgets: {
    javascript: 300, // KB
    css: 100, // KB
    images: 500, // KB
    fonts: 200, // KB
    total: 1000 // KB
  },
  
  // Caching strategy
  caching: {
    strategy: 'cache-first',
    maxAge: {
      html: 0,
      js: 31536000, // 1 year
      css: 31536000, // 1 year
      images: 86400, // 1 day
      fonts: 31536000 // 1 year
    }
  },
  
  // Prefetch configuration
  prefetch: {
    enabled: true,
    routes: ['/chat', '/mood', '/journal', '/resources'],
    delay: 2000 // ms after page load
  },
  
  // Service Worker configuration
  serviceWorker: {
    enabled: process.env.NODE_ENV === 'production',
    strategy: 'network-first',
    offlinePage: '/offline.html',
    cacheAssets: true
  }
};

// Optimization utilities
export class FrontendOptimizer {
  private static instance: FrontendOptimizer;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new FrontendOptimizer();
    }
    return this.instance;
  }
  
  // Prefetch routes for faster navigation
  prefetchRoutes(routes: string[]) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        routes.forEach(route => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          document.head.appendChild(link);
        });
      });
    }
  }
  
  // Optimize images with lazy loading
  optimizeImages() {
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[data-lazy]');
      images.forEach(img => {
        img.setAttribute('loading', 'lazy');
      });
    } else {
      // Fallback to IntersectionObserver
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              img.src = img.dataset.src || '';
              imageObserver.unobserve(img);
            }
          });
        },
        { rootMargin: '50px' }
      );
      
      document.querySelectorAll('img[data-lazy]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  // Monitor and report performance
  monitorPerformance() {
    if (!window.performance) return;
    
    // First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    paintEntries.forEach(entry => {
      console.log(`⚡ ${entry.name}: ${entry.startTime.toFixed(2)}ms`);
    });
    
    // Largest Contentful Paint
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log(`⚡ Largest Contentful Paint: ${lastEntry.startTime.toFixed(2)}ms`);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    new PerformanceObserver(list => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const delay = entry.processingStart - entry.startTime;
        console.log(`⚡ First Input Delay: ${delay.toFixed(2)}ms`);
      });
    }).observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift
    let clsScore = 0;
    new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const layoutEntry = entry as any;
        if (!layoutEntry.hadRecentInput) {
          clsScore += layoutEntry.value;
        }
      }
      console.log(`⚡ Cumulative Layout Shift: ${clsScore.toFixed(3)}`);
    }).observe({ entryTypes: ['layout-shift'] });
  }
  
  // Bundle analyzer
  analyzeBundle() {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    
    const bundleInfo = {
      scripts: Array.from(scripts).map(s => ({
        src: s.getAttribute('src'),
        size: 0 // Would need to fetch to get actual size
      })),
      styles: Array.from(styles).map(s => ({
        href: s.getAttribute('href'),
        size: 0
      }))
    };
    
    console.group('📦 Bundle Analysis');
    console.log('Scripts:', bundleInfo.scripts.length);
    console.log('Stylesheets:', bundleInfo.styles.length);
    console.groupEnd();
    
    return bundleInfo;
  }
  
  // Initialize all optimizations
  initialize() {
    // Prefetch critical routes
    if (optimizerConfig.prefetch.enabled) {
      setTimeout(() => {
        this.prefetchRoutes(optimizerConfig.prefetch.routes);
      }, optimizerConfig.prefetch.delay);
    }
    
    // Optimize images
    this.optimizeImages();
    
    // Monitor performance
    this.monitorPerformance();
    
    // Log optimization status
    console.log('🚀 Frontend Optimizer initialized');
  }
}

// Auto-initialize in production
if (process.env.NODE_ENV === 'production') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      FrontendOptimizer.getInstance().initialize();
    });
  } else {
    FrontendOptimizer.getInstance().initialize();
  }
}