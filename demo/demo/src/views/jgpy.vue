<template>
    <div class="goodsList">
        <div class="ww">
            <van-nav-bar title="展览详情" left-text="返回" left-arrow @click-left="onClickLeft" />
        </div>
        <div class="goods-item">
            <img src="https://www.dpm.org.cn/Uploads/Picture/2023/10/31/s654097a23fb12.jpg" alt="">
            <h1>“吉光片羽——故宫博物院藏清代宫廷雕版文物展”开展，展示32件（套）代表性文物</h1>
            <button class="sc" @click="cllect">收藏</button>
            <p>故宫博物院新开设一处专题展馆——雕版馆，位于太和门内东南崇楼及朝房。开馆展览“吉光片羽——故宫博物院藏清代宫廷雕版文物展”以库房式陈列的形式展出文物1.5万余件（套），这是故宫博物院首次举办此类专题文物展览。</p>

            <p>中国传统木刻雕版印刷术是古代劳动人民的智慧结晶，它的发明促进了文化传播与信息共享，推动了世界文明进程。故宫博物院珍藏明清宫廷雕版21万余块，内容囊括经史子集、政令文书等，文种包括汉、满、蒙、藏4种，具有版式各异、字体端庄、图像优美、雕琢精巧等特点。
            </p>

            <p>此次展览立足于故宫博物院多年来对院藏雕版文物整理、保护、研究的成果，重点展示32件（套）具有代表性的文物，从国政、文教、技艺三方面，挖掘蕴含在清代宫廷雕版文物中的历史文化信息。</p>

            <p>清内府顺治元年五月刻《摄政王令旨》雕版是一件罕见的清代早期政令文书印刷底版。据《清实录》记载，《摄政王令旨》发布于清军入京之后，内容大意为：摄政王多尔衮告诫各位王公大臣，在此进取中原之际，应各尽其职，不得为一时之利而贪赃枉法，违者必将严惩。此令旨颇有汉高祖“约法三章”的意味，在整饬朝纲和稳定国政方面发挥了重要作用。《清史图典》中收录了这件雕版的印刷品，四周套印龙纹边框，规制极高。展览中将雕版、档案、印刷品联合展示，相互佐证，让观众了解清内府早期从事印刷活动的情况。
            </p>

            <p>以《十三经注疏》《二十一史》为代表的儒家经典和纪传体史书是中华文明的重要载体。清初，为了大规模刊印这两部卷帙浩繁的经典，康熙帝下令整理内府所藏明代雕版，进行修补后重新刷印。展厅里展示的雕版为明万历年间北京国子监刻，书口处的万历年款挖去，嵌入“康熙二十五年重修”字样，是清内府整理明代遗存雕版的重要实物依据。
            </p>

            <p>《御书千手千眼观世音菩萨大悲心陀罗尼》雕版是乾隆御笔手书上版的雕版作品。由于御笔不可直接上版，需使用双钩临摹后的写样，相较于雕刻其他字体，御笔字的工价更加昂贵。此书中的佛像为套版印刷，图版刻制精巧，印纸为乾隆年间仿制的金粟山藏经纸，十分珍贵。

                清道光年间，国子监刻《钦定国子监志》，为国子监有志以来最好的刻本。此书所用《五屏风全图》雕版长约1.2米，是故宫所藏最大、最长的整木雕版。印刷方式为整版印刷，并采用“蝴蝶镶”的方式，将书中较长的插图折叠装订，展卷披阅时可将折叶展开以观全形。

                展览中还能看到清代宫廷版画最后一部作品《钦定元王恽承华事略补图》的雕版。此书为元代王恽《承华事略》补图而作，由光绪帝钦定，张之洞在苏州书局付梓刊刻。此书代表了清末宫廷木刻版画的高水平，带有西方石印版画风格。
            </p>
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
    }
}
</style>