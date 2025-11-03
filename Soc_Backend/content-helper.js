// Helper script for frontend content to listen to sidebar resize events
// Include this script in your frontend HTML: <script src="content-helper.js"></script>
// Or copy this code into your frontend's JavaScript

(function() {
  'use strict';

  // Listen for sidebar resize messages
  window.addEventListener('message', function(event) {
    // Verify message origin (adjust if needed for security)
    // if (event.origin !== 'chrome-extension://YOUR_EXTENSION_ID') return;

    if (event.data && event.data.type === 'sidebar-resize') {
      const { width, isFullscreen } = event.data;
      
      // Update viewport meta tag or add custom CSS variable
      document.documentElement.style.setProperty('--sidebar-width', width + 'px');
      document.documentElement.style.setProperty('--is-fullscreen', isFullscreen ? '1' : '0');
      
      // Trigger resize event for responsive layouts
      window.dispatchEvent(new Event('resize'));
      
      // Add/remove fullscreen class
      if (isFullscreen) {
        document.documentElement.classList.add('sidebar-fullscreen');
      } else {
        document.documentElement.classList.remove('sidebar-fullscreen');
      }
      
      // Example: Adjust container widths
      const containers = document.querySelectorAll('.container, main, [role="main"]');
      containers.forEach(container => {
        if (isFullscreen) {
          container.style.maxWidth = '100%';
          container.style.width = '100%';
        } else {
          // Restore original max-width if needed
          container.style.transition = 'max-width 0.2s ease, width 0.2s ease';
        }
      });
    }
  });

  // CSS helper - add this to your frontend CSS
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --sidebar-width: 380px;
      --is-fullscreen: 0;
    }
    
    /* Responsive adjustments when in fullscreen */
    html.sidebar-fullscreen body {
      max-width: 100% !important;
    }
    
    html.sidebar-fullscreen .container,
    html.sidebar-fullscreen main,
    html.sidebar-fullscreen [role="main"] {
      max-width: 100% !important;
      width: 100% !important;
      transition: max-width 0.2s ease, width 0.2s ease !important;
    }
    
    /* Smooth transitions for all content */
    body, main, .container, [role="main"] {
      transition: width 0.2s ease, max-width 0.2s ease !important;
    }
  `;
  document.head.appendChild(style);
  
  console.log('Sidebar resize helper loaded');
})();





