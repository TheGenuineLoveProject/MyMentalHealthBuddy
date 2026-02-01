import { useState, useEffect } from 'react';
import { 
  CheckCircle, AlertCircle, XCircle, Eye, 
  Keyboard, Volume2, Contrast, Type, RefreshCw
} from 'lucide-react';

export default function AccessibilityAudit() {
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState({ passed: 0, warnings: 0, failed: 0, total: 0 });
  const [running, setRunning] = useState(false);
  const [lastRun, setLastRun] = useState(null);

  const runAudit = () => {
    setRunning(true);
    const auditResults = [];

    const images = document.querySelectorAll('img');
    images.forEach((img, idx) => {
      const hasAlt = img.hasAttribute('alt');
      const altText = img.getAttribute('alt');
      auditResults.push({
        category: 'Images',
        rule: 'WCAG 1.1.1 - Non-text Content',
        status: hasAlt && altText !== '' ? 'pass' : hasAlt && altText === '' ? 'warning' : 'fail',
        message: hasAlt 
          ? (altText === '' ? 'Decorative image (empty alt) - verify intentional' : 'Image has alt text')
          : 'Image missing alt attribute',
        element: `img[${idx}]: ${img.src.slice(0, 50)}...`,
      });
    });

    const buttons = document.querySelectorAll('button, [role="button"]');
    buttons.forEach((btn, idx) => {
      const hasLabel = btn.hasAttribute('aria-label') || 
                       btn.hasAttribute('aria-labelledby') || 
                       (btn.textContent?.trim() || '').length > 0;
      auditResults.push({
        category: 'Interactive Elements',
        rule: 'WCAG 4.1.2 - Name, Role, Value',
        status: hasLabel ? 'pass' : 'fail',
        message: hasLabel ? 'Button has accessible name' : 'Button missing accessible name',
        element: `button[${idx}]: ${(btn.textContent || '').slice(0, 30)}`,
      });
    });

    const links = document.querySelectorAll('a');
    links.forEach((link, idx) => {
      const text = link.textContent?.trim() || '';
      const hasHref = link.hasAttribute('href');
      const genericText = ['click here', 'read more', 'learn more', 'here'].includes(text.toLowerCase());
      
      auditResults.push({
        category: 'Links',
        rule: 'WCAG 2.4.4 - Link Purpose',
        status: hasHref && text && !genericText ? 'pass' : genericText ? 'warning' : 'fail',
        message: !hasHref 
          ? 'Link missing href'
          : genericText 
            ? 'Generic link text - consider more descriptive text'
            : 'Link has descriptive text',
        element: `a[${idx}]: ${text.slice(0, 30)}`,
      });
    });

    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;
    let skipDetected = false;
    headings.forEach((heading) => {
      const level = parseInt(heading.tagName[1]);
      if (level > lastLevel + 1 && lastLevel > 0) {
        skipDetected = true;
      }
      lastLevel = level;
    });
    auditResults.push({
      category: 'Structure',
      rule: 'WCAG 1.3.1 - Info and Relationships',
      status: skipDetected ? 'warning' : 'pass',
      message: skipDetected 
        ? 'Heading levels are skipped (e.g., h1 to h3)'
        : 'Heading hierarchy is logical',
      element: `${headings.length} headings found`,
    });

    const h1Count = document.querySelectorAll('h1').length;
    auditResults.push({
      category: 'Structure',
      rule: 'WCAG 2.4.6 - Headings and Labels',
      status: h1Count === 1 ? 'pass' : h1Count === 0 ? 'fail' : 'warning',
      message: h1Count === 0 
        ? 'No h1 heading found'
        : h1Count === 1 
          ? 'Page has exactly one h1'
          : 'Multiple h1 headings found',
    });

    const forms = document.querySelectorAll('form');
    forms.forEach((form, formIdx) => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach((input, inputIdx) => {
        const hasLabel = input.hasAttribute('aria-label') ||
                        input.hasAttribute('aria-labelledby') ||
                        (input.id && document.querySelector(`label[for="${input.id}"]`));
        auditResults.push({
          category: 'Forms',
          rule: 'WCAG 1.3.1 - Labels',
          status: hasLabel ? 'pass' : 'fail',
          message: hasLabel ? 'Form input has label' : 'Form input missing label',
          element: `form[${formIdx}]/input[${inputIdx}]`,
        });
      });
    });

    const focusable = document.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]'
    );
    const negativeTabindex = Array.from(focusable).filter(
      el => parseInt(el.getAttribute('tabindex') || '0') < 0
    );
    auditResults.push({
      category: 'Keyboard',
      rule: 'WCAG 2.1.1 - Keyboard',
      status: negativeTabindex.length === 0 ? 'pass' : 'warning',
      message: negativeTabindex.length === 0 
        ? 'All focusable elements are keyboard accessible'
        : `${negativeTabindex.length} elements have negative tabindex`,
    });

    const skipLink = document.querySelector('a[href="#main"], a[href="#content"], [class*="skip"]');
    auditResults.push({
      category: 'Navigation',
      rule: 'WCAG 2.4.1 - Bypass Blocks',
      status: skipLink ? 'pass' : 'warning',
      message: skipLink 
        ? 'Skip link found'
        : 'Consider adding a skip-to-content link',
    });

    const mainLandmark = document.querySelector('main, [role="main"]');
    const navLandmark = document.querySelector('nav, [role="navigation"]');
    const hasLandmarks = mainLandmark && navLandmark;
    auditResults.push({
      category: 'Navigation',
      rule: 'WCAG 1.3.6 - Identify Purpose',
      status: hasLandmarks ? 'pass' : 'warning',
      message: hasLandmarks
        ? 'Page has main and navigation landmarks'
        : `Missing landmarks: ${!mainLandmark ? 'main ' : ''}${!navLandmark ? 'navigation' : ''}`.trim(),
    });

    const focusableElements = document.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    let hasFocusVisible = true;
    focusableElements.forEach(el => {
      const styles = window.getComputedStyle(el);
      if (styles.outline === 'none' && !el.classList.toString().includes('focus')) {
        hasFocusVisible = false;
      }
    });
    auditResults.push({
      category: 'Keyboard',
      rule: 'WCAG 2.4.7 - Focus Visible',
      status: hasFocusVisible ? 'pass' : 'warning',
      message: hasFocusVisible
        ? 'Focus indicators appear present'
        : 'Some elements may lack visible focus indicators',
      element: `${focusableElements.length} focusable elements checked`,
    });

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = document.querySelectorAll('[class*="animate"], [class*="transition"]');
    auditResults.push({
      category: 'Motion',
      rule: 'WCAG 2.3.3 - Animation from Interactions',
      status: 'pass',
      message: reducedMotion.matches 
        ? 'Reduced motion preference detected - verify animations respect it'
        : `${animations.length} animated elements found - verify reduced motion support`,
    });

    const interactiveAria = document.querySelectorAll('button[aria-pressed], [role="switch"], [aria-expanded]');
    interactiveAria.forEach((el, idx) => {
      const hasValidState = el.getAttribute('aria-pressed') !== null || 
                           el.getAttribute('aria-expanded') !== null;
      auditResults.push({
        category: 'Interactive Elements',
        rule: 'WCAG 4.1.2 - State Changes',
        status: hasValidState ? 'pass' : 'warning',
        message: hasValidState ? 'Interactive element has ARIA state' : 'Check state communication',
        element: `ARIA element[${idx}]`,
      });
    });

    const dialogElements = document.querySelectorAll('[role="dialog"], [role="alertdialog"], dialog');
    dialogElements.forEach((dialog, idx) => {
      const hasLabel = dialog.hasAttribute('aria-label') || dialog.hasAttribute('aria-labelledby');
      auditResults.push({
        category: 'Interactive Elements',
        rule: 'WCAG 4.1.2 - Modal Accessibility',
        status: hasLabel ? 'pass' : 'fail',
        message: hasLabel ? 'Dialog has accessible name' : 'Dialog missing aria-label or aria-labelledby',
        element: `dialog[${idx}]`,
      });
    });

    const passed = auditResults.filter(r => r.status === 'pass').length;
    const warnings = auditResults.filter(r => r.status === 'warning').length;
    const failed = auditResults.filter(r => r.status === 'fail').length;

    setResults(auditResults);
    setSummary({ passed, warnings, failed, total: auditResults.length });
    setLastRun(new Date());
    setRunning(false);
  };

  useEffect(() => {
    const timer = setTimeout(runAudit, 1000);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-600" />;
      case 'fail':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Images':
        return <Eye className="w-4 h-4" />;
      case 'Keyboard':
      case 'Interactive Elements':
        return <Keyboard className="w-4 h-4" />;
      case 'Forms':
        return <Type className="w-4 h-4" />;
      case 'Structure':
      case 'Navigation':
        return <Contrast className="w-4 h-4" />;
      case 'Links':
        return <Volume2 className="w-4 h-4" />;
      case 'Motion':
        return <RefreshCw className="w-4 h-4" />;
      default:
        return <Eye className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border" data-testid="accessibility-audit">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">WCAG AA Accessibility Audit</h2>
          <p className="text-sm text-gray-500">
            {lastRun ? `Last run: ${lastRun.toLocaleTimeString()}` : 'Running initial audit...'}
          </p>
        </div>
        <button
          onClick={runAudit}
          disabled={running}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--teal-600)] text-white rounded-lg hover:bg-[var(--teal-700)] disabled:opacity-50"
          data-testid="button-run-audit"
        >
          <RefreshCw className={`w-4 h-4 ${running ? 'animate-spin motion-reduce:animate-none' : ''}`} />
          {running ? 'Running...' : 'Re-run Audit'}
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg text-center" data-testid="stat-total">
          <p className="text-3xl font-bold text-gray-900">{summary.total}</p>
          <p className="text-sm text-gray-500">Total Checks</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg text-center" data-testid="stat-passed">
          <p className="text-3xl font-bold text-green-600">{summary.passed}</p>
          <p className="text-sm text-green-700">Passed</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg text-center" data-testid="stat-warnings">
          <p className="text-3xl font-bold text-amber-600">{summary.warnings}</p>
          <p className="text-sm text-amber-700">Warnings</p>
        </div>
        <div className="p-4 bg-red-50 rounded-lg text-center" data-testid="stat-failed">
          <p className="text-3xl font-bold text-red-600">{summary.failed}</p>
          <p className="text-sm text-red-700">Failed</p>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {results.map((result, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              result.status === 'pass' 
                ? 'bg-green-50 border-green-200'
                : result.status === 'warning'
                  ? 'bg-amber-50 border-amber-200'
                  : 'bg-red-50 border-red-200'
            }`}
            data-testid={`audit-result-${idx}`}
          >
            <div className="flex items-start gap-3">
              {getStatusIcon(result.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  {getCategoryIcon(result.category)}
                  <span className="text-xs font-medium text-gray-500">{result.category}</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500">{result.rule}</span>
                </div>
                <p className="text-sm font-medium text-gray-900">{result.message}</p>
                {result.element && (
                  <p className="text-xs font-mono text-gray-500 mt-1 truncate">
                    {result.element}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
