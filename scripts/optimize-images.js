// This script optimizes images in the public directory
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// Directories to process
const DIRS_TO_PROCESS = ['public/assests'];

// Output directory for optimized images
const OPTIMIZED_DIR = 'public/assests/optimized';

// Create optimized directory if it doesn't exist
if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

// Image formats to process
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

// Size thresholds for optimization (in bytes)
const SIZE_THRESHOLD = 500 * 1024; // 500KB

// Target quality for JPEG and WebP
const JPEG_QUALITY = 80;
const WEBP_QUALITY = 75;
const AVIF_QUALITY = 60;

// Maximum dimensions
const MAX_WIDTH = 1920;
const MAX_HEIGHT = 1080;

// Function to process a single image
async function processImage(imagePath) {
  try {
    const stats = await stat(imagePath);
    const ext = path.extname(imagePath).toLowerCase();
    
    // Skip if not an image or below threshold
    if (!IMAGE_EXTENSIONS.includes(ext) || stats.size < SIZE_THRESHOLD) {
      return;
    }
    
    console.log(`Processing: ${imagePath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
    // Get image dimensions
    const metadata = await sharp(imagePath).metadata();
    
    // Determine if resizing is needed
    const needsResize = metadata.width > MAX_WIDTH || metadata.height > MAX_HEIGHT;
    
    // Base filename for outputs
    const baseName = path.basename(imagePath, ext);
    const outputBasePath = path.join(OPTIMIZED_DIR, baseName);
    
    // Start with the sharp instance
    let sharpInstance = sharp(imagePath);
    
    // Resize if needed
    if (needsResize) {
      sharpInstance = sharpInstance.resize({
        width: Math.min(metadata.width, MAX_WIDTH),
        height: Math.min(metadata.height, MAX_HEIGHT),
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    // Create optimized JPEG
    await sharpInstance
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(`${outputBasePath}.jpg`);
      
    // Create WebP version
    await sharpInstance
      .webp({ quality: WEBP_QUALITY })
      .toFile(`${outputBasePath}.webp`);
      
    // Create AVIF version (if supported by sharp)
    try {
      await sharpInstance
        .avif({ quality: AVIF_QUALITY })
        .toFile(`${outputBasePath}.avif`);
    } catch (e) {
      console.log('AVIF conversion not supported or failed');
    }
    
    // Log savings
    const optimizedJpeg = await stat(`${outputBasePath}.jpg`);
    const optimizedWebp = await stat(`${outputBasePath}.webp`);
    
    console.log(`Original: ${(stats.size / 1024).toFixed(2)} KB`);
    console.log(`Optimized JPEG: ${(optimizedJpeg.size / 1024).toFixed(2)} KB (${Math.round((1 - optimizedJpeg.size / stats.size) * 100)}% reduction)`);
    console.log(`WebP: ${(optimizedWebp.size / 1024).toFixed(2)} KB (${Math.round((1 - optimizedWebp.size / stats.size) * 100)}% reduction)`);
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Main function to process all images
async function optimizeImages() {
  for (const dir of DIRS_TO_PROCESS) {
    try {
      const files = await readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const fileStat = await stat(filePath);
        
        if (fileStat.isDirectory()) {
          // Skip the optimized directory itself
          if (filePath === OPTIMIZED_DIR) continue;
          
          // Process subdirectories recursively
          DIRS_TO_PROCESS.push(filePath);
        } else {
          await processImage(filePath);
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${dir}:`, error);
    }
  }
  
  console.log('Image optimization complete!');
}

// Run the optimization
optimizeImages().catch(console.error); 