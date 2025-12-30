<template>
  <div>
    <Search2 @myClick="toSearch"></Search2>
    <swiper></swiper>
    <div class="mrww">
      <svg style="float: right;" @click="inter" t="1702381750058" class="icon" viewBox="0 0 1024 1024" version="1.1"
        xmlns="http://www.w3.org/2000/svg" p-id="16452" width="20" height="20">
        <path
          d="M810.666667 981.333333v-170.666666H213.333333v170.666666H170.666667V42.666667h42.666666v128h597.333334V42.666667h42.666666v938.666666z m0-213.333333v-256H213.333333v256h85.333334v-128h128v128z m0-298.666667V213.333333H213.333333v256h85.333334V341.333333h128v128h170.666666V341.333333h128v128z"
          fill="#c49162" p-id="16453"></path>
      </svg>
      <svg style="float: left;" :value="dateStr" @click="show = true" t="1702381481055" class="icon"
        viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12782"
        data-spm-anchor-id="a313x.search_index.0.i0.510d3a81M3mAy7" width="20" height="20">
        <path
          d="M896 448H128v447.957333l477.738667 0.021334L896 895.957333V448z m0-42.666667V192.042667C896 192 768 192 768 192V149.333333h128.042667A42.666667 42.666667 0 0 1 938.666667 192.042667v703.914666A42.624 42.624 0 0 1 896.064 938.666667H127.936A42.666667 42.666667 0 0 1 85.333333 895.957333V192.042667C85.333333 168.469333 104.256 149.333333 127.957333 149.333333H256v42.666667l-128 0.042667V405.333333h768zM298.666667 85.333333h42.666666v170.666667h-42.666666V85.333333z m384 0h42.666666v170.666667h-42.666666V85.333333zM384 149.333333h256v42.666667H384V149.333333z"
          fill="#c49162" p-id="12783" data-spm-anchor-id="a313x.search_index.0.i2.510d3a81M3mAy7" class=""></path>
      </svg>
      <div class="bt">
        <div class="wrap">
          每日汉服
          <div class="wrap_left_top"></div>
          <div class="wrap_right_top"></div>
          <div class="wrap_left_bottom"></div>
          <div class="wrap_right_bottom"></div>
        </div>
      </div>

      <van-popup v-model="show" position="bottom" round>
        <van-calendar v-model="date" @confirm="onConfirm" />
      </van-popup>
      
      <!-- 每日汉服 -->
      <div class="daily-hanfu-container" v-if="currentDailyHanfu">
        <div class="daily-hanfu-card" :class="{ selected: selectedHanfu && selectedHanfu.id === currentDailyHanfu.id }" @click="selectHanfu(currentDailyHanfu)">
          <div class="daily-hanfu-image-wrapper">
            <img :src="currentDailyHanfu.image" :alt="currentDailyHanfu.name" class="daily-hanfu-image" />
          </div>
        </div>
      </div>
      <van-empty v-else description="暂无汉服数据" />
    </div>
    <div class="bt">
      <div class="wrap">
        中华文化瑰宝
        <div class="wrap_left_top"></div>
        <div class="wrap_right_top"></div>
        <div class="wrap_left_bottom"></div>
        <div class="wrap_right_bottom"></div>
      </div>
    </div>
    <div class="category">
      <div v-for="category in categories" :key="category.id" class="category-item"
        :class="{ 'expanded': category.expanded }" @click="toggleCategory(category)">
        <div class="category-content">
          <div v-if="category.expanded" class="category-introduction">{{ category.introduction }}</div>
          <div v-else class="category-name">{{ category.name }}</div>
        </div>
      </div>
    </div>
    <div class="kb"></div>
    <!-- 底部导航 -->
    <Button></Button>
  </div>
</template>

<script>
import axios from 'axios';
import { showFailToast } from 'vant';
import Button from "../button/button.vue";
import Swiper from "../index/Swiper.vue";
import Search2 from "../index/Search2.vue";

