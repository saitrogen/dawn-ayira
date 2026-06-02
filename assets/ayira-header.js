/* Assets: ayira-header.js */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile search toggle logic
  const searchToggle = document.getElementById('AyiraSearchToggle');
  const searchClose = document.getElementById('AyiraSearchClose');
  const searchPanel = document.getElementById('AyiraMobileSearchPanel');
  
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      searchPanel.classList.add('is-active');
      const searchInput = searchPanel.querySelector('.ayira-header__mobile-search-input');
      if (searchInput) {
        setTimeout(() => searchInput.focus(), 150);
      }
    });
  }

  if (searchClose && searchPanel) {
    searchClose.addEventListener('click', () => {
      searchPanel.classList.remove('is-active');
    });
  }

  // Mobile menu drawer open/close logic
  const drawerOpen = document.getElementById('AyiraDrawerOpen');
  const drawerClose = document.getElementById('AyiraDrawerClose');
  const mobileDrawer = document.getElementById('AyiraMobileDrawer');
  const headerWrapper = document.querySelector('.ayira-header-wrapper');
  
  if (drawerOpen && mobileDrawer) {
    drawerOpen.addEventListener('click', () => {
      mobileDrawer.classList.add('is-active');
      if (headerWrapper) headerWrapper.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
    });
  }
  
  if (drawerClose && mobileDrawer) {
    drawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('is-active');
      if (headerWrapper) headerWrapper.classList.remove('menu-open');
      document.body.style.overflow = '';
    });
    
    // Close drawer when clicking outside content area
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        mobileDrawer.classList.remove('is-active');
        if (headerWrapper) headerWrapper.classList.remove('menu-open');
        document.body.style.overflow = '';
      }
    });
  }

  // Mobile drawer submenu dropdown triggers
  const drawerLinks = document.querySelectorAll('.ayira-header__drawer-link');
  drawerLinks.forEach(link => {
    const parentItem = link.closest('.ayira-header__drawer-item');
    const submenu = parentItem ? parentItem.querySelector('.ayira-header__drawer-submenu') : null;
    
    if (submenu) {
      link.addEventListener('click', (e) => {
        // Prevent default navigation only if it's a submenu toggle
        e.preventDefault();
        parentItem.classList.toggle('is-open');
        const caret = link.querySelector('.ayira-header__caret');
        if (caret) {
          if (parentItem.classList.contains('is-open')) {
            caret.style.transform = 'rotate(180deg)';
          } else {
            caret.style.transform = '';
          }
        }
      });
    }
  });
});

// Sticky Header Custom Web Component
class AyiraStickyHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.header = document.querySelector('.section-header') || this.closest('.section-header') || this;
    this.stickyType = this.getAttribute('data-sticky-type');
    this.currentScrollTop = 0;
    
    this.setHeaderHeight();
    this.resizeObserver = new ResizeObserver(() => this.setHeaderHeight());
    this.resizeObserver.observe(this.header);

    if (this.stickyType === 'always') {
      this.header.classList.add('shopify-section-header-sticky');
    } else if (this.stickyType === 'on-scroll-up') {
      this.scrollHandler = this.onScroll.bind(this);
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
  }

  setHeaderHeight() {
    document.documentElement.style.setProperty('--header-height', `${this.header.offsetHeight}px`);
  }

  onScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = this.header.offsetHeight;

    if (scrollTop > headerHeight) {
      this.header.classList.add('shopify-section-header-sticky', 'animate');
      
      if (scrollTop > this.currentScrollTop) {
        // Scrolling DOWN - Hide header
        this.header.classList.add('shopify-section-header-hidden');
      } else {
        // Scrolling UP - Show header
        this.header.classList.remove('shopify-section-header-hidden');
      }
    } else {
      // Near the top of the page - reset to normal static flow to prevent layout collapse loops
      if (scrollTop <= headerHeight) {
        this.header.classList.remove('shopify-section-header-sticky', 'shopify-section-header-hidden', 'animate');
      }
    }

    this.currentScrollTop = scrollTop;
  }

  disconnectedCallback() {
    if (this.scrollHandler) {
      window.removeEventListener('scroll', this.scrollHandler);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }
}

customElements.define('ayira-sticky-header', AyiraStickyHeader);
