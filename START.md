# 🚀 快速启动指南

## 第一步：安装依赖

在项目目录下运行：

```bash
npm install
```

这会安装：
- `express` - Web服务器框架
- `multer` - 文件上传处理
- `cors` - 跨域支持
- `nodemon` - 开发时自动重启（可选）

## 第二步：启动服务器

```bash
npm start
```

或者使用自动重启模式（开发时推荐）：

```bash
npm run dev
```

## 第三步：访问网站

打开浏览器访问：

**用户 Bob (1002)：**
```
http://localhost:3000/index.html?user=1002
```

**用户 Andy (1001)：**
```
http://localhost:3000/index.html?user=1001
```

**用户 Cathy (1003)：**
```
http://localhost:3000/index.html?user=1003
```

## 功能测试清单

### ✅ 浏览物品
1. 打开首页，应该看到4个物品
2. 右上角显示当前用户（如 "👤 Bob"）
3. 点击任意物品的 "View Details" 按钮

### ✅ 出价
1. 在物品详情页输入价格（必须高于当前价格）
2. 点击 "Place Bid" 按钮
3. 应该看到成功提示和更新的价格

### ✅ 创建物品
1. 点击导航栏的 "Sell Item"
2. 填写表单：
   - Item Name: 测试物品
   - Category: Electronics
   - Starting Price: 50
   - Auction Duration: 3 hours
   - Description: 这是一个测试物品
   - Image: 选择一张图片（可选）
3. 点击 "Submit Listing"
4. 2秒后自动跳转到首页，应该能看到新创建的物品

### ✅ 导航保持用户
1. 点击 "Home" 链接，URL应该保持 `?user=1002`
2. 点击 "Auctions"，URL应该保持用户参数
3. 在不同页面间切换，用户身份不会丢失

## 服务器端点

启动后可用的API：

```
GET  http://localhost:3000/api/items
POST http://localhost:3000/api/items
POST http://localhost:3000/api/bid
POST http://localhost:3000/api/upload
```

## 数据存储

所有数据保存在：
```
data/items.json
```

上传的图片保存在：
```
images/item-*.jpg
```

## 故障排除

### 端口被占用
如果端口 3000 已被使用，可以修改端口：

```bash
PORT=8080 npm start
```

然后访问 `http://localhost:8080/index.html?user=1002`

### 权限错误
确保有权限写入 `data/` 和 `images/` 目录。

### 图片上传失败
检查 `images/` 目录是否存在且可写。

### 数据丢失
检查 `data/items.json` 文件是否存在。如果不存在，服务器会自动创建。

## 停止服务器

按 `Ctrl + C` 停止服务器。

## 重置数据

如果想重新开始，可以删除或清空 `data/items.json`：

```bash
echo '{"items":[]}' > data/items.json
```

或者恢复初始数据：

```bash
cp data/items.json data/items.backup.json
git checkout data/items.json
```

## 多用户测试

打开3个浏览器窗口，分别使用不同用户：
1. 窗口1: `?user=1001` (Andy)
2. 窗口2: `?user=1002` (Bob)
3. 窗口3: `?user=1003` (Cathy)

模拟多用户竞拍场景。

## 下一步

- 添加用户认证系统
- 实现实时出价通知（WebSocket）
- 添加搜索和筛选功能
- 集成支付系统
