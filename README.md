# Copilot Sidebar Extension for Microsoft Edge

A fully-functional Microsoft Edge sidebar browser extension that visually and behaviorally mimics the Microsoft Copilot sidebar UI. Features an integrated AI-powered backend using Google Gemini with RAG (Retrieval-Augmented Generation) for intelligent SOC assistance.

## 🚀 Quick Start

1. **Backend**: Install dependencies and start the FastAPI server
2. **Extension**: Generate icons and load into Edge
3. **Chat**: Start asking questions and get AI-powered responses

See [Installation](#-installation) below for detailed steps.

## 📦 Features

- ✅ Collapsible/expandable sidebar (minimize button)
- ✅ Draggable edge-resize behavior (drag left edge to resize)
- ✅ **Frontend Content Display** - Load and display your frontend content in an iframe
- ✅ **Responsive Content Resizing** - Content smoothly adjusts as sidebar is resized
- ✅ **Fullscreen Mode** - Automatically adapts to full webpage layout when sidebar is wide (90% viewport)
- ✅ **AI-Powered Chat** - Integrated with Google Gemini for intelligent responses
- ✅ **RAG Pipeline** - Retrieval-Augmented Generation using knowledge base
- ✅ **Semantic Search** - FAISS-based vector similarity search
- ✅ Top navigation with Home, Chat, Plugins, and Settings icons
- ✅ Modern chat interface with text input and send button
- ✅ Scrollable chat area with message bubbles
- ✅ Welcome message on first load
- ✅ LocalStorage persistence for chat history
- ✅ Smooth animations and transitions (0.2s ease)
- ✅ Settings panel with backend configuration
- ✅ Responsive layout
- ✅ Page content smoothly adjusts when sidebar resizes

## 🚀 Installation

### Prerequisites

- **Python 3.8+** installed on your system
- **Microsoft Edge** browser (version 114+)
- **Google Gemini API Key** (get one from https://aistudio.google.com/app/apikey)

### Step 1: Set Up Backend

1. **Navigate to Backend Directory**:
   ```bash
   cd Soc_Backend
   ```

2. **Create Virtual Environment** (recommended):
   ```bash
   python -m venv venv
   
   # On Windows:
   venv\Scripts\activate
   
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure Environment**:
   - Create a `.env` file in the `Soc_Backend` directory:
   ```bash
   # Create .env file
   echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
   ```
   - Replace `your_actual_api_key_here` with your actual Gemini API key

5. **Start Backend Server**:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
   The backend will be running at `http://localhost:8000`

### Step 2: Generate Icons

The extension requires PNG icon files. You have two options:

#### Option A: Browser-Based (Recommended)
1. Open `create-icons.html` in Microsoft Edge or any modern browser
2. Click each button to download the required PNG icons (16x16, 32x32, 48x48, 128x128)
3. Move the downloaded files to the `icons/` folder:
   - `icon16.png`
   - `icon32.png`
   - `icon48.png`
   - `icon128.png`

#### Option B: Manual Conversion
Convert `icons/icon.svg` to PNG format at the required sizes (16, 32, 48, 128 pixels) using any image editor or online converter.

### Step 3: Load Extension in Edge

1. Open Microsoft Edge
2. Navigate to `edge://extensions/`
3. Enable **Developer mode** (toggle in bottom left)
4. Click **Load unpacked**
5. Select the extension folder (this directory)
6. The extension is now installed!

## 🎯 Usage

### Loading Frontend Content

1. **Open the Sidebar**: Click the extension icon in the Edge toolbar
2. **Switch to Content Tab**: Click the "Content" tab in the sidebar
3. **Enter URL**: Type the URL or path to your frontend content
4. **Load**: Click "Load" or press Enter
5. **Resize**: Drag the left edge of the sidebar to resize - content will adjust smoothly
6. **Fullscreen**: Drag the sidebar very wide (90% of viewport) to activate fullscreen mode - content adapts to full webpage layout

### Responsive Content Behavior

- **During Resize**: Content smoothly stretches/shrinks as you drag the sidebar
- **Fullscreen Mode**: When sidebar width exceeds 90% of viewport, content automatically adapts to behave like a full webpage layout
- **Smooth Transitions**: All content adjustments use 0.2s ease transitions

**For Best Results**: Include `content-helper.js` in your frontend HTML to enable automatic responsive adjustments:
```html
<script src="chrome-extension://YOUR_EXTENSION_ID/content-helper.js"></script>
```

Or add this to your frontend JavaScript:
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type === 'sidebar-resize') {
    // Adjust your layout based on event.data.width and event.data.isFullscreen
  }
});
```

## 🎯 Usage (Chat)

### Opening the Sidebar

1. **Via Toolbar Button**: Click the extension icon in the Edge toolbar
2. **Via Popup**: Click the extension icon, then click "Open Sidebar" in the popup

### Sidebar Features

- **Resize**: Drag the left edge of the sidebar to adjust width (280px - 800px)
- **Minimize**: Click the minimize button (top-left) to collapse the sidebar
- **Chat**: Type a message and press Enter or click Send
- **Navigation**: Use the top navigation buttons (Home, Chat, Plugins, Settings)
- **Settings**: Click the Settings icon to open the settings panel

### Backend Configuration

1. **Open Settings**: Click the Settings icon in the top navigation
2. **Enter Backend URL**: The default is `http://localhost:8000`
3. **Customize**: Change the URL if your backend is running on a different address
4. **Save**: Changes are saved automatically to localStorage

