# AI试衣功能配置说明

本文档说明如何配置阿里云百炼 AI 试衣 Plus 版 API。

## 环境变量配置

### 1. 创建 `.env` 文件

在项目根目录（`demo/demo/`）下创建 `.env` 文件，添加以下配置：

```env
# 阿里云DashScope API Key（必填）
VUE_APP_DASHSCOPE_API_KEY=sk-your-api-key-here

# 图片上传服务地址（可选）
VUE_APP_IMAGE_UPLOAD_URL=
```

### 2. 获取 API Key

1. 登录 [阿里云百炼控制台](https://dashscope.console.aliyun.com/)
2. 进入 **API-KEY管理** 页面
3. 点击 **创建API Key**
4. 复制生成的 API Key（格式：`sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）
5. 将 API Key 填入 `.env` 文件中的 `VUE_APP_DASHSCOPE_API_KEY`

### 3. 配置图片上传服务（可选）

AI 试衣 API 需要公网可访问的图片 URL。如果您上传的是本地图片，需要配置图片上传服务。

#### 选项1：使用免费图床（默认，无需配置）

**系统已内置免费图床支持**，如果您不配置 `VUE_APP_IMAGE_UPLOAD_URL`，系统会自动使用 sm.ms 免费图床服务上传图片。

- ✅ **优点**：无需配置，开箱即用
- ⚠️ **注意**：免费服务可能有稳定性限制，建议生产环境使用专用服务

#### 选项2：使用阿里云OSS（推荐，生产环境）

1. 开通阿里云OSS服务
2. 创建存储桶（Bucket）
3. 配置跨域访问（CORS）
4. 创建图片上传接口，返回公网URL
5. 将接口地址填入 `VUE_APP_IMAGE_UPLOAD_URL`

**示例配置：**
```env
VUE_APP_IMAGE_UPLOAD_URL=https://your-domain.com/api/upload/image
```

#### 选项3：使用其他对象存储服务

- 腾讯云COS
- 七牛云
- 又拍云
- 其他支持公网访问的对象存储服务

#### 选项4：使用已有公网URL

如果您的图片已经是公网可访问的URL（如CDN地址），可以不配置 `VUE_APP_IMAGE_UPLOAD_URL`。

## API 使用说明

### 功能特点

- **模型**：aitryon-plus（AI试衣Plus版）
- **生成时间**：15-30秒
- **计费**：0.50元/张
- **免费额度**：400张

### 输入要求

#### 模特图要求

- 文件大小：5KB - 5MB
- 分辨率：150px - 4096px
- 格式：JPG、JPEG、PNG、BMP、HEIC
- 要求：全身正面照，光照良好，有且仅有一个完整的人

#### 服饰图要求

- 文件大小：5KB - 5MB
- 分辨率：150px - 4096px
- 格式：JPG、JPEG、PNG、BMP、HEIC
- 要求：平铺拍摄，服饰完整，背景简洁

### 使用流程

1. **上传照片**：选择一张全身正面照
2. **选择汉服**：从汉服列表中选择一个样式
3. **开始换装**：点击"开始换装"按钮
4. **等待生成**：AI处理需要15-30秒
5. **查看结果**：生成完成后自动跳转到结果页面

## 错误处理

系统会自动处理以下错误情况：

- API Key 未配置或无效
- 图片上传失败
- 图片格式或大小不符合要求
- 网络连接问题
- API 调用失败

所有错误都会显示友好的中文提示信息。

## 注意事项

1. **API Key 安全**：请勿将 `.env` 文件提交到版本控制系统
2. **图片URL**：确保图片URL是公网可访问的，不支持本地路径
3. **任务结果**：任务结果仅保留24小时，请及时保存生成的图片
4. **网络要求**：需要稳定的网络连接，建议使用中国大陆服务器
5. **地域限制**：API仅支持"中国大陆（北京）"地域

## 技术支持

如遇到问题，请检查：

1. API Key 是否正确配置
2. 网络连接是否正常
3. 图片是否符合要求
4. 浏览器控制台是否有错误信息

更多信息请参考：[阿里云百炼AI试衣文档](https://help.aliyun.com/zh/model-studio/developer-reference/api-details-9)

## 技术支持

如遇到问题，请检查：

1. API Key 是否正确配置
2. 网络连接是否正常
3. 图片是否符合要求
4. 浏览器控制台是否有错误信息

更多信息请参考：[阿里云百炼AI试衣文档](https://help.aliyun.com/zh/model-studio/developer-reference/api-details-9)


