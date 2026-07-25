const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function uploadToNetlify() {
  console.log('🚀 开始部署到 Netlify...');
  
  try {
    const distDir = path.join(__dirname, '../dist');
    
    if (!fs.existsSync(distDir)) {
      console.error('❌ 错误: dist目录不存在，请先运行 npm run build');
      process.exit(1);
    }

    console.log('\n📁 正在打包dist目录...');
    const zipBuffer = await createZip(distDir);
    console.log(`   打包完成: ${zipBuffer.length} bytes`);

    console.log('\n📤 正在上传到 Netlify...');
    
    const boundary = '----NetlifyUpload' + Date.now();
    const body = Buffer.concat([
      Buffer.from(`--${boundary}\r\n`),
      Buffer.from(`Content-Disposition: form-data; name="file"; filename="dist.zip"\r\n`),
      Buffer.from(`Content-Type: application/zip\r\n\r\n`),
      zipBuffer,
      Buffer.from(`\r\n--${boundary}--\r\n`)
    ]);

    const options = {
      hostname: 'api.netlify.com',
      path: '/api/v1/sites',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
        'User-Agent': 'Node.js'
      }
    };

    const response = await httpsRequest(options, body);
    
    if (response.status === 200 || response.status === 201) {
      const site = response.body;
      console.log('\n🎉 部署成功!');
      console.log(`\n📌 公网访问地址: https://${site.subdomain}.netlify.app`);
      console.log(`   管理地址: https://app.netlify.com/sites/${site.subdomain}`);
      console.log('\n✅ 即使电脑关机，网站仍可访问！');
      console.log('   ⏳ 请等待几分钟后访问，需要时间生效');
    } else {
      console.log(`\n⚠️ 状态码: ${response.status}`);
      console.log('   响应: ', response.body);
      console.log('\n❌ 部署失败，请尝试手动方式');
    }

  } catch (error) {
    console.error('\n❌ 部署失败:', error.message);
    process.exit(1);
  }
}

function createZip(dir) {
  return new Promise((resolve, reject) => {
    const zip = [];
    const files = [];
    
    function collectFiles(currentDir, prefix = '') {
      const items = fs.readdirSync(currentDir);
      items.forEach(item => {
        const fullPath = path.join(currentDir, item);
        const relativePath = prefix ? `${prefix}/${item}` : item;
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
          collectFiles(fullPath, relativePath);
        } else {
          files.push({ path: relativePath, fullPath, stats });
        }
      });
    }
    
    collectFiles(dir);
    
    let offset = 0;
    const centralDirRecords = [];
    let totalSize = 0;
    
    files.forEach(file => {
      const content = fs.readFileSync(file.fullPath);
      const fileNameLen = Buffer.byteLength(file.path);
      const localHeader = Buffer.alloc(30 + fileNameLen);
      
      localHeader.writeUInt32LE(0x04034B50, 0);
      localHeader.writeUInt16LE(20, 4);
      localHeader.writeUInt16LE(0, 6);
      localHeader.writeUInt16LE(0, 8);
      localHeader.writeUInt16LE(0, 10);
      localHeader.writeUInt16LE(0, 12);
      localHeader.writeUInt32LE(content.length, 14);
      localHeader.writeUInt32LE(content.length, 18);
      localHeader.writeUInt16LE(fileNameLen, 26);
      localHeader.writeUInt16LE(0, 28);
      localHeader.write(file.path, 30);
      
      zip.push(localHeader);
      zip.push(content);
      
      const centralRecord = Buffer.alloc(46 + fileNameLen);
      centralRecord.writeUInt32LE(0x02014B50, 0);
      centralRecord.writeUInt16LE(20, 4);
      centralRecord.writeUInt16LE(20, 6);
      centralRecord.writeUInt16LE(0, 8);
      centralRecord.writeUInt16LE(0, 10);
      centralRecord.writeUInt16LE(0, 12);
      centralRecord.writeUInt16LE(0, 14);
      centralRecord.writeUInt32LE(content.length, 16);
      centralRecord.writeUInt32LE(content.length, 20);
      centralRecord.writeUInt32LE(content.length, 24);
      centralRecord.writeUInt32LE(content.length, 28);
      centralRecord.writeUInt16LE(fileNameLen, 32);
      centralRecord.writeUInt16LE(0, 34);
      centralRecord.writeUInt16LE(0, 36);
      centralRecord.writeUInt16LE(0, 38);
      centralRecord.writeUInt16LE(0, 40);
      centralRecord.writeUInt32LE(0, 42);
      centralRecord.writeUInt32LE(offset, 44);
      centralRecord.write(file.path, 46);
      
      centralDirRecords.push(centralRecord);
      totalSize += localHeader.length + content.length;
      offset += localHeader.length + content.length;
    });
    
    const centralDirSize = centralDirRecords.reduce((sum, r) => sum + r.length, 0);
    const centralDirOffset = offset;
    
    centralDirRecords.forEach(record => zip.push(record));
    
    const eocd = Buffer.alloc(22);
    eocd.writeUInt32LE(0x06054B50, 0);
    eocd.writeUInt16LE(0, 4);
    eocd.writeUInt16LE(0, 6);
    eocd.writeUInt16LE(files.length, 8);
    eocd.writeUInt16LE(files.length, 10);
    eocd.writeUInt32LE(centralDirSize, 12);
    eocd.writeUInt32LE(centralDirOffset, 16);
    eocd.writeUInt16LE(0, 20);
    
    zip.push(eocd);
    
    resolve(Buffer.concat(zip));
  });
}

uploadToNetlify();