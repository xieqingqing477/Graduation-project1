const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const sd = require('silly-datetime');
const CryptoJS = require("crypto-js");
var md5 = require('md5');
const formidable = require('formidable');
const multer = require('multer');
const path = require('path');
const https = require('https');
const http = require('http');
const fs = require('fs');
const crypto = require('crypto');
// const app = express();
// const apiRouter = require('./api')
// app.use(express.json());
// app.use('/api', apiRouter);
// const PORT = process.env.PORT || 3000;


// 创建数据库连接池
const pool = mysql.createPool({
    host: "127.0.0.1", //数据库地址
    user: "root",
    password: "123456",
    database: "aidress", //需要操作的数据库名称
});

// 初始化数据库表（如果不存在则创建）
function initializeTables() {
    const createDressHistoryTable = `
        CREATE TABLE IF NOT EXISTS \`dress_history\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`user_id\` int(11) DEFAULT NULL COMMENT '用户ID',
          \`result_image\` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '生成的换装结果图片（相对路径或完整URL）',
          \`original_image\` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '原始上传图片',
          \`garment_image\` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '当时选择的服饰图片',
          \`clothes_id\` int(11) DEFAULT NULL COMMENT '当时选择的服饰在clothes表中的ID（可选）',
          \`provider\` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '使用的AI服务提供方（如 aliyun）',
          \`status\` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '换装状态（success / fail 等）',
          \`message\` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '失败原因或备注',
          \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '换装时间',
          PRIMARY KEY (\`id\`),
          KEY \`idx_user_id\` (\`user_id\`),
          KEY \`idx_clothes_id\` (\`clothes_id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='AI换装结果记录表';
    `;

    const createFavoriteClothesTable = `
        CREATE TABLE IF NOT EXISTS \`favorite_clothes\` (
          \`id\` int(11) NOT NULL AUTO_INCREMENT,
          \`user_id\` int(11) DEFAULT NULL COMMENT '用户ID',
          \`clothes_id\` int(11) NOT NULL COMMENT '被收藏的衣服ID，对应clothes.id',
          \`create_time\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uniq_user_clothes\` (\`user_id\`, \`clothes_id\`),
          KEY \`idx_user_id\` (\`user_id\`),
          KEY \`idx_clothes_id\` (\`clothes_id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户收藏的衣服';
    `;

    pool.query(createDressHistoryTable, (err, results) => {
        if (err) {
            console.error('创建 dress_history 表失败:', err);
        } else {
            console.log('✅ dress_history 表已就绪');
        }
    });

    pool.query(createFavoriteClothesTable, (err, results) => {
        if (err) {
            console.error('创建 favorite_clothes 表失败:', err);
        } else {
            console.log('✅ favorite_clothes 表已就绪');
        }
    });
}

// 启动时初始化表
initializeTables();

