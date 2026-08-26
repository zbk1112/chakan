const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 8080;
const rootDir = path.join(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const spDir = path.join(rootDir, 'sp');   // 视频源目录：直接读 sp/，不复制到 dist

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
  '.mp4': 'video/mp4',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.aac': 'audio/aac',
  '.m3u8': 'application/vnd.apple.mpegurl',
  '.ts': 'video/mp2t',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf'
};

const VIDEO_EXT_RE = /\.(mp4|mov|m4v|webm|ogv|mp3|wav|aac|m3u8|ts)$/i;

// 查找真实文件（大小写不敏感），返回 { filePath, ext } 或 null
function resolveFile(dir, sub) {
  const clean = sub.replace(/^[\\/]+/, '').replace(/[?#].*$/, '');
  const parts = clean.split(/[\\/]+/).filter(Boolean);
  let current = dir;
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const low = part.toLowerCase();
    try {
      const names = fs.readdirSync(current);
      const match = names.find((n) => n.toLowerCase() === low);
      if (!match) return null;
      current = path.join(current, match);
    } catch (e) {
      return null;
    }
    const isLast = i === parts.length - 1;
    try {
      const st = fs.statSync(current);
      if (isLast) {
        if (st.isFile()) return { filePath: current, ext: path.extname(current).toLowerCase() };
        return null;
      }
      if (!st.isDirectory()) return null;
    } catch (e) {
      return null;
    }
  }
  return null;
}

// 扁平化回退查找：请求 /sp/DF/1.mp4 但目录不存在时，
// 按候选优先级在 sp/ 根目录找真实文件（解决 DF/ST/sw 结构丢失问题）
function resolveFileFallback(dir, sub) {
  // sub 形如 "DF/1.mp4"
  const parts = sub.replace(/^[\\/]+/, '').split(/[\\/]+/).filter(Boolean);
  if (parts.length !== 2) return null;

  const folder = parts[0].toUpperCase(); // DF / ST / SW
  const fileName = parts[1];                       // 1.mp4
  const index = path.basename(fileName, path.extname(fileName)); // "1"
  const ext = path.extname(fileName);             // ".mp4"

  // 根据文件夹生成候选（扩展名、下划线后缀不区分）
  let candidates = [];
  if (folder === 'DF' || folder === '1') {
    candidates = [
      `${index}.mp4`, `${index}.MP4`,
      `${index}_1.mp4`, `${index}_1.MP4`,
      `${index}_2.mp4`, `${index}_2.MP4`,
    ];
  } else if (folder === 'ST' || folder === '2') {
    candidates = [
      `${index}.MP4`, `${index}.mp4`,
      `${index}_1.MP4`, `${index}_1.mp4`,
      `${index}_2.MP4`, `${index}_2.mp4`,
      `${index}_3.MP4`, `${index}_3.mp4`,
      `${index}_4.MP4`, `${index}_4.mp4`,
    ];
  } else { // SW / sw
    candidates = [
      `${index}_2.mp4`, `${index}_2.MP4`,
      `${index}.mp4`, `${index}.MP4`,
      `${index}_1.mp4`, `${index}_1.MP4`,
    ];
  }

  // 去重并查找
  const seen = new Set();
  for (const name of candidates) {
    if (seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    const found = resolveFile(dir, name);
    if (found) return found;
  }
  return null;
}

// 流式返回文件（完整 or Range）
function sendVideoFile(req, res, filePath, ext) {
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  let stat;
  try { stat = fs.statSync(filePath); } catch (e) { res.writeHead(404); res.end('Not Found'); return; }

  const size = stat.size;
  const rangeHeader = req.headers && (req.headers['range'] || req.headers['Range']);
  const isHead = req.method === 'HEAD';

  const commonHeaders = {
    'Content-Type': contentType,
    'Accept-Ranges': 'bytes',
    'Cache-Control': VIDEO_EXT_RE.test(ext) ? 'public, max-age=3600' : 'public, max-age=31536000, immutable',
    'Content-Length': size,
    'Last-Modified': stat.mtime.toUTCString(),
    ETag: `W/"${size}-${stat.mtimeMs}"`,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Expose-Headers': 'Content-Length, Content-Range'
  };

  let start = 0, end = size - 1, status = 200;
  if (rangeHeader && typeof rangeHeader === 'string') {
    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    if (m) {
      const s = m[1] === '' ? NaN : parseInt(m[1], 10);
      const e = m[2] === '' ? NaN : parseInt(m[2], 10);
      let valid = true;
      if (!Number.isNaN(s)) {
        if (s < 0 || s >= size) valid = false;
        else start = s;
      }
      if (!Number.isNaN(e)) {
        if (e < start || e >= size) valid = false;
        else end = e;
      }
      if (valid) {
        status = 206;
        commonHeaders['Content-Range'] = `bytes ${start}-${end}/${size}`;
      } else {
        res.writeHead(416, {
          'Content-Range': `bytes */${size}`,
          'Access-Control-Allow-Origin': '*'
        });
        res.end('Range Not Satisfiable');
        return;
      }
    }
  }
  const contentLength = end - start + 1;
  commonHeaders['Content-Length'] = contentLength;

  res.writeHead(status, commonHeaders);
  if (isHead) { res.end(); return; }

  const stream = fs.createReadStream(filePath, { start, end, highWaterMark: 512 * 1024 });
  stream.on('error', () => { try { res.destroy(); } catch (_) {} });
  stream.pipe(res);
}

// 发送非视频的静态小文件（dist 资源等）
function sendStaticFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const isHead = req.method === 'HEAD';
  let stat;
  try { stat = fs.statSync(filePath); } catch (e) { return false; }
  if (!stat.isFile()) return false;

  const rangeHeader = req.headers && (req.headers['range'] || req.headers['Range']);
  const size = stat.size;
  const headers = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Accept-Ranges': 'bytes',
    ETag: `W/"${size}-${stat.mtimeMs}"`,
    'Last-Modified': stat.mtime.toUTCString(),
    'Content-Length': size
  };
  if (rangeHeader && VIDEO_EXT_RE.test(ext)) {
    // 非 sp 路由下的视频（理论上不打包进 dist，但有也按 range 发）
    sendVideoFile(req, res, filePath, ext);
    return true;
  }
  res.writeHead(200, headers);
  if (isHead) { res.end(); return true; }
  const stream = fs.createReadStream(filePath);
  stream.on('error', () => { try { res.destroy(); } catch (_) {} });
  stream.pipe(res);
  return true;
}

