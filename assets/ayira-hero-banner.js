/**
 * ayira-hero-banner.js
 *
 * Custom element: <ayira-hero-banner-carousel>
 * - Infinite looping carousel with single-direction leftward auto-scroll
 * - 100% full-width slides with adaptive layout
 * - Dot pagination (circular dots, underneath the banner)
 * - Supports swiping/dragging for both touch and mouse devices
 * - Uses ResizeObserver for robust layout positioning on initial load and resize
 * - Respects prefers-reduced-motion
 */

if (!customElements.get('ayira-hero-banner-carousel')) {
  class AyiraHeroBannerCarousel extends HTMLElement {
    constructor() {
      super();

      this.currentIndex = 0;
      this.currentElementIndex = 0;
      this.slideCount = 0;
      this.autoplayTimer = null;
      this.isHovered = false;
      this.isFocused = false;
      this.isTransitioning = false;
      this._resizeObserver = null;

      /* Touch/Mouse tracking */
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._isDragging = false;
      this._SWIPE_THRESHOLD = 50;
    }

    connectedCallback() {
      this.slideCount = parseInt(this.dataset.slideCount, 10) || 0;
      if (this.slideCount < 1) return;

      this._cacheDom();
      
      // Clone slides for infinite loop if we have at least 2 slides
      if (this.slideCount > 1) {
        this._setupClones();
        this._setupTransitionEndListener();
      }
      
      this._setupSlideOffsets();
      this._bindEvents();
      this._setupResizeObserver();
      this._startAutoplay();
    }

    disconnectedCallback() {
      this._stopAutoplay();
      if (this._resizeObserver) {
        this._resizeObserver.disconnect();
      }
    }

    /* ── DOM caching ───────────────────────────────────── */
    _cacheDom() {
      this.trackWrapper = this.querySelector('.ayira-hero-banner__track-wrapper');
      this.track = this.querySelector('.ayira-hero-banner__track');
      this.slides = Array.from(this.track?.children || []);
      this.dots = Array.from(this.querySelectorAll('.ayira-hero-banner__dot'));
      this.prevButton = this.querySelector('[data-nav-prev]');
      this.nextButton = this.querySelector('[data-nav-next]');
    }

    /* ── Clone first and last slides for infinite looping ── */
    _setupClones() {
      const originalSlides = Array.from(this.track.children);
      if (originalSlides.length <= 1) return;

      // Clone the last slide and prepend it
      const lastSlide = originalSlides[originalSlides.length - 1];
      const cloneLast = lastSlide.cloneNode(true);
      cloneLast.classList.add('is-clone');
      cloneLast.setAttribute('aria-hidden', 'true');
      cloneLast.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
      this.track.insertBefore(cloneLast, this.track.firstChild);

      // Clone the first slide and append it
      const firstSlide = originalSlides[0];
      const cloneFirst = firstSlide.cloneNode(true);
      cloneFirst.classList.add('is-clone');
      cloneFirst.setAttribute('aria-hidden', 'true');
      cloneFirst.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
      this.track.appendChild(cloneFirst);

      // Re-cache slides array to include clones
      this.slides = Array.from(this.track.children);
    }

    /* ── Set initial positions and states ──────────────── */
    _setupSlideOffsets() {
      const startElementIndex = this.slideCount > 1 ? 1 : 0;
      this.currentIndex = 0;
      this.currentElementIndex = startElementIndex;
      this._updateTrackPosition(startElementIndex, false);
      this._updateSlideVisibility();
      this._updateDots(0);
    }

    /* ── Transitionend listener for looping snap ──────── */
    _setupTransitionEndListener() {
      this.track.addEventListener('transitionend', (e) => {
        if (e.target !== this.track) return;
        
        this.isTransitioning = false;
        
        if (this.slideCount > 1) {
          if (this.currentElementIndex === 0) {
            // Snapping to the real last slide
            this._updateTrackPosition(this.slideCount, false);
          } else if (this.currentElementIndex === this.slideCount + 1) {
            // Snapping to the real first slide
            this._updateTrackPosition(1, false);
          }
        }
      });
    }

    /* ── ResizeObserver for robust layout updates ──────── */
    _setupResizeObserver() {
      if (typeof ResizeObserver === 'undefined') return;
      
      this._resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          // Recalculate track offset without animation to adjust to parent sizes
          this._updateTrackPosition(this.currentElementIndex, false);
        }
      });
      this._resizeObserver.observe(this);
    }

    /* ── Event binding ────────────────────────────────── */
    _bindEvents() {
      /* Dot clicks */
      this.dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          this.goTo(parseInt(dot.dataset.targetSlide, 10));
        });

        /* Arrow key nav on dot list */
        dot.addEventListener('keydown', (e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (this.isTransitioning) return;
            const delta = e.key === 'ArrowRight' ? 1 : -1;
            const next = (this.currentIndex + delta + this.slideCount) % this.slideCount;
            this.goTo(next);
            this.dots[next]?.focus();
          }
        });
      });

      /* Prev/Next button clicks */
      if (this.prevButton) {
        this.prevButton.addEventListener('click', () => {
          this.prev();
        });
      }
      if (this.nextButton) {
        this.nextButton.addEventListener('click', () => {
          this.next();
        });
      }

      /* Pause on hover */
      this.addEventListener('mouseenter', () => {
        this.isHovered = true;
        this._stopAutoplay();
      });

      this.addEventListener('mouseleave', () => {
        this.isHovered = false;
        if (!this.isFocused) this._startAutoplay();
      });

      /* Pause on focus (keyboard users) */
      this.addEventListener('focusin', () => {
        this.isFocused = true;
        this._stopAutoplay();
      });

      this.addEventListener('focusout', (e) => {
        if (!this.contains(e.relatedTarget)) {
          this.isFocused = false;
          if (!this.isHovered) this._startAutoplay();
        }
      });

      /* Touch & Mouse swipable dragging */
      this.addEventListener('pointerdown', this._onPointerDown.bind(this));
      this.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
      this.addEventListener('pointerup', this._onPointerUp.bind(this));
      this.addEventListener('pointercancel', this._onPointerUp.bind(this));
    }

    /* ── Swipe / Drag handlers ────────────────────────── */
    _onPointerDown(e) {
      if (this.isTransitioning) return;
      // Drag on touch, or left click for mouse
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      this._isDragging = true;
      this._touchStartX = e.clientX;
      this._touchStartY = e.clientY;
      this._stopAutoplay();

      try {
        this.setPointerCapture(e.pointerId);
      } catch (err) {
        // Fallback
      }
    }

    _onPointerMove(e) {
      if (!this._isDragging) return;
    }

    _onPointerUp(e) {
      if (!this._isDragging) return;
      this._isDragging = false;

      try {
        this.releasePointerCapture(e.pointerId);
      } catch (err) {
        // Fallback
      }

      const deltaX = e.clientX - this._touchStartX;
      const deltaY = e.clientY - this._touchStartY;

      /* Resume autoplay if not hovered or focused */
      if (!this.isHovered && !this.isFocused) {
        this._startAutoplay();
      }

      /* Ignore vertical scroll drags */
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }

      if (Math.abs(deltaX) >= this._SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }
    }

    /* ── Navigation ───────────────────────────────────── */
    next() {
      if (this.slideCount <= 1) return;
      if (this.isTransitioning) return;

      this.isTransitioning = true;
      const nextElementIndex = this.currentIndex + 2;
      this.currentIndex = (this.currentIndex + 1) % this.slideCount;

      this._updateSlideVisibility();
      this._updateTrackPosition(nextElementIndex, true);
      this._updateDots(this.currentIndex);
    }

    prev() {
      if (this.slideCount <= 1) return;
      if (this.isTransitioning) return;

      this.isTransitioning = true;
      const prevElementIndex = this.currentIndex;
      this.currentIndex = (this.currentIndex - 1 + this.slideCount) % this.slideCount;

      this._updateSlideVisibility();
      this._updateTrackPosition(prevElementIndex, true);
      this._updateDots(this.currentIndex);
    }

    goTo(index) {
      if (this.slideCount <= 1) return;
      if (this.isTransitioning || index === this.currentIndex) return;

      this.isTransitioning = true;
      this.currentIndex = index;

      this._updateSlideVisibility();
      this._updateTrackPosition(index + 1, true);
      this._updateDots(index);
    }

    /* ── Track position calculations ──────────────────── */
    _updateTrackPosition(elementIndex, animate) {
      if (!this.track) return;

      this.currentElementIndex = elementIndex;

      const containerWidth = this.trackWrapper?.offsetWidth || this.offsetWidth || 0;
      const slideWidth = this.slides[0]?.offsetWidth || 0;
      
      // Read gap between slides from computed styles
      const gap = parseFloat(window.getComputedStyle(this.track).gap) || 0;

      // TranslateX = (containerWidth - slideWidth) / 2 - elementIndex * (slideWidth + gap)
      const offsetToCenter = (containerWidth - slideWidth) / 2;
      const translateX = offsetToCenter - elementIndex * (slideWidth + gap);

      const isInstant = !animate || this._prefersReducedMotion();

      if (isInstant) {
        this.track.style.transition = 'none';
        this.track.style.setProperty('--slide-offset', `${translateX}px`);
        this.track.offsetHeight; // Force reflow
        this.track.style.transition = '';
        
        this.isTransitioning = false;
        
        // Handle snap immediately for instant transitions
        if (this.slideCount > 1) {
          if (elementIndex === 0) {
            this._updateTrackPosition(this.slideCount, false);
          } else if (elementIndex === this.slideCount + 1) {
            this._updateTrackPosition(1, false);
          }
        }
      } else {
        this.track.style.setProperty('--slide-offset', `${translateX}px`);
      }
    }

    /* ── Slide ARIA visibility ────────────────────────── */
    _updateSlideVisibility() {
      this.slides.forEach((slide, i) => {
        let isActive = false;
        if (i === this.currentIndex + 1) {
          isActive = true;
        } else if (i === 0 && this.currentIndex === this.slideCount - 1) {
          isActive = true;
        } else if (i === this.slideCount + 1 && this.currentIndex === 0) {
          isActive = true;
        }

        slide.classList.toggle('is-active', isActive);

        if (slide.classList.contains('is-clone')) {
          slide.setAttribute('aria-hidden', 'true');
          slide.querySelectorAll('a, button').forEach(el => el.setAttribute('tabindex', '-1'));
        } else {
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          slide.querySelectorAll('a, button').forEach(el => {
            el.setAttribute('tabindex', isActive ? '0' : '-1');
          });
        }
      });
    }

    /* ── Dot state ────────────────────────────────────── */
    _updateDots(index) {
      this.dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        dot.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    }

    /* ── Autoplay ─────────────────────────────────────── */
    _startAutoplay() {
      const enabled = this.dataset.autoplay === 'true';
      if (!enabled || this.slideCount <= 1) return;

      if (this._prefersReducedMotion()) return;

      const speed = parseInt(this.dataset.autoplaySpeed, 10) || 5000;
      this._stopAutoplay();
      this.autoplayTimer = setInterval(() => {
        if (!this.isHovered && !this.isFocused) {
          this.next();
        }
      }, speed);
    }

    _stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer);
        this.autoplayTimer = null;
      }
    }

    /* ── Utility ──────────────────────────────────────── */
    _prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  customElements.define('ayira-hero-banner-carousel', AyiraHeroBannerCarousel);
}