//搜索数据库图鉴内容

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}.`);
// });

// app.get('/api/search', (req, res) => {
//   const keyword = req.query.keyword; // 获取前端发送的查询关键词
//   // 查询数据库并返回结果
//   const result = db.query(`SELECT * FROM breed WHERE name LIKE '%${keyword}%'`);
//   res.send(result);
// });


//存储图片数据



// 中间件：解析请求体
router.use(express.json());

// 获取当前时间戳
function getCurrentTimestamp() {
    return sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
}

//处理图片
const storage = multer.diskStorage({
    destination: path.join(__dirname, "../../public/img"),
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 限制文件
    },
});

//修改
router.post('/updateUser', async (req, res, next) => {
    let form = formidable({
        uploadDir: path.join(__dirname, '../../public/img'),
        keepExtensions: true
    })
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next({
                code: 500,
                err
            })
            return;
        } else {
            const body = fields;
            const avatarPath = files.new_image.newFilename; // 获取上传的头像文件路径
            console.log(body);
            const sqlstr = "UPDATE `user` SET `name` = ?, `user_img` = ?, `birthday` = ?, `signature` = ? WHERE `id` = ?";
            const values = [body.new_name, 'img/' + avatarPath, body.new_tempBirthday, body.new_tempSignature , parseInt(body.new_id)];
            console.log(fields)
            pool.query(sqlstr, values, (err, results) => {
                if (err) {
                    return console.log(err.message);
                }
                if (results.affectedRows === 0) {
                    console.log("更新失败");
                    res.json({
                        success: false,
                        message: "更新失败"
                    });
                } else {
                    console.log("更新成功");
                    console.log(results,123);
                    const updatedData = {
                        name: body.new_name,
                        avatar: 'img/' + avatarPath,
                        signature:body.new_tempSignature
                    };
                    res.json({
                        success: true,
                        message: "更新成功",
                        data: updatedData
                    });
                }
            });
        }
    })
});
// 用户登录（使用手机号登录）
const sqlFindUser = "SELECT * FROM user WHERE phone=?";
const sqlCreateUser = "INSERT INTO user(name, pwd, phone) VALUES (?,?,?)";
router.post('/login', (req, res) => {
    try {
        console.log('收到登录请求:', req.body);
        const { username, password } = req.body; // username 现在代表手机号
        
        // 检查必要参数
        if (!username || !password) {
            console.error('缺少必要参数:', { username, password });
            res.status(400).send('手机号和密码不能为空');
            return;
        }
        
        const phone = username; // 将 username 作为手机号使用
    const md5Password = md5(password); // 对密码进行 md5 加密
        console.log('处理登录:', { phone, passwordLength: password.length, md5Password });
        
        // 简单的手机号格式验证
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            console.error('手机号格式不正确:', phone);
            res.status(400).send('手机号格式不正确');
            return;
        }
    
    pool.query(sqlFindUser, [phone], (err, results) => {
        if (err) {
            console.error('登录查询错误:', err);
            // 检查是否是字段不存在的错误
            if (err.code === 'ER_BAD_FIELD_ERROR' || err.message.includes('phone')) {
                res.status(500).send('数据库表缺少phone字段，请先执行SQL语句添加该字段');
            } else {
                res.status(500).send('查询用户数据失败: ' + err.message);
            }
            return;
        } else {
            if (results.length === 0) {
                console.log('用户不存在，已为您自动注册');
                // 注册时使用手机号作为默认用户名，也可以让用户后续修改
                const defaultName = phone.substring(7); // 使用手机号后4位作为默认用户名
                pool.query(sqlCreateUser, [defaultName, md5Password, phone], (err, insertResults) => { // 存入加密后的密码和手机号
                    if (err) {
                        console.error('创建用户错误:', err);
                        // 检查是否是字段不存在的错误
                        if (err.code === 'ER_BAD_FIELD_ERROR' || err.message.includes('phone')) {
                            res.status(500).send('数据库表缺少phone字段，请先执行SQL语句添加该字段');
                        } else {
                            res.status(500).send('创建用户数据失败: ' + err.message);
                        }
                        return;
                    } else {
                        // 注册成功后，重新查询用户数据
                        pool.query(sqlFindUser, [phone], (err, userResults) => {
                            if (err) {
                                console.error('查询新用户错误:', err);
                                res.status(500).send('查询新用户数据失败: ' + err.message);
                                return;
                    } else {
                        console.log('注册成功');
                                res.send({ message: '注册成功', redirectTo: '/home', name: userResults[0].name, userData: userResults });
                            }
                        });
                    }
                });
            } else if (results[0].pwd !== md5Password) { // 验证时也要使用加密后的密码进行比对
                console.log('密码错误');
                res.status(403).send('密码错误');
            } else {
                console.log('登录成功:', { userId: results[0].id, name: results[0].name });
                res.send({ message: '登录成功', redirectTo: '/home', name: results[0].name, userData: results });
            }
        }
    });
    } catch (error) {
        console.error('登录接口异常:', error);
        res.status(500).send('服务器内部错误: ' + error.message);
    }
});
//修改密码（使用用户ID或用户名查询）
const sqlFindUserByName = "SELECT * FROM user WHERE name=?";
const sqlUpdatePassword = "UPDATE user SET pwd=? WHERE id=?";
router.post('/updatePwd', (req, res) => {
    const { name, oldPassword, newPassword, userId } = req.body;
    const md5OldPassword = md5(oldPassword); // 对原密码进行 md5 加密
    const md5NewPassword = md5(newPassword); // 对新密码进行 md5 加密
    console.log({ name, userId, oldPassword: md5OldPassword, newPassword: md5NewPassword });
    
    // 优先使用用户ID查询，如果没有则使用用户名
    const queryField = userId ? 'id' : 'name';
    const queryValue = userId || name;
    const sqlQuery = userId ? "SELECT * FROM user WHERE id=?" : sqlFindUserByName;
    
    pool.query(sqlQuery, [queryValue], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('查询用户数据失败');
        } else {
            if (results.length === 0) {
                console.log('用户不存在');
                res.status(404).send('用户不存在');
            } else if (results[0].pwd !== md5OldPassword) { // 验证时也要使用加密后的密码进行比对
                console.log('原密码错误');
                res.status(403).send('原密码错误');
            } else {
                const updateUserId = userId || results[0].id;
                pool.query(sqlUpdatePassword, [md5NewPassword, updateUserId], (err, results) => { // 存入加密后的新密码
                    if (err) {
                        console.error(err);
                        res.status(500).send('更新密码失败');
                    } else {
                        console.log('修改密码成功');
                        res.send({ message: '修改密码成功', redirectTo: '/home' });
                    }
                });
            }
        }
    });
});
//注销账号
const sqlDeleteUser = "DELETE FROM user WHERE name=? AND pwd=?";
router.post('/logout', (req, res) => {
    const { name, password } = req.body;
    const md5password = md5(password);
    console.log({ name, md5password });
    pool.query(sqlFindUser, [name], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('查询用户数据失败');
        } else {
            if (results.length === 0) {
                console.log('用户不存在');
                res.status(404).send('用户不存在');
            } else if (results[0].pwd !== md5password) {
                console.log('密码错误');
                res.status(403).send('密码错误');
            } else {
                pool.query(sqlDeleteUser, [name, md5password], (err, results) => {
                    if (err) {
                        console.error(err);
                        res.status(500).send('注销用户失败');
                    } else {
                        console.log('注销成功');
                        res.send({ message: '注销成功' });
                    }
                });
            }
        }
    });
});
//查询点赞信息
// router.get('/praise', (req, res) => {
//   // 执行查询语句
//   const query = 'SELECT * FROM praise';
//   connection.query(query, (err, results) => {
//     if (err) {
//       console.error('查询失败：', err);
//       res.status(500).send('查询失败');
//     } else {
//       res.json(results);
//     }
//   });
// });
//查询系统用户
// router.get('/system_user', (req, res) => {
//   const query = 'SELECT * FROM `system_user` WHERE 1 ';
//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.json(results);
//     }
//   });
// });
const sqlQuerysystem = "SELECT * FROM `system_user` WHERE 1";

router.get('/system_user', (req, res) => {
  pool.query(sqlQuerysystem, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("查询CCI内容失败");
    } else {
      res.json(results);
    }
  });
});
//查询收藏的文物
router.get('/look_collect', (req, res) => {
  const query = 'SELECT * FROM `collect` WHERE 1 ';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
//查询展览购票信息
router.get('/ticket_purchase_record', (req, res) => {
  const query = 'SELECT * FROM `ticket_purchase_record` ';
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
//查询展览页轮播图

const sqlQuerypalace = "SELECT * FROM palace";

router.get('/palace', (req, res) => {
  pool.query(sqlQuerypalace, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("查询CCI内容失败");
    } else {
      res.json(results);
    }
  });
});
//查询文创页轮播图
// router.get('/lunbo', (req, res) => {
//   const query = 'SELECT * FROM lunbo';

//   connection.query(query, (error, results) => {
//     if (error) {
//       console.error(error);
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.json(results);
//     }
//   });
// });
const sqlQuerylunbo = "SELECT * FROM lunbo";

router.get('/lunbo', (req, res) => {
  pool.query(sqlQuerylunbo, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("查询CCI内容失败");
    } else {
      res.json(results);
    }
  });
});
//查询首页轮播图
router.get('/indexlunbo', (req, res) => {
  const query = 'SELECT * FROM indexlunbo';

  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json(results);
    }
  });
});
// const sqlQueryindexlunbo = "SELECT * FROM indexlunbo";

// router.get('/indexlunbo', (req, res) => {
//   pool.query(sqlQueryindexlunbo, (err, results) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("查询CCI内容失败");
//     } else {
//       res.json(results);
//     }
//   });
// });
// 新建评论
const sqlCreateComment = "INSERT INTO `comment`(`content`, `time`) VALUES (?,?)";
router.post("/comment", (req, res) => {
    const { content } = req.body;
    console.log({ content });
    pool.query(sqlCreateComment, [content, getCurrentTimestamp()], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("创建评论数据失败");
        } else {
            console.log(results);
            res.json(results);
        }
    });
});
const sqlQueryNoticeContent = "SELECT content FROM notice";

router.get("/notice", (req, res) => {
  pool.query(sqlQueryNoticeContent, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("查询通知内容失败");
    } else {
      res.json(results);
      console.log(res,'1')
      console.log(results,'2')
    }
  });
});
const sqlQueryCCIContent = "SELECT cid, price, description, title, thumb FROM cci";

router.get('/cci', (req, res) => {
  // CCI表已删除，直接返回空数组，避免数据库查询错误
  console.warn('CCI接口被调用，但表已删除，返回空数组');
  return res.json([]);
  
  // 以下代码已禁用，因为cci表已删除
  // pool.query(sqlQueryCCIContent, (err, results) => {
  //   if (err) {
  //     const isTableNotExists = err.code === 'ER_NO_SUCH_TABLE' || 
  //                               err.sqlMessage?.includes("doesn't exist") ||
  //                               err.sqlMessage?.includes("不存在");
  //     
  //     if (isTableNotExists) {
  //       console.warn('CCI表不存在，返回空数组');
  //       return res.json([]);
  //     }
  //     
  //     console.error('查询CCI内容失败:', err);
  //     res.status(500).json({
  //       success: false,
  //       message: '查询CCI内容失败',
  //       error: process.env.NODE_ENV === 'development' ? err.message : '数据库查询错误'
  //     });
  //   } else {
  //     res.json(results || []);
  //   }
  // });
});

//查询
router.get('/exhibitions', (req, res) => {
  const query = 'SELECT exhibition_name, exhibition_introduction, exhibition_address,tc, path,cover_photo FROM exhibition_information ';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
//查询收藏的展览信息
router.get('/collect_exhibitions', (req, res) => {
  const query = 'SELECT `exhibition_information_id`, `exhibition_name`, `start_time`, `end_time`, `ticket_price`, `cover_photo`, `exhibition_address`, `ticketing_instructions`, `exhibition_introduction`, `hits`, `praise_len`, `recommend`, `create_time`, `update_time`, `tc`, `path` FROM `exhibition_information` WHERE `exhibition_information_id` IN (1, 2)';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
//查询往期展览
router.get('/late_exhibitions', (req, res) => {
  const query = 'SELECT `exhibition_information_id`, `exhibition_name`, `start_time`, `end_time`, `ticket_price`, `cover_photo`, `exhibition_address`, `ticketing_instructions`, `exhibition_introduction`, `hits`, `praise_len`, `recommend`, `create_time`, `update_time`, `tc`, `path` FROM `exhibition_information` WHERE `exhibition_information_id` IN (5,6,7,8)';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
//查询展览信息

router.get('/look_exhibitions', (req, res) => {
  const query = 'SELECT exhibition_information_id, exhibition_name, start_time, end_time, ticket_price, cover_photo, exhibition_address, ticketing_instructions, exhibition_introduction, hits, praise_len, recommend, create_time, update_time, tc, path FROM exhibition_information';
  pool.query(query, (err, results) => {
    if (err) {
        console.log(req)
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
//查询用户
router.get("/look_user", (req, res) => {
    const sqlQuery = `
    SELECT * FROM user
  `;
    pool.query(sqlQuery, (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("获取失败");
        } else {
            console.log(results);
            res.json(results);
        }
    });
});
//模糊查询用户
router.get("/look_user1", (req, res) => {
  const name = req.query.name || ''; // 获取查询参数 name，如果不存在则默认为空字符串
  const sqlQuery = `
    SELECT * FROM user WHERE name LIKE '%${name}%'
  `;
  pool.query(sqlQuery, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("获取失败");
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

//删除用户账号
router.get("/delete_user", (req, res) => {
    const body = req.query;
    console.log(req.query);
    const sqlstr = "DELETE FROM `user` WHERE id = ? ";
    pool.query(sqlstr, [body.userId], (err, results) => {
        if (err) {
            return console.log(err.message);
        }
        if (results.affectedRows === 0) {
            console.log("删除失败");
        } else {
            console.log("删除成功");
        }
    });
});
//修改用户信息
router.post('/upUser', async (req, res, next) => {
    const body = req.body;
    const sqlstr = "UPDATE `user` SET `name` = ?,   `state` = ? WHERE `id` = ?";
    const values = [body.new_name, body.new_state, body.new_id];
    pool.query(sqlstr, values, (err, results) => {
        if (err) {
            return console.log(err.message);
        }
        if (results.affectedRows === 0) {
            console.log("更新失败");
            res.json({
                success: false,
                message: "更新失败"
            });
        } else {
            console.log("更新成功");
            console.log(results);
            const updatedData = {
                name: body.new_name
            };
            res.json({
                success: true,
                message: "更新成功",
                data: updatedData
            });
        }
    });
});
//主页查询信息
router.post('/search_exhibitions', (req, res) => {
  const  exhibitionName  = req.body.exhibitionName;
  console.log(exhibitionName)
  const query = `SELECT exhibition_information_id, exhibition_name, start_time, end_time, ticket_price, cover_photo, exhibition_address, ticketing_instructions, exhibition_introduction, hits, praise_len, recommend, create_time, update_time, tc, path FROM exhibition_information WHERE exhibition_name LIKE '%${exhibitionName}%'`;
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});

//查询
router.post('/xgxx', (req, res) => {
  const query = 'SELECT `id`, `name`, `pwd`, `user_img`, `birthday`, `signature` FROM `user` WHERE id = ?';
  const userid = req.body.userid
  pool.query(query,userid, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
//查询签名境界分开元通宝可提现金额
router.get('/look_signature', (req, res) => {
  const query = 'SELECT `signature` FROM `user`,`money`, `Tongbao`, `realm` WHERE id = ?';
  pool.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
    res.json(results);
  });
});
// mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// const userSchema = new mongoose.Schema({
//   avatar: String,
//   name: String,
//   id: String,
//   bio: String,
//   gender: String,
//   birthday: Date,
//   location: String
// });

// const User = mongoose.model('User', userSchema);

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     const ext = file.originalname.split('.').pop();
//     const filename = `${uuidv4()}.${ext}`;
//     cb(null, filename);
//   }
// });

// const upload = multer({ storage });

// router.post('/api/user', upload.single('avatar'), (req, res) => {
//   const { name, id, bio, gender, birthday, location } = req.body;
//   const user = new User({
//     avatar: req.file ? req.file.filename : '',
//     name,
//     id,
//     bio,
//     gender,
//     birthday,
//     location
//   });
//   user.save((error, user) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('保存失败');
//     } else {
//       console.log(user);
//       res.send('保存成功');
//     }
//   });
// });

// // 处理头像上传请求的路由
// router.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
//   // 处理上传的头像文件
//   const avatarFile = req.file;

//   // 将头像文件保存到数据库
//   // 使用适合您数据库的库或框架进行数据库操作，例如Mongoose、Sequelize等

//   // 示例使用Mongoose保存头像文件的代码
//   const Avatar = require('./models/avatar');
//   const newAvatar = new Avatar({
//     filename: avatarFile.filename,
//     originalname: avatarFile.originalname,
//     path: avatarFile.path
//   });
//   newAvatar.save()
//     .then(savedAvatar => {
//       // 返回保存成功的响应
//       res.json({ avatarUrl: savedAvatar.path });
//     })
//     .catch(error => {
//       // 处理保存失败的错误
//       console.error(error);
//       res.status(500).json({ error: 'Failed to save the avatar' });
//     });
// });

//管理展览数据

// ==================== 衣服相关API ====================

// 测试路由
router.get('/clothes/test', (req, res) => {
    res.json({ success: true, message: '衣服API路由正常工作' });
});

// 获取衣服列表
router.get('/clothes/list', (req, res) => {
    const { category_id, sub_category_id, keyword } = req.query;
    let sql = "SELECT * FROM clothes WHERE 1=1";
    const params = [];
    
    if (category_id && category_id !== 'all') {
        sql += " AND category_id = ?";
        params.push(category_id);
    }
    
    if (sub_category_id) {
        sql += " AND sub_category_id = ?";
        params.push(sub_category_id);
    }
    
    if (keyword) {
        sql += " AND (name LIKE ? OR dynasty LIKE ? OR detailed LIKE ?)";
        const keywordPattern = `%${keyword}%`;
        params.push(keywordPattern, keywordPattern, keywordPattern);
    }
    
    sql += " ORDER BY create_time DESC";
    
    pool.query(sql, params, (err, results) => {
        if (err) {
            console.error('查询衣服列表失败:', err);
            res.status(500).json({ success: false, message: '查询失败', error: err.message });
        } else {
            res.json({ success: true, data: results });
        }
    });
});

// ==================== 换装结果记录 API ====================

// 新增一条换装记录
router.post('/dress-history/add', (req, res) => {
    const {
        user_id,
        result_image,
        original_image,
        garment_image,
        clothes_id,
        provider,
        status,
        message
    } = req.body;

    // 先根据用户会员状态控制非会员换装次数（50次）
    const insertRecord = () => {
        // 验证和清理URL，确保不超过数据库字段长度限制（VARCHAR(500)）
        const truncateUrl = (url, maxLength = 500) => {
            if (!url) return null;
            
            // 如果是 base64 data URL，且长度超过限制，则不存储（因为截断后无法使用）
            if (url.startsWith('data:image/') || url.startsWith('data:application/')) {
                if (url.length > maxLength) {
                    console.warn(`Base64 data URL 过长，无法存储到数据库: ${url.length} > ${maxLength}，将跳过存储`);
                    return null; // 不存储 base64 data URL，因为截断后无法使用
                }
            }
            
            // 对于普通URL，如果超过长度则截断
            if (url.length > maxLength) {
                console.warn(`URL长度超过限制，将被截断: ${url.length} > ${maxLength}`);
                return url.substring(0, maxLength);
            }
            return url;
        };
        
        const sql = `INSERT INTO dress_history (
            user_id, result_image, original_image, garment_image, clothes_id,
            provider, status, message
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
        const values = [
            user_id ? parseInt(user_id) : null,
            truncateUrl(result_image),
            truncateUrl(original_image),
            truncateUrl(garment_image),
            clothes_id ? parseInt(clothes_id) : null,
            provider || 'aliyun',
            status || 'success',
            message || null
        ];
    
        pool.query(sql, values, (err, results) => {
            if (err) {
                console.error('添加换装记录失败:', err);
                console.error('SQL:', sql);
                console.error('Values:', values);
                res.status(500).json({ 
                    success: false, 
                    message: '添加换装记录失败', 
                    error: err.message 
                });
            } else {
                res.json({
                    success: true,
                    message: '添加换装记录成功',
                    data: { id: results.insertId }
                });
            }
        });
    };

    if (!user_id) {
        // 没有用户信息时不做限制，直接写入（兼容老逻辑）
        return insertRecord();
    }

    const userSql = 'SELECT state FROM user WHERE id = ?';
    pool.query(userSql, [user_id], (userErr, userResults) => {
        if (userErr) {
            console.error('查询用户信息失败:', userErr);
            return res.status(500).json({ success: false, message: '查询用户信息失败', error: userErr.message });
        }

        const user = userResults[0];
        const isVip = user && String(user.state) === '1';

        if (isVip) {
            // 会员无限制换装次数
            return insertRecord();
        }

        // 非会员：限制最多 50 次换装记录
        const countSql = 'SELECT COUNT(*) AS cnt FROM dress_history WHERE user_id = ?';
        pool.query(countSql, [user_id], (countErr, countResults) => {
            if (countErr) {
                console.error('统计换装次数失败:', countErr);
                return res.status(500).json({ success: false, message: '统计换装次数失败', error: countErr.message });
            }

            const cnt = countResults[0].cnt || 0;
            if (cnt >= 50) {
                return res.json({
                    success: false,
                    code: 'DRESS_LIMIT_REACHED',
                    message: '非会员换装次数已达50次，请充值会员以继续换装'
                });
            }

            insertRecord();
        });
    });
});

