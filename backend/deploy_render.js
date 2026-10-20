const https = require('https');

// ── CONFIG ──────────────────────────────────────────────
const RENDER_API_KEY  = process.env.RENDER_API_KEY;
const GITHUB_REPO     = 'https://github.com/usameacdy/usame-academy';
const DATABASE_URL    = 'postgresql://neondb_owner:npg_pTWjctHd7K6q@ep-broad-unit-b4lo1xzy.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const JWT_SECRET      = 'EduFlow_JWT_Super_Secret_2026_usameacademy';
// ────────────────────────────────────────────────────────

function renderRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'api.render.com',
      path: `/v1${path}`,
      method,
      headers: {
        'Authorization': `Bearer ${RENDER_API_KEY}`,
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(options, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function deploy() {
  console.log('🔍 Getting Render owner ID...');
  const me = await renderRequest('GET', '/owners?limit=1');
  if (me.status !== 200) { console.error('❌ Auth failed:', me.body); process.exit(1); }
  const ownerId = me.body[0]?.owner?.id;
  console.log('✅ Owner ID:', ownerId);

  console.log('\n🚀 Creating backend Web Service on Render...');
  const svc = await renderRequest('POST', '/services', {
    type: 'web_service',
    name: 'eduflow-backend',
    ownerId,
    repo: GITHUB_REPO,
    branch: 'master',
    rootDir: 'backend',
    runtime: 'node',
    buildCommand: 'npm install',
    startCommand: 'node server.js',
    plan: 'free',
    region: 'oregon',
    envVars: [
      { key: 'NODE_ENV',      value: 'production' },
      { key: 'PORT',          value: '10000' },
      { key: 'DATABASE_URL',  value: DATABASE_URL },
      { key: 'JWT_SECRET',    value: JWT_SECRET },
      { key: 'FRONTEND_URL',  value: 'https://usame-academy.vercel.app' },
    ]
  });

  if (svc.status === 201 || svc.status === 200) {
    const serviceId  = svc.body?.service?.id;
    const serviceUrl = svc.body?.service?.serviceDetails?.url || 'https://eduflow-backend.onrender.com';
    console.log('✅ Backend service created!');
    console.log('   Service ID :', serviceId);
    console.log('   Service URL:', serviceUrl);
    console.log('\n⏳ Render is building your backend (5-10 min)...');
    console.log('   Track at: https://dashboard.render.com');
  } else {
    console.error('❌ Service creation failed:', JSON.stringify(svc.body, null, 2));
  }
}

deploy().catch(console.error);
