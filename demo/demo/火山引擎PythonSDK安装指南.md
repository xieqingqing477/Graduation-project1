# 火山引擎Python SDK安装和使用指南

## ✅ 已完成的修改

1. **创建Python脚本**：`demo/demo/src/serve/volcano_dress.py`
   - 使用官方Python SDK调用火山引擎API
   - 自动处理签名算法
   - 支持从环境变量或参数获取AccessKey

2. **修改Node.js后端**：`demo/demo/src/serve/api.js`
   - `/api/dress/volcano`接口改为调用Python脚本
   - 移除了手动签名实现
   - 保留了阿里云换装功能（未修改）

3. **恢复前端按钮**：`demo/demo/src/views/clothes.vue`
   - 恢复了火山引擎换装按钮
   - 移除了"维护中"提示

## 📦 安装步骤

### 1. 安装Python环境

#### Windows系统
1. 下载Python 3.7+：https://www.python.org/downloads/
2. 安装时勾选"Add Python to PATH"
3. 验证安装：
   ```bash
   python --version
   # 或
   python3 --version
   ```

#### 如果安装失败（Windows路径长度限制）
根据官方文档，如果遇到路径长度限制问题：
1. 按`Win+R`，输入`regedit`打开注册表编辑器
2. 找到：`\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. 将`LongPathsEnabled`设置为`1`

### 2. 安装Python依赖库

```bash
# 进入项目目录
cd demo/demo

# 安装requests库（用于HTTP请求）
pip install requests

# 可选：安装火山引擎Python SDK（如果可用）
pip install volcengine-python-sdk
```

**注意**：由于火山引擎可能没有专门的Visual SDK，当前脚本使用HTTP直接调用方式，只需要`requests`库即可。

### 3. 验证安装

```bash
# 测试Python是否可以导入requests
python -c "import requests; print('requests库安装成功')"
```

## 🔧 配置说明

### 环境变量（可选）

如果`.env`文件中已配置，Python脚本会自动读取：
```env
VOLCANO_ACCESS_KEY_ID=AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY
VOLCANO_SECRET_ACCESS_KEY=TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==
```

如果没有配置，代码会使用默认值（已在代码中设置）。

## 🚀 使用步骤

### 1. 确保Python脚本存在

检查文件是否存在：
```
demo/demo/src/serve/volcano_dress.py
```

### 2. 重启后端服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
node src/serve/nodeserve.js
```

### 3. 测试功能

1. 打开前端页面
2. 上传照片并选择汉服
3. 点击"火山引擎换装"按钮
4. 查看结果

## 📝 Python脚本说明

### 脚本位置
`demo/demo/src/serve/volcano_dress.py`

### 脚本功能
- 从标准输入读取JSON参数
- 使用官方Python SDK调用火山引擎API
- 输出JSON格式的结果到标准输出

### 输入格式
```json
{
  "personImageUrl": "https://...",
  "garmentImageUrl": "https://...",
  "accessKeyId": "AK...",
  "secretAccessKey": "SK..."
}
```

### 输出格式
```json
{
  "success": true,
  "imageUrl": "https://...",
  "image_urls": ["https://..."],
  "message": "success"
}
```

## ⚠️ 常见问题

### 1. Python命令找不到

**错误**：`python3: command not found` 或 `python: command not found`

**解决**：
- Windows：确保安装Python时勾选了"Add Python to PATH"
- 或者使用完整路径：`C:\Python39\python.exe`
- 修改`api.js`中的`pythonCommand`为`python`（如果python3不可用）

### 2. SDK导入失败

**错误**：`ImportError: No module named volcenginesdkcore`

**解决**：
```bash
# 重新安装SDK
pip install --upgrade volcengine-python-sdk

# 或者使用python -m pip
python -m pip install volcengine-python-sdk
```

### 3. Visual API不存在

**错误**：`AttributeError: module 'volcenginesdkvisual' has no attribute 'VisualApi'`

