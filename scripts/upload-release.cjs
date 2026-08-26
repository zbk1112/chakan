// 上传全部视频到 GitHub Release v1.0.0
// 支持大文件 (2GB)、断点续传、重试
const fs = require('fs');
const path = require('path');
const https = require('https');

const OWNER = 'zbk1112';
const REPO = 'chakan';
const TAG = 'v1.0.0';
const TOKEN = process.env.GITHUB_TOKEN;
const SP_DIR = path.join(__dirname, '..', 'sp');
const CHUNK_SIZE = 8 * 1024 * 1024; // 8MB 分块

if (!TOKEN) {
  console.error('❌ 请设置 GITHUB_TOKEN 环境变量');
  process.exit(1);
}

function githubApi(pathname, method = 'GET', data = null, extra = {}) {
  return new Promise((resolve, reject) => {
    const hostname = extra.hostname || 'api.github.com';
    const opts = {
      hostname, method, path: pathname,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'deploy-script',
        'Accept': extra.accept || 'application/vnd.github+json',
      },
      ...(extra.contentType ? { headers: { ...(typeof opts.headers === 'object' ? opts.headers : {}), 'Content-Type': extra.contentType } } : {}),
    };
    if (data) {
      const body = typeof data === 'string' ? data : JSON.stringify(data);
      opts.headers = { ...opts.headers, 'Content-Length': Buffer.byteLength(body) };
    }

    const req = https.request(opts, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        let body;
        try { body = JSON.parse(raw.toString('utf8')); }
        catch { body = { raw: raw.toString('utf8', 0, 500) }; }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ body, headers: res.headers, status: res.statusCode, raw });
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(body).substring(0, 800)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(60000, () => { req.destroy(new Error('Request timeout 60s')); });
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function getOrCreateRelease() {
  // 查找现有 release
  try {
    const r = await githubApi(`/repos/${OWNER}/${REPO}/releases/tags/${TAG}`);
    console.log(`✅ Release 已存在: ${TAG} (${r.body.assets?.length || 0} 个附件)`);
    return r.body;
  } catch (e) {
    if (!e.message.includes('HTTP 404')) throw e;
  }

  // 查找 tag 是否存在，不存在先创建
  try {
    await githubApi(`/repos/${OWNER}/${REPO}/git/refs/tags/${TAG}`);
  } catch (e) {
    if (e.message.includes('HTTP 404')) {
      // 创建 tag 对象
      const mainR = await githubApi(`/repos/${OWNER}/${REPO}/git/ref/heads/main`);
      const sha = mainR.body.object.sha;
      await githubApi(`/repos/${OWNER}/${REPO}/git/tags`, 'POST', {
        tag: TAG, message: TAG, object: sha, type: 'commit',
      });
      await githubApi(`/repos/${OWNER}/${REPO}/git/refs`, 'POST', {
        ref: `refs/tags/${TAG}`, sha,
      });
      console.log(`✅ 已创建 tag ${TAG} @ ${sha.substring(0,7)}`);
    } else throw e;
  }

  // 创建 release
  const r = await githubApi(`/repos/${OWNER}/${REPO}/releases`, 'POST', {
    tag_name: TAG, name: `视频资源 ${TAG}`,
    body: '包含 DF / ST / sw 全部视频文件 (约 90 个)',
    draft: false, prerelease: false,
  });
  console.log(`✅ 已创建 Release ${TAG}: ${r.body.html_url}`);
  return r.body;
}

async function uploadAsset(uploadUrlTemplate, name, filePath, totalBytes) {
  // 解析 upload_url: https://uploads.github.com/repos/{owner}/{repo}/releases/{id}/assets{?name,label}
  const uploadUrl = uploadUrlTemplate.split('{')[0] + `?name=${encodeURIComponent(name)}`;
  const u = new URL(uploadUrl);

  const stream = fs.createReadStream(filePath);
  let uploaded = 0;
  let startTime = Date.now();
  let lastProgress = 0;

  return new Promise((resolve, reject) => {
    const opts = {
      method: 'POST',
      hostname: u.hostname,
      path: u.pathname + u.search,
      headers: {
        'Authorization': `token ${TOKEN}`,
        'User-Agent': 'deploy-script',
        'Content-Type': 'video/mp4',
        'Content-Length': totalBytes,
      },
    };
    const req = https.request(opts, (res) => {
      let chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try { resolve(JSON.parse(raw)); }
          catch { resolve({ state: 'uploaded', size: totalBytes }); }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${raw.substring(0, 600)}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(10 * 60 * 1000, () => req.destroy(new Error('上传超时 10 分钟')));

    stream.on('data', (c) => {
      uploaded += c.length;
      const now = Date.now();
      if (now - lastProgress > 2000 || uploaded === totalBytes) {
        lastProgress = now;
        const pct = ((uploaded / totalBytes) * 100).toFixed(1);
        const el = (now - startTime) / 1000;
        const spd = el > 0 ? (uploaded / 1024 / 1024 / el).toFixed(2) : '0';
        const eta = el > 0 ? Math.round((totalBytes - uploaded) / (uploaded / el)) : 0;
        process.stdout.write(`\r   ⏳ ${pct}% | ${(uploaded/1024/1024).toFixed(1)}MB/${(totalBytes/1024/1024).toFixed(0)}MB | ${spd}MB/s | ETA ${eta}s   `);
      }
    });
    stream.on('error', reject);
    stream.pipe(req);
  });
}

async function uploadWithRetry(uploadUrl, name, filePath, maxRetry = 5) {
  for (let i = 1; i <= maxRetry; i++) {
    try {
      const size = fs.statSync(filePath).size;
      process.stdout.write(`   📡 上传 (尝试 ${i}/${maxRetry}): ${name} (${(size/1024/1024).toFixed(0)}MB)\n`);
      const r = await uploadAsset(uploadUrl, name, filePath, size);
      process.stdout.write(`\r   ✅ ${name} 上传成功! (${(size/1024/1024).toFixed(1)}MB)          \n`);
      return r;
    } catch (e) {
      const delay = Math.min(60, Math.pow(2, i)) * 1000;
      process.stdout.write(`\r   ❌ 失败 (${e.message.substring(0, 200)}), ${delay/1000}s 后重试\n`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error(`已超过 ${maxRetry} 次重试: ${name}`);
}

async function main() {
  console.log('🎬 开始上传视频到 GitHub Release v1.0.0\n');

  const release = await getOrCreateRelease();
  const uploadUrl = release.upload_url;
  const existing = new Set((release.assets || []).map(a => a.name));
  console.log(`   Release ID: ${release.id}`);
  console.log(`   已存在附件: ${existing.size} 个`);

  // 扫描 sp 下所有视频
  const items = fs.readdirSync(SP_DIR).filter(f => /\.(mp4|MP4|webm)$/i.test(f));
  const totalBytesAll = items.reduce((s, f) => s + fs.statSync(path.join(SP_DIR, f)).size, 0);
  console.log(`\n📹 发现 ${items.length} 个视频，总大小 ${(totalBytesAll/1024/1024/1024).toFixed(2)} GB`);

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  let startTime = Date.now();

  for (let i = 0; i < items.length; i++) {
    const name = items[i];
    const filePath = path.join(SP_DIR, name);
    const size = fs.statSync(filePath).size;
    console.log(`\n[${i + 1}/${items.length}] ${name} (${(size/1024/1024).toFixed(1)}MB)`);

    // 已上传过的跳过
    if (existing.has(name)) {
      console.log(`   ⏭️  已上传，跳过`);
      skipCount++;
      continue;
    }

    try {
      await uploadWithRetry(uploadUrl, name, filePath);
      successCount++;
    } catch (e) {
      console.log(`   ❌❌❌ 上传失败: ${e.message}`);
      failCount++;
    }

    const elapsed = (Date.now() - startTime) / 1000;
    console.log(`   📊 进度: 成功${successCount} / 跳过${skipCount} / 失败${failCount} | 用时 ${Math.round(elapsed)}s`);
  }

  const done = (Date.now() - startTime) / 1000;
  console.log(`\n🏁 全部完成!`);
  console.log(`   成功: ${successCount} | 跳过: ${skipCount} | 失败: ${failCount}`);
  console.log(`   总用时: ${Math.round(done)}s`);
  console.log(`   公网视频 URL: https://github.com/${OWNER}/${REPO}/releases/download/${TAG}/`);
  console.log(`   公网平台: https://${OWNER}.github.io/${REPO}/`);
}

main().catch(e => { console.error('\n💥 致命错误:', e.message); process.exit(1); });
