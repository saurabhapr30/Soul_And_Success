const https = require('https');

const baseUrl = 'https://module-looksmart-refused-occur.trycloudflare.com';

function request(method, path, data = null, headers = {}) {
  return new Promise((resolve) => {
    const options = {
      method,
      headers: { ...headers }
    };
    if (data) {
      options.headers['Content-Type'] = 'application/json';
    }
    
    const req = https.request(baseUrl + path, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: body
        });
      });
    });
    
    req.on('error', e => resolve({ status: 500, error: e.message }));
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function run() {
  console.log('Testing Admin Login...');
  const loginRes = await request('POST', '/api/v1/auth/login', {
    email: 'admin@soulandsuccess.com',
    password: 'adminpassword'
  });
  console.log('Login Status:', loginRes.status);
  
  if (loginRes.status !== 200) {
    console.log('Login failed', loginRes.data);
    return;
  }
  
  let token = '';
  try {
    const body = JSON.parse(loginRes.data);
    token = body.data.accessToken;
  } catch(e) {}
  
  if (!token) {
    console.log('No token found in response.');
    return;
  }
  
  const authHeaders = {
    'Authorization': `Bearer ${token}`
  };
  
  console.log('\nTesting Auth APIs...');
  
  const endpoints = [
    '/api/v1/orders',
    '/api/v1/courses',
    '/api/v1/books',
    '/api/v1/products',
    // Find course ID to test enrollments
  ];
  
  for (const ep of endpoints) {
    const res = await request('GET', ep, null, authHeaders);
    console.log(`[${res.status}] ${ep}`);
    if (ep === '/api/v1/courses' && res.status === 200) {
      const data = JSON.parse(res.data);
      if (data.data && data.data.length > 0) {
         const courseId = data.data[0].id;
         console.log(`Testing Course Enrollments for Course ${courseId}...`);
         const er = await request('GET', `/api/v1/courses/${courseId}/enrollments`, null, authHeaders);
         console.log(`[${er.status}] /api/v1/courses/${courseId}/enrollments`);
      }
    }
  }
}
run();