// ==================== 收藏衣服 API ====================

// 添加收藏
router.post('/favorite-clothes/add', (req, res) => {
    const { user_id, clothes_id } = req.body;

    if (!user_id || !clothes_id) {
        return res.status(400).json({ success: false, message: '缺少用户ID或衣服ID' });
    }

    // 先检查是否已经收藏
    const checkSql = 'SELECT id FROM favorite_clothes WHERE user_id = ? AND clothes_id = ?';
    pool.query(checkSql, [user_id, clothes_id], (checkErr, checkResults) => {
        if (checkErr) {
            console.error('检查收藏状态失败:', checkErr);
            return res.status(500).json({ success: false, message: '检查收藏状态失败', error: checkErr.message });
        }

        if (checkResults.length > 0) {
            return res.json({ success: false, code: 'ALREADY_COLLECTED', message: '已经收藏过了' });
        }

        const insertSql = 'INSERT INTO favorite_clothes (user_id, clothes_id) VALUES (?, ?)';
        pool.query(insertSql, [user_id, clothes_id], (err, results) => {
            if (err) {
                console.error('添加收藏失败:', err);
                return res.status(500).json({ success: false, message: '添加收藏失败', error: err.message });
            }

            res.json({
                success: true,
                message: '收藏成功',
                data: { id: results.insertId }
            });
        });
    });
});

// 获取用户收藏的衣服列表
router.get('/favorite-clothes/list', (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ success: false, message: '缺少用户ID' });
    }

    const sql = `
        SELECT 
            f.id,
            c.id AS clothes_id,
            c.name,
            c.image,
            c.dynasty,
            c.color,
            c.season,
            c.detailed,
            f.create_time
        FROM favorite_clothes f
        JOIN clothes c ON f.clothes_id = c.id
        WHERE f.user_id = ?
        ORDER BY f.create_time DESC
    `;

    pool.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('查询收藏的衣服失败:', err);
            return res.status(500).json({ success: false, message: '查询收藏的衣服失败', error: err.message });
        }

        res.json({ success: true, data: results });
    });
});

// 获取当前用户的换装记录列表（按时间倒序）
router.get('/dress-history/list', (req, res) => {
    const { user_id } = req.query;

    let sql = 'SELECT * FROM dress_history';
    const params = [];

    if (user_id) {
        sql += ' WHERE user_id = ?';
        params.push(user_id);
    }

    sql += ' ORDER BY create_time DESC';

    pool.query(sql, params, (err, results) => {
        if (err) {
            console.error('查询换装记录失败:', err);
            res.status(500).json({ success: false, message: '查询换装记录失败', error: err.message });
        } else {
            res.json({ success: true, data: results });
        }
    });
});

// 获取换装记录详情
router.get('/dress-history/detail/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM dress_history WHERE id = ?';
    
    pool.query(sql, [id], (err, results) => {
        if (err) {
            console.error('查询换装记录详情失败:', err);
            res.status(500).json({ success: false, message: '查询换装记录详情失败', error: err.message });
        } else {
            if (results.length === 0) {
                res.status(404).json({ success: false, message: '换装记录不存在' });
            } else {
                res.json({ success: true, data: results[0] });
            }
        }
    });
});

// 获取衣服详情
router.get('/clothes/detail/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM clothes WHERE id = ?";
    
    pool.query(sql, [id], (err, results) => {
        if (err) {
            console.error('查询衣服详情失败:', err);
            res.status(500).json({ success: false, message: '查询失败', error: err.message });
        } else {
            if (results.length === 0) {
                res.status(404).json({ success: false, message: '衣服不存在' });
            } else {
                res.json({ success: true, data: results[0] });
            }
        }
    });
});