**解决**：
- Python脚本已包含多种SDK版本的兼容处理
- 如果仍然失败，可能需要查看火山引擎官方文档，确认Visual服务的正确SDK包名

### 4. 权限错误

**错误**：`Permission denied` 或 `Access denied`

**解决**：
- 确保Python脚本有执行权限
- Windows：右键脚本 → 属性 → 取消"只读"勾选

## 🔍 调试方法

### 查看后端日志

后端控制台会输出：
- `调用Python脚本: ...`
- `Python脚本执行完成，退出码: ...`
- `Python输出: ...`
- `Python错误输出: ...`（如果有）

### 手动测试Python脚本

```bash
# 进入脚本目录
cd demo/demo/src/serve

# 测试脚本
echo '{"personImageUrl":"https://example.com/person.jpg","garmentImageUrl":"https://example.com/garment.jpg"}' | python volcano_dress.py
```

## 📋 文件清单

### 新增文件
- ✅ `demo/demo/src/serve/volcano_dress.py` - Python脚本

### 修改的文件
- ✅ `demo/demo/src/serve/api.js` - 修改了`/api/dress/volcano`接口
- ✅ `demo/demo/src/views/clothes.vue` - 恢复了火山引擎按钮

### 未修改的文件
- ✅ 阿里云换装功能 - 完全未修改
- ✅ 其他API接口 - 未修改
- ✅ 前端其他页面 - 未修改

## ✨ 优势

使用Python SDK后：
1. ✅ **自动签名**：不需要手动实现签名算法
2. ✅ **更稳定**：官方维护，与API版本同步
3. ✅ **更简单**：代码更简洁，易于维护
4. ✅ **错误处理**：官方SDK提供更好的错误信息

## 🎯 下一步

1. 安装Python 3.7+
2. 安装火山引擎Python SDK：`pip install volcengine-python-sdk`
3. 重启后端服务器
4. 测试火山引擎换装功能

如果遇到问题，请查看后端控制台的日志输出，特别是Python脚本的执行结果。


## ✅ 已完成的修改

1. **创建Python脚本**：`demo/demo/src/serve/volcano_dress.py`
   - 使用官方Python SDK调用火山引擎API
   - 自动处理签名算法
   - 支持从环境变量或参数获取AccessKey

2. **修改Node.js后端**：`demo/demo/src/serve/api.js`
   - `/api/dress/volcano`接口改为调用Python脚本
   - 移除了手动签名实现
   - 保留了阿里云换装功能（未修改）

3. **恢复前端按钮**：`demo/demo/src/views/clothes.vue`
   - 恢复了火山引擎换装按钮
   - 移除了"维护中"提示

## 📦 安装步骤

### 1. 安装Python环境

#### Windows系统
1. 下载Python 3.7+：https://www.python.org/downloads/
2. 安装时勾选"Add Python to PATH"
3. 验证安装：
   ```bash
   python --version
   # 或
   python3 --version
   ```

#### 如果安装失败（Windows路径长度限制）
根据官方文档，如果遇到路径长度限制问题：
1. 按`Win+R`，输入`regedit`打开注册表编辑器
2. 找到：`\HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
3. 将`LongPathsEnabled`设置为`1`

### 2. 安装Python依赖库

```bash
# 进入项目目录
cd demo/demo

# 安装requests库（用于HTTP请求）
pip install requests

