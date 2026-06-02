/**
 * ayira-hero-banner.js
 *
 * Custom element: <ayira-hero-banner-carousel>
 * - Auto-advancing carousel with configurable speed
 * - Pause on hover / focus, resume on mouseout / blur
 * - Dot pagination (ARIA tablist)
 * - Touch / pointer swipe support
 * - Keyboard navigation (arrow keys on dots)
 * - Respects prefers-reduced-motion
 */

if (!customElements.get('ayira-hero-banner-carousel')) {
  class AyiraHeroBannerCarousel extends HTMLElement {
    constructor() {
      super();

      this.currentIndex = 0;
      this.slideCount = 0;
      this.autoplayTimer = null;
      this.isHovered = false;
      this.isFocused = false;

      /* Touch tracking */
      this._touchStartX = 0;
      this._touchStartY = 0;
      this._isDragging = false;
      this._SWIPE_THRESHOLD = 50;
    }

    connectedCallback() {
      this.slideCount = parseInt(this.dataset.slideCount, 10) || 0;
      if (this.slideCount < 1) return;

      this._cacheDom();
      this._setupSlideOffsets();
      this._bindEvents();
      this._startAutoplay();
    }

    disconnectedCallback() {
      this._stopAutoplay();
    }

    /* ── DOM caching ───────────────────────────────────── */
    _cacheDom() {
      this.track = this.querySelector('.ayira-hero-banner__track');
      this.slides = Array.from(this.querySelectorAll('.ayira-hero-banner__slide'));
      this.dots = Array.from(this.querySelectorAll('.ayira-hero-banner__dot'));
    }

    /* ── Set initial CSS custom property ─────────────── */
    _setupSlideOffsets() {
      this._updateTrackPosition(0, false);
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
            const delta = e.key === 'ArrowRight' ? 1 : -1;
            const next = (this.currentIndex + delta + this.slideCount) % this.slideCount;
            this.goTo(next);
            this.dots[next]?.focus();
          }
        });
      });

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

      /* Touch / pointer swipe */
      this.addEventListener('pointerdown', this._onPointerDown.bind(this), { passive: true });
      this.addEventListener('pointermove', this._onPointerMove.bind(this), { passive: true });
      this.addEventListener('pointerup', this._onPointerUp.bind(this));
      this.addEventListener('pointercancel', this._onPointerUp.bind(this));
    }

    /* ── Swipe handlers ───────────────────────────────── */
    _onPointerDown(e) {
      if (e.pointerType === 'mouse') return; // mouse handled by hover
      this._isDragging = true;
      this._touchStartX = e.clientX;
      this._touchStartY = e.clientY;
      this._stopAutoplay();
    }

    _onPointerMove(e) {
      if (!this._isDragging) return;
    }

    _onPointerUp(e) {
      if (!this._isDragging) return;
      this._isDragging = false;

      const deltaX = e.clientX - this._touchStartX;
      const deltaY = e.clientY - this._touchStartY;

      /* Ignore if more vertical than horizontal */
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        this._startAutoplay();
        return;
      }

      if (Math.abs(deltaX) >= this._SWIPE_THRESHOLD) {
        if (deltaX < 0) {
          this.next();
        } else {
          this.prev();
        }
      }

      this._startAutoplay();
    }

    /* ── Navigation ───────────────────────────────────── */
    next() {
      this.goTo((this.currentIndex + 1) % this.slideCount);
    }

    prev() {
      this.goTo((this.currentIndex - 1 + this.slideCount) % this.slideCount);
    }

    goTo(index) {
      if (index === this.currentIndex) return;
      const previous = this.currentIndex;
      this.currentIndex = index;
      this._updateSlideVisibility(previous);
      this._updateTrackPosition(index, true);
      this._updateDots(index);
    }

    /* ── Track position ───────────────────────────────── */
    _updateTrackPosition(index, animate) {
      if (!this.track) return;

      /* Get the width of a single slide for pixel offset */
      const slideWidth = this.slides[0]?.offsetWidth || 0;
      const offset = index * slideWidth;

      if (!animate || this._prefersReducedMotion()) {
        /* Snap immediately */
        this.track.style.transition = 'none';
        this.track.style.setProperty('--slide-offset', `${offset}px`);
        /* Re-enable transition after frame */
        requestAnimationFrame(() => {
          this.track.style.transition = '';
        });
      } else {
        this.track.style.setProperty('--slide-offset', `${offset}px`);
      }
    }

    /* ── Slide ARIA visibility ────────────────────────── */
    _updateSlideVisibility(previousIndex) {
      this.slides.forEach((slide, i) => {
        const isActive = i === this.currentIndex;
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
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

      /* Never start if reduced-motion prefers no animation */
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

    /* ── Handle resize: recalculate offset ────────────── */
    handleResize() {
      this._updateTrackPosition(this.currentIndex, false);
    }
  }

  customElements.define('ayira-hero-banner-carousel', AyiraHeroBannerCarousel);

  /* Recalculate on window resize (debounced) */
  let _resizeDebounce;
  window.addEventListener('resize', () => {
    clearTimeout(_resizeDebounce);
    _resizeDebounce = setTimeout(() => {
      document.querySelectorAll('ayira-hero-banner-carousel').forEach((el) => {
        el.handleResize?.();
      });
    }, 150);
  });
}