// 添加衣服
router.post('/clothes/add', upload.single('image'), (req, res) => {
    const {
        name,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name,
        color,
        season,
        purchase_time,
        brand,
        price,
        dynasty,
        detailed,
        location,
        user_id
    } = req.body;

    // 如果传入了 user_id，需要根据会员状态限制非会员上传数量
    const doInsert = () => {
        // 处理图片上传
        let imagePath = null;
        if (req.file) {
            imagePath = 'img/' + req.file.filename;
        } else if (req.body.image) {
            // 如果前端直接传递了图片URL
            imagePath = req.body.image;
        }
        
        const sql = `INSERT INTO clothes (
            name, image, category_id, category_name, sub_category_id, sub_category_name,
            color, season, purchase_time, brand, price, dynasty, detailed, location, user_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
            name,
            imagePath,
            category_id || null,
            category_name || null,
            sub_category_id || null,
            sub_category_name || null,
            color || null,
            season || null,
            purchase_time || null,
            brand || null,
            price ? parseFloat(price) : null,
            dynasty || null,
            detailed || null,
            location || null,
            user_id || null
        ];
        
        pool.query(sql, values, (err, results) => {
            if (err) {
                console.error('添加衣服失败:', err);
                res.status(500).json({ success: false, message: '添加失败', error: err.message });
            } else {
                res.json({ 
                    success: true, 
                    message: '添加成功',
                    data: { id: results.insertId }
                });
            }
        });
    };
    
    if (!user_id) {
        // 没有用户信息时直接插入（保持兼容）
        return doInsert();
    }

    // 查询用户会员状态和当前上传数量
    const userSql = 'SELECT state FROM user WHERE id = ?';
    pool.query(userSql, [user_id], (userErr, userResults) => {
        if (userErr) {
            console.error('查询用户信息失败:', userErr);
            return res.status(500).json({ success: false, message: '查询用户信息失败', error: userErr.message });
        }

        const user = userResults[0];
        const isVip = user && String(user.state) === '1';

        if (isVip) {
            // 会员无限制
            return doInsert();
        }

        // 非会员：限制最多 10 套
        const countSql = 'SELECT COUNT(*) AS cnt FROM clothes WHERE user_id = ?';
        pool.query(countSql, [user_id], (countErr, countResults) => {
            if (countErr) {
                console.error('统计衣服数量失败:', countErr);
                return res.status(500).json({ success: false, message: '统计衣服数量失败', error: countErr.message });
            }

            const cnt = countResults[0].cnt || 0;
            if (cnt >= 10) {
                return res.json({
                    success: false,
                    code: 'UPLOAD_LIMIT_REACHED',
                    message: '非会员最多只能上传10套衣服，请充值会员以继续上传'
                });
            }

            doInsert();
        });
    });
});

// 更新衣服信息
router.post('/clothes/update/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const {
        name,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name,
        color,
        season,
        purchase_time,
        brand,
        price,
        dynasty,
        detailed,
        location
    } = req.body;
    
    // 构建更新SQL
    let sql = "UPDATE clothes SET ";
    const updates = [];
    const values = [];
    
    if (name) { updates.push("name = ?"); values.push(name); }
    if (req.file) { 
        updates.push("image = ?"); 
        values.push('img/' + req.file.filename); 
    } else if (req.body.image) {
        updates.push("image = ?");
        values.push(req.body.image);
    }
    if (category_id) { updates.push("category_id = ?"); values.push(category_id); }
    if (category_name) { updates.push("category_name = ?"); values.push(category_name); }
    if (sub_category_id) { updates.push("sub_category_id = ?"); values.push(sub_category_id); }
    if (sub_category_name) { updates.push("sub_category_name = ?"); values.push(sub_category_name); }
    if (color !== undefined) { updates.push("color = ?"); values.push(color); }
    if (season !== undefined) { updates.push("season = ?"); values.push(season); }
    if (purchase_time) { updates.push("purchase_time = ?"); values.push(purchase_time); }
    if (brand !== undefined) { updates.push("brand = ?"); values.push(brand); }
    if (price !== undefined) { updates.push("price = ?"); values.push(parseFloat(price)); }
    if (dynasty !== undefined) { updates.push("dynasty = ?"); values.push(dynasty); }
    if (detailed !== undefined) { updates.push("detailed = ?"); values.push(detailed); }
    if (location !== undefined) { updates.push("location = ?"); values.push(location); }
    
    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: '没有要更新的字段' });
    }
    
    sql += updates.join(", ");
    sql += " WHERE id = ?";
    values.push(id);
    
    pool.query(sql, values, (err, results) => {
        if (err) {
            console.error('更新衣服失败:', err);
            res.status(500).json({ success: false, message: '更新失败', error: err.message });
        } else {
            res.json({ success: true, message: '更新成功' });
        }
    });
});

// 删除衣服（支持批量删除）
router.post('/clothes/delete', (req, res) => {
    const { ids } = req.body; // ids 应该是数组
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: '请提供要删除的衣服ID' });
    }
    
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM clothes WHERE id IN (${placeholders})`;
    
    pool.query(sql, ids, (err, results) => {
        if (err) {
            console.error('删除衣服失败:', err);
            res.status(500).json({ success: false, message: '删除失败', error: err.message });
        } else {
            res.json({ 
                success: true, 
                message: `成功删除 ${results.affectedRows} 条记录` 
            });
        }
    });
});

// 通用图片上传接口（用于AI试衣等功能）
router.post('/upload/image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: '请上传图片文件' });
    }
    
    // 如果配置了OSS，优先上传到OSS
    const ossConfig = {
        region: process.env.OSS_REGION,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        bucket: process.env.OSS_BUCKET
    };
    
    if (ossConfig.region && ossConfig.accessKeyId && ossConfig.accessKeySecret && ossConfig.bucket) {
        try {
            // 使用OSS上传
            const OSS = require('ali-oss');
            const client = new OSS({
                region: ossConfig.region,
                accessKeyId: ossConfig.accessKeyId,
                accessKeySecret: ossConfig.accessKeySecret,
                bucket: ossConfig.bucket
            });
            
            const ossPath = `images/${Date.now()}-${req.file.filename}`;
            const result = await client.put(ossPath, req.file.path);
            
            // 删除本地临时文件
            fs.unlinkSync(req.file.path);
            
            // 返回OSS公网URL
            const imageUrl = result.url;
            return res.json({
                success: true,
                url: imageUrl,
                imageUrl: imageUrl,
                data: {
                    url: imageUrl,
                    imageUrl: imageUrl
                }
            });
        } catch (ossError) {
            console.error('OSS上传失败，使用本地存储:', ossError);
            // OSS上传失败，继续使用本地存储
        }
    }
    
    // 如果没有配置OSS或OSS上传失败，使用本地存储
    const imageUrl = `http://127.0.0.1:8083/img/${req.file.filename}`;
    
    res.json({
        success: true,
        url: imageUrl,
        imageUrl: imageUrl,
        data: {
            url: imageUrl,
            imageUrl: imageUrl
        }
    });
});

// 将本地图片URL转换为公网URL（优先使用OSS，否则使用免费图床）
router.post('/dress/convert-image-url', async (req, res) => {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供图片URL' 
        });
    }
    
    // 如果已经是公网URL（不是本地地址），直接返回
    if (imageUrl.startsWith('https://')) {
        return res.json({
            success: true,
            publicUrl: imageUrl
        });
    }
    if (imageUrl.startsWith('http://') && !imageUrl.includes('127.0.0.1') && !imageUrl.includes('localhost')) {
        return res.json({
            success: true,
            publicUrl: imageUrl
        });
    }
    
    // 如果配置了OSS，优先上传到OSS
    const ossConfig = {
        region: process.env.OSS_REGION,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        bucket: process.env.OSS_BUCKET
    };
    
    console.log('OSS配置检查:', {
        hasRegion: !!ossConfig.region,
        hasAccessKeyId: !!ossConfig.accessKeyId,
        hasAccessKeySecret: !!ossConfig.accessKeySecret,
        hasBucket: !!ossConfig.bucket,
        region: ossConfig.region,
        bucket: ossConfig.bucket
    });
    
    if (ossConfig.region && ossConfig.accessKeyId && ossConfig.accessKeySecret && ossConfig.bucket) {
        try {
            // 提取文件名
            let filename;
            if (imageUrl.includes('img/')) {
                filename = imageUrl.split('img/')[1].split('?')[0];
            } else {
                const urlParts = imageUrl.split('/');
                filename = urlParts[urlParts.length - 1].split('?')[0];
            }
            filename = decodeURIComponent(filename);
            const localPath = path.join(__dirname, '../../public/img', filename);
            
            console.log('准备上传到OSS:', { filename, localPath, exists: fs.existsSync(localPath) });
            
            if (!fs.existsSync(localPath)) {
                return res.status(404).json({
                    success: false,
                    message: '图片文件不存在: ' + localPath
                });
            }
            
            // 使用OSS上传
            const OSS = require('ali-oss');
            const client = new OSS({
                region: ossConfig.region,
                accessKeyId: ossConfig.accessKeyId,
                accessKeySecret: ossConfig.accessKeySecret,
                bucket: ossConfig.bucket
            });
            
            const ossPath = `images/${Date.now()}-${filename}`;
            console.log('开始上传到OSS:', ossPath);
            const result = await client.put(ossPath, localPath);
            console.log('OSS上传成功:', result.url);
            
            return res.json({
                success: true,
                publicUrl: result.url
            });
        } catch (ossError) {
            console.error('OSS上传失败:', ossError);
            // OSS上传失败，返回详细错误信息
            return res.status(500).json({
                success: false,
                message: 'OSS上传失败：' + (ossError.message || '未知错误'),
                error: ossError.message,
                stack: ossError.stack,
                needOSS: true
            });
        }
    }
    
    // 如果没有配置OSS，返回错误提示
    return res.status(500).json({
        success: false,
        message: '未配置OSS对象存储服务。请参考 OSS_CONFIG.md 文件配置阿里云OSS，或使用前端免费图床服务。',
        needOSS: true
    });
});

