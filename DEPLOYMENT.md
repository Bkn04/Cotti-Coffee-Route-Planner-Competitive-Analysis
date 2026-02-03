# 库迪咖啡路线规划 - 在线部署指南

## 🚀 三种免费部署方案

---

## 方案一：Vercel 部署（推荐 ⭐️）

**优势：** 最简单、最快速、自动 HTTPS、自动 CI/CD

### 步骤 1：准备 GitHub 仓库

```bash
# 1. 创建 GitHub 账号（如果没有）
# 访问：https://github.com

# 2. 在 GitHub 创建新仓库
# 仓库名：cudi-coffee-route-planner
# 设为 Public

# 3. 推送代码到 GitHub
cd "/Users/HP/Desktop/Claude Project"
git remote add origin https://github.com/你的用户名/cudi-coffee-route-planner.git
git push -u origin master
```

### 步骤 2：部署到 Vercel

1. **访问 Vercel：** https://vercel.com
2. **用 GitHub 账号登录**
3. **点击 "Add New Project"**
4. **导入你的 GitHub 仓库：** `cudi-coffee-route-planner`
5. **配置项目：**
   - Framework Preset: **Vite**
   - Root Directory: `Claude Project`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **点击 "Deploy"**

### 步骤 3：完成 ✅

3分钟后，你会获得一个链接：
```
https://cudi-coffee-route-planner.vercel.app
```

**特性：**
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 每次 git push 自动部署
- ✅ 预览环境支持
- ✅ 完全免费

---

## 方案二：GitHub Pages 部署

**优势：** 完全免费、简单、无需额外账号

### 步骤 1：安装 gh-pages

```bash
cd "/Users/HP/Desktop/Claude Project"
npm install --save-dev gh-pages
```

### 步骤 2：修改 package.json

添加以下配置：

```json
{
  "homepage": "https://你的用户名.github.io/cudi-coffee-route-planner",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

### 步骤 3：修改 vite.config.js

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/cudi-coffee-route-planner/' // 添加这一行
});
```

### 步骤 4：推送到 GitHub

```bash
# 推送代码
git remote add origin https://github.com/你的用户名/cudi-coffee-route-planner.git
git push -u origin master
```

### 步骤 5：部署

```bash
npm run deploy
```

### 步骤 6：启用 GitHub Pages

1. 访问你的 GitHub 仓库
2. 点击 **Settings** → **Pages**
3. Source 选择：**gh-pages** 分支
4. 点击 **Save**

### 步骤 7：完成 ✅

5分钟后访问：
```
https://你的用户名.github.io/cudi-coffee-route-planner
```

---

## 方案三：Netlify 拖拽部署

**优势：** 最简单（无需命令行）、功能强大

### 步骤 1：构建项目

```bash
cd "/Users/HP/Desktop/Claude Project"
npm run build
```

构建产物在 `dist/` 文件夹

### 步骤 2：部署到 Netlify

1. 访问：https://app.netlify.com/drop
2. 直接拖拽 `dist` 文件夹到页面
3. 等待上传完成

### 步骤 3：完成 ✅

立即获得一个链接：
```
https://random-name-123456.netlify.app
```

可以在 Netlify 控制台自定义域名。

---

## 🎯 快速决策指南

| 你的情况 | 推荐方案 |
|---------|---------|
| 想要最简单快速 | **Vercel** |
| 已有 GitHub 账号 | **GitHub Pages** |
| 不想用命令行 | **Netlify 拖拽** |
| 需要自动部署 | **Vercel** |
| 完全免费 | 三者都免费 |

---

## 📱 部署后的功能

用户可以：
1. ✅ 输入当前位置和店铺地址
2. ✅ 查看优化后的路线地图
3. ✅ 查看路线统计（时间、距离、费用）
4. ✅ 显示周边竞品分布
5. ✅ 数据持久化保存
6. ✅ 移动端响应式体验

---

## 🔧 常见问题

### Q1: 部署后地图不显示？
**A:** 检查浏览器控制台，确认 Leaflet CSS 加载正常。

### Q2: API 调用失败？
**A:** Nominatim 和 Overpass API 都是免费公共服务，如遇限流：
- 等待几分钟重试
- 或使用本地 demo 的缓存功能

### Q3: 如何更新已部署的版本？
**A:**
- **Vercel/GitHub Pages:** 只需 `git push`，自动部署
- **Netlify 拖拽:** 重新构建并拖拽新的 `dist` 文件夹

### Q4: 如何绑定自定义域名？
**A:** 三个平台都支持自定义域名（可能需要升级计划）

---

## 📊 性能优化建议（可选）

部署后如需优化性能：

1. **启用缓存策略**
   ```javascript
   // 在 constants.js 增加缓存时间
   export const CACHE_TTL = {
     GEOCODING: 7 * 24 * 60 * 60 * 1000,  // 7天
     COMPETITORS: 24 * 60 * 60 * 1000,     // 24小时
     ROUTES: 60 * 60 * 1000                // 1小时
   };
   ```

2. **压缩图片和资源**
   ```bash
   npm install -D vite-plugin-compression
   ```

3. **启用 PWA（离线支持）**
   ```bash
   npm install -D vite-plugin-pwa
   ```

---

## 🎉 部署成功后

分享链接给团队：
```
📍 库迪咖啡路线规划工具
🔗 https://your-app.vercel.app
📱 支持手机、平板、电脑访问
```

**功能亮点：**
- 🗺️ 可视化路线地图
- 🚇 地铁路线优化
- 💰 成本时间统计
- ☕ 竞品分布分析
- 📍 支持纽约所有区域

---

## 📞 技术支持

如遇部署问题，检查：
1. Node.js 版本 ≥ 16
2. 所有依赖已安装：`npm install`
3. 本地构建成功：`npm run build`
4. GitHub 仓库权限正确

**祝部署顺利！** 🚀
