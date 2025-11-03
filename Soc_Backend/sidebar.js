const { useState, useEffect, useRef } = React;
const { createElement: h } = React;

// Helper function for className
const cn = (...classes) => classes.filter(Boolean).join(' ');

// SVG Icon Components
const HomeIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' }),
  h('polyline', { points: '9 22 9 12 15 12 15 22' })
);

const ChatIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('path', { d: 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z' })
);

const PluginsIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('path', { d: 'M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2' })
);

const SettingsIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('circle', { cx: '12', cy: '12', r: '3' }),
  h('path', { d: 'M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 17.364m12.728 0l-4.243-4.243m-4.242 0L5.636 6.636' })
);

const SendIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('line', { x1: '22', y1: '2', x2: '11', y2: '13' }),
  h('polygon', { points: '22 2 15 22 11 13 2 9 22 2' })
);

const MinimizeIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
  h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
);

const MaximizeIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('polyline', { points: '15 3 21 3 21 9' }),
  h('polyline', { points: '9 21 3 21 3 15' }),
  h('line', { x1: '21', y1: '3', x2: '14', y2: '10' }),
  h('line', { x1: '3', y1: '21', x2: '10', y2: '14' })
);

const CloseIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
  h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
  h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
);

const CopilotIcon = () => h('svg', { viewBox: '0 0 24 24', fill: 'currentColor' },
  h('path', { d: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5' })
);

// Loading Component
const LoadingDots = () => h('div', { className: 'message-loading' },
  h('div', { className: 'loading-dot' }),
  h('div', { className: 'loading-dot' }),
  h('div', { className: 'loading-dot' })
);

// Message Component
const Message = ({ message, isLoading }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) {
    return h('div', { className: 'message message-ai' }, h(LoadingDots));
  }

  return h('div', { className: cn('message', message.role === 'user' ? 'message-user' : 'message-ai') },
    h('div', { className: 'message-content' }, message.content),
    h('div', { className: 'message-time' }, formatTime(message.timestamp))
  );
};

// Welcome Component
const WelcomeMessage = () => h('div', { className: 'welcome-message' },
  h('div', { className: 'welcome-icon' }, h(CopilotIcon)),
  h('div', { className: 'welcome-title' }, 'Welcome to Copilot'),
  h('div', { className: 'welcome-text' }, 
    "Ask me anything! I'm here to help you with your questions and tasks.")
);

// Settings Panel Component
const SettingsPanel = ({ isOpen, onClose }) => {
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem('backend-url') || 'http://localhost:8000';
  });

  if (!isOpen) return null;

  const handleBackendUrlChange = (e) => {
    const url = e.target.value;
    setBackendUrl(url);
    localStorage.setItem('backend-url', url);
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to clear all chat history?')) {
      localStorage.removeItem('copilot-chat-history');
      window.location.reload();
    }
  };

  return h('div', { className: cn('settings-panel', isOpen ? 'open' : '') },
    h('div', { className: 'settings-header' },
      h('div', { className: 'settings-title' }, 'Settings'),
      h('button', { className: 'settings-close', onClick: onClose }, h(CloseIcon))
    ),
    h('div', { className: 'settings-content' },
      h('div', { className: 'settings-section' },
        h('div', { className: 'settings-section-title' }, 'Backend Configuration'),
        h('div', { style: { marginBottom: '12px' } },
          h('div', { style: { marginBottom: '6px', fontSize: '13px', color: 'var(--text-secondary)' } }, 'Backend URL:'),
          h('input', {
            type: 'text',
            value: backendUrl,
            onChange: handleBackendUrlChange,
            placeholder: 'http://localhost:8000',
            style: {
              width: '100%',
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none',
              fontFamily: 'inherit'
            }
          })
        )
      ),
      h('div', { className: 'settings-section' },
        h('div', { className: 'settings-section-title' }, 'Chat'),
        h('div', { className: 'settings-option', onClick: handleClearChat, style: { cursor: 'pointer' } }, 'Clear chat history'),
        h('div', { className: 'settings-option' }, 'Export conversation')
      ),
      h('div', { className: 'settings-section' },
        h('div', { className: 'settings-section-title' }, 'About'),
        h('div', { className: 'settings-option' }, 'Version 1.0.0'),
        h('div', { className: 'settings-option' }, 'Help & Support')
      )
    )
  );
};