// AI试衣任务创建接口（代理阿里云DashScope API，解决CORS问题）
router.post('/dress/create-task', (req, res) => {
    // 添加详细的调试日志
    console.log('=== 收到创建任务请求 ===');
    console.log('请求体原始数据:', JSON.stringify(req.body, null, 2));
    
    const { personImageUrl, topGarmentUrl, bottomGarmentUrl, garmentImageUrl, apiKey } = req.body;
    
    console.log('解构后的参数:', {
        hasPersonImageUrl: !!personImageUrl,
        personImageUrl: personImageUrl ? personImageUrl.substring(0, 50) + '...' : null,
        hasTopGarmentUrl: !!topGarmentUrl,
        topGarmentUrl: topGarmentUrl ? topGarmentUrl.substring(0, 50) + '...' : null,
        hasBottomGarmentUrl: !!bottomGarmentUrl,
        bottomGarmentUrl: bottomGarmentUrl ? bottomGarmentUrl.substring(0, 50) + '...' : null,
        hasGarmentImageUrl: !!garmentImageUrl,
        garmentImageUrl: garmentImageUrl ? garmentImageUrl.substring(0, 50) + '...' : null,
        hasApiKey: !!apiKey
    });
    
    // 兼容旧版本：如果只有garmentImageUrl，则作为topGarmentUrl
    const topUrl = topGarmentUrl || garmentImageUrl;
    
    console.log('处理后的参数:', {
        hasPersonImageUrl: !!personImageUrl,
        hasTopUrl: !!topUrl,
        topUrl: topUrl ? topUrl.substring(0, 50) + '...' : null
    });
    
    if (!personImageUrl || !topUrl) {
        console.log('参数验证失败:', {
            personImageUrl: !!personImageUrl,
            topUrl: !!topUrl
        });
        return res.status(400).json({ 
            success: false, 
            message: '请提供人物图片和上装图片URL',
            details: {
                hasPersonImageUrl: !!personImageUrl,
                hasTopGarmentUrl: !!topGarmentUrl,
                hasGarmentImageUrl: !!garmentImageUrl,
                hasTopUrl: !!topUrl
            }
        });
    }
    
    if (!apiKey) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供API Key' 
        });
    }
    
    // 构建请求体
    const inputData = {
        person_image_url: personImageUrl,
        top_garment_url: topUrl
    };
    
    // 如果提供了下装URL，添加到请求中
    if (bottomGarmentUrl) {
        inputData.bottom_garment_url = bottomGarmentUrl;
    }
    
    const requestBody = JSON.stringify({
        model: 'aitryon-plus',
        input: inputData,
        parameters: {
            resolution: -1,
            restore_face: true
        }
    });
    
    // 配置请求选项
    const options = {
        hostname: 'dashscope.aliyuncs.com',
        port: 443,
        path: '/api/v1/services/aigc/image2image/image-synthesis',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-DashScope-Async': 'enable',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };
    
    // 发送请求到阿里云API
    const httpsReq = https.request(options, (httpsRes) => {
        let data = '';
        
        httpsRes.on('data', (chunk) => {
            data += chunk;
        });
        
        httpsRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                
                if (httpsRes.statusCode === 200) {
                    if (responseData.output && responseData.output.task_id) {
                        res.json({
                            success: true,
                            taskId: responseData.output.task_id,
                            data: responseData
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: '创建任务失败：未返回task_id',
                            data: responseData
                        });
                    }
                } else {
                    res.status(httpsRes.statusCode).json({
                        success: false,
                        message: responseData.message || '创建任务失败',
                        data: responseData
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: '解析响应失败',
                    error: error.message
                });
            }
        });
    });
    
    httpsReq.on('error', (error) => {
        console.error('请求阿里云API失败:', error);
        res.status(500).json({
            success: false,
            message: '网络请求失败',
            error: error.message
        });
    });
    
    // 发送请求体
    httpsReq.write(requestBody);
    httpsReq.end();
});

