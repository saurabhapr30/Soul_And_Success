import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { optimizedUploadsDir, uploadsDir } from '../utils/uploadPaths';

export interface ImageVariant {
  width: number;
  height: number;
  url: string;
}

export interface OptimizedImageResult {
  originalUrl: string;
  optimizedUrl: string;
  srcSet: string;
  width: number;
  height: number;
  variants: ImageVariant[];
}

const RESPONSIVE_WIDTHS = [400, 800, 1200, 1600, 1920];

export class ImageOptimizationService {
  private uploadsDir: string;
  private optimizedDir: string;

  constructor() {
    this.uploadsDir = uploadsDir;
    this.optimizedDir = optimizedUploadsDir;
    this.ensureDirectory(this.optimizedDir);
  }

  private ensureDirectory(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Optimizes an uploaded image file: generates responsive WebP variants and a master optimized WebP.
   */
  async optimizeUploadedImage(
    inputFilePath: string,
    filename: string
  ): Promise<OptimizedImageResult> {
    this.ensureDirectory(this.optimizedDir);

    const parsed = path.parse(filename);
    const baseName = parsed.name;
    const originalUrl = `/uploads/${filename}`;

    try {
      const metadata = await sharp(inputFilePath).metadata();
      const origWidth = metadata.width || 1200;
      const origHeight = metadata.height || 800;

      // 1. Generate master optimized WebP (capped at original dimensions or max 2400px)
      const masterWebpFilename = `${baseName}.webp`;
      const masterWebpPath = path.join(this.optimizedDir, masterWebpFilename);

      await sharp(inputFilePath)
        .rotate() // auto-orient based on EXIF
        .webp({ quality: 82, alphaQuality: 85, effort: 4 })
        .toFile(masterWebpPath);

      const variants: ImageVariant[] = [];
      const srcSetParts: string[] = [];

      // 2. Generate responsive variants for widths smaller than or equal to original
      const targetWidths = RESPONSIVE_WIDTHS.filter(
        (w) => w <= origWidth * 1.05
      );

      // If original is smaller than 400, include original width as a variant
      if (targetWidths.length === 0) {
        targetWidths.push(origWidth);
      }

      for (const width of targetWidths) {
        const variantFilename = `${baseName}-${width}.webp`;
        const variantPath = path.join(this.optimizedDir, variantFilename);
        const variantUrl = `/uploads/optimized/${variantFilename}`;

        const scaledHeight = Math.round((origHeight / origWidth) * width);

        // Only generate if not already exists or updated
        if (!fs.existsSync(variantPath)) {
          await sharp(inputFilePath)
            .rotate()
            .resize({
              width,
              withoutEnlargement: true,
              fit: 'inside',
            })
            .webp({ quality: 82, alphaQuality: 85, effort: 4 })
            .toFile(variantPath);
        }

        variants.push({
          width,
          height: scaledHeight,
          url: variantUrl,
        });

        srcSetParts.push(`${variantUrl} ${width}w`);
      }

      const optimizedUrl = `/uploads/optimized/${masterWebpFilename}`;

      return {
        originalUrl,
        optimizedUrl,
        srcSet: srcSetParts.join(', '),
        width: origWidth,
        height: origHeight,
        variants,
      };
    } catch (err) {
      console.error(`Failed to optimize image: ${filename}`, err);
      // Graceful fallback to original URL
      return {
        originalUrl,
        optimizedUrl: originalUrl,
        srcSet: '',
        width: 0,
        height: 0,
        variants: [],
      };
    }
  }

  /**
   * Helper to derive optimized WebP URL for a given relative or absolute uploaded image URL.
   */
  getOptimizedUrl(url: string, width?: number): string {
    if (!url) return '';
    const trimmed = url.trim().replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/?/, '/');
    if (!trimmed.startsWith('/uploads/') && !trimmed.startsWith('uploads/')) {
      return trimmed;
    }

    const clean = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
    if (clean.includes('/uploads/optimized/')) {
      return clean;
    }

    const filename = path.basename(clean);
    const parsed = path.parse(filename);

    if (width) {
      const candidate = `/uploads/optimized/${parsed.name}-${width}.webp`;
      return candidate;
    }

    return `/uploads/optimized/${parsed.name}.webp`;
  }
}

export const imageOptimizationService = new ImageOptimizationService();
