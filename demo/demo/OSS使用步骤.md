# OSS配置完成后的使用步骤

## 一、确认Bucket信息

创建Bucket后，请记录以下信息：

1. **Bucket名称**：例如 `my-hanfu-images`
2. **地域**：例如 `oss-cn-beijing`
3. **读写权限**：应该是"公共读"

## 二、获取AccessKey

### 重要：关于AccessKey的安全提示

当您进入AccessKey管理页面时，会看到安全警告提示。有两种选择：

#### 选项1：使用 RAM 用户 AccessKey（推荐，更安全）

**优点**：
- 权限最小化，只授予OSS相关权限
- 即使泄露，也不会影响整个账号
- 更符合安全最佳实践

**适用场景**：
- 生产环境
- 长期使用的项目
- 需要更高安全性的场景

**创建步骤**：
1. 点击 **"使用 RAM 用户 AccessKey"** 按钮
2. 按照提示创建RAM用户
3. 为RAM用户授予OSS相关权限
4. 创建该RAM用户的AccessKey

#### 选项2：继续使用云账号 AccessKey（简单，适合测试）

**优点**：
- 创建简单，一步到位
- 适合测试和开发环境

**缺点**：
- 拥有账号的完全权限
- 如果泄露，风险较大

**适用场景**：
- 毕业设计项目（测试环境）
- 个人学习项目
- 短期使用的项目

**创建步骤**：
1. 勾选 **"我确认知晓云账号 AccessKey 安全风险"**
2. 点击 **"继续使用云账号 AccessKey"**
3. 创建AccessKey并保存

### 推荐选择

**对于毕业设计项目**：
- 如果只是测试使用，可以选择 **"继续使用云账号 AccessKey"**（简单快速）
- 如果希望更安全，建议使用 **"使用 RAM 用户 AccessKey"**（推荐）

### 创建AccessKey（两种方式）

#### 方式一：使用云账号 AccessKey（简单）

1. 在阿里云控制台，点击右上角头像
2. 选择 **AccessKey管理**
3. 看到安全提示时，勾选 **"我确认知晓云账号 AccessKey 安全风险"**
4. 点击 **"继续使用云账号 AccessKey"**
5. 点击 **创建AccessKey**
6. 保存以下信息（只显示一次，请妥善保管）：
   - **AccessKey ID**：例如 `LTAI5txxxxxxxxxxxxx`
   - **AccessKey Secret**：例如 `xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**重要：配置网络访问策略**

创建AccessKey后，可能会看到"AccessKey 级网络访问限制策略"页面：

**对于毕业设计项目（本地开发）**：
- 点击 **"允许所有公网访问"** 按钮（灰色按钮）
- 这样您就可以从本地开发环境使用AccessKey了
- 点击 **"提交"** 保存设置

**说明**：
- 这个设置是限制AccessKey可以从哪些IP地址使用
- 默认情况下，如果不配置，所有公网访问都会被拒绝
- 对于本地开发测试，允许所有公网访问即可
- 如果是生产环境，建议配置具体的IP地址列表

#### 方式二：使用 RAM 用户 AccessKey（推荐）

1. 在安全提示页面，点击 **"使用 RAM 用户 AccessKey"**
2. 进入RAM控制台，创建RAM用户：
   - 用户名：例如 `oss-user`
   - 访问方式：选择"编程访问"
3. 为用户授权OSS权限：
   - 选择"直接授权"
   - 搜索并选择 `AliyunOSSFullAccess`（OSS完全访问权限）
4. 创建完成后，为该RAM用户创建AccessKey
5. 保存AccessKey ID和Secret

## 三、安装依赖包

在项目根目录（`demo/demo/`）执行：

```bash
cd demo/demo
npm install ali-oss dotenv
```

或者直接运行 `安装OSS依赖.bat` 脚本（Windows系统）。

## 四、创建环境变量文件

在项目根目录（`demo/demo/`）创建 `.env` 文件：

```env
# 阿里云OSS配置
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
OSS_BUCKET=your-bucket-name
```

**重要**：请将上面的值替换为您实际的信息：
- `OSS_REGION`：您的Bucket地域（如：`oss-cn-beijing`、`oss-cn-shanghai`）
- `OSS_ACCESS_KEY_ID`：您的AccessKey ID
- `OSS_ACCESS_KEY_SECRET`：您的AccessKey Secret
- `OSS_BUCKET`：您的Bucket名称

**示例**：
```env
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=LTAI5txxxxxxxxxxxxx
OSS_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OSS_BUCKET=my-hanfu-images
```

## 五、配置CORS（跨域访问）

1. 在OSS控制台，选择您创建的Bucket
2. 进入 **权限管理** > **跨域设置**
3. 点击 **创建规则**
4. 配置如下：
   - **来源**：`http://localhost:8080`（或您的域名）
   - **允许Methods**：`GET`、`POST`、`PUT`
   - **允许Headers**：`*`
   - **暴露Headers**：`ETag`、`x-oss-request-id`
   - **缓存时间**：`3600`
