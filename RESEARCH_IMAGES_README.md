# Research Publication Images Guide

The research section now supports **both PDF and PNG/JPG images** for publication previews.

## Automatic Format Detection

The research widget automatically detects the file format based on the extension in `_data/research.yaml`:

```yaml
projects:
  - title: My Paper
    gif: assets/img/paper_diagram.pdf    # Will use PDF viewer

  - title: Another Paper
    gif: assets/img/preview.png          # Will use standard image
```

## Supported Formats

### PDF Files (`.pdf`)
- **Pros**: Vector graphics, sharp at any zoom, small file size
- **Cons**: Browser compatibility varies, may not display in all browsers
- **Rendering**: Uses `<object>` and `<embed>` tags with fallback
- **Best for**: Diagrams, plots, vector graphics

### Image Files (`.png`, `.jpg`, `.gif`)
- **Pros**: Universal browser support, reliable display
- **Cons**: Raster graphics, may look blurry when zoomed
- **Rendering**: Uses standard `<img>` tag
- **Best for**: Screenshots, photos, rasterized graphics

## Recommended Approach

**Option 1: Use PNG (Recommended for maximum compatibility)**
- Provides the best cross-browser experience
- Displays consistently across all devices
- No special rendering required

**Option 2: Use PDF (For vector graphics)**
- Ideal if your diagram is vector-based
- Smaller file size for complex diagrams
- May not display in older browsers

**Option 3: Provide both**
- Keep the PDF in your repo for archival
- Convert to PNG for the website
- Update `research.yaml` to point to the PNG

## Converting PDF to PNG

If you have a PDF and want to convert it to PNG for better compatibility:

### Using the Helper Script

```bash
./convert_pdf_to_png.sh assets/img/your_diagram.pdf
```

This will create `assets/img/your_diagram.png` with high quality (300 DPI).

### Manual Conversion

**Using ImageMagick (Command Line):**
```bash
# Install ImageMagick
brew install imagemagick  # macOS
# sudo apt install imagemagick  # Ubuntu

# Convert (first page only, 300 DPI)
convert -density 300 -quality 90 input.pdf[0] output.png
```

**Using Online Tools:**
- [PDF2PNG.com](https://pdf2png.com/)
- [Zamzar](https://www.zamzar.com/convert/pdf-to-png/)
- [CloudConvert](https://cloudconvert.com/pdf-to-png)

**Using Preview (macOS):**
1. Open PDF in Preview
2. File → Export
3. Format: PNG
4. Resolution: 300 DPI or higher

## Image Sizing Recommendations

For optimal display in the research section:
- **Width**: 800-1200 pixels
- **Height**: 400-600 pixels
- **Aspect ratio**: ~2:1 or 16:9
- **DPI**: 150-300 for PNG/JPG
- **File size**: Keep under 500KB

## Styling

The site automatically applies appropriate styling:

**For Images:**
- 1px border
- Responsive width (100%)
- Rounded corners
- Auto height

**For PDFs:**
- Fixed height preview (300px)
- Border matching site theme
- Dark mode inversion (for readability)
- Fallback link if preview fails

## Dark Mode Handling

**Images**: No automatic inversion (assumed to have appropriate colors)

**PDFs**: Automatically inverted in dark mode for better readability
- If your PDF has dark backgrounds, consider using PNG instead
- Or provide separate light/dark versions

## Example: Adding a Publication

```yaml
- title: My Amazing Research
  system-name: MySystem
  gif: assets/img/my_paper_diagram.png  # or .pdf
  conference: ICLR 2026
  conference-web: https://iclr.cc/
  authors: John Doe, <u>Your Name</u>, Jane Smith
  pdf: assets/papers/my_paper.pdf
  code: https://github.com/user/repo
  abstract-less: Short preview of the abstract...
  abstract-more: Full abstract continuation here.
  tag: my-paper-tag
  category: Symbolic AI
```

## Troubleshooting

### PDF not displaying
- **Solution 1**: Convert to PNG using the script above
- **Solution 2**: Check browser console for errors
- **Solution 3**: Ensure PDF file path is correct

### Image looks blurry
- Use higher resolution source (300 DPI)
- Ensure original width is at least 800px
- Use PNG instead of JPG for diagrams

### File too large
- Compress PNG: [TinyPNG](https://tinypng.com/)
- Compress JPG: Reduce quality to 85-90%
- Consider using PDF for vector graphics

### Wrong aspect ratio
- Crop image to ~2:1 or 16:9
- Use consistent sizing across all publications
- The container is responsive and will scale appropriately

## File Organization

Recommended structure:
```
assets/
├── img/
│   ├── paper1_preview.png
│   ├── paper2_preview.pdf
│   └── paper3_diagram.png
└── papers/
    ├── paper1_full.pdf
    ├── paper2_full.pdf
    └── paper3_full.pdf
```

## Notes

- The `gif` field name is historical (originally for GIFs) but now accepts any image format
- PDF embedding requires browser support for `<object>` tags
- Consider your target audience's likely browser when choosing formats
- PNG is the safest choice for maximum compatibility
