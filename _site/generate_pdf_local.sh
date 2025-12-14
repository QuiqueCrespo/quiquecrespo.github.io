#!/bin/bash
# Local PDF Generation Script
# Use this to test the LaTeX CV compilation before pushing to GitHub

set -e

echo "🔨 Building Jekyll site..."
bundle exec jekyll build

echo "📄 Compiling LaTeX CV to PDF..."
cd _site/assets/pdf

# Check if latexmk is installed
if ! command -v latexmk &> /dev/null; then
    echo "❌ Error: latexmk not found. Please install LaTeX:"
    echo "   macOS:   brew install --cask mactex"
    echo "   Ubuntu:  sudo apt-get install texlive-full"
    exit 1
fi

# Compile the CV
latexmk -pdf -file-line-error -interaction=nonstopmode cv.tex

# Move to assets directory
echo "📦 Moving PDF to assets..."
cd ../../..
mkdir -p assets
cp _site/assets/pdf/cv.pdf assets/cv.pdf

echo "✅ PDF generated successfully at: assets/cv.pdf"
echo "   You can now view it at: http://localhost:4000/assets/cv.pdf"
