<template>
  <div class="hanfu-introduction-page">
    <!-- 头部区域 -->
    <div class="header-section">
      <!-- 背景图片区域 -->
      <div class="header-background">
        <div class="image-placeholder"></div>
      </div>
      
      <!-- 标题文字覆盖层 -->
      <div class="header-overlay">
        <div class="subtitle">华夏衣冠</div>
      </div>
    </div>

    <!-- 主内容区域（可滚动） -->
    <div class="main-content-wrapper">
      <div class="main-content">
        <!-- 欢迎/介绍部分 -->
        <div class="welcome-section">
          <div class="welcome-text">欢迎了解汉服</div>
          <div class="welcome-subtitle">传统服饰文化</div>
          <div class="welcome-date">8月20日</div>
        </div>

        <!-- 两个大的交互卡片 -->
        <div class="interactive-cards">
          <!-- 左侧卡片：汉服历史/形制介绍 -->
          <div class="card-item card-left" @click="viewHanfuHistory">
            <img src="../assets/retouch_2025121920411977.png" alt="汉服历史" />
          </div>

          <!-- 右侧卡片：穿搭指南/汉服活动 -->
          <div class="card-item card-right" @click="viewDressingGuide">
            <img src="../assets/retouch_2025121920262157.png" alt="穿搭指南" />
          </div>
        </div>

        <!-- 分类网格（4个图片） -->
        <div class="category-grid">
          <div 
            class="category-item" 
            v-for="(category, index) in categories" 
            :key="index"
            @click="viewCategoryDetail(category)"
          >
            <div class="category-image-wrapper">
              <img :src="category.image" :alt="category.name" class="category-image" />
            </div>
            <div class="category-label">{{ category.name }}</div>
          </div>
        </div>

        <!-- 底部装饰/内容区域 -->
        <div class="bottom-decorative-area">
          <!-- 卷轴背景图片 -->
          <img src="../assets/jz.png" alt="汉服卷轴" class="scroll-image" />
          
          <!-- 答题区域 - 固定在卷轴中间 -->
          <div class="quiz-in-scroll">
            
            <div class="quiz-question">
              汉服的基本形制不包括哪一项？
            </div>
            
            <div class="quiz-options-horizontal">
              <div 
                class="quiz-option-horizontal" 
                v-for="(option, index) in quizOptions" 
                :key="index"
                @click="selectOption(index)"
                :class="{ 'selected': selectedOption === index }"
              >
                <div class="option-letter">{{ String.fromCharCode(65 + index) }}</div>
                <div class="option-text-small">{{ option }}</div>
              </div>
            </div>
            
            <div class="quiz-footer">
              <button class="mini-submit-btn" @click="submitAnswer" :disabled="selectedOption === null">
                {{ selectedOption === null ? '请选择' : '提交答案' }}
              </button>
              
            </div>
            
          </div>
          
        </div>
        <div class="quiz-hint">答对可以获得积分，积分兑换换装次数</div>
      </div>
      
    </div>

    <!-- 固定底部导航栏 -->
    <div class="fixed-footer">
      <Button>返回首页</Button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from './button/button.vue';

export default {
  name: 'ShapeIntroduction',
  components: {
    Button
  },
  setup() {
    const router = useRouter();

    // 分类数据
    const categories = ref([
      { name: '朝代', image: require('../assets/retouch_2025121815000786.png') },
      { name: '形制', image: require('../assets/retouch_2025121815003467.png') },
      { name: '纹样', image: require('../assets/retouch_2025121815013577.png') },
      { name: '传统色', image: require('../assets/retouch_2025121815050297.png') }
    ]);

    // 答题区域数据
    const quizOptions = ref(['深衣', '襦裙', '中山装', '道袍']);
    const selectedOption = ref(null);

    // 方法
    const viewHanfuHistory = () => {
      router.push({
        name: 'HanfuDetail',
        query: {
          type: '汉服历史',
          title: '汉服历史',
          desc: '溯源千年演变'
        }
      });
    };

    const viewDressingGuide = () => {
      router.push({
        name: 'HanfuDetail',
        query: {
          type: '穿搭指南',
          title: '穿搭指南',
          desc: '掌握搭配技巧'
        }
      });
    };

    const viewCategoryDetail = (category) => {
      router.push({
        name: 'HanfuDetail',
        query: {
          type: '形制分类',
          title: category.name
        }
      });
    };

    const selectOption = (index) => {
      selectedOption.value = index;
    };

    const submitAnswer = () => {
      if (selectedOption.value !== null) {
        const correctAnswer = 2; // 正确答案是C（中山装）
        if (selectedOption.value === correctAnswer) {
          alert('恭喜您答对了！中山装不属于汉服基本形制。');
        } else {
          alert(`答错了，正确答案是C（中山装）。\n\n汉服的基本形制包括：深衣、襦裙、道袍等，中山装是近代中国服装。`);
        }
      }
    };

    return {
      categories,
      quizOptions,
      selectedOption,
      viewHanfuHistory,
      viewDressingGuide,
      viewCategoryDetail,
      selectOption,
      submitAnswer
    };
  }
};
</script>

<style lang="scss" scoped>
.hanfu-introduction-page {
  min-height: 100vh;
  background: #ffffff;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
  position: relative;
  padding-bottom: 80px; /* 为底部按钮留空间 */
  box-sizing: border-box; /* 避免padding导致溢出 */
}

// 头部区域
.header-section {
  position: relative;
  width: 100%;
  height: 280px;
  overflow: hidden;
}

