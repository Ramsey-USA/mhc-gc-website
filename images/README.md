# MH Construction Website - Placeholder Images

This directory contains placeholder images for the MH Construction website. In production, these should be replaced with actual high-quality images.

## Required Images

### Logo & Branding
- `mh-logo.png` - Main company logo (transparent background)
- `mh-logo-white.png` - White version for dark backgrounds

### Hero Section
- `hero/summers-hub-timelapse.mp4` - Main hero video (1920x1080, <10MB)
- `hero/hero-fallback.jpg` - Fallback image for video

### Team Photos
- `team/ceo.jpg` - CEO headshot
- `team/coo.jpg` - COO headshot
- `team/john-doe.jpg` - Project Manager
- `team/jane-smith.jpg` - Lead Architect
- `team/mike-johnson.jpg` - Construction Supervisor
- `team/sarah-williams.jpg` - Estimator
- `team/robert-davis.jpg` - Safety Manager
- `team/lisa-martinez.jpg` - Interior Design Specialist

### Project Photos
- `projects/summers-hub/` - Summer's Hub project images
- `projects/fire-station/` - Fire station project images
- `projects/luxury-home/` - Luxury home project images
- `projects/commercial-plaza/` - Commercial plaza images
- `projects/historic-renovation/` - Historic renovation images
- `projects/industrial-facility/` - Industrial facility images

### About Page
- `about/company-story.jpg` - Company story image
- `about/innovation.jpg` - Innovation and technology image
- `about/service-area-map.jpg` - Service area map

### Certifications & Awards
- `certifications/leed.png` - LEED certification logo
- `certifications/osha.png` - OSHA certification logo
- `certifications/veteran.png` - Veteran-owned certification
- `certifications/excellence.png` - Excellence award logo

### Blog Images
- `blog/construction-technology.jpg` - Technology blog header
- `blog/summers-hub-blog.jpg` - Summer's Hub blog image
- `blog/veteran-excellence.jpg` - Veteran excellence blog image
- `blog/sustainable-building.jpg` - Sustainable building blog image
- `blog/safety-culture.jpg` - Safety culture blog image

### Contact Page
- `contact/service-area-map.jpg` - Service area map for contact page

### Icons
- `icons/` - Various UI icons and value icons

## Image Requirements

### Quality Standards
- All images should be high-resolution (minimum 1920px wide for hero images)
- Use WebP format where possible for better compression
- Provide fallback formats (JPEG/PNG) for compatibility
- Optimize images for web (compressed but high quality)

### Naming Convention
- Use lowercase letters and hyphens for file names
- Include descriptive names that match content
- Use consistent naming patterns across similar image types

### Alt Text Requirements
All images should have descriptive alt text for accessibility:
- Describe the content and context of the image
- Keep alt text concise but informative
- Don't start with "Image of" or "Picture of"

## Optimization Notes

### Performance
- Images over 100KB should be optimized
- Consider using progressive JPEG for large images
- Implement lazy loading for below-the-fold images
- Use appropriate image sizes for different breakpoints

### Responsive Images
- Provide multiple image sizes for different screen densities
- Use srcset and sizes attributes for responsive images
- Consider using CSS background images for decorative elements

### Video Requirements
- Hero video should be optimized for web playback
- Provide multiple formats (MP4, WebM) for browser compatibility
- Include poster image for video loading state
- Ensure video is muted and set to autoplay