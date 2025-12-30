<template>
    <div class="mui-numbox" data-numbox-min="1" :data-numbox-max="max">
        <button class="mui-btn mui-btn-numbox-minus" type="button">-</button>
        <input id="test" class="mui-input-numbox" type="number" :value="initCount" ref="num" @change="ChangeNum">
        <button class="mui-btn mui-btn-numbox-plus" type="button">+</button>
    </div>
</template>

<script>
import mui from '../lib/mui/js/mui.min.js'
export default {
    props: ['max', 'initCount', 'numId'],
    name: 'numberbox',
    data() {
        return {

        }
    },
    // 监听最大数量的变化
    watch: {
        'max'(newVal) {
            mui('.mui-numbox').numbox().setOption('max', newVal)
        }
    },
    mounted() {
        // numberbox这个组件必须初始化才能使用
        mui('.mui-numbox').numbox()
    },
    methods: {
        ChangeNum() {
            const count = parseInt(this.$refs.num.value)
            this.$emit('count', { count: count, id: this.numId })
        }
    }
}
</script>

<style lang="scss" scoped>
.mui-numbox {
    width: 100px;
    height: 28px;
    margin: 0;
}
</style>