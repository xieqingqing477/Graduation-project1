<template>
    <div>
        <van-nav-bar
      title="设置"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
        
        <!-- 优惠券单元格 -->
        <div class="container">
            <van-cell title="已绑定手机号" value="159****8351" icon="graphic" is-link />
            <van-cell title="账号与安全" icon="checked" is-link />
            <div class="gray"></div>
            <van-cell title="免密支付设置" icon="gold-coin" is-link />
            <van-cell title="先用后付设置" value="159****8351" icon="award" is-link>
                <van-tag type="primary" color="gray">领取0元下单资格</van-tag>
            </van-cell>
            <van-cell title="邻里设置" icon="lock" is-link />
            <van-cell title="消息接收设置" icon="invitation" is-link />
            <van-cell title="直播、照片、视频和通话" icon="live" is-link />
            <van-cell title="隐私号码保护设置" icon="phone-circle" is-link />
            <van-cell title="常见问题" icon="question" is-link />
            <van-cell title="意见反馈" icon="smile" is-link />
            <van-cell title="免费入驻以古为邻" icon="shop" is-link />
            <van-cell title="清除缓存" icon="delete" is-link />
            <van-cell title="个人信息共享清单" icon="cluster" is-link />
            <van-cell title="个人信息收集清单" icon="column" is-link />
            <van-cell title="隐私政策摘要" icon="warning" is-link />
            <van-button block @click="navigateToPage1">切换账号</van-button>
            <van-button block @click="navigateToPage2">注销账号</van-button>
            <van-button block @click="navigateToPage3">修改密码</van-button>
        </div>
        <div class="kb"></div>


    </div>
</template>
<script>
export default {
    data() {
        return {

        }
    },
    methods: {
        retreat() {
            this.$router.back()
        },
        navigateToPage1() {
            this.$router.push('/login');
        },
        navigateToPage2() {
            this.$router.push('/loginout');
        },
        navigateToPage3() {
            this.$router.push('/uppwd');
        },
        onClickLeft() {
           this.$router.back()
        },
    },
}
</script>
<style scoped>
div{
    font-family: "STLiti";
}

.icon {
    position: absolute;
    right: 350px;
    top: calc(50% + 5px);
    transform: translateY(calc(-50% - 5px));
}
</style>