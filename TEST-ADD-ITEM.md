# 测试 Add Item 功能

## 测试步骤

### 1. 准备桌子图片

先把桌子图片保存到 images 目录：
```bash
# 将您的桌子图片保存为
images/desk.jpg
```

### 2. 启动测试

**选项A：直接用浏览器打开**
```
1. 打开 create-listing.html?user=1002
2. 填写表单：
   - Item Name: Electric Standing Desk
   - Category: Other
   - Starting Price: 500
   - Auction Duration: 6 hours
   - Description: Modern electric standing desk with memory settings
   - Image: 选择 desk.jpg
3. 点击 Submit Listing
4. 等待 1.5 秒自动跳转
5. 在首页应该能看到新物品
```

**选项B：使用 Python 服务器**
```bash
# 启动服务器
python3 -m http.server 8000

# 访问
http://localhost:8000/create-listing.html?user=1002
```

### 3. 验证结果

创建成功后，检查：

1. **首页显示**
   - 访问 `index.html?user=1002`
   - 应该看到新的 "Electric Standing Desk" 物品

2. **LocalStorage 数据**
   - 打开浏览器控制台（F12）
   - Application → Local Storage
   - 查看 `auctionItems` 键
   - 应该包含新物品数据

3. **详情页**
   - 点击新物品的 "View Details"
   - 应该显示完整信息
   - 可以出价测试

### 4. 预期数据结构

新物品在 localStorage 中的格式：
```json
{
  "id": 5,
  "name": "Electric Standing Desk",
  "description": "Modern electric standing desk with memory settings",
  "image": "images/desk.jpg",
  "startingPrice": 500,
  "currentPrice": 500,
  "timeLeft": 21600,
  "category": "other",
  "seller": "1002",
  "bidHistory": [],
  "createdAt": 1710345678000
}
```

## 测试检查清单

- [ ] 表单验证正常（必填项检查）
- [ ] 图片选择后显示文件名
- [ ] 提交后显示成功消息
- [ ] 1.5秒后自动跳转到首页
- [ ] 首页显示新物品
- [ ] 新物品可以点击查看详情
- [ ] 可以对新物品出价
- [ ] 刷新页面后数据仍然存在
- [ ] 切换用户后仍能看到新物品

## 清除测试数据

如果需要重新测试：
```javascript
// 在浏览器控制台运行
localStorage.removeItem('auctionItems');
location.reload();
```

## 多用户测试

1. **Bob 创建物品** (user=1002)
   ```
   create-listing.html?user=1002
   ```

2. **Andy 出价** (user=1001)
   ```
   index.html?user=1001
   → 点击桌子
   → 出价 550
   ```

3. **Cathy 出更高价** (user=1003)
   ```
   index.html?user=1003
   → 点击桌子
   → 出价 600
   ```

4. **验证所有窗口**
   - 刷新所有窗口
   - 所有用户都应该看到最新价格 $600
   - 出价历史应该显示 Cathy → Andy
