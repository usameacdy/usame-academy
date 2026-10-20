/**
 * Full Auto-Deploy Script: Render (backend) + Vercel (frontend)
 * Run: node deploy_all.js
 * Env: RENDER_API_KEY and VERCEL_TOKEN must be set
 */

const https = require('https');
const { execSync } = require('child_process');

const RENDER_API_KEY   = process.env.RENDER_API_KEY;
const VERCEL_TOKEN     = process.env.VERCEL_TOKEN;
const GITHUB_REPO      = 'https://github.com/usameacdy/usame-academy';
const DATABASE_URL     = 'postgresql://neondb_owner:npg_pTWjctHd7K6q@ep-broad-unit-b4lo1xzy.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require';
const JWT_SECRET       = 'EduFlow_JWT_Super_Secret_2026_usameacademy';

// ── HTTP helper ──────────────────────────────────────────────────────────────
function request(hostname, path, method, body, token, tokenType = 'Bearer') {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname, path, method,
      headers: {
        'Authorization': `${tokenType} ${token}`,
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

// ── RENDER deploy ────────────────────────────────────────────────────────────
async function deployRender() {
  console.log('\n═══════════════════════════════════════');
  console.log('  🔵 RENDER — Backend Deployment');
  console.log('═══════════════════════════════════════');

  // 1. Get owner ID
  const me = await request('api.render.com', '/v1/owners?limit=1', 'GET', null, RENDER_API_KEY);
  if (me.status !== 200) throw new Error('Render auth failed: ' + JSON.stringify(me.body));
  const ownerId = me.body[0]?.owner?.id;
  console.log('✅ Render owner ID:', ownerId);

  // 2. Check if service already exists
  const existing = await request('api.render.com', '/v1/services?limit=20', 'GET', null, RENDER_API_KEY);
  let service = null;
  if (existing.status === 200) {
    service = existing.body.find(s => s.service?.name === 'eduflow-backend')?.service;
  }

  let backendUrl;
  if (service) {
    console.log('✅ Service already exists:', service.id);
    backendUrl = `https://${service.serviceDetails?.url || 'eduflow-backend.onrender.com'}`;
    // Trigger redeploy
    const redeploy = await request('api.render.com', `/v1/services/${service.id}/deploys`, 'POST', { clearCache: 'clear' }, RENDER_API_KEY);
    console.log('✅ Redeployment triggered! Status:', redeploy.status);
  } else {
    // 3. Create new service
    const svc = await request('api.render.com', '/v1/services', 'POST', {
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
    }, RENDER_API_KEY);

    if (svc.status !== 201 && svc.status !== 200) {
      throw new Error('Render service creation failed: ' + JSON.stringify(svc.body));
    }
    service = svc.body?.service;
    backendUrl = `https://${service?.serviceDetails?.url || 'eduflow-backend.onrender.com'}`;
    console.log('✅ Backend service created!');
    console.log('   ID :', service?.id);
  }

  console.log('   URL:', backendUrl);
  return backendUrl;
}

// ── VERCEL deploy ────────────────────────────────────────────────────────────
async function deployVercel(backendUrl) {
  console.log('\n═══════════════════════════════════════');
  console.log('  ⬛ VERCEL — Frontend Deployment');
  console.log('═══════════════════════════════════════');

  // Use Vercel CLI with token - most reliable approach
  try {
    console.log('🔄 Deploying frontend via Vercel CLI...');
    const result = execSync(
      `vercel --token ${VERCEL_TOKEN} --yes --cwd frontend --prod 2>&1`,
      { cwd: 'C:\\R2', encoding: 'utf8', timeout: 300000 }
    );
    console.log(result);
    const urlMatch = result.match(/https:\/\/[^\s]+vercel\.app/);
    const frontendUrl = urlMatch ? urlMatch[0] : 'https://usame-academy.vercel.app';
    console.log('✅ Frontend deployed!');
    console.log('   URL:', frontendUrl);
    return frontendUrl;
  } catch (err) {
    console.log('CLI output:', err.stdout || err.message);
    // Try extracting URL from error output too
    const urlMatch = (err.stdout || '').match(/https:\/\/[^\s]+vercel\.app/);
    if (urlMatch) {
      console.log('✅ Frontend deployed! URL:', urlMatch[0]);
      return urlMatch[0];
    }
    throw err;
  }
}

// ── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 EduFlow Full Deployment Starting...\n');

  if (!RENDER_API_KEY || !VERCEL_TOKEN) {
    console.error('❌ Missing env vars: RENDER_API_KEY and/or VERCEL_TOKEN');
    process.exit(1);
  }

  try {
    const backendUrl  = await deployRender();
    const frontendUrl = await deployVercel(backendUrl);

    console.log('\n╔═══════════════════════════════════════════════╗');
    console.log('║        ✅ DEPLOYMENT COMPLETE! 🎉              ║');
    console.log('╠═══════════════════════════════════════════════╣');
    console.log(`║  🌐 Frontend : ${frontendUrl.padEnd(30)} ║`);
    console.log(`║  ⚙️  Backend  : ${backendUrl.padEnd(30)} ║`);
    console.log('║  🔑 Admin    : admin@usamacademy.com           ║');
    console.log('║  🔒 Password : Admin@2026                      ║');
    console.log('╚═══════════════════════════════════════════════╝\n');
  } catch (err) {
    console.error('\n❌ Deployment error:', err.message);
    process.exit(1);
  }
}

main();
