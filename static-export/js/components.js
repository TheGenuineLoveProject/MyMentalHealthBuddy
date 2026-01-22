/**
 * The Genuine Love Project - Component JavaScript
 * Reusable interactive behaviors for UI components
 */

(function() {
  'use strict';

  // ============================================
  // Quote Rotator
  // ============================================
  function initQuoteRotators() {
    const rotators = document.querySelectorAll('.quote-rotator');
    
    rotators.forEach(rotator => {
      const slides = rotator.querySelectorAll('.quote-rotator__slide');
      const dots = rotator.querySelectorAll('.quote-rotator__dot');
      const progressBar = rotator.querySelector('.quote-rotator__progress-bar');
      const interval = parseInt(rotator.dataset.interval) || 8000;
      let current = 0;
      let timer;
      
      function showSlide(index) {
        slides.forEach((slide, i) => {
          slide.classList.toggle('quote-rotator__slide--active', i === index);
        });
        dots.forEach((dot, i) => {
          dot.classList.toggle('quote-rotator__dot--active', i === index);
          dot.setAttribute('aria-selected', i === index);
        });
        if (progressBar) {
          progressBar.style.animation = 'none';
          progressBar.offsetHeight;
          progressBar.style.animation = `quote-progress ${interval}ms linear`;
        }
        current = index;
      }
      
      function nextSlide() {
        showSlide((current + 1) % slides.length);
      }
      
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          showSlide(i);
          clearInterval(timer);
          timer = setInterval(nextSlide, interval);
        });
      });
      
      if (slides.length > 1) {
        timer = setInterval(nextSlide, interval);
      }
    });
  }

  // ============================================
  // FAQ Accordion
  // ============================================
  function initFAQAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const summary = item.querySelector('summary');
      if (summary) {
        summary.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.open = !item.open;
          }
        });
      }
    });
  }

  // ============================================
  // Testimonial Slider
  // ============================================
  function initTestimonialSliders() {
    const sliders = document.querySelectorAll('.testimonial-slider');
    
    sliders.forEach(slider => {
      const track = slider.querySelector('.testimonial-slider__track');
      const prevBtn = slider.querySelector('.testimonial-slider__btn--prev');
      const nextBtn = slider.querySelector('.testimonial-slider__btn--next');
      const dots = slider.querySelectorAll('.testimonial-slider__dot');
      
      if (!track) return;
      
      const slides = track.children;
      let current = 0;
      
      function updateSlider() {
        track.style.transform = `translateX(-${current * 100}%)`;
        dots.forEach((dot, i) => {
          dot.classList.toggle('testimonial-slider__dot--active', i === current);
          dot.setAttribute('aria-selected', i === current);
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          current = (current - 1 + slides.length) % slides.length;
          updateSlider();
        });
      }
      
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          current = (current + 1) % slides.length;
          updateSlider();
        });
      }
      
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          current = i;
          updateSlider();
        });
      });
    });
  }

  // ============================================
  // Calendar Component
  // ============================================
  function initCalendars() {
    const calendars = document.querySelectorAll('.calendar');
    
    calendars.forEach(calendar => {
      const days = calendar.querySelectorAll('.calendar__day:not([disabled])');
      const slots = document.querySelectorAll('.calendar__slot');
      
      days.forEach(day => {
        day.addEventListener('click', () => {
          days.forEach(d => d.classList.remove('calendar__day--selected'));
          day.classList.add('calendar__day--selected');
        });
      });
      
      slots.forEach(slot => {
        slot.addEventListener('click', () => {
          slots.forEach(s => s.classList.remove('calendar__slot--selected'));
          slot.classList.add('calendar__slot--selected');
        });
      });
    });
  }

  // ============================================
  // Donation Form
  // ============================================
  function initDonationForms() {
    const forms = document.querySelectorAll('.donation-form');
    
    forms.forEach(form => {
      const amountInputs = form.querySelectorAll('input[name="amount"]');
      const customField = form.querySelector('.donation-form__custom');
      const submitBtn = form.querySelector('.donation-form__submit');
      const toggleBtns = form.querySelectorAll('.donation-form__toggle-btn');
      
      amountInputs.forEach(input => {
        input.addEventListener('change', () => {
          if (input.value === 'custom') {
            if (customField) customField.hidden = false;
          } else {
            if (customField) customField.hidden = true;
            if (submitBtn) {
              submitBtn.textContent = `Donate $${input.value}`;
            }
          }
        });
      });
      
      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          toggleBtns.forEach(b => b.classList.remove('donation-form__toggle-btn--active'));
          btn.classList.add('donation-form__toggle-btn--active');
        });
      });
    });
  }

  // ============================================
  // Chat Assistant
  // ============================================
  function initChatAssistant() {
    const chats = document.querySelectorAll('.chat');
    
    chats.forEach(chat => {
      const form = chat.querySelector('.chat__form');
      const input = chat.querySelector('.chat__input');
      const messages = chat.querySelector('.chat__messages');
      const quickBtns = chat.querySelectorAll('.chat__quick-btn');
      
      function addMessage(text, isUser = true) {
        const messageHTML = isUser ? `
          <div class="chat__message chat__message--user">
            <div class="chat__message-content">
              <p>${text}</p>
              <time class="chat__message-time">Just now</time>
            </div>
          </div>
        ` : `
          <div class="chat__message chat__message--assistant">
            <div class="chat__message-avatar">
              <img src="/assets/icons/lotus.svg" alt="" width="20" height="20" />
            </div>
            <div class="chat__message-content">
              <p>${text}</p>
              <time class="chat__message-time">Just now</time>
            </div>
          </div>
        `;
        
        if (messages) {
          messages.insertAdjacentHTML('beforeend', messageHTML);
          messages.scrollTop = messages.scrollHeight;
        }
      }
      
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          if (input && input.value.trim()) {
            addMessage(input.value.trim(), true);
            input.value = '';
          }
        });
      }
      
      quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const response = btn.dataset.response;
          if (response) {
            addMessage(response, true);
          }
        });
      });
      
      if (input) {
        input.addEventListener('input', () => {
          input.style.height = 'auto';
          input.style.height = Math.min(input.scrollHeight, 120) + 'px';
        });
      }
    });
  }

  // ============================================
  // Newsletter Forms
  // ============================================
  function initNewsletterForms() {
    const forms = document.querySelectorAll('.newsletter form, .newsletter__form');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]');
        if (email && email.value) {
          const btn = form.querySelector('button[type="submit"]');
          if (btn) {
            btn.textContent = 'Subscribed!';
            btn.disabled = true;
            setTimeout(() => {
              btn.textContent = 'Subscribe';
              btn.disabled = false;
              email.value = '';
            }, 3000);
          }
        }
      });
    });
  }

  // ============================================
  // Initialize All Components
  // ============================================
  function init() {
    initQuoteRotators();
    initFAQAccordions();
    initTestimonialSliders();
    initCalendars();
    initDonationForms();
    initChatAssistant();
    initNewsletterForms();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
