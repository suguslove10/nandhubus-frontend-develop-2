# Image Optimization Guide for Nandhubus Frontend

This document provides guidelines and best practices for optimizing images in the Nandhubus frontend application to improve performance.

## Key Performance Issues Addressed

- Slow page loading times
- High bandwidth usage
- Poor Lighthouse scores
- Reduced SEO performance

## Implemented Solutions

### 1. Next.js Image Optimization Configuration

We've updated the Next.js configuration to enable more advanced image optimization settings:

```typescript
// next.config.ts
images: {
  remotePatterns: [...],
  domains: [...],
  formats: ['image/webp', 'image/avif'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentDispositionType: 'attachment',
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
}
```

### 2. OptimizedImage Component

We've created a reusable `OptimizedImage` component that wraps Next.js Image with best practices:

- Responsive sizing
- Error handling
- Optimized quality settings
- WebP and AVIF format support
- Lazy loading for below-the-fold images
- Priority loading for above-the-fold images
- Placeholder/blur-up technique

### 3. Image Optimization Script

We've added a Node.js script to optimize static images in the public directory:
- Resize large images
- Convert images to optimized JPEG, WebP, and AVIF formats
- Reduce file size while maintaining visual quality

## Best Practices for Developers

### 1. Always Use OptimizedImage Component

Instead of using standard `img` tags or even Next.js `Image` directly, use our `OptimizedImage` component:

```jsx
import OptimizedImage from "@/components/ui/OptimizedImage";

// Good
<OptimizedImage
  src={imageUrl}
  alt="Descriptive alt text"
  fill
  className="object-cover"
  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
  priority={isAboveTheFold}
  quality={75}
  placeholder="blur"
/>

// Bad
<img src={imageUrl} alt="..." />
```

### 2. Set Proper Sizes Attribute

The `sizes` attribute tells the browser what size the image will be displayed at different viewport widths:

```jsx
// For full-width images
sizes="100vw"

// For responsive grid layouts
sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"

// For fixed-width images
sizes="300px"
```

### 3. Use Priority for Above-the-Fold Images

Images visible when the page first loads should use the `priority` attribute:

```jsx
<OptimizedImage
  src={heroImage}
  alt="Hero banner"
  priority={true}
  // ...
/>
```

### 4. Use Proper Image Dimensions

- Don't use unnecessarily large images
- Specify the correct width and height attributes when not using `fill`
- Use the `fill` property with a parent container for responsive images

### 5. Optimize New Static Assets

When adding new images to the project:

1. Optimize them before adding to the repository
2. Use the `npm run optimize-images` script
3. Consider using WebP or AVIF formats when possible

### 6. Use Proper Alt Text

All images should have descriptive alt text for accessibility and SEO:

```jsx
// Good
<OptimizedImage src={busImage} alt="Luxury 40-seater air-conditioned bus" />

// Bad
<OptimizedImage src={busImage} alt="bus" />
<OptimizedImage src={busImage} alt="" />
```

### 7. Lazy Load Below-the-Fold Images

Images not visible on initial page load should not use the `priority` attribute, allowing them to lazy load:

```jsx
<OptimizedImage
  src={imageUrl}
  alt="Description"
  loading="lazy" // This is the default in our component
  // ...
/>
```

### 8. Use Placeholders for Better UX

For a better user experience, use placeholder blurs while images load:

```jsx
<OptimizedImage
  src={imageUrl}
  alt="Description"
  placeholder="blur"
  blurDataURL={dataUrl} // Optional, component will generate one if not provided
  // ...
/>
```

## Performance Monitoring

After implementing these optimizations, monitor performance using:

1. Lighthouse in Chrome DevTools
2. Core Web Vitals in Google Search Console
3. Web Vitals library for real user monitoring
4. PageSpeed Insights for regular testing

## Image CDN Consideration

For further optimization, consider using an image CDN:

- Cloudinary
- Imgix
- Cloudflare Images
- Vercel Image Optimization (if deployed on Vercel)

## Additional Resources

- [Next.js Image Optimization Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Web.dev Image Optimization Guide](https://web.dev/articles/choose-the-right-image-format)
- [Sharp Documentation](https://sharp.pixelplumbing.com/) 