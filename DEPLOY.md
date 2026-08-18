# 供应商培训平台 - 部署操作手册

## 一、项目概述

- **项目名称**: chakan（供应商培训平台）
- **技术栈**: React 18 + TypeScript + Vite 6 + Tailwind CSS 3
- **GitHub 仓库**: https://github.com/zbk1112/chakan
- **公网访问地址**: https://zbk1112.github.io/chakan/
- **部署方式**: GitHub Pages（gh-pages 分支）

## 二、环境要求

| 项目 | 要求 |
|------|------|
| Node.js | >= 18.x（推荐 22.x） |
| npm | >= 9.x |
| Git | 已安装并配置好 GitHub 凭证 |
| GitHub 账号 | 拥有 `zbk1112/chakan` 仓库的推送权限 |
| GitHub Token | 需具有 `repo` 权限的 Personal Access Token |

## 三、本地开发

### 3.1 克隆项目

```bash
git clone https://github.com/zbk1112/chakan.git
cd chakan
```

### 3.2 安装依赖

```bash
npm install
```

### 3.3 启动开发服务器

```bash
npm run dev
```

- 本地访问地址: http://localhost:5173/chakan/
- 支持热更新，修改代码后自动刷新

### 3.4 类型检查

```bash
npm run check
```

## 四、构建项目

```bash
npm run build
```

构建产物输出到 `dist/` 目录，包含：
- `index.html` — 入口文件
- `assets/` — JS、CSS、图片等静态资源

> **注意**: `vite.config.ts` 中 `base` 设置为 `/chakan/`，确保 GitHub Pages 子路径下资源加载正确。请勿修改此配置。

## 五、部署到 GitHub Pages

提供两种部署方式，**推荐使用方式一（GitHub API 部署）**，在国内网络环境下更稳定。

### 方式一：GitHub API 部署（推荐）

适用于 `github.com:443` 连接不稳定或被阻断的网络环境。

#### 5.1.1 配置 GitHub Token

1. 访问 https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 生成后复制 Token（格式: `ghp_xxxxx`）

#### 5.1.2 修改部署脚本中的 Token

