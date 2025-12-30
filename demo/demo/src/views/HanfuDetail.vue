<template>
  <div class="hanfu-detail-page">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <van-icon name="arrow-left" class="back-icon" @click="$router.back()" />
      <div class="nav-title">{{ title }}</div>
    </div>

    <!-- 主要内容 -->
    <div class="main-content">
      <h2 class="detail-title">{{ title }}</h2>
      <p class="detail-subtitle">{{ subTitle }}</p>
      <p class="detail-desc" v-if="description">{{ description }}</p>
      <p class="detail-placeholder" v-else>该板块的详细内容正在完善中，敬请期待。</p>
    </div>

    <!-- 底部朝代线 -->
    <div class="dynasty-line-wrapper">
      <div class="dynasty-line"></div>
      <div class="dynasty-items">
        <div
          v-for="(dynasty, index) in dynasties"
          :key="index"
          class="dynasty-item"
          :class="{ active: dynasty.name === currentDynasty }"
        >
          <div class="dynasty-dot"></div>
          <div class="dynasty-name">{{ dynasty.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'HanfuDetail',
  setup() {
    const route = useRoute();

    const title = computed(() => route.query.title || '汉服科普详情');
    const subTitle = computed(() => route.query.type || '');
    const description = computed(() => route.query.desc || '');
    const currentDynasty = computed(() => route.query.dynasty || '');

    const dynasties = [
      { name: '商周' },
      { name: '秦汉' },
      { name: '魏晋' },
      { name: '唐代' },
      { name: '宋代' },
      { name: '明代' }
    ];

    return {
      title,
      subTitle,
      description,
      dynasties,
      currentDynasty
    };
  }
};
</script>

<style scoped>
.hanfu-detail-page {
  min-height: 100vh;
  background: #fff;
  padding-bottom: 80px;
  font-family: STLiti, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.top-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
}

.back-icon {
  font-size: 20px;
  color: #ae8e66;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #ae8e66;
  margin-right: 28px; /* 抵消返回按钮占位 */
}

.main-content {
  padding: 20px 16px 40px;
}

.detail-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.detail-subtitle {
  font-size: 14px;
  color: #ae8e66;
  margin-bottom: 16px;
}

.detail-desc,
.detail-placeholder {
  font-size: 14px;
  color: #555;
  line-height: 1.8;
}

.dynasty-line-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 12px 18px;
  background: #fff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.dynasty-line {
  position: absolute;
  left: 10%;
  right: 10%;
  top: 28px;
  height: 2px;
  background: #e0e0e0;
}

.dynasty-items {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.dynasty-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.dynasty-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ae8e66;
  border: 2px solid #fff;
  box-shadow: 0 0 0 2px #ae8e66;
  margin-bottom: 4px;
}

.dynasty-name {
  font-size: 12px;
  color: #666;
}

.dynasty-item.active .dynasty-dot {
  background: #d4a574;
  box-shadow: 0 0 0 2px #d4a574;
}

.dynasty-item.active .dynasty-name {
  color: #d4a574;
  font-weight: 600;
}
</style>