export default {
  components: {
    Button,
    Swiper,
    Search2
  },
  data() {
    return {
      date: new Date(), // 设置默认日期为当天,
      imageUrl: '',
      showOverlay: false,
      overlayText: '黑漆描金勾莲蝙蝠纹梅花式盘。五个花瓣的梅花盘，花纹以中心的宝相花为中心向外扩散。五个花瓣，五只蝙蝠对应五福临门。',
      // 每日汉服列表（所有可用的汉服）
      allHanfuList: [],
      selectedHanfu: null, // 选中的汉服
      categories: [
        {
          id: 1,
          name: '夏商',
          image: require('../../assets/ctyy.png'),
          expanded: false,
          introduction: '上衣下裳雏形'
        },
        {
          id: 2,
          name: '西周',
          image: require('../../assets/ctyy.png'),
          expanded: false,
          introduction: '深衣,玄端,上玄下纁'
        },
        {
          id: 3,
          name: '春秋战国',
          image: 'category2.jpg',
          expanded: false,
          introduction: "续衽钩边,胡服,轻绡罗纨"
        },
        {
          id: 4,
          name: '秦代',
          image: 'category2.jpg',
          expanded: false,
          introduction: "袍服,曲裾深衣,玉组佩"
        },
        {
          id: 5,
          name: '宋朝',
          image: 'category2.jpg',
          expanded: false,
          introduction: "弹琴,弈棋,书法,绘画"
        },
        {
          id: 6,
          name: '汉代',
          image: 'category2.jpg',
          expanded: false,
          introduction: "三重曲裾,直裾袍,素纱单衣,直裾襜褕"
        },
        {
          id: 7,
          name: '魏晋南北朝',
          image: 'category2.jpg',
          expanded: false,
          introduction: "大袖宽衫,杂裾垂髾服,鹤氅,袿衣"
        },
        {
          id: 8,
          name: '隋代',
          image: 'category2.jpg',
          expanded: false,
          introduction: "圆领缺骻袍,高腰襦裙"
        },
        {
          id: 9, name: '唐朝',
          image: 'category2.jpg',
          expanded: false,
          introduction: "诃子裙,齐胸襦裙,大袖纱罗衫,圆领袍"
        },
        {
          id: 10, name: '宋代',
          image: 'category2.jpg',
          expanded: false,
          introduction: "圆领襕袍,褙子,旋袄,直裰"
        },
        {
          id: 11,
          name: '元代',
          image: 'category2.jpg',
          expanded: false,
          introduction: "深衣,襦裙,质孙服"
        },
        {
          id: 12,
          name: '明朝',
          image: 'category2.jpg',
          expanded: false,
          introduction: "马面裙,比甲,水田衣,曳撒,贴里"
        },
        // 其他 category 数据...
      ],
      show: false,
    };
  },
  computed: {
    dateStr() {
      return this.date.toISOString().slice(0, 10); // 将日期转换为字符串，格式为 'YYYY-MM-DD'
    },
    // 根据日期获取当天的汉服推荐
    currentDailyHanfu() {
      if (this.allHanfuList.length === 0) return null;
      // 根据日期计算索引，确保同一天显示同一件汉服
      const dateStr = this.dateStr;
      // 使用日期字符串的哈希值来选择汉服
      let hash = 0;
      for (let i = 0; i < dateStr.length; i++) {
        const char = dateStr.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      const index = Math.abs(hash) % this.allHanfuList.length;
      return this.allHanfuList[index];
    }
  },
  created() {
    this.onConfirm(this.date); // 初始化图片URL
    this.loadDailyHanfu(); // 加载每日汉服
  },
  methods: {
    toSearch(message) {
      this.$router.push({
        name: 'Search'
      })
    },
    toggleCategory(clickedCategory) {
      this.categories.forEach(category => {
        if (category.id === clickedCategory.id) {
          category.expanded = !category.expanded; // 切换当前点击的盒子的展开状态
        } else {
          category.expanded = false; // 收起其他盒子
        }
      });
    },
    inter() {
      this.$router.push('../Classification');
    },
    show2() {
      this.showOverlay = true;
    },
    show3() {
      this.showOverlay = false;
    },
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    onConfirm(value) {
      this.show = false;
      // Vant 4.x 中，confirm 事件传递的是选中的日期值
      const selectedDate = Array.isArray(value) ? value[0] : value;
      this.date = selectedDate instanceof Date ? selectedDate : new Date(selectedDate);
      this.imageUrl = this.calculateImageUrl(this.date);
      // 日期改变时，重置选中状态
      this.selectedHanfu = null;
    },
    calculateImageUrl(date) {
      const menus = [
        {
          name: "馆藏精品",
          id: 1,
          subs: [
            {
              id: 1,
              name: "黑漆描金缠枝莲蝙蝠纹梅花式盘",
              image: require("../../assets/q2.png")
            },
            {
              id: 1,
              name: "象牙编织锦地嵌花鸟图团扇",
              image: require("../../assets/d2.png")
            },
            {
              id: 1,
              name: "掐丝珐琅兽面纹出戟",
              image: require("../../assets/gc3.png")
            },
            {
              id: 1,
              name: "康熙款画珐琅莲瓣式盘",
              image: require("../../assets/tc4.png")
            },
            {
              id: 1,
              name: "银錾刻团花纹委角盒",
              image: require("../../assets/gc6.png")
            },
            {
              id: 1,
              name: "乾隆款红漆描金丹凤牡丹纹银里撇口碗",
              image: require("../../assets/gc7.png")
            }
          ]
        }
      ];

      // 根据日期获取对应的图片URL
      const index = date.getDate() % menus[0].subs.length;
      return menus[0].subs[index].image;
    },
    // 加载所有汉服列表（用于根据日期选择）
    loadDailyHanfu() {
      axios.get('http://127.0.0.1:8083/api/clothes/list')
        .then(response => {
          if (response.data.success && response.data.data.length > 0) {
            // 保存所有汉服数据
            this.allHanfuList = response.data.data.map(item => ({
              id: item.id,
              name: item.name,
              image: item.image ? `http://127.0.0.1:8083/img/${item.image.replace('img/', '')}` : '',
              dynasty: item.dynasty,
              color: item.color,
              categoryId: item.category_id,
              subCategoryId: item.sub_category_id,
              categoryName: item.category_name,
              subCategoryName: item.sub_category_name
            }));
          }
        })
        .catch(error => {
          console.error('加载每日汉服失败:', error);
        });
    },
    // 选择汉服
    selectHanfu(item) {
      if (this.selectedHanfu && this.selectedHanfu.id === item.id) {
        // 如果已选中，则取消选中
        this.selectedHanfu = null;
      } else {
        // 选中汉服
        this.selectedHanfu = item;
      }
    },
    // 去换装
    goToDress(item) {
      this.$router.push({
        name: 'Clothes',
        query: {
          hanfuId: item.id
        }
      });
    }
  }
};
</script>

<style scoped>
img {
  max-width: 100%;
}

.mrww {
  width: 95%;
  margin: auto;
  margin-top: 20px;
}

.zhwh {
  font-family: "STLiti";
  margin-left: 10px;
  margin-top: 10px;
  text-align: center;
  border: 1px double #151515;
  width: 95%;
  /* border-radius: 5px; */
  background-image: url(../../assets/qljs.png);
  opacity: 0.9;
}

div {
  font-family: "STLiti";
}

.overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgb(172, 166, 166);
  font-size: 24px;
  text-align: center;
}