// AI试衣任务查询接口（代理阿里云DashScope API）
router.post('/dress/query-task', (req, res) => {
    const { taskId, apiKey } = req.body;
    
    if (!taskId || !apiKey) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供任务ID和API Key' 
        });
    }
    
    // 配置请求选项
    const options = {
        hostname: 'dashscope.aliyuncs.com',
        port: 443,
        path: `/api/v1/tasks/${taskId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };
    
    // 发送请求到阿里云API
    const httpsReq = https.request(options, (httpsRes) => {
        let data = '';
        
        httpsRes.on('data', (chunk) => {
            data += chunk;
        });
        
        httpsRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                
                if (httpsRes.statusCode === 200) {
                    res.json({
                        success: true,
                        data: responseData
                    });
                } else {
                    res.status(httpsRes.statusCode).json({
                        success: false,
                        message: responseData.message || '查询任务失败',
                        data: responseData
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: '解析响应失败',
                    error: error.message
                });
            }
        });
    });
    
    httpsReq.on('error', (error) => {
        console.error('请求阿里云API失败:', error);
        res.status(500).json({
            success: false,
            message: '网络请求失败',
            error: error.message
        });
    });
    
    httpsReq.end();
});

// 火山引擎AI换装接口（使用Python SDK）
router.post('/dress/volcano', async (req, res) => {
    const { personImageUrl, topGarmentUrl, bottomGarmentUrl, garmentImageUrl } = req.body;
    
    // 兼容旧版本：如果只有garmentImageUrl，则作为topGarmentUrl
    const topUrl = topGarmentUrl || garmentImageUrl;
    
    if (!personImageUrl || !topUrl) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供人物图片和上装图片URL' 
        });
    }
    
    // 使用Python SDK调用火山引擎API
    const { spawn } = require('child_process');
    let pythonScript = path.join(__dirname, 'volcano_dress.py');
    
    // 检查Python脚本是否存在
    console.log('检查Python脚本路径:', pythonScript);
    console.log('__dirname:', __dirname);
    console.log('脚本是否存在:', fs.existsSync(pythonScript));
    
    if (!fs.existsSync(pythonScript)) {
        console.error('Python脚本不存在:', pythonScript);
        console.error('当前工作目录:', process.cwd());
        console.error('尝试查找文件...');
        
        // 尝试其他可能的路径
        const altPaths = [
            path.join(process.cwd(), 'src', 'serve', 'volcano_dress.py'),
            path.join(__dirname, '..', 'serve', 'volcano_dress.py'),
            path.join(process.cwd(), 'demo', 'demo', 'src', 'serve', 'volcano_dress.py')
        ];
        
        let foundPath = null;
        for (const altPath of altPaths) {
            if (fs.existsSync(altPath)) {
                foundPath = altPath;
                console.log('找到脚本在备用路径:', foundPath);
                break;
            }
        }
        
        if (!foundPath) {
            return res.status(500).json({
                success: false,
                message: 'Python脚本不存在',
                details: {
                    expectedPath: pythonScript,
                    currentDir: process.cwd(),
                    __dirname: __dirname,
                    triedPaths: altPaths
                }
            });
        } else {
            // 使用找到的路径
            pythonScript = foundPath;
        }
    }
    
    // 准备输入数据
    const inputDataObj = {
        personImageUrl: personImageUrl,
        topGarmentUrl: topUrl,
        accessKeyId: process.env.VOLCANO_ACCESS_KEY_ID || 'AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY',
        secretAccessKey: process.env.VOLCANO_SECRET_ACCESS_KEY || 'TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ=='
    };
    
    // 如果提供了下装URL，添加到输入数据中
    if (bottomGarmentUrl) {
        inputDataObj.bottomGarmentUrl = bottomGarmentUrl;
    }
    
    const inputData = JSON.stringify(inputDataObj);
    
    console.log('调用Python脚本:', pythonScript);
    console.log('Python脚本绝对路径:', path.resolve(pythonScript));
    console.log('输入数据:', {
        personImageUrl: personImageUrl ? personImageUrl.substring(0, 50) + '...' : 'null',
        topGarmentUrl: topUrl ? topUrl.substring(0, 50) + '...' : 'null',
        bottomGarmentUrl: bottomGarmentUrl ? bottomGarmentUrl.substring(0, 50) + '...' : 'null'
    });
    
    // 直接尝试执行Python脚本，按优先级尝试不同的Python命令
    // Windows系统：优先尝试 py（Python Launcher），然后 python
    // Linux/Mac：使用 python3
    const pythonCommands = process.platform === 'win32' 
        ? ['py', 'python', 'python3']  // Windows优先使用py命令
        : ['python3', 'python'];
    
    console.log('准备调用Python脚本:', pythonScript);
    console.log('当前平台:', process.platform);
    console.log('将尝试的Python命令:', pythonCommands);
    
    // 直接尝试执行，如果失败则尝试下一个命令
    let pythonCommand = pythonCommands[0];  // 默认使用第一个命令
    let pythonProcess = null;
    let lastError = null;
    
    for (const cmd of pythonCommands) {
        try {
            console.log(`尝试使用命令: ${cmd}`);
            pythonCommand = cmd;
            pythonProcess = spawn(cmd, [pythonScript], {
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: true,  // 强制使用shell，确保Windows上能正常工作
                env: process.env  // 传递环境变量
            });
            
            // 如果spawn成功（没有立即报错），说明命令可用
            console.log(`✓ 成功启动Python进程，使用命令: ${cmd}`);
            break;
        } catch (error) {
            console.log(`✗ 命令 ${cmd} 启动失败:`, error.message);
            lastError = error;
            pythonProcess = null;
            continue;
        }
    }
    
    // 如果所有命令都失败
    if (!pythonProcess) {
        console.error('所有Python命令启动失败');
        console.error('最后错误:', lastError);
        return res.status(500).json({
            success: false,
            message: 'Python环境未找到，请确保已安装Python 3.7+',
            suggestion: process.platform === 'win32' 
                ? 'Windows系统请安装Python 3.7+，并确保py或python命令可用。如果已安装，请尝试在命令行运行"py --version"或"python --version"确认。如果命令可用但后端仍报错，请重启后端服务器或检查PATH环境变量。'
                : '请安装Python 3.7+，并确保python3命令可用',
            triedCommands: pythonCommands,
            platform: process.platform,
            lastError: lastError ? lastError.message : '未知错误'
        });
    }
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });
    
    // 发送输入数据
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();
    
    pythonProcess.on('close', (code) => {
        console.log('Python脚本执行完成，退出码:', code);
        console.log('Python输出:', output);
        if (errorOutput) {
            console.error('Python错误输出:', errorOutput);
        }
        
        if (code === 0) {
            try {
                // 解析Python脚本输出的JSON
                const result = JSON.parse(output);
                
                if (result.success) {
                    if (result.imageUrl || (result.image_urls && result.image_urls.length > 0)) {
                        res.json({
                            success: true,
                            imageUrl: result.imageUrl || result.image_urls[0],
                            image_urls: result.image_urls || [result.imageUrl]
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: result.message || 'API返回成功但未包含图片URL',
                            response: result
                        });
                    }
                } else {
                    res.status(500).json({
                        success: false,
                        message: result.message || 'API调用失败',
                        error: result.error,
                        response: result
                    });
                }
            } catch (error) {
                console.error('解析Python脚本输出失败:', error);
                console.error('原始输出:', output);
                res.status(500).json({
                    success: false,
                    message: '解析Python脚本输出失败',
                    error: error.message,
                    output: output,
                    errorOutput: errorOutput
                });
            }
        } else {
            // Python脚本执行失败
            console.error('Python脚本执行失败，退出码:', code);
            console.error('错误输出:', errorOutput);
            
            // 如果是因为找不到python命令，提供详细错误信息
            if (code === 127 || errorOutput.includes('python') || errorOutput.includes('不是内部或外部命令') || errorOutput.includes('command not found')) {
                res.status(500).json({
                    success: false,
                    message: 'Python环境未找到，请确保已安装Python 3.7+',
                    error: errorOutput,
                    suggestion: process.platform === 'win32'
                        ? `请安装Python 3.7+，并确保${pythonCommand}命令可用。Windows系统请确保安装时勾选了"Add Python to PATH"，或使用Python Launcher（py命令）`
                        : `请安装Python 3.7+，并确保${pythonCommand}命令可用`
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Python脚本执行失败',
                    error: errorOutput || '未知错误',
                    exitCode: code,
                    output: output
                });
            }
        }
    });
    
    pythonProcess.on('error', (error) => {
        console.error('启动Python进程失败:', error);
        res.status(500).json({
            success: false,
            message: '无法启动Python进程',
            error: error.message,
            suggestion: process.platform === 'win32'
                ? '请确保已安装Python 3.7+，并且py或python命令可用。Windows系统推荐使用Python Launcher（py命令）'
                : '请确保已安装Python 3.7+，并且python3命令可用'
        });
    });
});

module.exports = router;
// });

// const upload = multer({ storage });

// router.post('/api/user', upload.single('avatar'), (req, res) => {
//   const { name, id, bio, gender, birthday, location } = req.body;
//   const user = new User({
//     avatar: req.file ? req.file.filename : '',
//     name,
//     id,
//     bio,
//     gender,
//     birthday,
//     location
//   });
//   user.save((error, user) => {
//     if (error) {
//       console.error(error);
//       res.status(500).send('保存失败');
//     } else {
//       console.log(user);
//       res.send('保存成功');
//     }
//   });
// });

// // 处理头像上传请求的路由
// router.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
//   // 处理上传的头像文件
//   const avatarFile = req.file;

//   // 将头像文件保存到数据库
//   // 使用适合您数据库的库或框架进行数据库操作，例如Mongoose、Sequelize等

//   // 示例使用Mongoose保存头像文件的代码
//   const Avatar = require('./models/avatar');
//   const newAvatar = new Avatar({
//     filename: avatarFile.filename,
//     originalname: avatarFile.originalname,
//     path: avatarFile.path
//   });
//   newAvatar.save()
//     .then(savedAvatar => {
//       // 返回保存成功的响应
//       res.json({ avatarUrl: savedAvatar.path });
//     })
//     .catch(error => {
//       // 处理保存失败的错误
//       console.error(error);
//       res.status(500).json({ error: 'Failed to save the avatar' });
//     });
// });

//管理展览数据

// ==================== 衣服相关API ====================

// 测试路由
router.get('/clothes/test', (req, res) => {
    res.json({ success: true, message: '衣服API路由正常工作' });
});

// 获取衣服列表
router.get('/clothes/list', (req, res) => {
    const { category_id, sub_category_id, keyword } = req.query;
    let sql = "SELECT * FROM clothes WHERE 1=1";
    const params = [];
    
    if (category_id && category_id !== 'all') {
        sql += " AND category_id = ?";
        params.push(category_id);
    }
    
    if (sub_category_id) {
        sql += " AND sub_category_id = ?";
        params.push(sub_category_id);
    }
    
    if (keyword) {
        sql += " AND (name LIKE ? OR dynasty LIKE ? OR detailed LIKE ?)";
        const keywordPattern = `%${keyword}%`;
        params.push(keywordPattern, keywordPattern, keywordPattern);
    }
    
    sql += " ORDER BY create_time DESC";
    
    pool.query(sql, params, (err, results) => {
        if (err) {
            console.error('查询衣服列表失败:', err);
            res.status(500).json({ success: false, message: '查询失败', error: err.message });
        } else {
            res.json({ success: true, data: results });
        }
    });
});

// 获取衣服详情
router.get('/clothes/detail/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM clothes WHERE id = ?";
    
    pool.query(sql, [id], (err, results) => {
        if (err) {
            console.error('查询衣服详情失败:', err);
            res.status(500).json({ success: false, message: '查询失败', error: err.message });
        } else {
            if (results.length === 0) {
                res.status(404).json({ success: false, message: '衣服不存在' });
            } else {
                res.json({ success: true, data: results[0] });
            }
        }
    });
});

// 添加衣服
router.post('/clothes/add', upload.single('image'), (req, res) => {
    const {
        name,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name,
        color,
        season,
        purchase_time,
        brand,
        price,
        dynasty,
        detailed,
        location
    } = req.body;
    
    // 处理图片上传
    let imagePath = null;
    if (req.file) {
        imagePath = 'img/' + req.file.filename;
    } else if (req.body.image) {
        // 如果前端直接传递了图片URL
        imagePath = req.body.image;
    }
    
    const sql = `INSERT INTO clothes (
        name, image, category_id, category_name, sub_category_id, sub_category_name,
        color, season, purchase_time, brand, price, dynasty, detailed, location
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        name,
        imagePath,
        category_id || null,
        category_name || null,
        sub_category_id || null,
        sub_category_name || null,
        color || null,
        season || null,
        purchase_time || null,
        brand || null,
        price ? parseFloat(price) : null,
        dynasty || null,
        detailed || null,
        location || null
    ];
    
    pool.query(sql, values, (err, results) => {
        if (err) {
            console.error('添加衣服失败:', err);
            res.status(500).json({ success: false, message: '添加失败', error: err.message });
        } else {
            res.json({ 
                success: true, 
                message: '添加成功',
                data: { id: results.insertId }
            });
        }
    });
});

// 更新衣服信息
router.post('/clothes/update/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const {
        name,
        category_id,
        category_name,
        sub_category_id,
        sub_category_name,
        color,
        season,
        purchase_time,
        brand,
        price,
        dynasty,
        detailed,
        location
    } = req.body;
    
    // 构建更新SQL
    let sql = "UPDATE clothes SET ";
    const updates = [];
    const values = [];
    
    if (name) { updates.push("name = ?"); values.push(name); }
    if (req.file) { 
        updates.push("image = ?"); 
        values.push('img/' + req.file.filename); 
    } else if (req.body.image) {
        updates.push("image = ?");
        values.push(req.body.image);
    }
    if (category_id) { updates.push("category_id = ?"); values.push(category_id); }
    if (category_name) { updates.push("category_name = ?"); values.push(category_name); }
    if (sub_category_id) { updates.push("sub_category_id = ?"); values.push(sub_category_id); }
    if (sub_category_name) { updates.push("sub_category_name = ?"); values.push(sub_category_name); }
    if (color !== undefined) { updates.push("color = ?"); values.push(color); }
    if (season !== undefined) { updates.push("season = ?"); values.push(season); }
    if (purchase_time) { updates.push("purchase_time = ?"); values.push(purchase_time); }
    if (brand !== undefined) { updates.push("brand = ?"); values.push(brand); }
    if (price !== undefined) { updates.push("price = ?"); values.push(parseFloat(price)); }
    if (dynasty !== undefined) { updates.push("dynasty = ?"); values.push(dynasty); }
    if (detailed !== undefined) { updates.push("detailed = ?"); values.push(detailed); }
    if (location !== undefined) { updates.push("location = ?"); values.push(location); }
    
    if (updates.length === 0) {
        return res.status(400).json({ success: false, message: '没有要更新的字段' });
    }
    
    sql += updates.join(", ");
    sql += " WHERE id = ?";
    values.push(id);
    
    pool.query(sql, values, (err, results) => {
        if (err) {
            console.error('更新衣服失败:', err);
            res.status(500).json({ success: false, message: '更新失败', error: err.message });
        } else {
            res.json({ success: true, message: '更新成功' });
        }
    });
});

