// Simple script to generate PNG icons from SVG
// Run with: node generate-icons.js
// Requires: npm install canvas (or use browser-based create-icons.html)

const fs = require('fs');
const path = require('path');

// For now, create a simple note file
// Users can use create-icons.html in browser or convert manually
const note = `PNG icons needed:
- icon16.png (16x16)
- icon32.png (32x32)  
- icon48.png (48x48)
- icon128.png (128x128)

Use create-icons.html in a browser to generate these, or convert icons/icon.svg manually.`;

fs.writeFileSync(path.join(__dirname, 'icons', 'README.txt'), note);

// Try to use canvas if available
try {
  const { createCanvas } = require('canvas');
  
  const sizes = [16, 32, 48, 128];
  
  sizes.forEach(size => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, '#0078d4');
    gradient.addColorStop(1, '#106ebe');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    
    // Draw rounded corners
    ctx.globalCompositeOperation = 'destination-in';
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, size * 0.1875);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    
    // Draw icon (simplified)
    ctx.strokeStyle = 'white';
    ctx.fillStyle = 'white';
    ctx.lineWidth = size / 32;
    
    // Draw layered circles/lines to represent Copilot icon
    const center = size / 2;
    const radius = size * 0.15;
    
    // Main circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw lines/pattern
    ctx.beginPath();
    ctx.moveTo(center - radius * 1.5, center);
    ctx.lineTo(center + radius * 1.5, center);
    ctx.moveTo(center, center - radius * 1.5);
    ctx.lineTo(center, center + radius * 1.5);
    ctx.stroke();
    
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(path.join(__dirname, 'icons', `icon${size}.png`), buffer);
    console.log(`Generated icon${size}.png`);
  });
  
  console.log('All icons generated successfully!');
} catch (e) {
  console.log('Canvas module not available. Use create-icons.html in browser instead.');
  console.log('Or install canvas: npm install canvas');
}

