import axios from 'axios';
import fs from 'fs';
import path from 'path';

const API_URL = 'http://localhost:5000/api/v1';

async function runQA() {
  console.log('--- STARTING BLOG QA ---');
  let token = '';

  // 1. Authenticate as Admin
  try {
    const res = await axios.post(`${API_URL}/auth/login`, {
      email: 'admin@soulandsuccess.com',
      password: 'adminpassword'
    });
    token = res.data.data.accessToken;
    console.log('[PASS] Authentication');
  } catch (err: any) {
    console.error('[FAIL] Authentication', err.response?.data || err.message);
    process.exit(1);
  }

  const authAxios = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  let createdPostId = '';

  // 2. Create Draft with SEO, tags, and gallery
  try {
    const payload = {
      title: 'QA Test Article',
      excerpt: 'This is a test excerpt',
      content: '<p>Hello <b>World</b><script>alert(1)</script></p>',
      status: 'DRAFT',
      tags: [{ name: 'Test' }, { name: 'QA' }],
      seoTitle: 'QA SEO',
      seoKeywords: ['test', 'qa'],
      galleryImages: ['http://example.com/img1.jpg']
    };
    const res = await authAxios.post(`${API_URL}/blog`, payload);
    createdPostId = res.data.data.id;
    console.log('[PASS] Create Draft Blog Post');
    
    // Verify properties
    if (!res.data.data.slug.startsWith('qa-test-article')) throw new Error('Slug not auto-generated correctly');
    if (res.data.data.status !== 'DRAFT') throw new Error('Status not saved correctly');
    console.log('[PASS] Slug Generation and Status');
  } catch (err: any) {
    console.error('[FAIL] Create Draft Blog Post', err.response?.data || err.message);
  }

  // 3. Edit to Published
  let slug = '';
  try {
    const payload = {
      status: 'PUBLISHED',
      seoKeywords: ['test', 'qa', 'update']
    };
    const res = await authAxios.put(`${API_URL}/blog/${createdPostId}`, payload);
    if (res.data.data.status !== 'PUBLISHED') throw new Error('Failed to update status');
    if (res.data.data.seoKeywords.length !== 3) throw new Error('Failed to update arrays');
    slug = res.data.data.slug;
    console.log('[PASS] Edit and Publish');
  } catch (err: any) {
    console.error('[FAIL] Edit and Publish', err.response?.data || err.message);
  }

  // 4. Test Public Fetch
  try {
    const res = await axios.get(`${API_URL}/blog/slug/${slug}`);
    if (res.data.data.title !== 'QA Test Article') throw new Error('Public fetch failed');
    console.log('[PASS] Public Fetch');
  } catch (err: any) {
    console.error('[FAIL] Public Fetch', err.response?.data || err.message);
  }

  // 5. Delete Post
  try {
    await authAxios.delete(`${API_URL}/blog/${createdPostId}`);
    console.log('[PASS] Delete Post');
  } catch (err: any) {
    console.error('[FAIL] Delete Post', err.response?.data || err.message);
  }

  console.log('--- QA COMPLETE ---');
}

runQA();
