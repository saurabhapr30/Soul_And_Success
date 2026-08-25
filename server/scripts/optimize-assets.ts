import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { imageOptimizationService } from '../src/services/imageOptimizationService';

const ASSETS_DIR = path.resolve(__dirname, '../../src/assets');
const UPLOADS_DIR = path.resolve(__dirname, '../uploads');

interface OptimizeStats {
  file: string;
  originalSize: number;
  optimizedSize: number;
  savedPercent: number;
}

async function optimizeUploads(): Promise<OptimizeStats[]> {
  const stats: OptimizeStats[] = [];
  if (!fs.existsSync(UPLOADS_DIR)) return stats;

  const entries = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

    const fullPath = path.join(UPLOADS_DIR, entry.name);
    const origSize = fs.statSync(fullPath).size;

    const result = await imageOptimizationService.optimizeUploadedImage(fullPath, entry.name);
    const optPath = path.join(UPLOADS_DIR, 'optimized', `${path.parse(entry.name).name}.webp`);

    let optSize = origSize;
    if (fs.existsSync(optPath)) {
      optSize = fs.statSync(optPath).size;
    }

    const saved = origSize > 0 ? ((origSize - optSize) / origSize) * 100 : 0;
    stats.push({
      file: `uploads/${entry.name}`,
      originalSize: origSize,
      optimizedSize: optSize,
      savedPercent: Math.max(0, Math.round(saved)),
    });
  }

  return stats;
}

async function optimizeSrcAssets(): Promise<OptimizeStats[]> {
  const stats: OptimizeStats[] = [];
  if (!fs.existsSync(ASSETS_DIR)) return stats;

  const entries = fs.readdirSync(ASSETS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    // Only optimize raster assets > 50KB, skip SVGs or small icons
    if (!['.png', '.jpg', '.jpeg'].includes(ext)) continue;
    if (entry.name.includes('signature') || entry.name.endsWith('.svg')) continue;

    const fullPath = path.join(ASSETS_DIR, entry.name);
    const origSize = fs.statSync(fullPath).size;
    if (origSize < 50 * 1024) continue; // Skip tiny icons

    const parsed = path.parse(entry.name);
    const outWebpPath = path.join(ASSETS_DIR, `${parsed.name}.webp`);

    try {
      const metadata = await sharp(fullPath).metadata();
      const origWidth = metadata.width || 1200;
      
      // Limit max dimension to 2400px to prevent monstrous 8000px raw figma exports
      const maxDim = 2400;
      let pipeline = sharp(fullPath).rotate();
      if (origWidth > maxDim) {
        pipeline = pipeline.resize({ width: maxDim, withoutEnlargement: true });
      }

      await pipeline
        .webp({ quality: 84, alphaQuality: 88, effort: 4 })
        .toFile(outWebpPath);

      const optSize = fs.statSync(outWebpPath).size;
      const saved = origSize > 0 ? ((origSize - optSize) / origSize) * 100 : 0;

      stats.push({
        file: `src/assets/${entry.name} -> ${parsed.name}.webp`,
        originalSize: origSize,
        optimizedSize: optSize,
        savedPercent: Math.max(0, Math.round(saved)),
      });
    } catch (err) {
      console.error(`Error optimizing asset ${entry.name}:`, err);
    }
  }

  return stats;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function run() {
  console.log('==============================================');
  console.log('STARTING PRODUCTION IMAGE OPTIMIZATION RUN');
  console.log('==============================================\n');

  console.log('1. Optimizing uploaded images in server/uploads/ ...');
  const uploadStats = await optimizeUploads();
  for (const s of uploadStats) {
    console.log(`  ✓ [${s.savedPercent}% saved] ${s.file}: ${formatBytes(s.originalSize)} -> ${formatBytes(s.optimizedSize)}`);
  }

  console.log('\n2. Optimizing bundled Figma assets in src/assets/ ...');
  const assetStats = await optimizeSrcAssets();
  for (const s of assetStats) {
    console.log(`  ✓ [${s.savedPercent}% saved] ${s.file}: ${formatBytes(s.originalSize)} -> ${formatBytes(s.optimizedSize)}`);
  }

  const allStats = [...uploadStats, ...assetStats];
  const totalOrig = allStats.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalOpt = allStats.reduce((acc, curr) => acc + curr.optimizedSize, 0);
  const totalSaved = totalOrig > 0 ? ((totalOrig - totalOpt) / totalOrig) * 100 : 0;

  console.log('\n==============================================');
  console.log(`OPTIMIZATION SUMMARY:`);
  console.log(`Total Images Processed: ${allStats.length}`);
  console.log(`Original Total Size:    ${formatBytes(totalOrig)}`);
  console.log(`Optimized Total Size:   ${formatBytes(totalOpt)}`);
  console.log(`Total Bandwidth Saved:  ${totalSaved.toFixed(1)}% (${formatBytes(totalOrig - totalOpt)})`);
  console.log('==============================================');
}

run().catch((err) => {
  console.error('Optimization failed:', err);
  process.exit(1);
});
