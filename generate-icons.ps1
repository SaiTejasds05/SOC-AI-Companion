# PowerShell script to generate simple PNG icons
# Run with: .\generate-icons.ps1

$sizes = @(16, 32, 48, 128)
$iconsPath = "icons"

foreach ($size in $sizes) {
    # Create a simple bitmap
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Create gradient effect (simplified to solid color)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(0, 120, 212))
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Draw white icon pattern
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [Math]::Max(1, $size / 32))
    $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    
    $center = $size / 2
    $radius = $size * 0.15
    
    # Draw circle
    $graphics.FillEllipse($whiteBrush, $center - $radius, $center - $radius, $radius * 2, $radius * 2)
    
    # Draw cross lines
    $graphics.DrawLine($pen, $center - $radius * 1.5, $center, $center + $radius * 1.5, $center)
    $graphics.DrawLine($pen, $center, $center - $radius * 1.5, $center, $center + $radius * 1.5)
    
    # Save
    $filePath = Join-Path $iconsPath "icon$size.png"
    $bitmap.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Generated $filePath"
}

Write-Host "All icons generated successfully!"

