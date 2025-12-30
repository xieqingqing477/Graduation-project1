# 火山引擎AI换装API配置说明

## 1. 环境变量配置

在项目根目录的 `.env` 文件中添加以下配置（如果还没有该文件，请创建）：

```env
# 火山引擎API配置
VOLCANO_ACCESS_KEY_ID=AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY
VOLCANO_SECRET_ACCESS_KEY=TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==
```

## 2. 前端环境变量配置（可选）

如果需要在前端使用，可以在 `.env` 文件中添加：

```env
# 火山引擎API配置（前端）
VUE_APP_VOLCANO_ACCESS_KEY_ID=AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY
VUE_APP_VOLCANO_SECRET_ACCESS_KEY=TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==
```

**注意**：前端环境变量通常不需要配置，因为API调用是通过后端代理的。

## 3. 功能说明

### 换装页面功能

在换装页面（`clothes.vue`）中，现在有两个换装按钮：

1. **阿里云换装**：使用阿里云DashScope AI试衣Plus版
2. **火山引擎换装**：使用火山引擎图片换装API

### 使用步骤

1. 上传模特的全身正面照
2. 选择汉服样式
3. 点击"阿里云换装"或"火山引擎换装"按钮
4. 等待AI生成换装效果

## 4. API接口说明

### 后端接口

- **路径**：`POST /api/dress/volcano`
- **请求体**：
  ```json
  {
    "personImageUrl": "https://公网可访问的人物图片URL",
    "garmentImageUrl": "https://公网可访问的服装图片URL"
  }
  ```
- **响应**：
  ```json
  {
    "success": true,
    "imageUrl": "https://生成的换装效果图URL",
    "image_urls": ["https://生成的换装效果图URL"]
  }
  ```

## 5. 注意事项

1. **图片URL要求**：
   - 图片必须是公网可访问的URL（不能是本地地址）
   - 如果图片是本地文件，系统会自动通过OSS或免费图床服务转换为公网URL

2. **API签名**：
   - 后端已实现火山引擎Signature Version 4签名算法
   - 签名会自动生成，无需手动配置

3. **超时设置**：
   - 前端请求超时时间：120秒
   - 如果生成时间较长，请耐心等待

4. **错误处理**：
   - 如果API调用失败，会显示错误提示
   - 请检查网络连接和API密钥配置

## 6. 重启服务

配置完成后，需要重启后端服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
node src/serve/nodeserve.js
```

## 7. 测试

1. 打开换装页面
2. 上传照片并选择汉服
3. 点击"火山引擎换装"按钮
4. 查看生成的换装效果

## 8. 故障排查

如果遇到问题，请检查：

1. 后端服务器是否正常运行
2. `.env` 文件中的API密钥是否正确
3. 图片URL是否是公网可访问的
4. 网络连接是否正常
5. 查看后端控制台的错误日志


## 1. 环境变量配置

在项目根目录的 `.env` 文件中添加以下配置（如果还没有该文件，请创建）：

```env
# 火山引擎API配置
VOLCANO_ACCESS_KEY_ID=AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY
VOLCANO_SECRET_ACCESS_KEY=TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==
```

## 2. 前端环境变量配置（可选）

如果需要在前端使用，可以在 `.env` 文件中添加：

```env
# 火山引擎API配置（前端）
VUE_APP_VOLCANO_ACCESS_KEY_ID=AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY
VUE_APP_VOLCANO_SECRET_ACCESS_KEY=TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==
```

**注意**：前端环境变量通常不需要配置，因为API调用是通过后端代理的。

## 3. 功能说明

### 换装页面功能

在换装页面（`clothes.vue`）中，现在有两个换装按钮：

1. **阿里云换装**：使用阿里云DashScope AI试衣Plus版
2. **火山引擎换装**：使用火山引擎图片换装API

### 使用步骤

1. 上传模特的全身正面照
2. 选择汉服样式
3. 点击"阿里云换装"或"火山引擎换装"按钮
4. 等待AI生成换装效果

## 4. API接口说明

### 后端接口

- **路径**：`POST /api/dress/volcano`
- **请求体**：
  ```json
  {
    "personImageUrl": "https://公网可访问的人物图片URL",
    "garmentImageUrl": "https://公网可访问的服装图片URL"
  }
  ```
- **响应**：
  ```json
  {
    "success": true,
    "imageUrl": "https://生成的换装效果图URL",
    "image_urls": ["https://生成的换装效果图URL"]
  }
  ```

## 5. 注意事项

1. **图片URL要求**：
   - 图片必须是公网可访问的URL（不能是本地地址）
   - 如果图片是本地文件，系统会自动通过OSS或免费图床服务转换为公网URL

2. **API签名**：
   - 后端已实现火山引擎Signature Version 4签名算法
   - 签名会自动生成，无需手动配置

3. **超时设置**：
   - 前端请求超时时间：120秒
   - 如果生成时间较长，请耐心等待

4. **错误处理**：
   - 如果API调用失败，会显示错误提示
   - 请检查网络连接和API密钥配置

## 6. 重启服务

配置完成后，需要重启后端服务器：

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
node src/serve/nodeserve.js
```

## 7. 测试

1. 打开换装页面
2. 上传照片并选择汉服
3. 点击"火山引擎换装"按钮
4. 查看生成的换装效果

## 8. 故障排查

如果遇到问题，请检查：

1. 后端服务器是否正常运行
2. `.env` 文件中的API密钥是否正确
3. 图片URL是否是公网可访问的
4. 网络连接是否正常
5. 查看后端控制台的错误日志