// 删除衣服（支持批量删除）
router.post('/clothes/delete', (req, res) => {
    const { ids } = req.body; // ids 应该是数组
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: '请提供要删除的衣服ID' });
    }
    
    const placeholders = ids.map(() => '?').join(',');
    const sql = `DELETE FROM clothes WHERE id IN (${placeholders})`;
    
    pool.query(sql, ids, (err, results) => {
        if (err) {
            console.error('删除衣服失败:', err);
            res.status(500).json({ success: false, message: '删除失败', error: err.message });
        } else {
            res.json({ 
                success: true, 
                message: `成功删除 ${results.affectedRows} 条记录` 
            });
        }
    });
});

// 通用图片上传接口（用于AI试衣等功能）
router.post('/upload/image', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: '请上传图片文件' });
    }
    
    // 如果配置了OSS，优先上传到OSS
    const ossConfig = {
        region: process.env.OSS_REGION,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        bucket: process.env.OSS_BUCKET
    };
    
    if (ossConfig.region && ossConfig.accessKeyId && ossConfig.accessKeySecret && ossConfig.bucket) {
        try {
            // 使用OSS上传
            const OSS = require('ali-oss');
            const client = new OSS({
                region: ossConfig.region,
                accessKeyId: ossConfig.accessKeyId,
                accessKeySecret: ossConfig.accessKeySecret,
                bucket: ossConfig.bucket
            });
            
            const ossPath = `images/${Date.now()}-${req.file.filename}`;
            const result = await client.put(ossPath, req.file.path);
            
            // 删除本地临时文件
            fs.unlinkSync(req.file.path);
            
            // 返回OSS公网URL
            const imageUrl = result.url;
            return res.json({
                success: true,
                url: imageUrl,
                imageUrl: imageUrl,
                data: {
                    url: imageUrl,
                    imageUrl: imageUrl
                }
            });
        } catch (ossError) {
            console.error('OSS上传失败，使用本地存储:', ossError);
            // OSS上传失败，继续使用本地存储
        }
    }
    
    // 如果没有配置OSS或OSS上传失败，使用本地存储
    const imageUrl = `http://127.0.0.1:8083/img/${req.file.filename}`;
    
    res.json({
        success: true,
        url: imageUrl,
        imageUrl: imageUrl,
        data: {
            url: imageUrl,
            imageUrl: imageUrl
        }
    });
});

// 将本地图片URL转换为公网URL（优先使用OSS，否则使用免费图床）
router.post('/dress/convert-image-url', async (req, res) => {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供图片URL' 
        });
    }
    
    // 如果已经是公网URL（不是本地地址），直接返回
    if (imageUrl.startsWith('https://')) {
        return res.json({
            success: true,
            publicUrl: imageUrl
        });
    }
    if (imageUrl.startsWith('http://') && !imageUrl.includes('127.0.0.1') && !imageUrl.includes('localhost')) {
        return res.json({
            success: true,
            publicUrl: imageUrl
        });
    }
    
    // 如果配置了OSS，优先上传到OSS
    const ossConfig = {
        region: process.env.OSS_REGION,
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        bucket: process.env.OSS_BUCKET
    };
    
    console.log('OSS配置检查:', {
        hasRegion: !!ossConfig.region,
        hasAccessKeyId: !!ossConfig.accessKeyId,
        hasAccessKeySecret: !!ossConfig.accessKeySecret,
        hasBucket: !!ossConfig.bucket,
        region: ossConfig.region,
        bucket: ossConfig.bucket
    });
    
    if (ossConfig.region && ossConfig.accessKeyId && ossConfig.accessKeySecret && ossConfig.bucket) {
        try {
            // 提取文件名
            let filename;
            if (imageUrl.includes('img/')) {
                filename = imageUrl.split('img/')[1].split('?')[0];
            } else {
                const urlParts = imageUrl.split('/');
                filename = urlParts[urlParts.length - 1].split('?')[0];
            }
            filename = decodeURIComponent(filename);
            const localPath = path.join(__dirname, '../../public/img', filename);
            
            console.log('准备上传到OSS:', { filename, localPath, exists: fs.existsSync(localPath) });
            
            if (!fs.existsSync(localPath)) {
                return res.status(404).json({
                    success: false,
                    message: '图片文件不存在: ' + localPath
                });
            }
            
            // 使用OSS上传
            const OSS = require('ali-oss');
            const client = new OSS({
                region: ossConfig.region,
                accessKeyId: ossConfig.accessKeyId,
                accessKeySecret: ossConfig.accessKeySecret,
                bucket: ossConfig.bucket
            });
            
            const ossPath = `images/${Date.now()}-${filename}`;
            console.log('开始上传到OSS:', ossPath);
            const result = await client.put(ossPath, localPath);
            console.log('OSS上传成功:', result.url);
            
            return res.json({
                success: true,
                publicUrl: result.url
            });
        } catch (ossError) {
            console.error('OSS上传失败:', ossError);
            // OSS上传失败，返回详细错误信息
            return res.status(500).json({
                success: false,
                message: 'OSS上传失败：' + (ossError.message || '未知错误'),
                error: ossError.message,
                stack: ossError.stack,
                needOSS: true
            });
        }
    }
    
    // 如果没有配置OSS，返回错误提示
    return res.status(500).json({
        success: false,
        message: '未配置OSS对象存储服务。请参考 OSS_CONFIG.md 文件配置阿里云OSS，或使用前端免费图床服务。',
        needOSS: true
    });
});

// AI试衣任务创建接口（代理阿里云DashScope API，解决CORS问题）
router.post('/dress/create-task', (req, res) => {
    // 添加详细的调试日志
    console.log('=== 收到创建任务请求 ===');
    console.log('请求体原始数据:', JSON.stringify(req.body, null, 2));
    
    const { personImageUrl, topGarmentUrl, bottomGarmentUrl, garmentImageUrl, apiKey } = req.body;
    
    console.log('解构后的参数:', {
        hasPersonImageUrl: !!personImageUrl,
        personImageUrl: personImageUrl ? personImageUrl.substring(0, 50) + '...' : null,
        hasTopGarmentUrl: !!topGarmentUrl,
        topGarmentUrl: topGarmentUrl ? topGarmentUrl.substring(0, 50) + '...' : null,
        hasBottomGarmentUrl: !!bottomGarmentUrl,
        bottomGarmentUrl: bottomGarmentUrl ? bottomGarmentUrl.substring(0, 50) + '...' : null,
        hasGarmentImageUrl: !!garmentImageUrl,
        garmentImageUrl: garmentImageUrl ? garmentImageUrl.substring(0, 50) + '...' : null,
        hasApiKey: !!apiKey
    });
    
    // 兼容旧版本：如果只有garmentImageUrl，则作为topGarmentUrl
    const topUrl = topGarmentUrl || garmentImageUrl;
    
    console.log('处理后的参数:', {
        hasPersonImageUrl: !!personImageUrl,
        hasTopUrl: !!topUrl,
        topUrl: topUrl ? topUrl.substring(0, 50) + '...' : null
    });
    
    if (!personImageUrl || !topUrl) {
        console.log('参数验证失败:', {
            personImageUrl: !!personImageUrl,
            topUrl: !!topUrl
        });
        return res.status(400).json({ 
            success: false, 
            message: '请提供人物图片和上装图片URL',
            details: {
                hasPersonImageUrl: !!personImageUrl,
                hasTopGarmentUrl: !!topGarmentUrl,
                hasGarmentImageUrl: !!garmentImageUrl,
                hasTopUrl: !!topUrl
            }
        });
    }
    
    if (!apiKey) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供API Key' 
        });
    }
    
    // 构建请求体
    const inputData = {
        person_image_url: personImageUrl,
        top_garment_url: topUrl
    };
    
    // 如果提供了下装URL，添加到请求中
    if (bottomGarmentUrl) {
        inputData.bottom_garment_url = bottomGarmentUrl;
    }
    
    const requestBody = JSON.stringify({
        model: 'aitryon-plus',
        input: inputData,
        parameters: {
            resolution: -1,
            restore_face: true
        }
    });
    
    // 配置请求选项
    const options = {
        hostname: 'dashscope.aliyuncs.com',
        port: 443,
        path: '/api/v1/services/aigc/image2image/image-synthesis',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-DashScope-Async': 'enable',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };
    
    // 发送请求到阿里云API
    const httpsReq = https.request(options, (httpsRes) => {
        let data = '';
        
        httpsRes.on('data', (chunk) => {
            data += chunk;
        });
        
        httpsRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                
                if (httpsRes.statusCode === 200) {
                    if (responseData.output && responseData.output.task_id) {
                        res.json({
                            success: true,
                            taskId: responseData.output.task_id,
                            data: responseData
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: '创建任务失败：未返回task_id',
                            data: responseData
                        });
                    }
                } else {
                    res.status(httpsRes.statusCode).json({
                        success: false,
                        message: responseData.message || '创建任务失败',
                        data: responseData
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: '解析响应失败',
                    error: error.message
                });
            }
        });
    });
    
    httpsReq.on('error', (error) => {
        console.error('请求阿里云API失败:', error);
        res.status(500).json({
            success: false,
            message: '网络请求失败',
            error: error.message
        });
    });
    
    // 发送请求体
    httpsReq.write(requestBody);
    httpsReq.end();
});