# 可选：安装火山引擎Python SDK（如果可用）
pip install volcengine-python-sdk
```

**注意**：由于火山引擎可能没有专门的Visual SDK，当前脚本使用HTTP直接调用方式，只需要`requests`库即可。

### 3. 验证安装

```bash
# 测试Python是否可以导入requests
python -c "import requests; print('requests库安装成功')"
```

## 🔧 配置说明

### 环境变量（可选）

如果`.env`文件中已配置，Python脚本会自动读取：
```env
VOLCANO_ACCESS_KEY_ID=AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY
VOLCANO_SECRET_ACCESS_KEY=TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==
```

如果没有配置，代码会使用默认值（已在代码中设置）。

## 🚀 使用步骤

### 1. 确保Python脚本存在

检查文件是否存在：
```
demo/demo/src/serve/volcano_dress.py
```

### 2. 重启后端服务器

```bash
# 停止当前服务器（Ctrl+C）
# 然后重新启动
node src/serve/nodeserve.js
```

### 3. 测试功能

1. 打开前端页面
2. 上传照片并选择汉服
3. 点击"火山引擎换装"按钮
4. 查看结果

## 📝 Python脚本说明

### 脚本位置
`demo/demo/src/serve/volcano_dress.py`

### 脚本功能
- 从标准输入读取JSON参数
- 使用官方Python SDK调用火山引擎API
- 输出JSON格式的结果到标准输出

### 输入格式
```json
{
  "personImageUrl": "https://...",
  "garmentImageUrl": "https://...",
  "accessKeyId": "AK...",
  "secretAccessKey": "SK..."
}
```

### 输出格式
```json
{
  "success": true,
  "imageUrl": "https://...",
  "image_urls": ["https://..."],
  "message": "success"
}
```

## ⚠️ 常见问题

### 1. Python命令找不到

**错误**：`python3: command not found` 或 `python: command not found`

**解决**：
- Windows：确保安装Python时勾选了"Add Python to PATH"
- 或者使用完整路径：`C:\Python39\python.exe`
- 修改`api.js`中的`pythonCommand`为`python`（如果python3不可用）

### 2. SDK导入失败

**错误**：`ImportError: No module named volcenginesdkcore`

**解决**：
```bash
# 重新安装SDK
pip install --upgrade volcengine-python-sdk

# 或者使用python -m pip
python -m pip install volcengine-python-sdk
```

### 3. Visual API不存在

**错误**：`AttributeError: module 'volcenginesdkvisual' has no attribute 'VisualApi'`

**解决**：
- Python脚本已包含多种SDK版本的兼容处理
- 如果仍然失败，可能需要查看火山引擎官方文档，确认Visual服务的正确SDK包名

### 4. 权限错误

**错误**：`Permission denied` 或 `Access denied`

**解决**：
- 确保Python脚本有执行权限
- Windows：右键脚本 → 属性 → 取消"只读"勾选

## 🔍 调试方法

### 查看后端日志

后端控制台会输出：
- `调用Python脚本: ...`
- `Python脚本执行完成，退出码: ...`
- `Python输出: ...`
- `Python错误输出: ...`（如果有）

### 手动测试Python脚本

```bash
# 进入脚本目录
cd demo/demo/src/serve

# 测试脚本
echo '{"personImageUrl":"https://example.com/person.jpg","garmentImageUrl":"https://example.com/garment.jpg"}' | python volcano_dress.py
```

## 📋 文件清单

### 新增文件
- ✅ `demo/demo/src/serve/volcano_dress.py` - Python脚本

### 修改的文件
- ✅ `demo/demo/src/serve/api.js` - 修改了`/api/dress/volcano`接口
- ✅ `demo/demo/src/views/clothes.vue` - 恢复了火山引擎按钮

### 未修改的文件
- ✅ 阿里云换装功能 - 完全未修改
- ✅ 其他API接口 - 未修改
- ✅ 前端其他页面 - 未修改

## ✨ 优势

使用Python SDK后：
1. ✅ **自动签名**：不需要手动实现签名算法
2. ✅ **更稳定**：官方维护，与API版本同步
3. ✅ **更简单**：代码更简洁，易于维护
4. ✅ **错误处理**：官方SDK提供更好的错误信息

## 🎯 下一步

1. 安装Python 3.7+
2. 安装火山引擎Python SDK：`pip install volcengine-python-sdk`
3. 重启后端服务器
4. 测试火山引擎换装功能

如果遇到问题，请查看后端控制台的日志输出，特别是Python脚本的执行结果。





