<template>
    <div class="goodsList">
        <div class="ww">
            <van-nav-bar title="展览详情" left-text="返回" left-arrow @click-left="onClickLeft" />
        </div>
        <div class="goods-item" >
            <img src="https://www.dpm.org.cn/Uploads/Picture/2023/11/28/s656540bac2e38.jpg" alt="">
            <h1>晚唐飞泉琴与古琴谱辉映，故宫再现“大圣遗音”</h1>
            <button class="sc" @click="cllect">收藏</button>
            <div class="exhibition-content">
                <p>故宫博物院钟粹宫古琴馆"大圣遗音——古琴文化展（第二期）"以焕然一新的面目再度开馆。此次展览共展出故宫博物院院藏文物55件，其中古琴9张，这些院藏古琴年代序列完整，不乏晚唐雷氏制作的飞泉琴、南宋时期制作的海月清辉琴等名琴。展览特别设置以院藏明代早期古琴谱《秋鸿》图谱册为主题的空间。</p>
                <p>"大圣遗音——古琴文化展（第二期）"开幕仪式由故宫博物院副院长王跃工主持，故宫博物院党委书记都海江、中央民族乐团团长赵聪分别致辞，故宫博物院院长王旭东宣布展览开幕。故宫博物院与古琴有着极为深厚的历史渊源，明清皇宫紫禁城中曾经琴声不断、名琴罗列，盛极一时。故宫博物院党委书记都海江说："故宫博物院建院近百年来，保管好宫廷旧藏古琴的同时，积极进行社会征集、接受国家文物局调拨，丰富了故宫古琴文物馆藏，几代故宫人薪火相传。古琴大师管平湖先生曾亲手修复了唐琴大圣遗音琴、飞泉琴，其弟子郑珉中先生更在故宫藏琴的研究上硕果累累，出版了《故宫古琴》，成为古琴学界的一大盛事。新时期以来，故宫博物院更致力于古琴有计划地保养、修复和展示，让故宫古琴走入当代观众心中。"</p>
                <p>"本次展览是故宫博物院对中华优秀传统文化传承和活化的有力举措。对于中华文明的传承与复兴，中央民族乐团与故宫博物院有着相同的理念和共同目标。"中央民族乐团团长赵聪说，"早在2020年，两家单位就签署战略合作协议，合作打造的音乐文化项目《故宫之声》将于明年与大家见面。"</p>
                <p>据展览执行策展人、故宫博物院宫廷音乐与戏曲研究所副所长孙召华介绍，本次展览共展出故宫博物院院藏文物55件，其中古琴9张，这些院藏古琴年代序列完整，不乏晚唐雷氏制作的飞泉琴、南宋时期制作的海月清辉琴等名琴。</p>
                <p>"飞泉"琴，连珠式，晚唐制作。据云"连珠式"系隋逸士李疑所创作。杉木斫，髹栗壳色漆，有大块朱漆修补，纯鹿角灰胎，蛇腹间冰纹断。蚌徽，紫檀岳尾，白玉轸润若凝脂，青玉足。</p>
            </div>
        </div>
    </div>
</template>
<script>
import router from '@/router';
import { Toast } from 'vant';
export default {
    methods: {
        onClickLeft() {
            this.$router.go(-1)
        },
        onClickRight() {
            Toast('按钮');
        },
        cllect() {
            Toast('收藏成功');
            const button = document.querySelector('.sc');
            if (button) {
                button.textContent = '已收藏';
            }
        }
    },
};
</script>
<style lang="scss" scoped>
div {
    font-family: "STLiti";
}

.ww {
    padding: 0;
    height: 30px;
    width: 100%;
}

.goodsList {
    display: flex;
    flex-wrap: wrap;
    padding-left: 10px;
    background-color: #fffcfc;

    .goods-item {
        width: calc(calc(100%) - 10px);
        background: #fff;
        //shang you xia zuo
        margin: 10px 10px 0 0;
        flex-direction: column;
        justify-content: space-between;
        padding: 5px;

        img {
            width: 100%;

        }

        .goods-title {
            font-size: 15px;
            color: #333;
            //shangxia zuoyou
            margin: 10px 0;
        }

        .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 0;

            .price {
                color: rgb(207, 179, 109);
                font-weight: bold;
                font-size: 16px;
            }

            .cell {
                font-size: 13px;
                margin-left: 2px;
            }
        }

        .exhibition-content {
            margin-top: 10px;

            p {
                margin-bottom: 15px;
                font-size: 14px;
                line-height: 1.8;
                color: #333;
                text-align: justify;
            }
        }
    }
}
</style>