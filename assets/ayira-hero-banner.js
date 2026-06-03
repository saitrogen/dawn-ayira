/**
 * ayira-hero-banner.js
 *
 * Custom element: <ayira-hero-banner-carousel>
 *
 * Architecture: CSS scroll-snap does the swipe/momentum heavy lifting.
 * JS handles: clones for infinite loop wrapping, autoplay, dot synchronization,
 * navigation arrows, and keyboard accessibility.
 *
 * This version uses a clean JS-cloning approach to achieve a true seamless loop:
 * - A clone of the last slide is prepended.
 * - A clone of the first slide is appended.
 * - CSS scroll-snap handles swipe physics.
 * - JS scroll end listener instantly wraps from clone to real slide invisibly.
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
      this._scrollTimeout = null;
      this._resizeTimeout = null;
    }

    connectedCallback() {
      this.slideCount = parseInt(this.dataset.slideCount, 10) || 0;
      if (this.slideCount < 1) return;

      this._cacheDom();
      if (!this.trackWrapper || !this.track) return;

      if (this.slideCount > 1) {
        this._setupClones();
      }

      this._bindEvents();

      // Robust initialization: poll until element has layout width
      if (this.slideCount > 1) {
        this.currentIndex = 0;
        const initScroll = () => {
          const slideWidth = this.trackWrapper.offsetWidth;
          if (slideWidth > 0) {
            this._adjustScrollToActive(false);
            this._updateDots(0);
            this._updateAriaStates();
            this._startAutoplay();
          } else {
            setTimeout(initScroll, 50);
          }
        };
        initScroll();
      } else {
        this.currentIndex = 0;
        this._updateDots(0);
        this._updateAriaStates();
        this._startAutoplay();
      }
    }

    disconnectedCallback() {
      this._stopAutoplay();
      if (this._scrollTimeout) clearTimeout(this._scrollTimeout);
      if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
    }

    /* ── DOM caching ────────────────────────────────────── */
    _cacheDom() {
      this.trackWrapper = this.querySelector('.ayira-hero-banner__track-wrapper');
      this.track = this.querySelector('.ayira-hero-banner__track');
      this.slides = Array.from(this.querySelectorAll('.ayira-hero-banner__slide'));
      this.dots = Array.from(this.querySelectorAll('.ayira-hero-banner__dot'));
      this.prevButton = this.querySelector('[data-nav-prev]');
      this.nextButton = this.querySelector('[data-nav-next]');
    }

    /* ── Clone slides for seamless infinite loop ────────── */
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

      // Re-cache slides to include the clones
      this.slides = Array.from(this.querySelectorAll('.ayira-hero-banner__slide'));
    }

    /* ── Event binding ──────────────────────────────────── */
    _bindEvents() {
      /* Scroll end detection: debounced scroll event */
      this.trackWrapper.addEventListener('scroll', () => {
        if (this._scrollTimeout) clearTimeout(this._scrollTimeout);
        this._scrollTimeout = setTimeout(() => this._onScrollEnd(), 100);
      }, { passive: true });

      /* Resize listener to snap correctly during screen size changes */
      window.addEventListener('resize', () => {
        if (this._resizeTimeout) clearTimeout(this._resizeTimeout);
        this._resizeTimeout = setTimeout(() => {
          this._adjustScrollToActive(false);
        }, 100);
      });

      /* Dot clicks */
      this.dots.forEach((dot) => {
        dot.addEventListener('click', () => {
          const target = parseInt(dot.dataset.targetSlide, 10);
          this.goTo(target);
        });

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

      /* Prev/Next buttons */
      if (this.prevButton) {
        this.prevButton.addEventListener('click', () => this.prev());
      }
      if (this.nextButton) {
        this.nextButton.addEventListener('click', () => this.next());
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

      /* Pause on focus */
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
    }

    /* ── Scroll end detection ───────────────────────────── */
    _onScrollEnd() {
      if (!this.trackWrapper) return;

      const scrollLeft = this.trackWrapper.scrollLeft;
      const slideWidth = this.trackWrapper.offsetWidth;
      if (slideWidth === 0) return;

      const currentElementIndex = Math.round(scrollLeft / slideWidth);

      if (this.slideCount > 1) {
        if (currentElementIndex === 0) {
          // Wrapped to last slide clone at start. Jump to real last slide.
          this.currentIndex = this.slideCount - 1;
          this.trackWrapper.scrollTo({
            left: this.slideCount * slideWidth,
            behavior: 'auto'
          });
          this._updateDots(this.currentIndex);
          this._updateAriaStates();
        } else if (currentElementIndex === this.slideCount + 1) {
          // Wrapped to first slide clone at end. Jump to real first slide.
          this.currentIndex = 0;
          this.trackWrapper.scrollTo({
            left: 1 * slideWidth,
            behavior: 'auto'
          });
          this._updateDots(this.currentIndex);
          this._updateAriaStates();
        } else {
          // On a real slide
          const newIndex = currentElementIndex - 1;
          if (newIndex !== this.currentIndex) {
            this.currentIndex = newIndex;
            this._updateDots(this.currentIndex);
            this._updateAriaStates();
          }
        }
      } else {
        const newIndex = Math.max(0, Math.min(currentElementIndex, this.slideCount - 1));
        if (newIndex !== this.currentIndex) {
          this.currentIndex = newIndex;
          this._updateDots(this.currentIndex);
          this._updateAriaStates();
        }
      }
    }

    /* ── Navigation ─────────────────────────────────────── */
    next() {
      if (this.slideCount <= 1) return;

      if (this.slideCount > 1) {
        const slideWidth = this.trackWrapper.offsetWidth;
        const nextElementIndex = this.currentIndex + 2;
        this.trackWrapper.scrollTo({
          left: nextElementIndex * slideWidth,
          behavior: 'smooth'
        });
      }
    }

    prev() {
      if (this.slideCount <= 1) return;

      if (this.slideCount > 1) {
        const slideWidth = this.trackWrapper.offsetWidth;
        const prevElementIndex = this.currentIndex;
        this.trackWrapper.scrollTo({
          left: prevElementIndex * slideWidth,
          behavior: 'smooth'
        });
      }
    }

    goTo(index) {
      if (this.slideCount <= 1 || index === this.currentIndex) return;

      this.currentIndex = index;
      this._adjustScrollToActive(true);
      this._updateDots(index);
      this._updateAriaStates();
    }

    /* ── Adjust Scroll position based on active index ────── */
    _adjustScrollToActive(smooth = false) {
      if (!this.trackWrapper) return;
      const slideWidth = this.trackWrapper.offsetWidth;
      const targetElementIndex = this.slideCount > 1 ? this.currentIndex + 1 : this.currentIndex;
      this.trackWrapper.scrollTo({
        left: targetElementIndex * slideWidth,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    /* ── Dot state ──────────────────────────────────────── */
    _updateDots(index) {
      this.dots.forEach((dot, i) => {
        const isActive = i === index;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        dot.setAttribute('tabindex', isActive ? '0' : '-1');
      });
    }

    /* ── ARIA visibility ────────────────────────────────── */
    _updateAriaStates() {
      this.slides.forEach((slide, i) => {
        if (this.slideCount > 1) {
          const isRealSlide = i >= 1 && i <= this.slideCount;
          const isActive = isRealSlide && (i - 1 === this.currentIndex);
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          slide.querySelectorAll('a, button').forEach(el => {
            el.setAttribute('tabindex', isActive ? '0' : '-1');
          });
        } else {
          const isActive = i === this.currentIndex;
          slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
          slide.querySelectorAll('a, button').forEach(el => {
            el.setAttribute('tabindex', isActive ? '0' : '-1');
          });
        }
      });
    }

    /* ── Autoplay ───────────────────────────────────────── */
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

    /* ── Utility ────────────────────────────────────────── */
    _prefersReducedMotion() {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
  }

  customElements.define('ayira-hero-banner-carousel', AyiraHeroBannerCarousel);
}
