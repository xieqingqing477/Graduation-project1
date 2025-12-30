<template>
  <div class="vip-page">
    <div class="top-navbar">
      <van-icon name="arrow-left" class="back-icon" @click="$router.back()" />
      <div class="nav-title">与子同袍会员</div>
    </div>

    <div class="content">
      <div class="vip-card">
        <div class="vip-title">会员特权</div>
        <ul class="vip-list">
          <li>无限上传服饰资源到柜笥</li>
          <li>无限次 AI 换装体验</li>
          <li>后续可扩展更多会员专属权益</li>
        </ul>
      </div>

      <div class="action-section">
        <van-button
          type="primary"
          block
          round
          class="vip-button"
          @click="openVip"
        >
          立即开通 / 续费会员
        </van-button>
        <div class="hint">
          当前状态：
          <span v-if="isVip">已是会员账号</span>
          <span v-else>非会员账号</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { showSuccessToast, showFailToast, showConfirmDialog } from 'vant';

export default {
  name: 'Vip',
  computed: {
    isVip() {
      return String(sessionStorage.getItem('state') || '0') === '1';
    },
  },
  methods: {
    openVip() {
      const userId = sessionStorage.getItem('userid');
      if (!userId) {
        showFailToast('请先登录账号');
        return;
      }

      showConfirmDialog({
        title: '开通会员',
        message: '开通 / 续费会员后，可无限上传服饰并无限次换装，确认开通吗？',
      })
        .then(() => {
          // 调用后端接口，把 state 设置为 1
          axios
            .post('http://127.0.0.1:8083/upUser', {
              new_id: userId,
              new_name: sessionStorage.getItem('name') || '',
              new_state: 1,
            })
            .then((response) => {
              if (response.data && response.data.success) {
                sessionStorage.setItem('state', '1');
                showSuccessToast('会员开通成功');
              } else {
                showFailToast(response.data.message || '会员开通失败');
              }
            })
            .catch((error) => {
              console.error('开通会员失败:', error);
              showFailToast('会员开通失败，请稍后重试');
            });
        })
        .catch(() => {});
    },
  },
};
</script>

<style scoped>
.vip-page {
  min-height: 100vh;
  background: #f5f2ec;
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

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #ae8e66;
}

.back-icon {
  font-size: 20px;
  color: #ae8e66;
}

.content {
  padding: 16px;
}

.vip-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.vip-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.vip-list {
  padding-left: 18px;
  font-size: 14px;
  color: #555;
}

.vip-list li + li {
  margin-top: 4px;
}

.action-section {
  margin-top: 20px;
}

.vip-button {
  background: linear-gradient(135deg, #ae8e66 0%, #c9a87a 100%);
  border: none;
}

.hint {
  margin-top: 10px;
  font-size: 13px;
  color: #666;
  text-align: center;
}
</style>


