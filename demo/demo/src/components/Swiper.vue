<template>
    <div>
        <mt-swipe :auto="4000">
            <mt-swipe-item v-for="item in imgList" :key="item.id">
                <img :src="item.imgSrc" alt="">
            </mt-swipe-item>
        </mt-swipe>

    </div>
</template>

<script>


export default {
    props:['imgList'],
    data() {
        return {
            // imgList: [
            //     {
            //         id: 1,
            //          imgSrc: "https://img2.tuguaishou.com/ips_templ_preview/c8/6d/ed/lg_4702847_1632279444_614a9b949503b.jpg!w380?auth_key=2279808000-0-0-a14dd3a8d75827b602303055b6681305"
            //       },
            //     {
            //         id: 2,
            //         imgSrc: "https://img2.tuguaishou.com/ips_templ_preview/c8/6d/ed/lg_4702847_1632279444_614a9b949503b.jpg!w380?auth_key=2279808000-0-0-a14dd3a8d75827b602303055b6681305"
            //     }
            // ]
        }
    },
    methods: {

    }

}
</script>

<style lang="scss" scoped>
.mint-swipe {
    height: 200px;

    .mint-swipe-items-wrap {
        .mint-swipe-item {
            text-align: center;

            img {
                width: 100%;
                height: 100%;
            }

        }


    }
}
</style>