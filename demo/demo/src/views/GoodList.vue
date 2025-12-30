<template>
    <div class="goodsList">
        <div class="ww">
            <van-nav-bar title="单品详情" left-text="返回" left-arrow @click-left="onClickLeft" />
        </div>
        <div class="goods-item" v-if="clothesDetail">
            <img :src="clothesDetail.image ? `http://127.0.0.1:8083/img/${clothesDetail.image.replace('img/', '')}` : ''" alt="">
                <button class="sc" :class="{ 'collected': isCollected }" @click="cllect">{{ isCollected ? '已收藏' : '收藏' }}</button>
            <h4 class="goods-title">{{ clothesDetail.name }}</h4>
            
            <div class="info-section">
                <div class="info-row">
                    <span class="label">分类：</span>
                    <span class="value">{{ clothesDetail.category_name }} > {{ clothesDetail.sub_category_name }}</span>
                </div>
                <div class="info-row" v-if="clothesDetail.color">
                    <span class="label">颜色：</span>
                    <span class="value color-value" :style="{ color: getColorValue(clothesDetail.color) }">
                        <span class="color-dot" :style="{ backgroundColor: getColorValue(clothesDetail.color) }"></span>
                        {{ clothesDetail.color }}
                    </span>
                </div>
                <div class="info-row" v-if="clothesDetail.season">
                    <span class="label">季节：</span>
                    <span class="value">{{ clothesDetail.season }}</span>
                </div>
                <div class="info-row" v-if="clothesDetail.purchase_time">
                    <span class="label">购入时间：</span>
                    <span class="value">{{ clothesDetail.purchase_time }}</span>
                </div>
                <div class="info-row" v-if="clothesDetail.location">
                    <span class="label">位置：</span>
                    <span class="value">{{ clothesDetail.location }}</span>
                </div>
                <div class="info-row" v-if="clothesDetail.brand">
                    <span class="label">品牌：</span>
                    <span class="value">{{ clothesDetail.brand }}</span>
                </div>
                <div class="info-row" v-if="clothesDetail.price">
                    <span class="label">价格：</span>
                    <span class="value price-value">{{ clothesDetail.price }} 元</span>
                </div>
                <div class="info-row" v-if="clothesDetail.dynasty">
                    <span class="label">朝代：</span>
                    <span class="value">{{ clothesDetail.dynasty }}</span>
                </div>
            </div>
            
            <div class="detailed-info" v-if="clothesDetail.detailed">
                <span class="info-label">描述：</span><br>
                <div class="info-content">{{ clothesDetail.detailed }}</div>
            </div>
        </div>
        <van-loading v-else type="spinner" color="#1989fa" vertical>加载中...</van-loading>
    </div>
</template>

