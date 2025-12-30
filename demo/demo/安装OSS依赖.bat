@echo off
echo 正在安装阿里云OSS SDK和dotenv...
cd /d "%~dp0"
npm install ali-oss dotenv
echo.
echo 安装完成！
echo.
echo 请按照 OSS_CONFIG.md 文件中的说明配置OSS环境变量。
echo 在项目根目录（demo/demo/）创建 .env 文件，并填入OSS配置信息。
pause







