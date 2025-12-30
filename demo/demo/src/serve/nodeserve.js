// 加载环境变量（如果存在.env文件）
require('dotenv').config();

const express = require("express");
const svgCaptcha = require("svg-captcha");
const multer = require('multer');
const app = express();

// 解析请求体
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 跨域设置
const cors = require("cors");
app.use(cors({
    // 允许跨域请求的地址，可以是一个数组
    origin: [
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://127.0.0.1:8081",
        "http://localhost:8081",
        // "http://192.168.121.46:8080",
    ],
    // 允许携带cookie
    credentials: true
}));

// 配置静态文件服务 - 提供 public 目录下的文件访问
const path = require('path');
app.use('/img', express.static(path.join(__dirname, '../../public/img')));
app.use(express.static(path.join(__dirname, '../../public')));

// // 生成验证码
app.get("/captcha", (req, res) => {
    const captcha = svgCaptcha.create();
    // 返回验证码文本和svg图片数据
    res.send({
        text: captcha.text,
        data: captcha.data,
    });
});

// 导入路由模块
const router = require("./api.js");

// 使用路由模块
app.use("/api", router);

// 根路径处理
app.get("/", (req, res) => {
    res.json({
        message: "后端 API 服务器运行中",
        api: "http://127.0.0.1:8083/api",
        captcha: "http://127.0.0.1:8083/captcha",
        frontend: "请访问前端应用: http://localhost:8080"
    });
});

// 监听端口
app.listen(8083, () => {
    console.log("服务器启动成功");
    console.log("http://127.0.0.1:8083")
});
