-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 2023-12-23 13:10:00
-- 服务器版本： 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `museum`
--

-- --------------------------------------------------------

--
-- 表的结构 `cci`
--

CREATE TABLE IF NOT EXISTS `cci` (
  `cid` int(11) NOT NULL,
  `price` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `thumb` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `cci`
--

INSERT INTO `cci` (`cid`, `price`, `description`, `title`, `thumb`) VALUES
(1, '599.00', '中国博物馆秋影金波茶具礼盒套装茶杯盘子套装餐具礼品中国风礼物', '秋影金波节庆礼盒', 'https://img12.360buyimg.com/n7/jfs/t1/96156/27/38173/99117/6430cb97Fc70627b1/4210e80132638a9d.jpg!q90'),
(2, '599.00', '中国国家博物馆花鸟玲珑香囊套装熏香手工合香香蜜丸国博文创新婚礼物送朋友 绿色', '花鸟玲珑香囊套装', 'https://img14.360buyimg.com/n0/jfs/t1/127090/6/23323/220118/621dccb6E43fa602e/bd9ec18420e71f07.jpg.avif'),
(3, '599.00', '中国博物馆秋影金波茶具礼盒套装茶杯盘子套装餐具礼品中国风礼物', '秋影金波节庆礼盒', 'http://img14.360buyimg.com/n5/s54x54_jfs/t1/169142/4/33802/54835/63a93d55Fcac1ae61/2e6e52c00079ea03.jpg.avif');

-- --------------------------------------------------------

--
-- 表的结构 `collect`
--

CREATE TABLE IF NOT EXISTS `collect` (
  `collect_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  `source_table` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_field` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_id` int(10) NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `img` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`collect_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `collect`
--

INSERT INTO `collect` (`collect_id`, `user_id`, `source_table`, `source_field`, `source_id`, `title`, `img`, `create_time`, `update_time`) VALUES
(1, 1001, '珐琅彩楼转心瓶', 'image', 1, '珐琅彩楼转心瓶', 'gc5.png', '2023-12-18 00:38:10', '2023-12-18 00:38:10'),
(2, 1001, '画珐琅兽面纹', 'image', 2, '画珐琅兽面纹', 'gc2.png', '2023-12-18 00:38:11', '2023-12-18 00:38:11'),
(3, 1001, '掐丝珐琅兽面纹出戟', 'image', 3, '掐丝珐琅兽面纹出戟', 'gc3.png', '2023-12-18 00:38:12', '2023-12-18 00:38:12'),
(4, 1001, '康熙款画珐琅莲瓣式盘', 'image', 4, '康熙款画珐琅莲瓣式盘', 'tc4.png', '2023-12-18 00:38:13', '2023-12-18 00:38:13'),
(5, 1001, '银錾刻团花纹委角盒', 'image', 5, '银錾刻团花纹委角盒', 'gc6.png', '2023-12-18 00:38:14', '2023-12-18 00:38:14'),
(6, 1001, '乾隆款红漆描金丹凤牡丹纹银里撇口碗', 'image', 6, '乾隆款红漆描金丹凤牡丹纹银里撇口碗', 'gc7.png', '2023-12-18 00:38:15', '2023-12-18 00:38:15');

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--

CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reply_to_id` int(11) NOT NULL DEFAULT '0',
  `content` longtext COLLATE utf8_unicode_ci,
  `nickname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `avatar` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `source_table` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_field` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `source_id` int(10) NOT NULL,
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `cultural_relics_information`
--

CREATE TABLE IF NOT EXISTS `cultural_relics_information` (
  `cultural_relics_information_id` int(11) NOT NULL,
  `cultural_relic_number` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name_of_cultural_relics` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `types_of_cultural_relics` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `unearthed_time` date DEFAULT NULL,
  `pictures_of_cultural_relics` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `introduction_to_cultural_relics` longtext COLLATE utf8_unicode_ci,
  `hits` int(11) NOT NULL DEFAULT '0',
  `praise_len` int(11) NOT NULL DEFAULT '0',
  `recommend` int(11) NOT NULL DEFAULT '0',
  `create_time` datetime DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`cultural_relics_information_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `exhibition_information`
--

CREATE TABLE IF NOT EXISTS `exhibition_information` (
  `exhibition_information_id` int(11) NOT NULL AUTO_INCREMENT,
  `exhibition_name` varchar(64) COLLATE utf8_unicode_ci NOT NULL,
  `start_time` date NOT NULL,
  `end_time` date NOT NULL,
  `ticket_price` int(11) NOT NULL,
  `cover_photo` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `exhibition_address` text COLLATE utf8_unicode_ci NOT NULL,
  `ticketing_instructions` text COLLATE utf8_unicode_ci NOT NULL,
  `exhibition_introduction` longtext COLLATE utf8_unicode_ci NOT NULL,
  `hits` int(11) DEFAULT NULL,
  `praise_len` int(11) DEFAULT NULL,
  `recommend` int(11) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `update_time` timestamp NULL DEFAULT NULL,
  `tc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `path` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`exhibition_information_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `exhibition_information`
--

INSERT INTO `exhibition_information` (`exhibition_information_id`, `exhibition_name`, `start_time`, `end_time`, `ticket_price`, `cover_photo`, `exhibition_address`, `ticketing_instructions`, `exhibition_introduction`, `hits`, `praise_len`, `recommend`, `create_time`, `update_time`, `tc`, `path`) VALUES
(1, '大圣遗音', '2023-11-28', '2023-12-31', 100, 'https://www.dpm.org.cn/Uploads/Picture/2023/11/28/s656540bac2e38.jpg', '北京市东城区某某地点', '购票须知内容', '古琴文化展', 0, 0, 1, '2023-12-14 10:43:21', '2023-12-14 02:43:21', '大圣遗音——古琴文化展（第二期）', 'zl'),
(2, '吉光片羽', '2023-10-31', '2023-11-30', 80, 'https://www.dpm.org.cn/Uploads/Picture/2023/10/31/s654097a23fb12.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:43:21', '2023-12-14 02:43:21', '吉光片羽——故宫博物院藏清代雕版文物展', 'jgpy'),
(3, '五洲四海', '2023-09-01', '2023-09-30', 60, 'https://www.dpm.org.cn/Uploads/Picture/2023/09/28/s65153a7fbe46a.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:46:51', '2023-12-14 02:46:51', '五洲四海——一带一路考古合作展', '0'),
(4, '诚慎仁术', '2023-09-01', '2023-09-30', 80, 'https://www.dpm.org.cn/Uploads/Picture/2020/09/21/s5f683b0928338.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:46:51', '2023-12-14 02:46:51', '诚慎仁术——清宫医药文物展', '0'),
(5, '茶·世界', '2023-08-01', '2023-08-31', 50, 'https://www.dpm.org.cn/Uploads/Picture/2023/09/01/s64f14ec4b68c1.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:46:51', '2023-12-14 02:46:51', '茶·世界——茶文化特展', '0'),
(6, '宋拓魅力', '2023-09-01', '2023-09-30', 70, 'https://www.dpm.org.cn/Uploads/Picture/2023/09/26/s6512943611b5d.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:46:51', '2023-12-14 02:46:51', '宋拓魅力——碑帖珍本特展', '0'),
(7, '江山逸韵', '2023-08-01', '2023-08-31', 60, 'https://www.dpm.org.cn/Uploads/Picture/2023/08/02/s64ca19db3ab95.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:46:51', '2023-12-14 02:46:51', '江山逸韵 时代新风——中央文史研究馆研究员书画作品', '0'),
(8, '祥开万象', '2023-04-01', '2023-04-30', 90, 'https://www.dpm.org.cn/Uploads/Picture/2023/04/28/s644b2af266843.jpg', '北京市东城区某某地点', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 10:46:51', '2023-12-14 02:46:51', '祥开万象——故宫与西藏文物联展', '0'),
(9, '中国古代饮食文化展', '2023-12-01', '2023-12-31', 80, 'https://www.chnmuseum.cn/zl/ztcl/202112/P020211227572989171843.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '中国古代饮食文化展', '0'),
(10, '远古江南•海陆山河——河姆渡文化发现50周年考古成果特展', '2023-11-01', '2023-11-30', 60, 'https://www.chnmuseum.cn/zl/lszl/kgfjxl/202311/P020231107360301267853.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '远古江南•海陆山河——河姆渡文化发现50周年考古成果特展', '0'),
(11, '中国古代书画', '2023-10-01', '2023-10-31', 50, 'https://www.chnmuseum.cn/zl/ztcl/201912/P020230303579989301166.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '中国古代书画', '0'),
(12, '澄古匠心——伍炳亮家具艺术展', '2023-09-01', '2023-09-30', 70, 'https://www.chnmuseum.cn/zl/lszl/lswhxl/202309/P020231129567486068460.png', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '澄古匠心——伍炳亮家具艺术展', '0'),
(13, '鉴往知远——新时代考古成果展', '2023-08-01', '2023-08-31', 60, 'https://www.chnmuseum.cn/zl/lszl/kgfjxl/202308/P020230831553802784833.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '鉴往知远——新时代考古成果展', '0'),
(14, '中国白——德化白瓷展', '2023-07-01', '2023-07-31', 70, 'https://www.chnmuseum.cn/zl/lszl/dywhxl/202308/P020230825613111786885.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '中国白——德化白瓷展', '0'),
(15, '中国古代玉器', '2023-06-01', '2023-06-30', 50, 'https://www.chnmuseum.cn/zl/ztcl/202308/P020230818453966648181.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '中国古代玉器', '0'),
(16, '中国古代佛造像', '2023-05-01', '2023-05-31', 60, 'https://www.chnmuseum.cn/zl/ztcl/202307/P020230718295777453037.jpg', '展览地址', '购票须知内容', '展览介绍内容', 0, 0, 1, '2023-12-14 11:14:47', '2023-12-14 03:14:47', '中国古代佛造像', '0');

-- --------------------------------------------------------

--
-- 表的结构 `indexlunbo`
--

CREATE TABLE IF NOT EXISTS `indexlunbo` (
  `inid` int(11) NOT NULL AUTO_INCREMENT,
  `inimg` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `iname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`inid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=4 ;

--
-- 转存表中的数据 `indexlunbo`
--

INSERT INTO `indexlunbo` (`inid`, `inimg`, `iname`) VALUES
(1, '../../assets/lunbo1.png', 'Image 1'),
(2, '../../assets/lunbo2.png', 'Image 2'),
(3, '../../assets/lunbo3.png', 'Image 3');

-- --------------------------------------------------------

--
-- 表的结构 `lunbo`
--

CREATE TABLE IF NOT EXISTS `lunbo` (
  `lid` int(11) NOT NULL AUTO_INCREMENT,
  `lname` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `limg` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`lid`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `lunbo`
--

INSERT INTO `lunbo` (`lid`, `lname`, `limg`) VALUES
(1, 'Image 1', 'https://img10.360buyimg.com/cms/jfs/t1/192872/11/42089/198515/6555a6b5F817805f0/7b27d8572de012fb.jpg'),
(2, 'Image 2', 'https://img10.360buyimg.com/cms/jfs/t1/227429/25/3439/169352/6555a6b4Fb8cd8395/238df80fe6eab119.jpg'),
(3, 'Image 3', 'https://img13.360buyimg.com/cms/jfs/t1/93299/16/33559/151093/6555a6b4F3182b30c/d3b45cd871eb667b.jpg'),
(4, 'Image 4', 'https://img11.360buyimg.com/cms/jfs/t1/179776/10/39782/345878/6555a6b3Fb165e14d/0e51f36ada6ce5fe.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `notice`
--

CREATE TABLE IF NOT EXISTS `notice` (
  `notice_id` mediumint(8) NOT NULL AUTO_INCREMENT,
  `title` varchar(125) COLLATE utf8_unicode_ci NOT NULL,
  `content` longtext COLLATE utf8_unicode_ci,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`notice_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `notice`
--

INSERT INTO `notice` (`notice_id`, `title`, `content`, `create_time`, `update_time`) VALUES
(1, '', '不止跳楼价还给你包邮到家!', '2023-12-13 08:39:35', '2023-12-13 08:39:35'),
(2, '', '文艺青年，文创先锋，为爱筑梦。', '2023-12-13 08:39:35', '2023-12-13 08:39:35'),
(3, '', '名店专场，优惠尽享。网罗名店优惠，升华购物品位。', '2023-12-13 08:39:35', '2023-12-13 08:39:35'),
(4, '', '文化创意无极限，全球手工好作品。', '2023-12-13 08:39:35', '2023-12-13 08:39:35');

-- --------------------------------------------------------

--
-- 表的结构 `palace`
--

CREATE TABLE IF NOT EXISTS `palace` (
  `pid` int(11) NOT NULL,
  `pname` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pimg` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 转存表中的数据 `palace`
--

INSERT INTO `palace` (`pid`, `pname`, `pimg`) VALUES
(1, 'Palace 1', 'https://www.chnmuseum.cn/zl/tthb/202304/W020230925370166780425.png'),
(2, 'Palace 2', 'https://www.chnmuseum.cn/zl/tthb/202311/W020231108346473872843.png'),
(3, 'Palace 3', 'https://www.chnmuseum.cn/zl/tthb/202001/W020200131455856748812.jpg');

-- --------------------------------------------------------

--
-- 表的结构 `praise`
--

CREATE TABLE IF NOT EXISTS `praise` (
  `praise_id` int(10) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `source_table` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `source_field` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `source_id` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`praise_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `praise`
--

INSERT INTO `praise` (`praise_id`, `user_id`, `create_time`, `update_time`, `source_table`, `source_field`, `source_id`, `status`) VALUES
(1, 1001, '2023-12-18 00:58:11', '2023-12-18 00:58:11', 'table1', 'field1', 1, 1),
(2, 1002, '2023-12-18 00:58:11', '2023-12-18 00:58:11', 'table2', 'field2', 2, 1),
(3, 1003, '2023-12-18 00:58:11', '2023-12-18 00:58:11', 'table1', 'field1', 3, 0),
(4, 1004, '2023-12-18 00:58:11', '2023-12-18 00:58:11', 'table3', 'field3', 4, 1),
(5, 1005, '2023-12-18 00:58:11', '2023-12-18 00:58:11', 'table2', 'field2', 5, 0);

-- --------------------------------------------------------

--
-- 表的结构 `system_user`
--

CREATE TABLE IF NOT EXISTS `system_user` (
  `system_user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_gender` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `examine_state` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `recommend` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`system_user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `system_user`
--

INSERT INTO `system_user` (`system_user_id`, `user_name`, `user_gender`, `examine_state`, `recommend`, `user_id`, `create_time`, `update_time`) VALUES
(1, '张三', '男', '已通过', 1, 1001, '1899-11-30 00:00:00', '0000-00-00 00:00:00'),
(2, '李四', '女', '已拒绝', 0, 1002, '1899-11-30 00:00:00', '2023-12-18 02:44:25'),
(3, '王五', '男', '待审核', 1, 1003, '1899-11-30 00:00:00', '2023-12-18 02:44:23'),
(4, '赵六', '女', '已通过', 1, 1004, '1899-11-30 00:00:00', '2023-12-18 02:44:22'),
(5, '刘七', '男', '已通过', 0, 1005, '1899-11-30 00:00:00', '2023-12-18 02:44:19');

-- --------------------------------------------------------

--
-- 表的结构 `ticket_purchase_record`
--

CREATE TABLE IF NOT EXISTS `ticket_purchase_record` (
  `ticket_purchase_record_id` int(11) NOT NULL AUTO_INCREMENT,
  `order_no` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `exhibition_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ticket_price` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `user_information` int(11) DEFAULT NULL,
  `user_name` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contact_number` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `number_of_tickets_purchased` int(11) DEFAULT NULL,
  `total_price_of_tickets` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ticketing_remarks` text COLLATE utf8_unicode_ci,
  `pay_state` varchar(16) COLLATE utf8_unicode_ci DEFAULT NULL,
  `pay_type` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `recommend` int(11) DEFAULT NULL,
  `create_time` datetime NOT NULL,
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ticket_purchase_record_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=6 ;

--
-- 转存表中的数据 `ticket_purchase_record`
--

INSERT INTO `ticket_purchase_record` (`ticket_purchase_record_id`, `order_no`, `exhibition_name`, `ticket_price`, `user_information`, `user_name`, `contact_number`, `number_of_tickets_purchased`, `total_price_of_tickets`, `ticketing_remarks`, `pay_state`, `pay_type`, `recommend`, `create_time`, `update_time`) VALUES
(1, '202312180001', '大圣遗音', '100', 1001, '张三', '13812345678', 2, '200', '无', '已支付', '支付宝', NULL, '2023-12-18 08:38:10', '2023-12-18 00:48:42'),
(2, '202312180002', '吉光片羽', '80', 1002, '李四', '13998765432', 1, '80', '无', '已支付', '微信支付', NULL, '2023-12-18 08:38:11', '2023-12-18 00:48:42'),
(3, '202312180003', '五洲四海', '50', 1003, '王五', '13787654321', 3, '150', '无', '已支付', '银行卡支付', NULL, '2023-12-18 08:38:12', '2023-12-18 00:48:42'),
(4, '202312180004', '诚慎仁术', '120', 1004, '赵六', '13676543210', 4, '480', '无', '已支付', '支付宝', NULL, '2023-12-18 08:38:13', '2023-12-18 00:48:42'),
(5, '202312180005', '宋拓魅力', '60', 1005, '陈七', '13565432109', 2, '120', '无', '已支付', '微信支付', NULL, '2023-12-18 08:38:14', '2023-12-18 00:48:42');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(11) COLLATE utf8_unicode_ci NOT NULL,
  `pwd` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `user_img` mediumtext CHARACTER SET utf8 COMMENT '用户头像',
  `birthday` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `signature` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `money` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `Tongbao` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `realm` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `state` varchar(1) COLLATE utf8_unicode_ci DEFAULT '0' COMMENT '用户身份：0-普通用户，1-管理员',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=12 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`id`, `name`, `pwd`, `user_img`, `birthday`, `signature`, `money`, `Tongbao`, `realm`, `state`) VALUES
(7, '和风容与', '202cb962ac59075b964b07152d234b70', 'img/5036505dac09f0c8aff8a3901.jpeg', 'Fri Mar 01 2013 00:00:00 GMT+0800 (中国标准时间)', '松花酿酒，春水煎茶', '100', '1720', '3290', '1'),
(8, '123', 'd41d8cd98f00b204e9800998ecf8427e', NULL, '2023-12-16', '', '100', '111', '1233', '0'),
(9, '凌以', '81dc9bdb52d04dc20036dbd8313ed055', 'img/872e377150aebc12fa83e2700.png', '2003-11-29', '埃勾饺', '100', '1', '222', '0'),
(10, '1234213', '81dc9bdb52d04dc20036dbd8313ed055', 'img/0da598c7efa36e122d3dea000.jpeg', '', '', '100', '123', '123', '0'),
(11, '', 'd41d8cd98f00b204e9800998ecf8427e', NULL, NULL, '', '100', '1234', '1234', '0');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

