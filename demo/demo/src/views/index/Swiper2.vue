
<template>
  <div>
  <van-swipe class="my-swipe" :autoplay="4000" indicator-color="white">
      <van-swipe-item v-for="(item, index) in images" :key="index">
        <img class="swipe-image" :src="item.pimg">
      </van-swipe-item>
    </van-swipe>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  data() {
    return {
      images: []
    };
  },
  mounted() {
    axios.get('http://localhost:8083/api/palace')
      .then(response => {
        this.images = response.data;
      })
      .catch(error => {
        console.error(error);
      });
  }
};
</script>
<style scoped>
.my-swipe .van-swipe-item {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden; /* 防止图片溢出 */
}

.swipe-image {
  width: 95%; /* 图片宽度占满容器宽度 */
  height: auto; /* 高度自动调整以保持图片原始比例 */
  border-radius:10px;
}
</style>