5. 点击 **确定** 保存

## 六、重启后端服务器

配置完成后，重启后端服务器：

```bash
cd demo/demo
node src/serve/nodeserve.js
```

## 七、测试OSS配置

### 方法一：通过前端上传测试

1. 启动前端服务器（如果还没启动）：
   ```bash
   cd demo/demo
   npm run serve
   ```

2. 访问前端页面，尝试上传一张图片
3. 检查返回的URL是否为OSS地址（格式：`https://your-bucket.oss-cn-beijing.aliyuncs.com/...`）
4. 在浏览器中访问该URL，确认图片可以正常显示

### 方法二：通过AI试衣功能测试

1. 进入AI试衣页面
2. 上传一张用户照片
3. 选择一件汉服
4. 点击"开始试衣"
5. 如果配置正确，图片会自动上传到OSS，然后调用AI试衣API

## 八、验证配置是否成功

### 检查后端日志

重启后端服务器后，查看控制台输出：
- 如果没有报错，说明配置正常
- 如果看到 `OSS上传失败` 错误，检查：
  1. `.env` 文件中的配置是否正确
  2. AccessKey是否有权限
  3. Bucket名称和地域是否正确

### 检查图片URL

上传图片后，返回的URL应该是：
```
https://your-bucket.oss-cn-beijing.aliyuncs.com/images/1234567890-filename.jpg
```

而不是：
```
http://127.0.0.1:8083/img/filename.jpg
```

如果返回的是本地URL，说明OSS配置未生效，请检查：
1. `.env` 文件是否存在且配置正确
2. 后端服务器是否已重启
3. 依赖包是否已安装（`ali-oss`、`dotenv`）

## 常见问题

### 1. 上传失败，提示"OSS上传失败"

**可能原因**：
- AccessKey配置错误
- Bucket名称或地域不正确
- AccessKey没有权限

**解决方法**：
1. 检查 `.env` 文件中的配置
2. 确认AccessKey是否有OSS的读写权限
3. 确认Bucket名称和地域是否正确

### 2. 图片URL仍然是本地地址

**可能原因**：
- OSS配置未生效
- 后端服务器未重启
- 依赖包未安装

**解决方法**：
1. 确认已安装 `ali-oss` 和 `dotenv`
2. 确认 `.env` 文件在正确位置（`demo/demo/.env`）
3. 重启后端服务器

### 3. 图片无法访问

**可能原因**：
- Bucket权限不是"公共读"
- CORS未配置

**解决方法**：
1. 检查Bucket权限是否为"公共读"
2. 检查CORS配置是否正确

## 完成！

配置完成后，您的AI试衣功能就可以正常使用OSS存储图片了！


## 一、确认Bucket信息

