<template>
    <div>
        
        <van-nav-bar
      title="优惠券"
      left-text="返回"
      right-text="按钮"
      left-arrow
      @click-left="retreat"
      @click-right="onClickRight"
    />
        <!-- 优惠券单元格 -->
        <div class="container">
            <van-coupon-cell :coupons="coupons" :chosen-coupon="chosenCoupon" @click="showList = true" />
            <!-- 优惠券列表 -->
            <van-popup v-model:show="showList" round position="bottom" style="height: 90%; padding-top: 4px;">
                <van-coupon-list :coupons="coupons" :chosen-coupon="chosenCoupon" :disabled-coupons="disabledCoupons"
                    @change="onChange" @exchange="onExchange" />
            </van-popup>
        </div>
    </div>
</template>
<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
    setup() {
        const router = useRouter();
        
        const coupon = {
            available: 1,
            condition: '无门槛\n最多优惠12元',
            reason: '',
            value: 150,
            name: '优惠券名称',
            startAt: 1489104000,
            endAt: 1514592000,
            valueDesc: '1.5',
            unitDesc: '元',
        };

        const coupons = ref([coupon]);
        const showList = ref(false);
        const chosenCoupon = ref(-1);

        const onChange = (index) => {
            showList.value = false;
            chosenCoupon.value = index;
        };
        const onExchange = (code) => {
            coupons.value.push(coupon);
        };
        
        const retreat = () => {
            router.back();
        };
        
        const onClickRight = () => {
            // 处理右侧按钮点击
        };

        return {
            coupons,
            showList,
            onChange,
            onExchange,
            chosenCoupon,
            disabledCoupons: [coupon],
            retreat,
            onClickRight,
        };
    }
};
</script>
<style scoped>
header {
    width: 100%;
    height: 50px;
    text-align: center;
    line-height: 50px;
    /* background-repeat: no-repeat; */
    /* border-bottom: 1px solid rgb(244, 147, 199); */
    /* position: absolute; */
    top: 0;
    /* background-color: rgb(244, 147, 199); */
    z-index: 999;
    /* color:#fff3b6; */
    font-size:larger;
}

.container {
    background: #faf8f8;
    margin-bottom: 80px;
    /* position: fixed; */
}
.icon {
    position: absolute;
    right: 330px;
    margin-top: 5px;
}
</style>
