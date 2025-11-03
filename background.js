// Background service worker for Copilot Sidebar Extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Copilot Sidebar Extension installed');
});

// Handle sidebar panel opening
chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: tab.windowId });
});

// Keep sidebar open across navigation
chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === 'complete') {
    // Sidebar persists automatically in MV3
  }
});

