-- 创建衣服表（单品详情表）
CREATE TABLE IF NOT EXISTS `clothes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '衣服名称',
  `image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '衣服图像',
  `category_id` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '一级分类ID',
  `category_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '一级分类名称',
  `sub_category_id` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '二级分类ID',
  `sub_category_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '二级分类名称',
  `color` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '颜色',
  `season` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '季节',
  `purchase_time` date DEFAULT NULL COMMENT '购入时间',
  `brand` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '品牌',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `dynasty` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '朝代',
  `detailed` text COLLATE utf8_unicode_ci COMMENT '描述',
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '位置（如：三号衣柜↓4抽屉）',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID，关联user表的id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_sub_category` (`sub_category_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='衣服单品详情表';

INSERT INTO `clothes` (
  `name`, 
  `image`, 
  `category_id`, 
  `category_name`, 
  `sub_category_id`, 
  `sub_category_name`, 
  `color`, 
  `season`, 
  `purchase_time`, 
  `brand`, 
  `price`, 
  `dynasty`, 
  `detailed`, 
  `location`,
  `user_id`
) VALUES (
  '林深时见鹿',
  'img/微信图片_20251113161603_200_64.jpg',
  'upper',
  '上装',
  'upper_6',
  '比甲',
  '浅绿色',
  '春季/秋季',
  '2022-09-11',
  '明镜华服',
  415.92,
  '明',
  '这是一件精美的明代短比甲，采用圆领设计，整体为浅绿色调，配以精致的盘扣装饰。衣服上绣有精美的花卉图案，展现了传统汉服的优雅与精致。',
  '三号衣柜↓4抽屉',
  7
);

-- ==================== 换装记录表 ====================
CREATE TABLE IF NOT EXISTS `dress_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `result_image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '生成的换装结果图片（相对路径或完整URL）',
  `original_image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '原始上传图片',
  `garment_image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '当时选择的服饰图片',
  `clothes_id` int(11) DEFAULT NULL COMMENT '当时选择的服饰在clothes表中的ID（可选）',
  `provider` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '使用的AI服务提供方（如 aliyun）',
  `status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '换装状态（success / fail 等）',
  `message` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '失败原因或备注',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '换装时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_clothes_id` (`clothes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='AI换装结果记录表';

-- ==================== 收藏衣服表 ====================
CREATE TABLE IF NOT EXISTS `favorite_clothes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `clothes_id` int(11) NOT NULL COMMENT '被收藏的衣服ID，对应clothes.id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '收藏时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_user_clothes` (`user_id`, `clothes_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_clothes_id` (`clothes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='用户收藏的衣服';

-- ==================== 上传换装使用统计表（可选，如果后续需要更细统计可以扩展） ====================
-- 当前上传/换装次数限制逻辑直接通过 clothes 和 dress_history 表统计，无需额外字段。


  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '衣服名称',
  `image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '衣服图像',
  `category_id` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '一级分类ID',
  `category_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '一级分类名称',
  `sub_category_id` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '二级分类ID',
  `sub_category_name` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '二级分类名称',
  `color` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '颜色',
  `season` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '季节',
  `purchase_time` date DEFAULT NULL COMMENT '购入时间',
  `brand` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '品牌',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `dynasty` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '朝代',
  `detailed` text COLLATE utf8_unicode_ci COMMENT '描述',
  `location` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '位置（如：三号衣柜↓4抽屉）',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID，关联user表的id',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_sub_category` (`sub_category_id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci COMMENT='衣服单品详情表';

-- 插入示例数据：林深时见鹿
INSERT INTO `clothes` (
  `name`, 
  `image`, 
  `category_id`, 
  `category_name`, 
  `sub_category_id`, 
  `sub_category_name`, 
  `color`, 
  `season`, 
  `purchase_time`, 
  `brand`, 
  `price`, 
  `dynasty`, 
  `detailed`, 
  `location`,
  `user_id`
) VALUES (
  '林深时见鹿',
  'img/微信图片_20251113161603_200_64.jpg',
  'upper',
  '上装',
  'upper_6',
  '比甲',
  '浅绿色',
  '春季/秋季',
  '2022-09-11',
  '明镜华服',
  415.92,
  '明',
  '这是一件精美的明代短比甲，采用圆领设计，整体为浅绿色调，配以精致的盘扣装饰。衣服上绣有精美的花卉图案，展现了传统汉服的优雅与精致。',
  '三号衣柜↓4抽屉',
  7
);





