const https = require('https');

const baseUrl = 'https://module-looksmart-refused-occur.trycloudflare.com';

const endpoints = [
  '/',
  '/about',
  '/courses',
  '/books',
  '/merchandise',
  '/api/v1/courses',
  '/api/v1/books',
  '/api/v1/products',
  '/api/v1/services',
  '/api/v1/blog',
];

async function checkUrl(path) {
  return new Promise((resolve) => {
    https.get(baseUrl + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          path,
          status: res.statusCode,
          headers: res.headers,
          dataSnippet: data.substring(0, 100).replace(/\n/g, ' ')
        });
      });
    }).on('error', (e) => {
      resolve({ path, status: 500, error: e.message });
    });
  });
}

async function run() {
  console.log('Testing Cloudflare URL...');
  for (const ep of endpoints) {
    const res = await checkUrl(ep);
    console.log(`[${res.status}] ${ep}`);
    if (res.headers && res.headers['access-control-allow-origin']) {
      console.log(`  CORS: ${res.headers['access-control-allow-origin']}`);
    }
  }
}
run();