编辑 [scripts/deploy-gh-pages.cjs](file:///c:/Users/22311/Desktop/chakan-main/scripts/deploy-gh-pages.cjs)：

```javascript
const GITHUB_TOKEN = 'ghp_你的Token';  // 替换为你的 Token
const OWNER = 'zbk1112';
const REPO = 'chakan';
const BRANCH = 'gh-pages';
```

#### 5.1.3 执行部署

```bash
# 1. 构建项目
npm run build

# 2. 通过 GitHub API 部署
node scripts/deploy-gh-pages.cjs
```

#### 5.1.4 部署脚本工作原理

```
dist/ 文件 → 创建 Blob → 创建 Tree → 创建 Commit → 更新 gh-pages 分支引用
```

脚本会自动完成以下步骤：
1. 获取 `gh-pages` 分支最新提交（不存在则从 `main` 创建）
2. 将 `dist/` 下所有文件上传为 Git Blob（二进制文件 Base64 编码）
3. 基于现有 Tree 创建新的 Git Tree
4. 创建新提交，父提交为当前 `gh-pages` 分支头
5. 更新 `gh-pages` 分支引用指向新提交

### 方式二：gh-pages npm 包部署

适用于网络环境良好、可正常访问 `github.com:443` 的情况。

```bash
# 1. 构建项目
npm run build

# 2. 部署到 gh-pages 分支
npx gh-pages -d dist -b gh-pages -m "deploy: 部署到 GitHub Pages"
```

## 六、GitHub Pages 配置

### 6.1 检查 Pages 配置

访问 GitHub API 查看 Pages 配置状态：

```bash
curl -s -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/zbk1112/chakan/pages
```

正常响应应包含：
```json
{
  "status": "built",
  "source": {
    "branch": "gh-pages",
    "path": "/"
  }
}
```

### 6.2 首次启用 Pages

如果 Pages 未启用（返回 404），通过 API 创建：

```bash
curl -X POST -H "Authorization: token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":{"branch":"gh-pages","path":"/"}}' \
  https://api.github.com/repos/zbk1112/chakan/pages
```

### 6.3 修改 Pages Source

如果 Source 配置错误，通过 API 更新：

```bash
curl -X PUT -H "Authorization: token YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"source":{"branch":"gh-pages","path":"/"}}' \
  https://api.github.com/repos/zbk1112/chakan/pages
```

## 七、代码同步到 GitHub

### 7.1 提交代码到 main 分支

```bash
git add .
git commit -m "feat: 描述你的修改内容"
git push origin main
```

### 7.2 完整发布流程（代码 + 部署）

```bash
# 1. 提交源码
git add .
git commit -m "feat: 描述你的修改内容"
git push origin main

# 2. 构建项目
npm run build

# 3. 部署到 GitHub Pages
node scripts/deploy-gh-pages.cjs
```

## 八、常见问题排查

### 8.1 公网访问白屏

**原因**: `gh-pages` 分支内容未更新，或 Pages Source 配置错误。

**解决**:
1. 确认 `gh-pages` 分支有最新的 `index.html`：
   ```bash
   curl -s https://api.github.com/repos/zbk1112/chakan/contents/index.html?ref=gh-pages \
     -H "Authorization: token YOUR_TOKEN"
   ```
2. 确认 Pages Source 指向 `gh-pages` 分支（参见第六章）
3. 重新执行部署

### 8.2 git push 失败（连接超时）

**原因**: 国内网络环境下 `github.com:443` 连接不稳定。

**解决**:
- 使用方式一（GitHub API 部署），API 走 `api.github.com`，通常比 git 协议更稳定
- 或配置 Git 代理：
  ```bash
  git config --global http.proxy http://127.0.0.1:7890
  git config --global https.proxy http://127.0.0.1:7890
  ```
  完成后取消代理：
  ```bash
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  ```

### 8.3 公网访问 ERR_CONNECTION_RESET

**原因**: 国内 ISP/GFW 级别的网络拦截，非 GitHub Pages 配置问题。

**解决**: 访问者需使用 VPN/代理访问 `zbk1112.github.io`。

### 8.4 资源加载 404

**原因**: `vite.config.ts` 中的 `base` 配置错误。

**解决**: 确保 `base` 设置为 `/chakan/`：
```typescript
export default defineConfig({
  base: '/chakan/',
  // ...
})
```

### 8.5 部署脚本报 "dist 目录不存在"

**原因**: 未先执行构建。

**解决**:
```bash
npm run build
node scripts/deploy-gh-pages.cjs
```

### 8.6 GitHub Token 过期

**原因**: Token 有效期到期或被撤销。

**解决**: 重新生成 Token，更新 [deploy-gh-pages.cjs](file:///c:/Users/22311/Desktop/chakan-main/scripts/deploy-gh-pages.cjs) 中的 `GITHUB_TOKEN`。

## 九、项目结构

```
chakan-main/
├── dist/                       # 构建产物（gitignore）
├── public/                     # 静态资源
├── scripts/
│   └── deploy-gh-pages.cjs     # GitHub API 部署脚本
├── src/
│   ├── components/             # 通用组件
│   ├── data/
│   │   └── content.ts          # 项目数据配置
│   ├── pages/                  # 页面组件
│   │   ├── Home.tsx            # 首页（项目卡片）
│   │   └── Projects/           # 项目详情页
│   ├── App.tsx                 # 根组件
│   └── main.tsx                # 入口文件
├── vite.config.ts              # Vite 配置
├── package.json                # 依赖和脚本
└── tsconfig.json               # TypeScript 配置
```

## 十、快速部署清单

部署前逐项确认：

- [ ] 本地修改已完成并通过 `npm run check`
- [ ] 已执行 `npm run build`，`dist/` 目录已更新
- [ ] GitHub Token 有效且具有 `repo` 权限
- [ ] [deploy-gh-pages.cjs](file:///c:/Users/22311/Desktop/chakan-main/scripts/deploy-gh-pages.cjs) 中 Token 已更新
- [ ] 执行 `node scripts/deploy-gh-pages.cjs` 部署成功
- [ ] GitHub Pages 状态为 `built`
- [ ] 源码已提交到 `main` 分支（`git push origin main`）
