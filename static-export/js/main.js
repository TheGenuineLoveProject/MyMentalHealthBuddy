/**
 * THE GENUINE LOVE PROJECT - Main JavaScript
 * Accessibility-focused, lightweight interactions
 */

(function() {
  'use strict';

  // Mobile Menu Toggle
  function initMobileMenu() {
    const menuBtn = document.querySelector('.header__menu-btn');
    const nav = document.querySelector('.header__nav');
    
    if (!menuBtn) return;
    
    menuBtn.addEventListener('click', function() {
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', !isExpanded);
      nav?.classList.toggle('is-open');
      
      // Toggle body scroll
      document.body.style.overflow = isExpanded ? '' : 'hidden';
    });
  }

  // Onboarding Option Selection
  function initOnboardingOptions() {
    const options = document.querySelectorAll('.onboarding__option');
    
    options.forEach(option => {
      option.addEventListener('click', function() {
        // Remove selected state from all
        options.forEach(opt => opt.classList.remove('onboarding__option--selected'));
        // Add selected state to clicked
        this.classList.add('onboarding__option--selected');
        // Check the radio input
        const radio = this.querySelector('input[type="radio"]');
        if (radio) radio.checked = true;
      });
    });
  }

  // Filter Tabs
  function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => {
          t.classList.remove('filter-tab--active');
          t.setAttribute('aria-selected', 'false');
        });
        this.classList.add('filter-tab--active');
        this.setAttribute('aria-selected', 'true');
      });
    });
  }

  // Smooth Scroll for Anchor Links
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          target.focus();
        }
      });
    });
  }

  // Focus Trap for Modals/Mobile Nav
  function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
      if (e.key === 'Escape') {
        // Close modal/menu
        element.classList.remove('is-open');
        document.body.style.overflow = '';
      }
    });
  }

  // Reduced Motion Check
  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Initialize All
  function init() {
    initMobileMenu();
    initOnboardingOptions();
    initFilterTabs();
    
    if (!prefersReducedMotion()) {
      initSmoothScroll();
    }
    
    // Log for development
    console.log('The Genuine Love Project - Initialized');
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
