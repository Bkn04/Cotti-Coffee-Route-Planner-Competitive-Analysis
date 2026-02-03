# 库迪咖啡路线规划应用 | Cudi Coffee Route Planner

一款专为库迪咖啡纽约区域经理设计的路线规划工具，用于优化每日多店铺选址访问路线。

## 🌐 在线演示

**正式版本：** [立即体验](https://your-username.github.io/cudi-coffee-route-planner) *(部署后替换链接)*

**本地运行：** 见下方"快速开始"章节

---

## 功能特性

### 核心功能
- ✅ **多地址管理** - 添加、删除、查看多个店铺地址
- ✅ **智能路线优化** - 基于贪心算法自动优化访问顺序
- ✅ **地图可视化** - 在纽约地图上直观显示所有店铺位置
- ✅ **竞品分布** - 显示周边星巴克、瑞幸、Blank Street等竞品咖啡店
- ✅ **路线统计** - 实时显示总距离、预估时间和费用
- ✅ **数据持久化** - 自动保存所有数据到本地存储
- ✅ **响应式设计** - 支持桌面端和移动端

### MVP版本功能
- 当前位置设置（手动输入或GPS定位）
- 店铺地址添加（支持地理编码）
- 路线自动优化（最近邻算法）
- 地图标记和路线显示
- 成本和时间估算

## 技术栈

- **前端框架**: React 18
- **构建工具**: Vite 5
- **地图库**: Leaflet.js + React-Leaflet
- **地图数据**: OpenStreetMap（免费）
- **地理编码**: Nominatim API（免费）
- **数据存储**: LocalForage
- **样式**: 原生CSS（CSS变量）

## 快速开始

### 前置要求
- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

应用会自动在浏览器中打开：[http://localhost:5173](http://localhost:5173)

### 构建生产版本

```bash
npm run build
npm run preview
```

## 🚀 在线部署

想让所有人都能访问这个应用？查看详细部署指南：

📖 **[完整部署文档](./DEPLOYMENT.md)**

### 三种免费部署方案

| 方案 | 时间 | 难度 | 推荐度 |
|------|------|------|--------|
| **Vercel** | 3分钟 | ⭐ | ⭐⭐⭐⭐⭐ |
| **GitHub Pages** | 5分钟 | ⭐⭐ | ⭐⭐⭐⭐ |
| **Netlify拖拽** | 2分钟 | ⭐ | ⭐⭐⭐ |

### 🎯 快速部署（GitHub Pages）

```bash
# 运行自动化脚本
./deploy-github-pages.sh
```

或手动部署：

```bash
# 1. 安装gh-pages
npm install --save-dev gh-pages

# 2. 部署
npm run deploy
```

**完整步骤和其他方案，请查看：** [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 使用指南

### 1. 设置当前位置

首次使用时，需要设置你的当前位置：

- **方式一**：输入地址（如 "Times Square, New York, NY"）
- **方式二**：点击"使用我的位置"按钮（需要浏览器定位权限）

### 2. 添加店铺

在"添加店铺"区域输入店铺地址：

```
示例地址：
- 350 5th Ave, New York, NY（帝国大厦）
- 1 Wall St, New York, NY（华尔街）
- 1 Brooklyn Bridge, Brooklyn, NY（布鲁克林大桥）
```

### 3. 查看优化路线

添加2个或更多店铺后：
- 系统会自动优化访问顺序
- 地图上显示编号标记（按访问顺序）
- 紫色虚线连接路线
- 查看总距离、时间和费用统计

### 4. 查看竞品分布

点击"显示竞品"按钮：
- 地图上显示周边竞品咖啡店（500米范围内）
- 不同颜色标记不同品牌：
  - 🟢 星巴克 (Starbucks)
  - 🔵 瑞幸咖啡 (Luckin Coffee)
  - 🟡 Blank Street Coffee
  - 🟠 Dunkin'
- 右下角显示竞品统计数量

### 5. 管理店铺

- **查看列表**：侧边栏显示所有店铺
- **删除店铺**：点击店铺卡片右侧的 × 按钮
- **路线更新**：删除店铺后路线自动重新优化

## 项目结构

```
/Users/HP/Desktop/Claude Project/
├── index.html                          # HTML入口
├── package.json                        # 项目配置
├── vite.config.js                      # Vite配置
├── README.md                           # 项目文档
│
├── public/                             # 静态资源
│   └── data/                           # 数据文件
│
└── src/
    ├── main.jsx                        # React入口
    ├── App.jsx                         # 主应用组件
    │
    ├── components/                     # React组件
    │   ├── Map/
    │   │   └── MapView.jsx             # 地图组件
    │   ├── Controls/
    │   │   ├── AddressInput.jsx        # 地址输入
    │   │   └── StoreList.jsx           # 店铺列表
    │   └── RoutePanel/
    │       └── RouteSummary.jsx        # 路线摘要
    │
    ├── hooks/                          # 自定义Hooks
    │   ├── useStores.js                # 店铺管理
    │   └── useRoute.js                 # 路线优化
    │
    ├── services/                       # 业务逻辑
    │   ├── geocoding.js                # 地理编码
    │   └── optimization.js             # 路线优化算法
    │
    ├── utils/                          # 工具函数
    │   ├── distance.js                 # 距离计算
    │   ├── constants.js                # 常量配置
    │   └── storage.js                  # 存储管理
    │
    └── styles/
        └── main.css                    # 全局样式
```

## API说明

### 使用的免费API

1. **Nominatim (OpenStreetMap)**
   - 用途：地址地理编码
   - 限制：每秒1次请求
   - 无需API密钥

2. **OpenStreetMap Tiles**
   - 用途：地图瓦片显示
   - 完全免费
   - 无需API密钥

3. **Overpass API (OpenStreetMap)**
   - 用途：竞品咖啡店POI查询
   - 限制：合理使用
   - 无需API密钥

### 未来可选API

1. **MTA API** - 实时地铁数据
2. **OpenRouteService** - 高级路线规划

## 核心算法

### 路线优化：贪心最近邻算法

```javascript
算法流程：
1. 从当前位置出发
2. 找到最近的未访问店铺
3. 移动到该店铺
4. 重复步骤2-3直到访问所有店铺

时间复杂度：O(n²)
适用范围：<50个店铺
```

### 距离计算：Haversine公式

用于计算地球表面两点之间的最短距离（大圆距离）。

## 数据存储

### LocalForage存储结构

```javascript
{
  "cudi_stores": [
    {
      "id": "uuid",
      "name": "店铺名称",
      "address": "原始地址",
      "displayAddress": "格式化地址",
      "coordinates": { "lat": 40.7589, "lng": -73.9851 },
      "addedAt": "2024-02-02T..."
    }
  ],
  "cudi_current_location": {
    "address": "Times Square",
    "coordinates": { "lat": 40.7589, "lng": -73.9851 }
  },
  "cudi_route": {
    "route": [...],
    "stats": { ... },
    "optimizedAt": "2024-02-02T..."
  }
}
```

## 常见问题

### 1. 地址解析失败怎么办？

- 确保地址包含 "New York" 或 "NYC"
- 使用完整地址格式：街道 + 城市 + 州
- 检查拼写是否正确

### 2. 如何清除所有数据？

打开浏览器控制台（F12），运行：

```javascript
localStorage.clear();
location.reload();
```

### 3. 支持哪些浏览器？

- Chrome/Edge: ✅ 最佳体验
- Firefox: ✅ 完全支持
- Safari: ✅ 支持（需允许定位权限）

## 性能优化

- ✅ 组件懒加载
- ✅ 地理编码结果缓存
- ✅ 防抖处理用户输入
- ✅ 路线优化异步计算
- ✅ LocalForage高效存储

## 未来功能计划

### 第二版本（增强功能）

- [ ] 地铁路线集成（MTA数据）
- [x] 竞品分布显示（星巴克、瑞幸等） ✅ **已完成**
- [ ] 分步导航指引
- [ ] 多日行程规划
- [ ] 导出路线为PDF
- [ ] 竞品密度分析图表

### 第三版本（高级功能）

- [ ] 后端API集成
- [ ] 用户账号系统
- [ ] 团队协作功能
- [ ] 实时交通数据
- [ ] 移动端原生App

## 开发指南

### 添加新组件

```bash
# 创建新组件
touch src/components/YourComponent/YourComponent.jsx

# 在App.jsx中引入
import YourComponent from './components/YourComponent/YourComponent';
```

### 添加新服务

```bash
# 创建服务文件
touch src/services/yourService.js

# 导出函数
export async function yourFunction() { ... }
```

### 修改样式

编辑 `src/styles/main.css`，使用CSS变量：

```css
.your-class {
  color: var(--primary-blue);
  padding: var(--spacing-md);
}
```

## 故障排除

### 依赖安装失败

```bash
# 清除缓存
rm -rf node_modules package-lock.json
npm cache clean --force

# 重新安装
npm install
```

### 端口被占用

修改 `vite.config.js` 中的端口：

```javascript
export default defineConfig({
  server: {
    port: 3000 // 改为其他端口
  }
})
```

## 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

## 许可证

MIT License

## 联系方式

- **项目**: 库迪咖啡路线规划应用
- **版本**: 1.0.0 (MVP)
- **开发时间**: 2024年2月

---

**⚠️ 注意事项：**

1. 本应用使用免费API，请遵守使用限制
2. 地理编码结果仅供参考，实际路线请以导航为准
3. 费用估算基于标准地铁票价（$2.90），实际费用可能不同
4. 数据存储在本地浏览器，清除浏览器数据会导致数据丢失

**✨ 祝您使用愉快！**