创建Bucket后，请记录以下信息：

1. **Bucket名称**：例如 `my-hanfu-images`
2. **地域**：例如 `oss-cn-beijing`
3. **读写权限**：应该是"公共读"

## 二、获取AccessKey

### 重要：关于AccessKey的安全提示

当您进入AccessKey管理页面时，会看到安全警告提示。有两种选择：

#### 选项1：使用 RAM 用户 AccessKey（推荐，更安全）

**优点**：
- 权限最小化，只授予OSS相关权限
- 即使泄露，也不会影响整个账号
- 更符合安全最佳实践

**适用场景**：
- 生产环境
- 长期使用的项目
- 需要更高安全性的场景

**创建步骤**：
1. 点击 **"使用 RAM 用户 AccessKey"** 按钮
2. 按照提示创建RAM用户
3. 为RAM用户授予OSS相关权限
4. 创建该RAM用户的AccessKey

#### 选项2：继续使用云账号 AccessKey（简单，适合测试）

**优点**：
- 创建简单，一步到位
- 适合测试和开发环境

**缺点**：
- 拥有账号的完全权限
- 如果泄露，风险较大

**适用场景**：
- 毕业设计项目（测试环境）
- 个人学习项目
- 短期使用的项目

**创建步骤**：
1. 勾选 **"我确认知晓云账号 AccessKey 安全风险"**
2. 点击 **"继续使用云账号 AccessKey"**
3. 创建AccessKey并保存

### 推荐选择

**对于毕业设计项目**：
- 如果只是测试使用，可以选择 **"继续使用云账号 AccessKey"**（简单快速）
- 如果希望更安全，建议使用 **"使用 RAM 用户 AccessKey"**（推荐）

### 创建AccessKey（两种方式）

#### 方式一：使用云账号 AccessKey（简单）

1. 在阿里云控制台，点击右上角头像
2. 选择 **AccessKey管理**
3. 看到安全提示时，勾选 **"我确认知晓云账号 AccessKey 安全风险"**
4. 点击 **"继续使用云账号 AccessKey"**
5. 点击 **创建AccessKey**
6. 保存以下信息（只显示一次，请妥善保管）：
   - **AccessKey ID**：例如 `LTAI5txxxxxxxxxxxxx`
   - **AccessKey Secret**：例如 `xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

**重要：配置网络访问策略**

创建AccessKey后，可能会看到"AccessKey 级网络访问限制策略"页面：

**对于毕业设计项目（本地开发）**：
- 点击 **"允许所有公网访问"** 按钮（灰色按钮）
- 这样您就可以从本地开发环境使用AccessKey了
- 点击 **"提交"** 保存设置

**说明**：
- 这个设置是限制AccessKey可以从哪些IP地址使用
- 默认情况下，如果不配置，所有公网访问都会被拒绝
- 对于本地开发测试，允许所有公网访问即可
- 如果是生产环境，建议配置具体的IP地址列表

#### 方式二：使用 RAM 用户 AccessKey（推荐）

1. 在安全提示页面，点击 **"使用 RAM 用户 AccessKey"**
2. 进入RAM控制台，创建RAM用户：
   - 用户名：例如 `oss-user`
   - 访问方式：选择"编程访问"
3. 为用户授权OSS权限：
   - 选择"直接授权"
   - 搜索并选择 `AliyunOSSFullAccess`（OSS完全访问权限）
4. 创建完成后，为该RAM用户创建AccessKey
5. 保存AccessKey ID和Secret

## 三、安装依赖包

在项目根目录（`demo/demo/`）执行：

```bash
cd demo/demo
npm install ali-oss dotenv
```

或者直接运行 `安装OSS依赖.bat` 脚本（Windows系统）。

## 四、创建环境变量文件

在项目根目录（`demo/demo/`）创建 `.env` 文件：

```env
# 阿里云OSS配置
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=your-access-key-id
OSS_ACCESS_KEY_SECRET=your-access-key-secret
OSS_BUCKET=your-bucket-name
```

**重要**：请将上面的值替换为您实际的信息：
- `OSS_REGION`：您的Bucket地域（如：`oss-cn-beijing`、`oss-cn-shanghai`）
- `OSS_ACCESS_KEY_ID`：您的AccessKey ID
- `OSS_ACCESS_KEY_SECRET`：您的AccessKey Secret
- `OSS_BUCKET`：您的Bucket名称

**示例**：
```env
OSS_REGION=oss-cn-beijing
OSS_ACCESS_KEY_ID=LTAI5txxxxxxxxxxxxx
OSS_ACCESS_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OSS_BUCKET=my-hanfu-images
```

## 五、配置CORS（跨域访问）

1. 在OSS控制台，选择您创建的Bucket
2. 进入 **权限管理** > **跨域设置**
3. 点击 **创建规则**
4. 配置如下：
   - **来源**：`http://localhost:8080`（或您的域名）
   - **允许Methods**：`GET`、`POST`、`PUT`
   - **允许Headers**：`*`
   - **暴露Headers**：`ETag`、`x-oss-request-id`
   - **缓存时间**：`3600`