### Chat History

- All conversations are automatically saved to localStorage
- Chat history persists across browser sessions
- To clear history, use the Settings panel (or clear browser data)

## 📁 Project Structure

```
soc-frontend-extension/
├── manifest.json          # Extension manifest (MV3)
├── background.js          # Service worker
├── sidebar.html           # Sidebar page HTML
├── sidebar.js             # React sidebar component (JSX compiled)
├── sidebar.jsx            # React sidebar component source
├── sidebar.css            # Stylesheet
├── popup.html             # Extension popup launcher
├── icons/                 # Extension icons
│   ├── icon.svg           # Source SVG icon
│   ├── icon16.png         # 16x16 icon (generate this)
│   ├── icon32.png         # 32x32 icon (generate this)
│   ├── icon48.png         # 48x48 icon (generate this)
│   └── icon128.png        # 128x128 icon (generate this)
├── create-icons.html      # Browser-based icon generator
├── generate-icons.js      # Node.js icon generator (optional)
├── generate-icons.ps1     # PowerShell icon generator (optional)
└── Soc_Backend/           # Backend API (FastAPI + Gemini)
    ├── main.py            # FastAPI application (main entry point)
    ├── llm_client.py      # Gemini LLM client
    ├── embed_client.py    # Embedding client
    ├── rag_pipeline.py    # RAG pipeline
    ├── kb_loader.py       # Knowledge base loader
    ├── requirements.txt   # Python dependencies
    ├── .env               # Environment variables (create this)
    └── data/
        └── soc_kb.txt     # SOC knowledge base
```

## 🛠️ Technical Details

### Technologies

**Frontend:**
- **React 18** (via CDN with Babel standalone for JSX)
- **Plain CSS** (CSS variables for theming)
- **Edge Extension API** (Manifest V3)
- **LocalStorage** (for chat persistence)

**Backend:**
- **FastAPI** (Python web framework)
- **Google Gemini AI** (LLM for responses)
- **Sentence Transformers** (for embeddings)
- **FAISS** (vector similarity search)
- **RAG Pipeline** (Retrieval-Augmented Generation)

### Browser Compatibility

- Microsoft Edge (Chromium-based)
- Requires Edge version that supports `sidePanel` API (Edge 114+)

### Build Requirements

- **No build tools required!** The extension runs directly in the browser
- React and Babel are loaded via CDN
- All code is processed client-side

