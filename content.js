// Content script to handle smooth page resizing when sidebar is resized
(function() {
  'use strict';

  let resizeObserver;
  let lastWidth = window.innerWidth;
  let isResizing = false;
  let resizeTimer;

  // Add smooth transition styles to the page
  const addSmoothTransition = () => {
    // Create style element if it doesn't exist
    if (document.getElementById('copilot-sidebar-resize-styles')) return;

    const style = document.createElement('style');
    style.id = 'copilot-sidebar-resize-styles';
    style.textContent = `
      /* Smooth transition for body and main content */
      body {
        transition: width 0.2s ease, max-width 0.2s ease, margin-right 0.2s ease, padding-right 0.2s ease !important;
      }
      
      /* Smooth transition for html element */
      html {
        transition: width 0.2s ease, max-width 0.2s ease !important;
      }
      
      /* Smooth transition for fixed/sticky elements */
      [style*="position: fixed"],
      [style*="position:fixed"],
      [style*="position: sticky"],
      [style*="position:sticky"] {
        transition: right 0.2s ease, margin-right 0.2s ease, width 0.2s ease !important;
      }
      
      /* Smooth transition for main content containers */
      main,
      .main,
      #main,
      .content,
      #content,
      .container,
      #container,
      article,
      .article,
      section,
      .section {
        transition: width 0.2s ease, max-width 0.2s ease, margin-right 0.2s ease !important;
      }
      
      /* Smooth transition for viewport-based elements */
      [style*="width: 100vw"],
      [style*="width:100vw"],
      [style*="max-width: 100vw"],
      [style*="max-width:100vw"] {
        transition: width 0.2s ease, max-width 0.2s ease !important;
      }
      
      /* Smooth transition for flex/grid containers */
      .flex, [class*="flex-"], .grid, [class*="grid-"] {
        transition: width 0.2s ease, max-width 0.2s ease !important;
      }
    `;
    document.head.appendChild(style);
  };

  // Monitor window resize for sidebar changes
  const handleResize = () => {
    const currentWidth = window.innerWidth;
    
    // Check if this is likely a sidebar resize (width decreased)
    if (Math.abs(lastWidth - currentWidth) > 5) {
      isResizing = true;
      
      // Clear existing timer
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
      
      // Add smooth transition class
      document.body.style.transition = 'margin-right 0.2s ease, padding-right 0.2s ease';
      
      // Reset timer
      resizeTimer = setTimeout(() => {
        isResizing = false;
        // Remove transition after resize completes
        setTimeout(() => {
          if (!isResizing) {
            document.body.style.transition = '';
          }
        }, 250);
        resizeTimer = null;
      }, 100);
      
      lastWidth = currentWidth;
    }
  };

  // Use ResizeObserver for more accurate detection
  const setupResizeObserver = () => {
    if (typeof ResizeObserver === 'undefined') {
      // Fallback to window resize
      window.addEventListener('resize', handleResize);
      return;
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const currentWidth = window.innerWidth;
        
        if (Math.abs(lastWidth - currentWidth) > 5) {
          handleResize();
        }
      }
    });

    // Observe body for size changes
    resizeObserver.observe(document.body);
  };

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      addSmoothTransition();
      setupResizeObserver();
      window.addEventListener('resize', handleResize);
    });
  } else {
    addSmoothTransition();
    setupResizeObserver();
    window.addEventListener('resize', handleResize);
  }

  // Listen for messages from sidebar about resize
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'sidebar-resize') {
        // Apply smooth transition to all relevant elements
        applySmoothResize(message.width);
        handleResize();
        sendResponse({ success: true });
      }
      return true; // Keep message channel open for async response
    });
  }

  // Apply smooth resize styles to page elements
  const applySmoothResize = (sidebarWidth) => {
    // Add transition to body
    document.body.style.transition = 'margin-right 0.2s ease, padding-right 0.2s ease';
    
    // Find and style main content areas
    const contentSelectors = [
      'main',
      '.main',
      '#main',
      '.content',
      '#content',
      '.container',
      '#container',
      '[role="main"]',
      'article',
      '.article'
    ];

    contentSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.transition = 'width 0.2s ease, max-width 0.2s ease, margin-right 0.2s ease';
      });
    });

    // Style viewport-width elements
    const vwElements = document.querySelectorAll('[style*="100vw"], [style*="100 vw"]');
    vwElements.forEach(el => {
      el.style.transition = 'width 0.2s ease, max-width 0.2s ease';
    });

    // Style fixed/sticky positioned elements
    const fixedElements = document.querySelectorAll('[style*="position: fixed"], [style*="position:fixed"], [style*="position: sticky"], [style*="position:sticky"]');
    fixedElements.forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'fixed' || computedStyle.position === 'sticky') {
        el.style.transition = 'right 0.2s ease, margin-right 0.2s ease';
      }
    });
  };

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    window.removeEventListener('resize', handleResize);
  });
})();

