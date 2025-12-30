const mysql = require("mysql");

// 创建数据库连接池
const pool = mysql.createPool({
    host: "127.0.0.1", //数据库地址
    user: "root",
    password: "123456",
    database: "museum", //需要操作的数据库名称
});

// 测试数据库连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ 数据库连接失败:", err.message);
        console.log("\n请检查以下配置：");
        console.log("1. MySQL 服务是否已启动");
        console.log("2. 数据库 'museum' 是否已创建");
        console.log("3. 用户名和密码是否正确（当前: root / 123456）");
        console.log("4. 如果数据库不存在，请运行: mysql -u root -p < museum.sql");
        process.exit(1);
    } else {
        console.log("✅ 数据库连接成功！");
        console.log("数据库信息：");
        console.log("  - 主机: 127.0.0.1");
        console.log("  - 数据库: museum");
        console.log("  - 用户: root");
        
        // 测试查询
        connection.query("SHOW TABLES", (err, results) => {
            connection.release();
            if (err) {
                console.error("❌ 查询失败:", err.message);
            } else {
                console.log(`\n✅ 数据库表数量: ${results.length}`);
                if (results.length > 0) {
                    console.log("表列表:");
                    results.forEach((row, index) => {
                        console.log(`  ${index + 1}. ${Object.values(row)[0]}`);
                    });
                }
            }
            process.exit(0);
        });
    }
});


// 创建数据库连接池
const pool = mysql.createPool({
    host: "127.0.0.1", //数据库地址
    user: "root",
    password: "123456",
    database: "museum", //需要操作的数据库名称
});

// 测试数据库连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ 数据库连接失败:", err.message);
        console.log("\n请检查以下配置：");
        console.log("1. MySQL 服务是否已启动");
        console.log("2. 数据库 'museum' 是否已创建");
        console.log("3. 用户名和密码是否正确（当前: root / 123456）");
        console.log("4. 如果数据库不存在，请运行: mysql -u root -p < museum.sql");
        process.exit(1);
    } else {
        console.log("✅ 数据库连接成功！");
        console.log("数据库信息：");
        console.log("  - 主机: 127.0.0.1");
        console.log("  - 数据库: museum");
        console.log("  - 用户: root");
        
        // 测试查询
        connection.query("SHOW TABLES", (err, results) => {
            connection.release();
            if (err) {
                console.error("❌ 查询失败:", err.message);
            } else {
                console.log(`\n✅ 数据库表数量: ${results.length}`);
                if (results.length > 0) {
                    console.log("表列表:");
                    results.forEach((row, index) => {
                        console.log(`  ${index + 1}. ${Object.values(row)[0]}`);
                    });
                }
            }
            process.exit(0);
        });
    }
});





