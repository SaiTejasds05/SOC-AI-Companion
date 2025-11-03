# PowerShell script to download React libraries for the extension
Write-Host "Downloading React libraries..."

# Download React
Write-Host "Downloading React..."
Invoke-WebRequest -Uri "https://unpkg.com/react@18/umd/react.production.min.js" -OutFile "react.min.js"

# Download ReactDOM
Write-Host "Downloading ReactDOM..."
Invoke-WebRequest -Uri "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" -OutFile "react-dom.min.js"

# Download Babel Standalone
Write-Host "Downloading Babel Standalone..."
Invoke-WebRequest -Uri "https://unpkg.com/@babel/standalone/babel.min.js" -OutFile "babel.min.js"

Write-Host "All libraries downloaded successfully!"
Write-Host "Files created: react.min.js, react-dom.min.js, babel.min.js"

