const http = require('http');
const path = require('path');

// Run from server directory
const app = require(path.join(__dirname, '../server/dist/app')).default;

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

async function verify() {
  const server = http.createServer(app);
  await new Promise(r => server.listen(0, '127.0.0.1', r));

  try {
    console.log('--- 1. Testing specific failing image URL: /uploads/optimized/image-1787661192204-800.webp ---');
    const res1 = await makeRequest(server, '/uploads/optimized/image-1787661192204-800.webp');
    console.log('Status:', res1.status, 'Content-Type:', res1.headers['content-type'], 'Size:', res1.body.length);

    console.log('\n--- 2. Testing direct full name: /uploads/optimized/image-1787661192204-556247922-800.webp ---');
    const res2 = await makeRequest(server, '/uploads/optimized/image-1787661192204-556247922-800.webp');
    console.log('Status:', res2.status, 'Content-Type:', res2.headers['content-type'], 'Size:', res2.body.length);

    console.log('\n--- 3. Testing master WebP: /uploads/optimized/image-1787661192204-556247922.webp ---');
    const res3 = await makeRequest(server, '/uploads/optimized/image-1787661192204-556247922.webp');
    console.log('Status:', res3.status, 'Content-Type:', res3.headers['content-type'], 'Size:', res3.body.length);

    console.log('\n--- 4. Testing original unoptimized: /uploads/image-1787661192204-556247922.png ---');
    const res4 = await makeRequest(server, '/uploads/image-1787661192204-556247922.png');
    console.log('Status:', res4.status, 'Content-Type:', res4.headers['content-type'], 'Size:', res4.body.length);

    if (res1.status === 200 && res2.status === 200 && res3.status === 200 && res4.status === 200) {
      console.log('\n>>> ALL 4 IMAGE SERVING TESTS PASSED (HTTP 200) <<<');
    } else {
      console.error('\n>>> SOME TESTS FAILED <<<');
      process.exit(1);
    }
  } finally {
    server.close();
  }
}

verify();
