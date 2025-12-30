
<template>
  <div>
    <van-swipe class="my-swipe" :autoplay="4000" indicator-color="white">
  <van-swipe-item><img class="swipe-image" src="../../assets/lunobo1.png"></van-swipe-item>
  <van-swipe-item><img class="swipe-image" src="../../assets/lunbo2.png"></van-swipe-item>
  <van-swipe-item><img class="swipe-image" src="../../assets/lunbo3.png"></van-swipe-item>
</van-swipe>
  </div>
</template>
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