// Main Sidebar Component
const Sidebar = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(380);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [contentUrl, setContentUrl] = useState('');
  const iframeRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const resizeRef = useRef(null);

  // Load content URL from storage on mount
  useEffect(() => {
    // Get current page URL or default content URL
    if (chrome && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url) {
          setContentUrl(tabs[0].url);
        }
      });
    }
    
    // Load saved content URL if available
    const savedUrl = localStorage.getItem('copilot-content-url');
    if (savedUrl) {
      setContentUrl(savedUrl);
    }
  }, []);

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('copilot-chat-history');
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('copilot-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // AI response function - integrated with backend
  const generateAIResponse = async (userMessage) => {
    // Get backend URL from storage or use default
    const backendUrl = localStorage.getItem('backend-url') || 'http://localhost:8000';
    
    try {
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Return the answer, or show error if present
      if (data.error) {
        return `Sorry, I encountered an error: ${data.error}`;
      }
      
      return data.answer || "I couldn't generate a response. Please try again.";
      
    } catch (error) {
      console.error('Error calling backend:', error);
      // Fallback to offline response if backend is unavailable
      return `I'm having trouble connecting to the backend server at ${backendUrl}. ` +
             `Please make sure the backend is running and the URL is correct.\n\n` +
             `Error: ${error.message}`;
    }
  };

  // Handle sending a message
  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    const aiResponse = await generateAIResponse(userMessage.content);
    
    const aiMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: Date.now()
    };

    setIsLoading(false);
    setMessages(prev => [...prev, aiMessage]);
  };

  // Handle keyboard shortcuts
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputValue]);

  // Resize functionality
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newWidth = Math.max(280, Math.min(800, window.innerWidth - e.clientX));
      setSidebarWidth(newWidth);
      
      // Notify iframe content about sidebar resize in real-time during drag
      if (iframeRef.current && activeTab === 'content') {
        try {
          const iframe = iframeRef.current;
          const threshold = window.innerWidth * 0.9;
          const fullscreen = newWidth >= threshold;
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage({
              type: 'sidebar-resize',
              width: newWidth,
              isFullscreen: fullscreen
            }, '*');
          }
        } catch (e) {
          // Cross-origin restrictions, ignore
        }
      }
      
      // Notify content script about sidebar resize
      if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'sidebar-resize',
              width: newWidth
            }).catch(() => {
              // Ignore errors if content script isn't ready
            });
          }
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, activeTab]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Detect fullscreen mode (when sidebar is very wide) and update iframe
  useEffect(() => {
    const threshold = window.innerWidth * 0.9; // 90% of viewport width
    const fullscreen = sidebarWidth >= threshold;
    setIsFullscreen(fullscreen);
    
    // Update iframe when size changes for responsive behavior
    if (iframeRef.current && activeTab === 'content') {
      // Trigger resize event in iframe for responsive content
      try {
        const iframe = iframeRef.current;
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage({
            type: 'sidebar-resize',
            width: sidebarWidth,
            isFullscreen: fullscreen
          }, '*');
          
          // Also trigger a resize event on the iframe itself
          // This helps content that listens to window resize events
          if (iframe.contentWindow.dispatchEvent) {
            iframe.contentWindow.dispatchEvent(new Event('resize'));
          }
        }
      } catch (e) {
        // Cross-origin restrictions, ignore
      }
    }
  }, [sidebarWidth, activeTab]);

  // Apply width to container and notify content script
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${sidebarWidth}px`;
      
      // Notify content script about sidebar width change
      if (chrome && chrome.tabs) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'sidebar-resize',
              width: sidebarWidth
            }).catch(() => {
              // Ignore errors if content script isn't ready
            });
          }
        });
      }
    }
  }, [sidebarWidth]);

  return h('div', {
    ref: containerRef,
    className: cn('sidebar-container', isMinimized ? 'minimized' : ''),
    style: { width: `${sidebarWidth}px` }
  },
    h('div', {
      ref: resizeRef,
      className: cn('resize-handle', isDragging ? 'dragging' : ''),
      onMouseDown: handleResizeStart
    }),
    h('div', { className: 'top-nav' },
      h('div', { className: 'nav-left' },
        h('button', {
          className: 'nav-toggle',
          onClick: () => setIsMinimized(!isMinimized),
          title: isMinimized ? 'Expand' : 'Minimize'
        }, isMinimized ? h(MaximizeIcon) : h(MinimizeIcon)),
        h('div', { className: 'nav-title' }, 'Copilot')
      ),
      h('div', { className: 'nav-right' },
        h('button', {
          className: cn('nav-button', activeTab === 'home' ? 'active' : ''),
          onClick: () => setActiveTab('home'),
          title: 'Home'
        }, h(HomeIcon)),
        h('button', {
          className: cn('nav-button', activeTab === 'chat' ? 'active' : ''),
          onClick: () => setActiveTab('chat'),
          title: 'Chat'
        }, h(ChatIcon)),
        h('button', {
          className: 'nav-button',
          onClick: () => {},
          title: 'Plugins'
        }, h(PluginsIcon)),
        h('button', {
          className: cn('nav-button', settingsOpen ? 'active' : ''),
          onClick: () => setSettingsOpen(!settingsOpen),
          title: 'Settings'
        }, h(SettingsIcon))
      )
    ),
    ...(isMinimized ? [] : [
      h('div', { className: 'tab-nav', key: 'tabs' },
        h('button', {
          className: cn('tab-button', activeTab === 'chat' ? 'active' : ''),
          onClick: () => setActiveTab('chat')
        }, 'New Chat'),
        h('button', {
          className: cn('tab-button', activeTab === 'home' ? 'active' : ''),
          onClick: () => setActiveTab('home')
        }, 'Home'),
        h('button', {
          className: cn('tab-button', activeTab === 'content' ? 'active' : ''),
          onClick: () => setActiveTab('content')
        }, 'Content')
      ),
      activeTab === 'content' ? h('div', {
        className: cn('content-container', isFullscreen ? 'fullscreen' : ''),
        key: 'content',
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          width: '100%',
          minWidth: 0,
          minHeight: 0,
          boxSizing: 'border-box'
        }
      },
        h('div', {
          className: 'content-header',
          style: {
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexShrink: 0
          }
        },
          h('input', {
            type: 'text',
            value: contentUrl,
            onChange: (e) => {
              setContentUrl(e.target.value);
              localStorage.setItem('copilot-content-url', e.target.value);
            },
            placeholder: 'Enter URL or path to your frontend...',
            style: {
              flex: 1,
              padding: '8px 12px',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              fontSize: '14px',
              outline: 'none'
            }
          }),
          h('button', {
            onClick: () => {
              const iframe = iframeRef.current;
              if (iframe) {
                iframe.src = contentUrl || 'about:blank';
              }
            },
            style: {
              padding: '8px 16px',
              background: 'var(--primary-color)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }
          }, 'Load')
        ),
        h('iframe', {
          id: 'content-iframe',
          ref: iframeRef,
          src: contentUrl || 'about:blank',
          style: {
            flex: 1,
            width: '100%',
            height: '100%',
            border: 'none',
            transition: 'width 0.2s ease, max-width 0.2s ease, opacity 0.2s ease',
            minHeight: 0,
            minWidth: 0,
            display: 'block'
          },
          onLoad: () => {
            console.log('Content loaded');
            try {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                  type: 'sidebar-resize',
                  width: sidebarWidth,
                  isFullscreen: isFullscreen
                }, '*');
              }
            } catch (e) {
              // Cross-origin restrictions, ignore
            }
          }
        })
      ) : h('div', { className: 'chat-container', key: 'chat' },
        h('div', { className: 'chat-messages' },
          messages.length === 0 && !isLoading ? h(WelcomeMessage) : [
            ...messages.map((msg, idx) => h(Message, { key: idx, message: msg })),
            ...(isLoading ? [h(Message, { key: 'loading', isLoading: true })] : []),
            h('div', { key: 'end', ref: messagesEndRef })
          ]
        ),
        h('div', { className: 'chat-input-area' },
          h('div', { className: 'input-wrapper' },
            h('textarea', {
              ref: inputRef,
              className: 'chat-input',
              placeholder: 'Ask me anything...',
              value: inputValue,
              onChange: (e) => setInputValue(e.target.value),
              onKeyPress: handleKeyPress,
              rows: '1'
            }),
            h('button', {
              className: 'send-button',
              onClick: handleSend,
              disabled: !inputValue.trim() || isLoading,
              title: 'Send message'
            }, h(SendIcon))
          )
        )
      )
    ]),
    h(SettingsPanel, { isOpen: settingsOpen, onClose: () => setSettingsOpen(false) })
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(Sidebar));