function createServer(port) {
  const server = http.createServer((req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range, Accept, Origin');

    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405); res.end('Method Not Allowed'); return;
    }

    const rawUrl = decodeURIComponent((req.url || '/').split('?')[0]);
    // URL 归一化：把任何前缀下的 /sp/... 统一按 sp/ 资源对待（防 SPA 相对路径解析错误）
    // e.g. /tasks/sp/DF/1.mp4 → /sp/DF/1.mp4
    let url = rawUrl;
    const spIdx = rawUrl.indexOf('/sp/');
    if (spIdx > 0) url = rawUrl.slice(spIdx);
    else if (rawUrl.endsWith('/sp') || rawUrl.endsWith('/sp/')) url = '/sp/';

    // === 路由 1: /sp/* → 项目根 /sp/ 目录 ===
    if (url === '/sp' || url.startsWith('/sp/')) {
      const sub = url === '/sp' ? '' : url.slice('/sp'.length).replace(/^[\\/]+/, '');
      if (!sub) {
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('视频目录 OK. 请访问具体视频，例如 /sp/DF/1.mp4  来源目录: ' + spDir);
        return;
      }
      // 安全：防止路径穿越
      const target = path.normalize(path.join(spDir, sub));
      const base = path.normalize(spDir);
      if (target !== base && !target.startsWith(base + path.sep)) {
        res.writeHead(403); res.end('Forbidden'); return;
      }
      const resolved = resolveFile(spDir, sub);
      if (!resolved) {
        // 目录不存在时，回退到扁平文件名搜索（DF/ST/sw 结构丢失时）
        const fallback = resolveFileFallback(spDir, sub);
        if (!fallback) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('视频文件未找到: ' + sub + '\n源目录: ' + spDir);
          return;
        }
        sendVideoFile(req, res, fallback.filePath, fallback.ext);
        return;
      }
      sendVideoFile(req, res, resolved.filePath, resolved.ext);
      return;
    }

    // === 路由 2: dist 静态资源 ===
    const wantIndex = url === '/' || url === '';
    let filePath = path.join(distDir, wantIndex ? 'index.html' : url);
    const resolvedPath = path.resolve(filePath);
    const resolvedDist = path.resolve(distDir);
    if (resolvedPath !== resolvedDist && !resolvedPath.startsWith(resolvedDist + path.sep)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }

    let stat;
    try { stat = fs.statSync(filePath); } catch (_) { stat = null; }
    if (stat && stat.isFile()) {
      sendStaticFile(req, res, filePath);
      return;
    }
    if (stat && stat.isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      if (fs.existsSync(idx)) { sendStaticFile(req, res, idx); return; }
    }

    // SPA fallback：除了明显的资源后缀，其他都返回 index.html
    const looksLikeAsset = /\.(html?|js|mjs|css|png|jpe?g|svg|ico|gif|webp|woff2?|map|json|mp4|mov|webm|mp3|wav|txt)$/i.test(url);
    if (looksLikeAsset) {
      // 明确是资源但不存在 → 给 404（便于排障：video 404 时浏览器直接显示）
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('资源不存在: ' + url);
      return;
    }
    // SPA 页面
    try {
      const indexBuf = fs.readFileSync(path.join(distDir, 'index.html'));
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(indexBuf);
    } catch (err) {
      res.writeHead(500); res.end('Server Error: dist/index.html 不存在，请先 npm run build');
    }
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '0.0.0.0', () => resolve({ server, port }));
    server.on('error', reject);
  });
}