5. 点击 **确定** 保存

## 六、重启后端服务器

配置完成后，重启后端服务器：

```bash
cd demo/demo
node src/serve/nodeserve.js
```

## 七、测试OSS配置

### 方法一：通过前端上传测试

1. 启动前端服务器（如果还没启动）：
   ```bash
   cd demo/demo
   npm run serve
   ```

2. 访问前端页面，尝试上传一张图片
3. 检查返回的URL是否为OSS地址（格式：`https://your-bucket.oss-cn-beijing.aliyuncs.com/...`）
4. 在浏览器中访问该URL，确认图片可以正常显示

### 方法二：通过AI试衣功能测试

1. 进入AI试衣页面
2. 上传一张用户照片
3. 选择一件汉服
4. 点击"开始试衣"
5. 如果配置正确，图片会自动上传到OSS，然后调用AI试衣API

## 八、验证配置是否成功

### 检查后端日志

重启后端服务器后，查看控制台输出：
- 如果没有报错，说明配置正常
- 如果看到 `OSS上传失败` 错误，检查：
  1. `.env` 文件中的配置是否正确
  2. AccessKey是否有权限
  3. Bucket名称和地域是否正确

### 检查图片URL

上传图片后，返回的URL应该是：
```
https://your-bucket.oss-cn-beijing.aliyuncs.com/images/1234567890-filename.jpg
```

而不是：
```
http://127.0.0.1:8083/img/filename.jpg
```

如果返回的是本地URL，说明OSS配置未生效，请检查：
1. `.env` 文件是否存在且配置正确
2. 后端服务器是否已重启
3. 依赖包是否已安装（`ali-oss`、`dotenv`）

## 常见问题

### 1. 上传失败，提示"OSS上传失败"

**可能原因**：
- AccessKey配置错误
- Bucket名称或地域不正确
- AccessKey没有权限

**解决方法**：
1. 检查 `.env` 文件中的配置
2. 确认AccessKey是否有OSS的读写权限
3. 确认Bucket名称和地域是否正确

### 2. 图片URL仍然是本地地址

**可能原因**：
- OSS配置未生效
- 后端服务器未重启
- 依赖包未安装

**解决方法**：
1. 确认已安装 `ali-oss` 和 `dotenv`
2. 确认 `.env` 文件在正确位置（`demo/demo/.env`）
3. 重启后端服务器

### 3. 图片无法访问

**可能原因**：
- Bucket权限不是"公共读"
- CORS未配置

**解决方法**：
1. 检查Bucket权限是否为"公共读"
2. 检查CORS配置是否正确

## 完成！

配置完成后，您的AI试衣功能就可以正常使用OSS存储图片了！





