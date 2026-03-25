# Server Setup Guide - Items Management

## Overview
所有物品数据通过服务器API进行管理。客户端通过以下端点与服务器交互：

## 数据存储方式

### 选项1：JSON 文件存储（推荐用于Demo）
- 数据保存在 `data/items.json`
- 简单、无需数据库
- 适合演示和开发
- 参考：`server-items-example.js`

### 选项2：数据库存储（推荐用于生产）
- MongoDB、MySQL、PostgreSQL 等
- 更好的性能和扩展性
- 支持复杂查询

## 必需的API端点

### 1. GET /api/items
获取所有物品列表

**请求：**
```
GET /api/items
```

**响应：**
```json
{
  "success": true,
  "items": [
    {
      "id": 1,
      "name": "Vintage Watch",
      "description": "Beautiful vintage timepiece",
      "image": "images/watch.jpg",
      "startingPrice": 100,
      "currentPrice": 120,
      "timeLeft": 7200,
      "category": "collectibles",
      "seller": "1002",
      "bidHistory": [
        {
          "bidder": "1001",
          "amount": 120,
          "time": "2024-03-13T10:30:00.000Z"
        }
      ],
      "createdAt": "2024-03-13T08:00:00.000Z"
    }
  ]
}
```

### 2. POST /api/items
创建新物品（由create.js调用）

**请求：**
```json
{
  "name": "Gaming Keyboard",
  "description": "Mechanical keyboard with RGB",
  "image": "images/item-1710345678-123456789.jpg",
  "startingPrice": 50,
  "currentPrice": 50,
  "timeLeft": 10800,
  "category": "electronics",
  "seller": "1002",
  "bidHistory": []
}
```

**响应：**
```json
{
  "success": true,
  "message": "Item created successfully",
  "item": {
    "id": 5,
    "name": "Gaming Keyboard",
    "description": "Mechanical keyboard with RGB",
    "image": "images/item-1710345678-123456789.jpg",
    "startingPrice": 50,
    "currentPrice": 50,
    "timeLeft": 10800,
    "category": "electronics",
    "seller": "1002",
    "bidHistory": [],
    "createdAt": "2024-03-13T10:45:00.000Z"
  }
}
```

### 3. POST /api/bid
对物品出价（由detail.js调用）

**请求：**
```json
{
  "itemId": 1,
  "amount": 130,
  "bidder": "1003"
}
```

**响应：**
```json
{
  "success": true,
  "message": "Bid placed successfully",
  "item": {
    "id": 1,
    "currentPrice": 130,
    "bidHistory": [
      {
        "bidder": "1003",
        "amount": 130,
        "time": "2024-03-13T10:50:00.000Z"
      },
      {
        "bidder": "1001",
        "amount": 120,
        "time": "2024-03-13T10:30:00.000Z"
      }
    ]
  }
}
```

### 4. POST /api/upload
上传物品图片（由create.js调用）

**请求：**
- Content-Type: multipart/form-data
- Field name: `image`
- File: 图片文件

**响应：**
```json
{
  "success": true,
  "imageUrl": "images/item-1710345678-123456789.jpg",
  "message": "Image uploaded successfully"
}
```

## 数据流程图

```
创建物品流程：
1. 用户填写表单 (create-listing.html)
   ↓
2. 上传图片 → POST /api/upload
   ↓ 返回图片URL
3. 提交物品数据 → POST /api/items
   ↓ 保存到 data/items.json 或数据库
4. 返回成功，跳转到首页
   ↓
5. 首页加载 → GET /api/items
   ↓ 显示所有物品（包括新添加的）
```

```
出价流程：
1. 用户在详情页出价 (item-detail.html)
   ↓
2. 提交出价 → POST /api/bid
   ↓ 验证并更新数据
3. 返回最新物品数据
   ↓
4. 更新页面显示
```

## 数据文件结构

### data/items.json
```json
{
  "items": [
    {
      "id": 1,
      "name": "Vintage Watch",
      "description": "Beautiful vintage timepiece",
      "image": "images/watch.jpg",
      "startingPrice": 100,
      "currentPrice": 120,
      "timeLeft": 7200,
      "category": "collectibles",
      "seller": "1002",
      "bidHistory": [
        {
          "bidder": "1001",
          "amount": 120,
          "time": "2024-03-13T10:30:00.000Z"
        }
      ],
      "createdAt": "2024-03-13T08:00:00.000Z",
      "lastUpdate": 1710329400000
    }
  ]
}
```

## 实现步骤

### 使用 server-items-example.js

1. **安装依赖：**
```bash
npm install express
```

2. **集成到现有服务器：**
将 `server-items-example.js` 中的路由添加到你的主服务器文件。

3. **创建数据目录：**
```bash
mkdir -p data
```

4. **初始化数据文件（可选）：**
```bash
echo '{"items":[]}' > data/items.json
```

5. **测试端点：**
```bash
# 获取所有物品
curl http://localhost:3000/api/items

# 创建新物品
curl -X POST http://localhost:3000/api/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Item",
    "description": "Test",
    "startingPrice": 10,
    "currentPrice": 10,
    "timeLeft": 3600,
    "seller": "1002",
    "bidHistory": []
  }'
```

## 倒计时逻辑

服务器端处理倒计时：
- 每次 GET /api/items 时更新 `timeLeft`
- 计算自上次更新以来的时间差
- 从 `timeLeft` 中减去经过的秒数
- 客户端也有本地倒计时，但以服务器为准

## 安全建议

1. **输入验证**：验证所有输入数据
2. **用户认证**：添加登录系统
3. **权限控制**：确保只有物品所有者可以编辑
4. **防止恶意出价**：验证出价金额合法性
5. **API限流**：防止滥用

## 测试清单

- [ ] GET /api/items 返回正确的物品列表
- [ ] POST /api/items 可以创建新物品
- [ ] POST /api/bid 可以成功出价
- [ ] POST /api/upload 可以上传图片
- [ ] 倒计时正确更新
- [ ] 出价历史正确记录
- [ ] 错误情况正确处理
