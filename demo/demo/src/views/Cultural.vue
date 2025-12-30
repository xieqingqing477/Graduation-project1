<template>
  <div>
    <Search2></Search2>
    <Swiper3></Swiper3>
    <van-notice-bar left-icon="volume-o" :scrollable="false" v-model="noticeContent">
      <van-swipe vertical class="notice-swipe" :autoplay="3000" :show-indicators="false">
        <van-swipe-item v-for="notice in notices" :key="notice.id">{{ notice.content }}</van-swipe-item>
      </van-swipe>
    </van-notice-bar>
    <img src="../assets/fenl.png" alt="" style="width: 95%;margin-left: 10px;">
    <van-swipe-cell v-for="item in items" :key="item.cid">
      <van-card :desc="item.description" :title="item.title" :thumb="item.thumb" class="a" />
    </van-swipe-cell>
    <div class="kb"></div>
  

  </div>
</template>
<script>
import axios from 'axios';
import { Toast } from 'vant';
import Swiper3 from "../views/index/Swiper3.vue";

import Search2 from "../views/index/Search2.vue";
export default {
  components: {
    Swiper3,
    Search2
  },
  data() {
    return {
      // items: [
      //   { id: 1, price: 599.00, desc: "中国博物馆秋影金波茶具礼盒套装茶杯盘子套装餐具礼品中国风礼物", title: '秋影金波节庆礼盒', thumb: 'https://img12.360buyimg.com/n7/jfs/t1/96156/27/38173/99117/6430cb97Fc70627b1/4210e80132638a9d.jpg!q90' },
      //   { id: 2, price: 599.00, desc: "中国国家博物馆花鸟玲珑香囊套装熏香手工合香香蜜丸国博文创新婚礼物送朋友 绿色", title: '花鸟玲珑香囊套装', thumb: 'https://img14.360buyimg.com/n0/jfs/t1/127090/6/23323/220118/621dccb6E43fa602e/bd9ec18420e71f07.jpg.avif' },
      //   { id: 3, price: 599.00, desc: "中国博物馆秋影金波茶具礼盒套装茶杯盘子套装餐具礼品中国风礼物", title: '秋影金波节庆礼盒', thumb: 'http://img14.360buyimg.com/n5/s54x54_jfs/t1/169142/4/33802/54835/63a93d55Fcac1ae61/2e6e52c00079ea03.jpg.avif' }
      // ],
      noticeContent: '', // 通知内容
      notices: [], // 通知数组
      items: []
    }
  },
  mounted() {
    axios
      .get('http://localhost:8083/api/notice')
      .then(response => {
        console.log(response.data, "====强强强强"); // 打印响应数据
        this.notices = response.data;
        this.noticeContent = this.notices[0].content; // 将第一条通知内容赋值给noticeContent
      })
      .catch(error => {
        console.error(error);
      });
    // CCI接口调用已禁用（cci表已删除，不再需要此数据）
    // axios.get('http://localhost:8083/api/cci')
    //   .then(response => {
    //     console.log(response.data, "====强强强强");
    //     this.items = response.data;
    //   })
    //   .catch(error => {
    //     console.error(error);
    //   });
    // 直接设置为空数组，避免接口调用
    this.items = [];
  },


};
</script>
<style>
.notice-swipe {
  height: 40px;
  line-height: 40px;
  /* color: black; */
}

.a {
  width: 90%;
  margin: auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;

}

.goods-card {
  margin: auto;
  background-color: rgb(234, 196, 112);
  width: 90%;
}

.delete-button {
  height: 100%;
}

.van-grid-item {
  background-color: bisque;
}
</style>