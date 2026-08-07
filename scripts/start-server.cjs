const http = require('http');
const fs = require('fs');
const path = require('path');

const DEFAULT_PORT = 8080;
const distDir = path.join(__dirname, '..', 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.map': 'application/json'
};

function createServer(port) {
  const server = http.createServer((req, res) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    let filePath = path.join(distDir, req.url === '/' ? 'index.html' : req.url);
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    const resolvedPath = path.resolve(filePath);
    const resolvedDist = path.resolve(distDir);
    
    if (!resolvedPath.startsWith(resolvedDist)) {
      console.log(`[ERROR] Path traversal attempt: ${req.url}`);
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          console.log(`[WARN] File not found: ${filePath}, serving index.html`);
          fs.readFile(path.join(distDir, 'index.html'), (err, fallbackContent) => {
            if (err) {
              console.log(`[ERROR] Cannot serve fallback: ${err.message}`);
              res.writeHead(500);
              res.end('Server Error');
            } else {
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(fallbackContent, 'utf-8');
            }
          });
        } else {
          console.log(`[ERROR] ${error.code}: ${error.message}`);
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        }
      } else {
        res.writeHead(200, { 
          'Content-Type': contentType,
          'Cache-Control': 'max-age=31536000, immutable'
        });
        res.end(content, 'utf-8');
      }
    });
  });

  return new Promise((resolve, reject) => {
    server.listen(port, '0.0.0.0', () => {
      resolve({ server, port });
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        reject(err);
      } else {
        reject(err);
      }
    });
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
      
      Object.keys(interfaces).forEach((interfaceName) => {
        interfaces[interfaceName].forEach((iface) => {
          if (iface.family === 'IPv4' && !iface.internal) {
            ipAddresses.push(iface.address);
          }
        });
      });

      console.log('\n========================================');
      console.log('局域网离线供应商培训平台已启动');
      console.log('========================================');
      console.log(`\n本地访问地址:`);
      console.log(`  http://localhost:${port}`);
      console.log(`  http://127.0.0.1:${port}`);
      console.log(`\n局域网访问地址:`);
      ipAddresses.forEach((ip) => {
        console.log(`  http://${ip}:${port}`);
      });
      console.log(`\n请在同一局域网内的设备浏览器中输入以上地址访问平台`);
      console.log(`\n服务器日志:`);
      console.log(`========================================`);
      break;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        maxRetries--;
        port++;
        if (maxRetries > 0) {
          console.log(`端口 ${port - 1} 已被占用，尝试使用端口 ${port}...`);
        } else {
          console.error('\n❌ 无法启动服务器：');
          console.error('   端口 8080-8084 均被占用');
          console.error('   请关闭占用这些端口的程序后重试');
          process.exit(1);
        }
      } else {
        console.error('\n❌ 启动服务器失败:', err.message);
        process.exit(1);
      }
    }
  }
}

startServer();
