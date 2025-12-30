<template>
    <div>
        <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="onClickLeft">
            <template #right>
                <van-icon name="search" size="18" color="black" />
            </template>
        </van-nav-bar>
        <van-tabs v-model:active="active">
            <van-tab title="全部">
                <img src="https://p5.itc.cn/q_70/images03/20210118/c0ab2f8c00704dd099afeeff2e22c124.gif" alt=""
                    style="width: 150px;margin-left: 34%;margin-top: 1rem; border-radius: 30px;">
                <p style="text-align: center;" ><router-link to="/orderlist"> 查看全部订单</router-link><br>或者试试<span style="color:brown">切换账号</span></p>
            </van-tab>
            <van-tab title="待付款"><img src="https://p5.itc.cn/q_70/images03/20210118/c0ab2f8c00704dd099afeeff2e22c124.gif"
                    alt="" style="width: 150px;margin-left: 34%;margin-top: 1rem; border-radius: 30px;">
                <p style="text-align: center;">没有订单哦,去看看推荐商品<br><span style="color:brown">查看全部</span>或<span
                        style="color:brown">切换账号</span></p>
            </van-tab>
            <van-tab title="待发货"><img src="https://p5.itc.cn/q_70/images03/20210118/c0ab2f8c00704dd099afeeff2e22c124.gif"
                    alt="" style="width: 150px;margin-left: 34%;margin-top: 1rem; border-radius: 30px;">
                <p style="text-align: center;">没有订单哦,去看看推荐商品<br><span style="color:brown">查看全部</span>或<span
                        style="color:brown">切换账号</span></p>
            </van-tab>
            <van-tab title="评价">
                <div class="kx"></div>
                <van-cell title="我的评价" is-link value="查看全部" :border="false"/>
                <div class="tow2">
                    <van-row>
                        <van-col span="1">
                                <div class="sx"></div>
                            </van-col>
                        <van-col span="3">
                            <van-image round width="2.5rem" height="2.5rem"
                                src="https://img0.baidu.com/it/u=3039514666,1518234992&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500" />
                        </van-col>
                        <van-col span="4">0<br><span>已评价</span></van-col>
                        <van-col span="1">
                            <div class="sx">|</div>
                        </van-col>
                        <van-col span="4">0<br><span>获赞</span></van-col>
                        <van-col span="1">
                            <div class="sx">|</div>
                        </van-col>
                        <van-col span="4">0<br><span>获评论</span></van-col>
                        <van-col span="1">
                            <div class="sx">|</div>
                        </van-col>
                        <van-col span="4">0<br><span>被浏览</span></van-col>
                    </van-row>
                    <router-view></router-view>
                </div>

                <img src="https://p5.itc.cn/q_70/images03/20210118/c0ab2f8c00704dd099afeeff2e22c124.gif" alt=""
                    style="width: 150px;margin-left: 34%;margin-top: 1rem; border-radius: 30px;">
                <p style="text-align: center;">没有订单哦,去看看推荐商品<br><span style="color:brown">查看全部</span>或<span
                        style="color:brown">切换账号</span></p>
            </van-tab>
        </van-tabs>


    </div>
</template>
<script>
import { ref } from 'vue';

export default {
    setup() {
        const active = ref(0);

        const onClickLeft = () => history.back();

        return {
            active,
            onClickLeft
        };
    }
};

</script>
<style>
.van-nav-bar__arrow,
.van-nav-bar__text {
    color: #bd5d5d !important;
    /* 修改箭头和返回按钮的颜色为红色 */
}
.kx{
    height: 2px;
    background-color: rgb(240, 241, 241);
    width: 100%;
}
.tow2{
    padding: auto;
    text-align: center;
    background-color:#fff ;
    height: 50px;
}
</style>
