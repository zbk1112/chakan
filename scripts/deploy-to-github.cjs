const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = 'zbk1112';
const REPO = 'chakan';
const BRANCH = 'main';

function base64Encode(file) {
  const content = fs.readFileSync(file);
  return content.toString('base64');
}

function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function getLatestCommit() {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/branches/${BRANCH}`,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js'
    }
  };
  const response = await httpsRequest(options);
  return response.body.commit.sha;
}

async function getTree(commitSha) {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/trees/${commitSha}?recursive=1`,
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js'
    }
  };
  const response = await httpsRequest(options);
  return response.body.tree || [];
}

async function createBlob(content, isBinary) {
  const data = JSON.stringify({
    content: content,
    encoding: isBinary ? 'base64' : 'utf-8'
  });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/blobs`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const response = await httpsRequest(options, data);
  return response.body.sha;
}

async function createTree(baseTreeSha, entries) {
  const data = JSON.stringify({
    base_tree: baseTreeSha,
    tree: entries
  });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/trees`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const response = await httpsRequest(options, data);
  return response.body.sha;
}

async function createCommit(parentSha, treeSha, message) {
  const data = JSON.stringify({
    message: message,
    parents: [parentSha],
    tree: treeSha
  });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/commits`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const response = await httpsRequest(options, data);
  return response.body.sha;
}

async function updateBranch(commitSha) {
  const data = JSON.stringify({
    sha: commitSha
  });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`,
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const response = await httpsRequest(options, data);
  return response;
}

async function enablePages() {
  const data = JSON.stringify({
    source: {
      branch: BRANCH,
      path: '/dist'
    }
  });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/pages`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json',
      'Content-Length': data.length
    }
  };
  const response = await httpsRequest(options, data);
  return response;
}

function collectFiles(dir, prefix = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const relativePath = prefix ? `${prefix}/${item}` : item;
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      files.push(...collectFiles(fullPath, relativePath));
    } else {
      files.push({ path: relativePath, fullPath, size: stats.size });
    }
  });
  
  return files;
}

async function main() {
  if (!GITHUB_TOKEN) {
    console.error('❌ 错误: 请设置环境变量 GITHUB_TOKEN');
    console.error('使用方式: GITHUB_TOKEN=your_token node scripts/deploy-to-github.cjs');
    process.exit(1);
  }

  console.log('🚀 开始部署到 GitHub Pages...');
  
  try {
    const distDir = path.join(__dirname, '../dist');
    
    if (!fs.existsSync(distDir)) {
      console.error('❌ 错误: dist目录不存在，请先运行 npm run build');
      process.exit(1);
    }

    const files = collectFiles(distDir);
    console.log(`📁 发现 ${files.length} 个文件需要上传`);
    files.forEach(f => console.log(`   - ${f.path} (${f.size} bytes)`));

    console.log('\n🔄 获取最新提交信息...');
    const commitSha = await getLatestCommit();
    console.log(`   当前提交: ${commitSha.substring(0, 7)}...`);

    console.log('\n📤 创建文件Blob...');
    const treeEntries = [];
    
    for (const file of files) {
      const ext = path.extname(file.path).toLowerCase();
      const isBinary = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.css', '.js', '.map'].includes(ext);
      
      console.log(`   - ${file.path} ${isBinary ? '(二进制)' : '(文本)'}`);
      
      if (isBinary) {
        const content = base64Encode(file.fullPath);
        const blobSha = await createBlob(content, true);
        treeEntries.push({ path: `dist/${file.path}`, mode: '100644', type: 'blob', sha: blobSha });
      } else {
        const content = fs.readFileSync(file.fullPath, 'utf-8');
        const blobSha = await createBlob(content, false);
        treeEntries.push({ path: `dist/${file.path}`, mode: '100644', type: 'blob', sha: blobSha });
      }
    }

    console.log('\n🌳 创建新的Git树...');
    const treeSha = await createTree(commitSha, treeEntries);
    console.log(`   树创建成功: ${treeSha.substring(0, 7)}...`);

    console.log('\n📝 创建新提交...');
    const newCommitSha = await createCommit(commitSha, treeSha, 'deploy: 更新平台静态文件');
    console.log(`   提交成功: ${newCommitSha.substring(0, 7)}...`);

    console.log('\n🔗 更新分支...');
    const branchResponse = await updateBranch(newCommitSha);
    if (branchResponse.status === 200) {
      console.log('   分支更新成功!');
    } else {
      console.log(`   分支更新状态: ${branchResponse.status}`);
    }

    console.log('\n🌐 启用 GitHub Pages...');
    const pagesResponse = await enablePages();
    if (pagesResponse.status === 201) {
      console.log('   GitHub Pages 启用成功!');
      console.log(`   访问地址: https://${OWNER}.github.io/${REPO}/`);
    } else {
      console.log(`   Pages状态: ${pagesResponse.status}`);
      console.log('   请手动在 GitHub 仓库设置中启用 Pages');
    }

    console.log('\n🎉 部署完成!');
    console.log(`\n📌 公网访问地址: https://${OWNER}.github.io/${REPO}/`);
    console.log('   请等待几分钟后访问，GitHub Pages需要时间生效');

  } catch (error) {
    console.error('\n❌ 部署失败:', error.message);
    process.exit(1);
  }
}

main();