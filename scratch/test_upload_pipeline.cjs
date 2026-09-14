const http = require('http');
const path = require('path');
const fs = require('fs');
const sharp = require(path.join(__dirname, '../server/node_modules/sharp'));

const app = require(path.join(__dirname, '../server/dist/app')).default;
const { imageOptimizationService } = require(path.join(__dirname, '../server/dist/services/imageOptimizationService'));

function makeRequest(server, urlPath) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    http.get(`http://127.0.0.1:${port}${urlPath}`, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: Buffer.concat(chunks)
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  const server = http.createServer(app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));

  const uploadsDir = path.join(__dirname, '../server/uploads');
  const dummyFilename = `test-upload-${Date.now()}-123456789.png`;
  const dummyPath = path.join(uploadsDir, dummyFilename);

  try {
    // 1. Create a sample 1000x800 image
    await sharp({
      create: {
        width: 1000,
        height: 800,
        channels: 4,
        background: { r: 200, g: 100, b: 50, alpha: 1 }
      }
    }).png().toFile(dummyPath);

    console.log('Created dummy test image:', dummyFilename);

    // 2. Optimize it via imageOptimizationService
    const result = await imageOptimizationService.optimizeUploadedImage(dummyPath, dummyFilename);
    console.log('Optimization result:');
    console.log(' - originalUrl:', result.originalUrl);
    console.log(' - optimizedUrl:', result.optimizedUrl);
    console.log(' - srcSet:', result.srcSet);

    // 3. Test HTTP serving for the master optimized WebP
    const resMaster = await makeRequest(server, result.optimizedUrl);
    console.log('Master WebP request status:', resMaster.status, 'Content-Type:', resMaster.headers['content-type']);

    // 4. Test HTTP serving for the 800w variant
    const variant800Url = `/uploads/optimized/test-upload-${dummyFilename.replace('.png', '')}-800.webp`;
    // Wait, the variant URL from result.variants:
    const var800 = result.variants.find(v => v.width === 800);
    console.log('Requesting variant:', var800.url);
    const resVariant = await makeRequest(server, var800.url);
    console.log('Variant 800w request status:', resVariant.status, 'Content-Type:', resVariant.headers['content-type']);

    if (resMaster.status === 200 && resVariant.status === 200) {
      console.log('\n>>> NEW UPLOAD PIPELINE VERIFICATION PASSED (HTTP 200) <<<');
    } else {
      console.error('\n>>> NEW UPLOAD PIPELINE VERIFICATION FAILED <<<');
      process.exit(1);
    }
  } finally {
    server.close();
    // Cleanup dummy files
    if (fs.existsSync(dummyPath)) fs.unlinkSync(dummyPath);
    const optDir = path.join(uploadsDir, 'optimized');
    if (fs.existsSync(optDir)) {
      const files = fs.readdirSync(optDir).filter(f => f.startsWith(`test-upload-`));
      files.forEach(f => fs.unlinkSync(path.join(optDir, f)));
    }
  }
}

run();