## 🎨 Customization

### Changing Colors

Edit CSS variables in `sidebar.css`:

```css
:root {
  --primary-color: #0078d4;      /* Primary blue */
  --primary-hover: #106ebe;       /* Hover blue */
  --bg-primary: #ffffff;          /* Background */
  --text-primary: #323130;        /* Text color */
  /* ... more variables */
}
```

### AI Integration Status

✅ **AI integration is already configured!** The extension is connected to the SOC Backend which uses:
- Google Gemini 1.5 Flash for generating responses
- RAG (Retrieval-Augmented Generation) for enhanced answers
- FAISS vector search for knowledge base retrieval
- Sentence transformers for semantic search

The backend provides intelligent SOC-related assistance using the knowledge base.

### Adding Plugins/Tools

1. Update the Plugins button click handler in `sidebar.jsx`
2. Create a plugins panel component (similar to SettingsPanel)
3. Add plugin functionality as needed

### Modifying Sidebar Width

Default width is set in `sidebar.css`:

```css
--sidebar-width: 380px;
--sidebar-min-width: 280px;
--sidebar-max-width: 800px;
```

## 🐛 Troubleshooting

### Sidebar doesn't open
- Ensure Developer mode is enabled in Edge
- Check that all icon files exist in the `icons/` folder
- Reload the extension: `edge://extensions/` → Reload button

### Icons not showing
- Generate PNG icons using `create-icons.html`
- Verify all 4 icon sizes are present in `icons/` folder
- Check file names match exactly: `icon16.png`, `icon32.png`, etc.

### Chat history not persisting
- Check browser permissions for localStorage
- Ensure you're not in private/incognito mode (localStorage disabled)

### Resize not working
- Ensure you're dragging from the leftmost edge of the sidebar
- Try refreshing the sidebar page

### Backend not responding
- Verify the backend server is running: `http://localhost:8000`
- Check that `uvicorn main:app --reload` was started successfully
- Verify `.env` file exists in `Soc_Backend/` directory with valid `GEMINI_API_KEY`
- Check backend terminal for error messages
- Test backend directly: `curl http://localhost:8000/` or open in browser
- Verify backend URL in Settings panel matches your server address

### API key errors
- Ensure you have a valid Gemini API key from https://aistudio.google.com/app/apikey
- Check `.env` file has the correct format: `GEMINI_API_KEY=your_key_here`
- No quotes needed around the API key value
- Restart the backend server after updating `.env`

### Extension can't connect to backend
- Check browser console (F12) for CORS errors
- Verify `main.py` has CORS middleware configured
- Ensure backend is running on the correct port (default: 8000)
- Try testing the backend endpoint with curl or Postman

## 📝 Development

### Making Changes

1. Edit files directly (no build step needed)
2. Reload extension in `edge://extensions/`
3. Refresh sidebar page to see changes

### Testing

- Use Edge DevTools (F12) to inspect the sidebar
- Check Console for any errors
- Test localStorage in Application tab

## 🔐 Permissions

The extension uses the following permissions:

- `sidePanel`: Required for sidebar functionality
- `storage`: For localStorage access
- `tabs`: To interact with browser tabs
- `<all_urls>`: Optional, for potential content script features

## 📄 License

This extension is provided as-is for demonstration and development purposes.

## 🎯 Next Steps

To make this production-ready:

1. ✅ **AI Integration**: Already implemented with Gemini + RAG pipeline
2. **Add Plugins**: Implement actual plugin functionality
3. **Error Handling**: Enhance error handling and user feedback
4. **Themes**: Add dark mode and theme customization
5. **Export**: Add conversation export functionality
6. **Search**: Add search within chat history
7. **Multi-chat**: Support multiple chat conversations/tabs
8. **Security**: Implement authentication for production deployment
9. **Performance**: Optimize embedding and search performance
10. **Monitoring**: Add logging and analytics

---

**Ready to use!** Follow the installation steps above to set up the backend and load the extension into Edge.