// AI试衣任务查询接口（代理阿里云DashScope API）
router.post('/dress/query-task', (req, res) => {
    const { taskId, apiKey } = req.body;
    
    if (!taskId || !apiKey) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供任务ID和API Key' 
        });
    }
    
    // 配置请求选项
    const options = {
        hostname: 'dashscope.aliyuncs.com',
        port: 443,
        path: `/api/v1/tasks/${taskId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`
        }
    };
    
    // 发送请求到阿里云API
    const httpsReq = https.request(options, (httpsRes) => {
        let data = '';
        
        httpsRes.on('data', (chunk) => {
            data += chunk;
        });
        
        httpsRes.on('end', () => {
            try {
                const responseData = JSON.parse(data);
                
                if (httpsRes.statusCode === 200) {
                    res.json({
                        success: true,
                        data: responseData
                    });
                } else {
                    res.status(httpsRes.statusCode).json({
                        success: false,
                        message: responseData.message || '查询任务失败',
                        data: responseData
                    });
                }
            } catch (error) {
                res.status(500).json({
                    success: false,
                    message: '解析响应失败',
                    error: error.message
                });
            }
        });
    });
    
    httpsReq.on('error', (error) => {
        console.error('请求阿里云API失败:', error);
        res.status(500).json({
            success: false,
            message: '网络请求失败',
            error: error.message
        });
    });
    
    httpsReq.end();
});

// 火山引擎AI换装接口（使用Python SDK）
router.post('/dress/volcano', async (req, res) => {
    const { personImageUrl, topGarmentUrl, bottomGarmentUrl, garmentImageUrl } = req.body;
    
    // 兼容旧版本：如果只有garmentImageUrl，则作为topGarmentUrl
    const topUrl = topGarmentUrl || garmentImageUrl;
    
    if (!personImageUrl || !topUrl) {
        return res.status(400).json({ 
            success: false, 
            message: '请提供人物图片和上装图片URL' 
        });
    }
    
    // 使用Python SDK调用火山引擎API
    const { spawn } = require('child_process');
    let pythonScript = path.join(__dirname, 'volcano_dress.py');
    
    // 检查Python脚本是否存在
    console.log('检查Python脚本路径:', pythonScript);
    console.log('__dirname:', __dirname);
    console.log('脚本是否存在:', fs.existsSync(pythonScript));
    
    if (!fs.existsSync(pythonScript)) {
        console.error('Python脚本不存在:', pythonScript);
        console.error('当前工作目录:', process.cwd());
        console.error('尝试查找文件...');
        
        // 尝试其他可能的路径
        const altPaths = [
            path.join(process.cwd(), 'src', 'serve', 'volcano_dress.py'),
            path.join(__dirname, '..', 'serve', 'volcano_dress.py'),
            path.join(process.cwd(), 'demo', 'demo', 'src', 'serve', 'volcano_dress.py')
        ];
        
        let foundPath = null;
        for (const altPath of altPaths) {
            if (fs.existsSync(altPath)) {
                foundPath = altPath;
                console.log('找到脚本在备用路径:', foundPath);
                break;
            }
        }
        
        if (!foundPath) {
            return res.status(500).json({
                success: false,
                message: 'Python脚本不存在',
                details: {
                    expectedPath: pythonScript,
                    currentDir: process.cwd(),
                    __dirname: __dirname,
                    triedPaths: altPaths
                }
            });
        } else {
            // 使用找到的路径
            pythonScript = foundPath;
        }
    }
    
    // 准备输入数据
    const inputDataObj = {
        personImageUrl: personImageUrl,
        topGarmentUrl: topUrl,
        accessKeyId: process.env.VOLCANO_ACCESS_KEY_ID || 'AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY',
        secretAccessKey: process.env.VOLCANO_SECRET_ACCESS_KEY || 'TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ=='
    };
    
    // 如果提供了下装URL，添加到输入数据中
    if (bottomGarmentUrl) {
        inputDataObj.bottomGarmentUrl = bottomGarmentUrl;
    }
    
    const inputData = JSON.stringify(inputDataObj);
    
    console.log('调用Python脚本:', pythonScript);
    console.log('Python脚本绝对路径:', path.resolve(pythonScript));
    console.log('输入数据:', {
        personImageUrl: personImageUrl ? personImageUrl.substring(0, 50) + '...' : 'null',
        topGarmentUrl: topUrl ? topUrl.substring(0, 50) + '...' : 'null',
        bottomGarmentUrl: bottomGarmentUrl ? bottomGarmentUrl.substring(0, 50) + '...' : 'null'
    });
    
    // 直接尝试执行Python脚本，按优先级尝试不同的Python命令
    // Windows系统：优先尝试 py（Python Launcher），然后 python
    // Linux/Mac：使用 python3
    const pythonCommands = process.platform === 'win32' 
        ? ['py', 'python', 'python3']  // Windows优先使用py命令
        : ['python3', 'python'];
    
    console.log('准备调用Python脚本:', pythonScript);
    console.log('当前平台:', process.platform);
    console.log('将尝试的Python命令:', pythonCommands);
    
    // 直接尝试执行，如果失败则尝试下一个命令
    let pythonCommand = pythonCommands[0];  // 默认使用第一个命令
    let pythonProcess = null;
    let lastError = null;
    
    for (const cmd of pythonCommands) {
        try {
            console.log(`尝试使用命令: ${cmd}`);
            pythonCommand = cmd;
            pythonProcess = spawn(cmd, [pythonScript], {
                stdio: ['pipe', 'pipe', 'pipe'],
                shell: true,  // 强制使用shell，确保Windows上能正常工作
                env: process.env  // 传递环境变量
            });
            
            // 如果spawn成功（没有立即报错），说明命令可用
            console.log(`✓ 成功启动Python进程，使用命令: ${cmd}`);
            break;
        } catch (error) {
            console.log(`✗ 命令 ${cmd} 启动失败:`, error.message);
            lastError = error;
            pythonProcess = null;
            continue;
        }
    }
    
    // 如果所有命令都失败
    if (!pythonProcess) {
        console.error('所有Python命令启动失败');
        console.error('最后错误:', lastError);
        return res.status(500).json({
            success: false,
            message: 'Python环境未找到，请确保已安装Python 3.7+',
            suggestion: process.platform === 'win32' 
                ? 'Windows系统请安装Python 3.7+，并确保py或python命令可用。如果已安装，请尝试在命令行运行"py --version"或"python --version"确认。如果命令可用但后端仍报错，请重启后端服务器或检查PATH环境变量。'
                : '请安装Python 3.7+，并确保python3命令可用',
            triedCommands: pythonCommands,
            platform: process.platform,
            lastError: lastError ? lastError.message : '未知错误'
        });
    }
    
    let output = '';
    let errorOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
        output += data.toString();
    });
    
    pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString();
    });
    
    // 发送输入数据
    pythonProcess.stdin.write(inputData);
    pythonProcess.stdin.end();
    
    pythonProcess.on('close', (code) => {
        console.log('Python脚本执行完成，退出码:', code);
        console.log('Python输出:', output);
        if (errorOutput) {
            console.error('Python错误输出:', errorOutput);
        }
        
        if (code === 0) {
            try {
                // 解析Python脚本输出的JSON
                const result = JSON.parse(output);
                
                if (result.success) {
                    if (result.imageUrl || (result.image_urls && result.image_urls.length > 0)) {
                        res.json({
                            success: true,
                            imageUrl: result.imageUrl || result.image_urls[0],
                            image_urls: result.image_urls || [result.imageUrl]
                        });
                    } else {
                        res.status(500).json({
                            success: false,
                            message: result.message || 'API返回成功但未包含图片URL',
                            response: result
                        });
                    }
                } else {
                    res.status(500).json({
                        success: false,
                        message: result.message || 'API调用失败',
                        error: result.error,
                        response: result
                    });
                }
            } catch (error) {
                console.error('解析Python脚本输出失败:', error);
                console.error('原始输出:', output);
                res.status(500).json({
                    success: false,
                    message: '解析Python脚本输出失败',
                    error: error.message,
                    output: output,
                    errorOutput: errorOutput
                });
            }
        } else {
            // Python脚本执行失败
            console.error('Python脚本执行失败，退出码:', code);
            console.error('错误输出:', errorOutput);
            
            // 如果是因为找不到python命令，提供详细错误信息
            if (code === 127 || errorOutput.includes('python') || errorOutput.includes('不是内部或外部命令') || errorOutput.includes('command not found')) {
                res.status(500).json({
                    success: false,
                    message: 'Python环境未找到，请确保已安装Python 3.7+',
                    error: errorOutput,
                    suggestion: process.platform === 'win32'
                        ? `请安装Python 3.7+，并确保${pythonCommand}命令可用。Windows系统请确保安装时勾选了"Add Python to PATH"，或使用Python Launcher（py命令）`
                        : `请安装Python 3.7+，并确保${pythonCommand}命令可用`
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Python脚本执行失败',
                    error: errorOutput || '未知错误',
                    exitCode: code,
                    output: output
                });
            }
        }
    });
    
    pythonProcess.on('error', (error) => {
        console.error('启动Python进程失败:', error);
        res.status(500).json({
            success: false,
            message: '无法启动Python进程',
            error: error.message,
            suggestion: process.platform === 'win32'
                ? '请确保已安装Python 3.7+，并且py或python命令可用。Windows系统推荐使用Python Launcher（py命令）'
                : '请确保已安装Python 3.7+，并且python3命令可用'
        });
    });
});

module.exports = router;