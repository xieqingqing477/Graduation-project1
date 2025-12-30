-- ==================== 换装记录表 ====================
-- 如果表已存在则跳过创建
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


