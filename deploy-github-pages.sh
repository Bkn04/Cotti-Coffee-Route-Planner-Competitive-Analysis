#!/bin/bash

# 库迪咖啡路线规划 - GitHub Pages 自动部署脚本

echo "🚀 开始部署到 GitHub Pages..."
echo ""

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在项目根目录运行此脚本"
    exit 1
fi

# 1. 安装 gh-pages（如果未安装）
echo "📦 检查依赖..."
if ! grep -q "gh-pages" package.json; then
    echo "安装 gh-pages..."
    npm install --save-dev gh-pages
fi

# 2. 提示用户输入 GitHub 用户名
echo ""
echo "请输入你的 GitHub 用户名："
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ 错误：GitHub 用户名不能为空"
    exit 1
fi

# 3. 更新 vite.config.js
echo ""
echo "📝 更新 Vite 配置..."
cat > vite.config.js << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/cudi-coffee-route-planner/'
});
EOF

# 4. 更新 package.json
echo "📝 更新 package.json..."
node << EOF
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.homepage = 'https://$GITHUB_USERNAME.github.io/cudi-coffee-route-planner';
pkg.scripts = pkg.scripts || {};
pkg.scripts.predeploy = 'npm run build';
pkg.scripts.deploy = 'gh-pages -d dist';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
EOF

# 5. 构建项目
echo ""
echo "🔨 构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 6. 检查是否已添加 remote
if ! git remote | grep -q "origin"; then
    echo ""
    echo "🔗 添加 GitHub remote..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/cudi-coffee-route-planner.git"
fi

# 7. 提交更改
echo ""
echo "💾 提交配置更改..."
git add vite.config.js package.json package-lock.json
git commit -m "chore: Configure for GitHub Pages deployment"

# 8. 推送到 GitHub
echo ""
echo "📤 推送到 GitHub..."
git push -u origin master

# 9. 部署到 GitHub Pages
echo ""
echo "🚀 部署到 GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "📋 下一步："
    echo "1. 访问 GitHub 仓库：https://github.com/$GITHUB_USERNAME/cudi-coffee-route-planner"
    echo "2. 点击 Settings → Pages"
    echo "3. Source 选择 'gh-pages' 分支"
    echo "4. 点击 Save"
    echo ""
    echo "5分钟后访问："
    echo "🔗 https://$GITHUB_USERNAME.github.io/cudi-coffee-route-planner"
    echo ""
else
    echo "❌ 部署失败，请检查错误信息"
    exit 1
fi
