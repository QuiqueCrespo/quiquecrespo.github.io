#!/bin/bash
# Convert PDF images to PNG for better browser compatibility
# This is optional - the site now supports both PDF and PNG images

if [ "$#" -ne 1 ]; then
    echo "Usage: ./convert_pdf_to_png.sh <pdf_file>"
    echo "Example: ./convert_pdf_to_png.sh assets/img/diagram.pdf"
    exit 1
fi

PDF_FILE="$1"
PNG_FILE="${PDF_FILE%.pdf}.png"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "❌ Error: ImageMagick not found. Please install it:"
    echo "   macOS:   brew install imagemagick"
    echo "   Ubuntu:  sudo apt-get install imagemagick"
    exit 1
fi

echo "🔄 Converting PDF to PNG..."
echo "   Input:  $PDF_FILE"
echo "   Output: $PNG_FILE"

# Convert first page of PDF to PNG with good quality
convert -density 300 -quality 90 "${PDF_FILE}[0]" "$PNG_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Conversion successful!"
    echo ""
    echo "Update your _data/research.yaml:"
    echo "   gif: $PNG_FILE"
else
    echo "❌ Conversion failed!"
    exit 1
fi
