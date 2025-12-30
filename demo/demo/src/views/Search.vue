<template>
    <div>
        
        <div class="InputContainer">
            <van-icon name="arrow-left" @click="onClickLeft" />
            <input type="text" name="text" class="input" id="input" placeholder="寻汝之所好" v-model="values">
            <label for="input" class="labelforsearch">
            </label>
            <button class="micButton" @click="inputs"><svg class="icon" t="1701866635786" viewBox="0 0 1024 1024"
                    version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1488" width="20" height="20">
                    <path
                        d="M798.4 582.5c17.3-45.5 25.2-94.1 23.7-142.1-2.8-96.2-42.9-189.2-109.6-257.2-33.4-33.9-72.7-62.4-116.4-82.6-43.6-20.4-91.6-33-140.8-36-49.2-3-99.6 3.9-147 21-47.3 17.2-91.4 44.5-127.9 79.9l-25.9 28c-7.9 9.9-15.4 20.3-23.1 30.4-7.1 10.6-13.2 21.8-19.8 32.7-5.9 11.3-11 23-16.4 34.6-19.5 47.2-29.1 98.4-28.3 149.2 1.7 101.8 45.2 201.3 117.5 271 36 34.9 78.7 62.7 125.1 81.1 46.4 18.5 96.2 27.6 145.8 26.9 49.6-0.7 98.9-11.2 144.2-30.8 45.4-19.5 86.6-48.1 120.8-83.2 34.1-35.3 60.9-77.4 78.1-122.9zM587.3 759.1c-42 16.7-87.1 24.9-132 24.2-44.9-0.7-89.5-10.3-130.4-28-41-17.7-78.1-43.5-109.1-75.3-30.8-32-55.1-69.8-71.2-110.8-16-41-23.7-85-22.7-128.7 1.6-87.5 37.1-172.7 97.9-235.6 30.4-31.3 66.2-57.7 106.3-76.5 39.9-19 84-30.9 129.3-34 45.3-3 91.8 3.2 135.5 19 43.6 15.8 84.2 41 117.8 73.8l23.7 25.9c7.2 9.2 14.1 18.8 21.1 28.1 6.5 9.8 12 20.2 18 30.2 5.3 10.4 9.9 21.3 14.8 31.9 17.5 43.5 25.6 90.6 24.2 137.1-1.6 46.5-12.4 92.3-31.3 134.1s-45.7 79.7-78.4 111.3c-32.8 31.6-71.5 56.7-113.5 73.3zM948.2 853c-20.6-22.1-39.3-45.8-56.7-70.6-17.3-24.9-34.4-50-52.9-73.9l-6.9-9-3.5-4.5-1.8-2.3-2.7-3.1c-7.5-7.9-18.4-13.5-30.1-14.3-11.6-0.9-23.6 2.9-32.7 10.1l-3.3 2.8-2.2 2-4.2 3.8-8.4 7.6-33.3 30.7-8.3 7.7c-4.1 3.9-8.2 9.1-11 14.7-5.9 11.3-7.2 25.3-3.5 37.9 1.8 6.3 4.8 12.2 8.6 17.4 1.9 2.6 4.1 5 6.4 7.1l4.4 4.2 16.3 15.8 32.4 31.7c21.7 21 44.5 40.8 68.5 59.2 6 4.5 12.1 9.1 18.3 13.4 3.1 2.2 6.3 4.3 9.4 6.4l6.1 4c2.7 1.7 5.6 3.2 8.5 4.4 11.7 4.9 24.1 5.1 35.2 2.4 11.1-2.9 21.1-9.4 27.8-18l13.1-19.2 6.6-9.4 3.7-5.2c1.2-2 2.4-4 3.3-6 7.6-16.8 4-35.8-7.1-47.8z m-4.6 40.6c-0.9 1.2-2.1 2.2-3.2 3.2l-4.1 3-9.4 6.6c-6.2 4.3-12.9 8.8-18.9 12.7-8.2 3.8-17.6 0.7-21-4-0.4-0.5-3.7-4.8-3.7-4.8-2.6-2.8-5.1-5.7-7.7-8.4-5.2-5.5-10.6-10.8-16-16.1-21.8-20.9-44.8-40.4-68.8-58.8l-36.2-27.3s-23.1-17.7-23.5-18c-0.8-0.8-1.4-1.6-1.9-2.5-0.9-1.8-1.2-4-0.4-6.2 0.4-1.2 0.9-2.1 2-3.6l52.5-57.3c2.5-2.5 5.6-4.1 9.1-4.4 3.5-0.2 7.2 0.9 10.4 3.5l1.2 1 1.9 2 3.9 4.1 7.8 8.2c20.9 21.8 43.1 42.5 65.1 63.4 22 20.9 42.6 43 61.3 66.6 8.8 11.1 8 27.8-0.4 37.1z"
                        fill="#000" p-id="1489"></path>
                </svg>
            </button>
        </div>
        <div>
            <van-grid :gutter="10" :column-num="2">
                <van-grid-item :to="{ path: item.path }" v-for="item in items" :key="item.id" @click="showDialog(item.tc)">
                    <div class="grid-item-content">
                        <img :src="item.cover_photo" alt="" srcset="" class="tp">
                        <van-cell :title="item.exhibition_name">
                            <template #right-icon>
                                <van-icon name="like-o" />
                            </template>
                        </van-cell>
                    </div>
                </van-grid-item>
            </van-grid>
        </div>
        <van-empty v-if="items.length==0" class="custom-image" image="https://img01.yzcdn.cn/vant/custom-empty-image.png" description="描述文字" />
    </div>
</template>
<script>
import axios from 'axios';

export default {
    data() {
        return {
            values: '',
            items: []
        }
    },
    methods: {
        inputs() {
            const _this = this
            axios({
                url: "http://127.0.0.1:8083/api/search_exhibitions",
                method: "post",
                data: {
                    exhibitionName: _this.values
                }
            }).then(function (res) {
                console.log('查询成功', res)
                _this.items = res.data
            }).catch(function (err) {
                console.log(err)
            })
        },
        onClickLeft() {
            this.$router.go(-1)
        },
    }
}
</script>
<style scoped>
div {
    font-family: STLiti;
    margin: 7px;

}

.custom-image .van-empty__image {
    width: 90px;
    height: 90px;
}

.InputContainer {
    width: 90%;
    margin-left: 10px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url(../assets/sousuo.png);
    background-size: contain;
    /* 背景图片缩放以完全适应元素 */
    font-family: "STLiti";
    border-radius: 10px;
    overflow: hidden;
    cursor: pointer;
    padding-left: 15px;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.075);
}

.input {
    width: 80%;
    height: 80%;
    border: none;
    outline: none;
    font-size: 0.9em;
    caret-color: rgb(255, 81, 0);
    opacity: 0.6;
}

.labelforsearch {
    cursor: text;
    padding: 0px 12px;
}

.searchIcon {
    width: 13px;
}

.border {
    height: 40%;
    width: 1.3px;
    background-color: rgb(223, 223, 223);
}

.micIcon {
    width: 12px;
}

.micButton {
    padding: 0px 15px 0px 12px;
    border: none;
    background-color: transparent;
    height: 40px;
    cursor: pointer;
    transition-duration: .3s;
}

.searchIcon path {
    fill: rgb(114, 114, 114);
}

.micIcon path {
    fill: rgb(255, 81, 0);
}

.micButton:hover {
    background-color: #e4cf86;
    transition-duration: .3s;

}
</style>