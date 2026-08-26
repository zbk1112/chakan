const fs = require('fs');
const path = require('path');
const https = require('https');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || '';
const OWNER = 'zbk1112';
const REPO = 'chakan';
const BRANCH = 'gh-pages';

// 视频和音频等二进制文件扩展名
const BINARY_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.svg', '.gif', '.css', '.js', '.map', '.mp4', '.MP4', '.webm', '.ogg', '.mp3', '.wav', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

function httpsRequest(options, data = null) {
  if (data) {
    options.headers = options.headers || {};
    options.headers['Content-Length'] = Buffer.byteLength(data);
  }
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
  if (response.status === 404) {
    return null;
  }
  return {
    commitSha: response.body.commit.sha,
    treeSha: response.body.commit.commit.tree.sha
  };
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
      'Content-Type': 'application/json'
    }
  };
  const response = await httpsRequest(options, data);
  if (response.status !== 201) {
    console.error('   ❌ Blob 创建失败:', response.status, response.body);
    return null;
  }
  return response.body.sha;
}

async function createTree(baseTreeSha, entries) {
  const payload = baseTreeSha
    ? { base_tree: baseTreeSha, tree: entries }
    : { tree: entries };
  const data = JSON.stringify(payload);
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/trees`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json'
    }
  };
  const response = await httpsRequest(options, data);
  if (response.status !== 201) {
    console.error('   ❌ 树创建失败:', response.status, response.body);
    return null;
  }
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
      'Content-Type': 'application/json'
    }
  };
  const response = await httpsRequest(options, data);
  if (response.status !== 201) {
    console.error('   ❌ 提交创建失败:', response.status, response.body);
    return null;
  }
  return response.body.sha;
}

async function updateBranch(commitSha) {
  const data = JSON.stringify({ sha: commitSha });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/refs/heads/${BRANCH}`,
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json'
    }
  };
  const response = await httpsRequest(options, data);
  return response;
}

async function createBranch(fromSha) {
  const data = JSON.stringify({ ref: `refs/heads/${BRANCH}`, sha: fromSha });
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/git/refs`,
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'User-Agent': 'Node.js',
      'Content-Type': 'application/json'
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

async function getMainBranchSha() {
  const options = {
    hostname: 'api.github.com',
    path: `/repos/${OWNER}/${REPO}/branches/main`,
    headers: { 'Authorization': `token ${GITHUB_TOKEN}`, 'User-Agent': 'Node.js' }
  };
  const response = await httpsRequest(options);
  return response.body.commit.sha;
}

async function main() {
  console.log('🚀 开始通过 GitHub API 部署到 gh-pages 分支...');

  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('❌ dist 目录不存在，请先运行 npm run build');
    process.exit(1);
  }

  // GitHub Pages 只部署网页代码（不包含视频，视频通过 Release 单独托管）
  // 所以这里不复制 sp 目录

  const files = collectFiles(distDir);
  console.log(`📁 发现 ${files.length} 个文件需要上传（网页代码，不含视频）`);

  let commitInfo = await getLatestCommit();
  let commitSha, treeSha;

  if (!commitInfo) {
    console.log('📝 gh-pages 分支不存在，从 main 分支创建...');
    const mainSha = await getMainBranchSha();
    await createBranch(mainSha);
    commitSha = mainSha;
    treeSha = null;
  } else {
    commitSha = commitInfo.commitSha;
    treeSha = commitInfo.treeSha;
  }

  console.log(`🔄 基准提交: ${commitSha.substring(0, 7)}...`);
  console.log('📤 创建文件 Blob...');

  const treeEntries = [];
  for (const file of files) {
    const ext = path.extname(file.path).toLowerCase();
    const isBinary = BINARY_EXTENSIONS.includes(ext);
    console.log(`   - ${file.path} (${isBinary ? '二进制' : '文本'})`);

    let blobSha;
    if (isBinary) {
      const content = fs.readFileSync(file.fullPath).toString('base64');
      blobSha = await createBlob(content, true);
    } else {
      const content = fs.readFileSync(file.fullPath, 'utf-8');
      blobSha = await createBlob(content, false);
    }
    if (!blobSha) {
      console.error('❌ Blob 创建失败，终止部署');
      process.exit(1);
    }
    treeEntries.push({ path: file.path, mode: '100644', type: 'blob', sha: blobSha });
  }

  console.log('🌳 创建新的 Git 树...');
  const newTreeSha = await createTree(treeSha, treeEntries);
  if (!newTreeSha) {
    console.error('❌ 树创建失败，终止部署');
    process.exit(1);
  }
  console.log(`   树 SHA: ${newTreeSha.substring(0, 7)}...`);

  console.log('📝 创建新提交...');
  const newCommitSha = await createCommit(commitSha, newTreeSha, 'deploy: 部署到 GitHub Pages');
  if (!newCommitSha) {
    console.error('❌ 提交创建失败，终止部署');
    process.exit(1);
  }
  console.log(`   提交 SHA: ${newCommitSha.substring(0, 7)}...`);

  console.log('🔗 更新分支...');
  const branchResponse = await updateBranch(newCommitSha);
  if (branchResponse.status === 200) {
    console.log('   ✅ 分支更新成功!');
  } else {
    console.log(`   状态: ${branchResponse.status}`);
  }

  console.log('\n🎉 部署完成!');
  console.log('📌 访问地址: https://zbk1112.github.io/chakan/');
  console.log('⏳ GitHub Pages 需要几分钟时间生效...');
}

main().catch(err => console.error('❌ 部署失败:', err.message));