async function startServer() {
  let port = DEFAULT_PORT;
  let maxRetries = 5;

  while (maxRetries > 0) {
    try {
      const { server, port: actualPort } = await createServer(port);
      port = actualPort;

      const os = require('os');
      const interfaces = os.networkInterfaces();
      const ipAddresses = [];

      Object.keys(interfaces).forEach((name) => {
        interfaces[name].forEach((iface) => {
          if (iface.family === 'IPv4' && !iface.internal) ipAddresses.push(iface.address);
        });
      });

      console.log('\n========================================');
      console.log('局域网离线供应商培训平台已启动');
      console.log('========================================');
      console.log(`\n本地访问地址:`);
      console.log(`  http://localhost:${port}`);
      console.log(`  http://127.0.0.1:${port}`);
      console.log(`\n局域网访问地址:`);
      ipAddresses.forEach((ip) => console.log(`  http://${ip}:${port}`));
      console.log(`\n静态目录：${distDir}`);
      console.log(`视频源目录：${spDir}`);
      console.log(`视频路由：http://localhost:${port}/sp/（支持拖动进度条、手机端小窗播放）`);
      console.log(`\n服务器日志:`);
      console.log(`========================================`);
      break;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        maxRetries--; port++;
        if (maxRetries > 0) console.log(`端口 ${port - 1} 已被占用，尝试使用端口 ${port}...`);
        else { console.error('\n❌ 无法启动服务器：端口 8080-8084 均被占用'); process.exit(1); }
      } else {
        console.error('\n❌ 启动服务器失败:', err.message); process.exit(1);
      }
    }
  }
}

startServer();
