<template>
    <div>
        <van-nav-bar title="常见问题" left-text="返回" left-arrow @click-left="onClickLeft" />
        <div class="content">
            <h3>常见问题解决方法：</h3>
            <ol>
                <li>网络连接异常：确认手机网络是否正常连接，或者尝试更换网络连接方式，例如从Wi-Fi切换到移动数据网络。</li>
                <li>版本兼容性问题：尝试升级以古为邻app到最新版本，或者卸载并重新安装app，以解决可能存在的版本兼容性问题。</li>
                <li>数据库故障或接口更新：以古为邻的服务器出现故障或维护操作，导致无法正常连接访问，或者接口发生了变化，导致无法正常使用接口。</li>
            </ol>
            <p>如果以上方法无法解决问题，建议联系与子同袍官方客服，以获得更详细的帮助和解决方案。</p>
        </div>
    </div>
</template>

<script>
export default {
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
    },
};
</script>

<style>
.content {
    padding: 20px;
}

h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

ol {
    margin-left: 20px;
}

p {
    margin-top: 20px;
}
</style>
