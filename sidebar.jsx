const { useState, useEffect, useRef, useCallback } = React;

// SVG Icon Components
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const PluginsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v6m0 6v6m9-9h-6m-6 0H3m15.364 6.364l-4.243-4.243m-4.242 0L5.636 17.364m12.728 0l-4.243-4.243m-4.242 0L5.636 6.636" />
  </svg>
);

const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

const MinimizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const MaximizeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15 3 21 3 21 9" />
    <polyline points="9 21 3 21 3 15" />
    <line x1="21" y1="3" x2="14" y2="10" />
    <line x1="3" y1="21" x2="10" y2="14" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CopilotIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

// Loading Component
const LoadingDots = () => (
  <div className="message-loading">
    <div className="loading-dot"></div>
    <div className="loading-dot"></div>
    <div className="loading-dot"></div>
  </div>
);

// Message Component
const Message = ({ message, isLoading }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="message message-ai">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className={`message ${message.role === 'user' ? 'message-user' : 'message-ai'}`}>
      <div className="message-content">{message.content}</div>
      <div className="message-time">{formatTime(message.timestamp)}</div>
    </div>
  );
};

// Welcome Component
const WelcomeMessage = () => (
  <div className="welcome-message">
    <div className="welcome-icon">
      <CopilotIcon />
    </div>
    <div className="welcome-title">Welcome to Copilot</div>
    <div className="welcome-text">
      Ask me anything! I'm here to help you with your questions and tasks.
    </div>
  </div>
);

// Settings Panel Component
const SettingsPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={`settings-panel ${isOpen ? 'open' : ''}`}>
      <div className="settings-header">
        <div className="settings-title">Settings</div>
        <button className="settings-close" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <div className="settings-content">
        <div className="settings-section">
          <div className="settings-section-title">Chat</div>
          <div className="settings-option">Clear chat history</div>
          <div className="settings-option">Export conversation</div>
        </div>
        <div className="settings-section">
          <div className="settings-section-title">Appearance</div>
          <div className="settings-option">Theme settings</div>
          <div className="settings-option">Font size</div>
        </div>
        <div className="settings-section">
          <div className="settings-section-title">About</div>
          <div className="settings-option">Version 1.0.0</div>
          <div className="settings-option">Help & Support</div>
        </div>
      </div>
    </div>
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

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const resizeRef = useRef(null);

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

  // Placeholder AI response function
  const generateAIResponse = async (userMessage) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simple placeholder responses
    const responses = [
      "That's an interesting question! Let me help you with that.",
      "I understand what you're asking. Here's what I think...",
      "Great question! Based on what you've shared, I'd suggest...",
      "I can definitely help with that. Here's my take on it...",
      "Thanks for asking! Let me provide some insights on this topic."
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] + 
           "\n\n(This is a placeholder response. Connect your AI service to get real answers!)";
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

    // Generate AI response
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
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  // Apply width to container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.width = `${sidebarWidth}px`;
    }
  }, [sidebarWidth]);

  return (
    <div 
      ref={containerRef}
      className={`sidebar-container ${isMinimized ? 'minimized' : ''}`}
      style={{ width: `${sidebarWidth}px` }}
    >
      <div 
        ref={resizeRef}
        className={`resize-handle ${isDragging ? 'dragging' : ''}`}
        onMouseDown={handleResizeStart}
      />
      
      <div className="top-nav">
        <div className="nav-left">
          <button 
            className="nav-toggle"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? <MaximizeIcon /> : <MinimizeIcon />}
          </button>
          <div className="nav-title">Copilot</div>
        </div>
        <div className="nav-right">
          <button 
            className={`nav-button ${activeTab === 'home' ? 'active' : ''}`}
            onClick={() => setActiveTab('home')}
            title="Home"
          >
            <HomeIcon />
          </button>
          <button 
            className={`nav-button ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            title="Chat"
          >
            <ChatIcon />
          </button>
          <button 
            className="nav-button"
            onClick={() => {}}
            title="Plugins"
          >
            <PluginsIcon />
          </button>
          <button 
            className={`nav-button ${settingsOpen ? 'active' : ''}`}
            onClick={() => setSettingsOpen(!settingsOpen)}
            title="Settings"
          >
            <SettingsIcon />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="tab-nav">
            <button 
              className={`tab-button ${activeTab === 'chat' ? 'active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              New Chat
            </button>
            <button 
              className={`tab-button ${activeTab === 'home' ? 'active' : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home
            </button>
          </div>

          <div className="chat-container">
            <div className="chat-messages">
              {messages.length === 0 && !isLoading ? (
                <WelcomeMessage />
              ) : (
                <>
                  {messages.map((msg, idx) => (
                    <Message key={idx} message={msg} />
                  ))}
                  {isLoading && <Message isLoading={true} />}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            <div className="chat-input-area">
              <div className="input-wrapper">
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  placeholder="Ask me anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  rows="1"
                />
                <button 
                  className="send-button"
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  title="Send message"
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Sidebar />);