.header-background {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background-image: url('../assets/sfhfbg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.header-overlay {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  text-align: right;
  z-index: 10;
  border-radius: 20px 20px 0 0;
}

.subtitle {
  font-size: 34px;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  writing-mode: vertical-rl;
  text-orientation: upright;
  letter-spacing: 4px;
  font-family:"STLiti";
}

// 主内容区域
.main-content-wrapper {
  margin-top: -20px;
  position: relative;
  z-index: 1;
  padding: 0 16px;
}

.main-content {
  background: #ffffff;
  border-radius: 20px 20px 0 0;
  padding: 24px 0;
}

// 欢迎部分
.welcome-section {
  background: linear-gradient(135deg, #fdfdfd 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 20px;
  position: relative;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
  color: #8b4513;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
}

.welcome-subtitle {
  font-size: 14px;
  color: #ae8e66;
  margin-bottom: 12px;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
}

.welcome-date {
  position: absolute;
  right: 20px;
  top: 20px;
  font-size: 14px;
  color: #8b4513;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
}

// 交互卡片 - 修复布局冲突
.interactive-cards {
  display: flex;
  gap: 12px; // 用gap替代margin-right负值，避免溢出
  height: 150px;
  margin-bottom: 24px;
}

.card-item {
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-left {
  flex: 1; // 1/3比例
}

.card-right {
  flex: 2; // 2/3比例
}

.card-item:active {
  transform: scale(0.98);
  box-shadow: 
        0 8px 24px rgba(0, 0, 0, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-item img {
  width: 100%;
  height: 100%;
  object-fit: cover; // 改为cover，避免图片拉伸变形
  display: block;
  
}

// 分类网格 - 优化适配
.category-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.category-item:active {
  transform: scale(0.95);
}

.category-image-wrapper {
  width: 100%;
  aspect-ratio: 1/1; // 用宽高比替代固定尺寸，适配不同屏幕
  max-width: 100px;
  margin-bottom: 8px;
  overflow: hidden;
  border-radius: 8px;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-image:hover {
  transform: scale(1.05);
  
}

.category-label {
  font-size: 13px;
  color: #8b4513;
  text-align: center;
  font-weight: 500;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
  margin-top: 4px;
}

// 底部装饰区域 - 修改后
.bottom-decorative-area {
  width: 100%;
  height: 350px; /* 固定高度，让卷轴完整显示 */
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
}

.scroll-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 确保卷轴完整显示，比例不变 */
  object-position: center;
  display: block;
}

// 答题区域 - 嵌入卷轴中
.quiz-in-scroll {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 75%; /* 占卷轴宽度的85% */
  max-width: 200px; /* 最大宽度限制 */
  padding: 15px 20px; /* 羊皮纸颜色 */
  border-radius: 8px;
  z-index: 2;
}

.quiz-header {
  text-align: center;
  margin-bottom: 10px;
}



.quiz-question {
  font-size: 13px;
  color: #5a3921;
  line-height: 1.4;
  margin-bottom: 12px;
  text-align: center;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
  padding: 0 5px;
}

.quiz-options-horizontal {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 80px;
}

.quiz-option-horizontal {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.7);
  
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 30px;
  
  &:hover {
    border-color: #ae8e66;
    background: rgba(245, 242, 236, 0.9);
  }
  
  &.selected {
    border-color: #8b4513;
    background: rgba(139, 69, 19, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(139, 69, 19, 0.2);
  }
}

.option-letter {
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #8b4513;
  color: white;
  border-radius: 50%;
  font-size: 11px;
  font-weight: bold;
}

.option-text-small {
  font-size: 11px;
  color: #5a3921;
  text-align: center;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
  line-height: 1.2;
}

.quiz-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.mini-submit-btn {
  background: linear-gradient(to bottom, #8b4513, #6b3410);
  color: white;
  border: none;
  margin-top:-80px ;
  border-radius: 15px;
  font-size: 12px;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 100px;
  
  &:hover:not(:disabled) {
    background: linear-gradient(to bottom, #a0522d, #7a3f1a);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(139, 69, 19, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #d4c4b0;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.quiz-hint {
  font-size: 10px;
  color: #ae8e66;
  text-align: center;
  font-family: "STKaiti", "KaiTi", "楷体", "SimKai", serif;
}

// 固定底部按钮
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: #f5f2ec;
  z-index: 99;
  border-top: 1px solid rgba(212, 165, 116, 0.2);
}

// 响应式设计 - 优化小屏适配
@media (max-width: 480px) {
  .header-section {
    height: 240px;
  }
  
  .interactive-cards {
    height: 140px;
  }
  
  .category-image-wrapper {
    max-width: 60px;
  }
  
  .category-label {
    font-size: 12px;
  }
  
  .bottom-decorative-area {
    height: 200px;
  }
  
  .quiz-in-scroll {
    width: 90%;
    padding: 12px 15px;
  }
  
  .quiz-option-horizontal {
    padding: 6px 3px;
  }
  
  .option-text-small {
    font-size: 10px;
  }
}

@media (max-width: 375px) {
  .category-grid {
    gap: 12px;
  }
  
  .category-image-wrapper {
    max-width: 55px;
  }
  
  .quiz-in-scroll {
    width: 92%;
    padding: 10px 12px;
  }
  
  .quiz-question {
    font-size: 12px;
  }
  
  .quiz-options-horizontal {
    gap: 6px;
  }
}
</style>