<script>
import axios from 'axios';
import { showSuccessToast, showFailToast } from 'vant';
export default {
    props: ['category_id'],
    name: 'GoodList',
    data() {
        return {
            clothesDetail: null,
            isCollected: false
        }
    },
    methods: {
        onClickLeft() {
            this.$router.go(-1);
        },
        async cllect() {
            if (!this.clothesDetail || !this.clothesDetail.id) {
                showFailToast('缺少衣服信息，无法收藏');
                return;
            }

            const userId = sessionStorage.getItem('user_id');
            if (!userId) {
                showFailToast('请先登录后再收藏');
                return;
            }

            if (this.isCollected) {
                showFailToast('已经收藏过了');
                return;
            }

            try {
                const response = await axios.post('http://127.0.0.1:8083/api/favorite-clothes/add', {
                    user_id: userId,
                    clothes_id: this.clothesDetail.id
                });

                if (response.data && response.data.success) {
                    this.isCollected = true;
                    showSuccessToast('收藏成功');
                } else if (response.data && response.data.code === 'ALREADY_COLLECTED') {
                    this.isCollected = true;
                    showFailToast('已经收藏过了');
                } else {
                    showFailToast(response.data.message || '收藏失败');
                }
            } catch (error) {
                console.error('收藏失败:', error);
                showFailToast('收藏失败，请稍后重试');
            }
        },
        // 获取图片URL
        getImageUrl(imagePath) {
            if (!imagePath) return '';
            if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
                return imagePath;
            }
            // 移除开头的 'img/' 如果存在，然后拼接完整路径
            const path = imagePath.replace(/^img\//, '');
            return `http://127.0.0.1:8083/${path}`;
        },
        // 获取颜色值（将颜色名称转换为颜色代码）
        getColorValue(colorName) {
            const colorMap = {
                '浅绿色': '#90EE90',
                '绿色': '#008000',
                '浅蓝色': '#87CEEB',
                '蓝色': '#0000FF',
                '红色': '#FF0000',
                '粉色': '#FFC0CB',
                '黄色': '#FFFF00',
                '白色': '#FFFFFF',
                '黑色': '#000000',
                '灰色': '#808080',
                '紫色': '#800080',
                '橙色': '#FFA500',
                '棕色': '#A52A2A'
            };
            return colorMap[colorName] || '#333';
        },
        // 检查收藏状态
        async checkCollectionStatus() {
            if (!this.clothesDetail || !this.clothesDetail.id) {
                return;
            }

            const userId = sessionStorage.getItem('user_id');
            if (!userId) {
                this.isCollected = false;
                return;
            }

            try {
                const response = await axios.get('http://127.0.0.1:8083/api/favorite-clothes/list', {
                    params: { user_id: userId }
                });

                if (response.data && response.data.success) {
                    // 检查当前衣服是否在收藏列表中
                    const isInFavorites = response.data.data.some(
                        item => item.clothes_id === this.clothesDetail.id
                    );
                    this.isCollected = isInFavorites;
                }
            } catch (error) {
                console.error('检查收藏状态失败:', error);
                // 检查失败时不影响页面显示，默认为未收藏
                this.isCollected = false;
            }
        },
        // 加载衣服详情
        loadClothesDetail() {
            const id = this.$route.params.id;
            if (!id) {
                showFailToast('缺少衣服ID');
                return;
            }
            
            axios.get(`http://127.0.0.1:8083/api/clothes/detail/${id}`)
                .then(response => {
                    if (response.data.success) {
                        this.clothesDetail = response.data.data;
                        // 加载详情后检查收藏状态
                        this.checkCollectionStatus();
                    } else {
                        showFailToast(response.data.message || '加载失败');
                    }
                })
                .catch(error => {
                    console.error('加载衣服详情失败:', error);
                    showFailToast('加载失败，请稍后重试');
                });
        }
    },
    created() {
        this.loadClothesDetail();
    },
}
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
    background-color:  #fffcfc;

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

        .detailed-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            
            .info-label {
                font-weight: bold;
                font-size: 15px;
                color: #333;
            }
            
            .info-content {
                margin-top: 8px;
                font-size: 14px;
                line-height: 1.8;
                color: #666;
                white-space: pre-wrap;
            }
        }
        
        .info-section {
            margin-top: 15px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            
            .info-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                
                &:last-child {
                    margin-bottom: 0;
                }
                
                .label {
                    font-size: 14px;
                    color: #666;
                    min-width: 80px;
                    font-weight: 500;
                }
                
                .value {
                    font-size: 14px;
                    color: #333;
                    flex: 1;
                    
                    &.price-value {
                        color: rgb(207, 179, 109);
                        font-weight: bold;
                        font-size: 16px;
                    }
                    
                    &.color-value {
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        
                        .color-dot {
                            width: 16px;
                            height: 16px;
                            border-radius: 50%;
                            border: 1px solid #ddd;
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
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
    background-color:  #fffcfc;

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

        .detailed-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
            
            .info-label {
                font-weight: bold;
                font-size: 15px;
                color: #333;
            }
            
            .info-content {
                margin-top: 8px;
                font-size: 14px;
                line-height: 1.8;
                color: #666;
                white-space: pre-wrap;
            }
        }
        
        .info-section {
            margin-top: 15px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 8px;
            
            .info-row {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
                
                &:last-child {
                    margin-bottom: 0;
                }
                
                .label {
                    font-size: 14px;
                    color: #666;
                    min-width: 80px;
                    font-weight: 500;
                }
            }
        }
    }
}

.sc {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 16px;
    background-color: #ae8e66;
    color: #fff;
    border: none;
    border-radius: 20px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
}

.sc:hover {
    background-color: #9a7a55;
}

.sc.collected {
    background-color: #999;
    cursor: not-allowed;
}

.sc.collected:hover {
    background-color: #888;
}
</style>