.category {
  display: flex;
  /* 使用 flexbox 布局 */
  justify-content: center;
  /* 水平居中对齐 */
  width: 95%;
  margin: auto;
  margin-top: 17px;
  font-family: "STLiti";
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  /* 竖直方向排列 */
  width: 100px;
  /* 初始宽度 */
  height: 130px;
  /* 高度 */
  border: 1px solid #ccc;
  transition: width 0.3s ease;
  /* 添加过渡效果 */
}

.category-item.expanded {
  width: 200px;
  /* 点击后的宽度 */
}

.category-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-image: url(../../assets/qljs.png);
}

.category-introduction {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 14px;
  color: #fff;
  padding: 10px;
  text-align: center;
}

.category-image img {
  width: 100%;
  height: 130px;
}

.category-name {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

.bt {
  display: flex;
  margin: 10px;
  justify-content: center;
  align-items: center;
  color: #ae8e66;
  text-align: center;
}

/* 内凹圆角 */


.wrap {
  width: 100px;
  height: 20px;
  border: 1px solid rgb(121, 119, 119);
  position: relative;
  margin-left: 10px;

}

.wrap_left_top,
.wrap_right_top,
.wrap_left_bottom,
.wrap_right_bottom {
  position: absolute;
  width: 3px;
  height: 3px;
  border: 2px solid #fff;
  z-index: 1;
  background: rgb(251, 250, 251);
}

.wrap_left_top {
  top: -1px;
  left: -1px;
  border-radius: 0 0 40px 0;
  border-bottom: 2px solid #ae8e66;
  border-right: 2px solid #ae8e66;
}

.wrap_right_top {
  top: -1px;
  right: -1px;
  border-radius: 0 0 0 40px;
  border-bottom: 2px solid #ae8e66;
  border-left: 2px solid #ae8e66;
}

.wrap_left_bottom {
  left: -1px;
  bottom: -1px;
  border-radius: 0 40px 0 0;
  border-top: 2px solid #ae8e66;
  border-right: 2px solid #ae8e66;
}

.wrap_right_bottom {
  right: -1px;
  bottom: -1px;
  border-radius: 40px 0 0 0;
  border-top: 2px solid #ae8e66;
  border-left: 2px solid #ae8e66;
}

/* 每日汉服容器 */
.daily-hanfu-container {
  margin-top: 15px;
  padding: 0 10px;
  display: flex;
  justify-content: center;
}

.daily-hanfu-card {
  position: relative;
  width: 100%;
  max-width: 300px;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.daily-hanfu-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.daily-hanfu-card.selected {
  border-color: #ae8e66;
  box-shadow: 0 4px 12px rgba(174, 142, 102, 0.3);
}

.daily-hanfu-image-wrapper {
  width: 100%;
  height: 200px;
  position: relative;
  overflow: hidden;
}

.daily-hanfu-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.daily-hanfu-info {
  padding: 12px;
  min-height: 70px;
  display: flex !important;
  flex-direction: column;
  justify-content: flex-start;
  visibility: visible;
  opacity: 1;
}

.daily-hanfu-name {
  font-size: 15px;
  color: #333 !important;
  font-weight: bold;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
  display: block;
  visibility: visible;
  opacity: 1;
}

.daily-hanfu-tags {
  display: flex !important;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  margin-top: 0;
  visibility: visible;
  opacity: 1;
}

.daily-hanfu-tags .tag {
  display: inline-block !important;
  padding: 3px 8px;
  font-size: 11px;
  border-radius: 0;
  border: 1px solid #d4a574;
  background: transparent;
  color: #d4a574 !important;
  font-weight: 500;
  white-space: nowrap;
  visibility: visible;
  opacity: 1;
}

.dress-button-wrapper {
  padding: 8px 12px 12px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dress-button {
  width: 100%;
  background: linear-gradient(135deg, #ae8e66 0%, #c9a87a 100%);
  border: none;
  color: #fff;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(174, 142, 102, 0.3);
}

.dress-button:active {
  transform: translateY(1px);
  box-shadow: 0 1px 4px rgba(174, 142, 102, 0.3);
}
</style>
