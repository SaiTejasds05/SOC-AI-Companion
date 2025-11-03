// Popup script for Copilot Sidebar Extension
document.addEventListener('DOMContentLoaded', () => {
  const openButton = document.getElementById('openSidebar');
  if (openButton) {
    openButton.addEventListener('click', async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs[0]) {
          await chrome.sidePanel.open({ windowId: tabs[0].windowId });
          window.close();
        }
      } catch (error) {
        console.error('Error opening sidebar:', error);
      }
    });
  }
});

