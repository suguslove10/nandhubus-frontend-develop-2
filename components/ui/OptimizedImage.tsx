"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  sizes?: string;
  quality?: number;
  loading?: "lazy" | "eager";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className = "",
  sizes = "100vw",
  quality = 75,
  loading = "lazy",
  placeholder = "empty",
  blurDataURL,
  onClick,
  style,
}: OptimizedImageProps) {
  // Default blur data URL if not provided
  const [localBlurDataURL, setLocalBlurDataURL] = useState<string | undefined>(
    blurDataURL
  );

  // Generate default blur data URL for images without one
  useEffect(() => {
    if (placeholder === "blur" && !blurDataURL) {
      setLocalBlurDataURL("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=");
    }
  }, [placeholder, blurDataURL]);

  // Default sizes for responsive images
  const responsiveSizes = sizes || 
    (fill 
      ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" 
      : "(max-width: 640px) 100vw, (max-width: 768px) 768px, 1280px");

  // Handle errors for better UX
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          ...style
        }}
        onClick={onClick}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      sizes={responsiveSizes}
      quality={quality}
      loading={priority ? "eager" : loading}
      priority={priority}
      placeholder={placeholder as any}
      blurDataURL={localBlurDataURL}
      onError={() => setImgError(true)}
      onClick={onClick}
      style={style}
    />
  );
} 