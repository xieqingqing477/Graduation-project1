<template>
    <div class="com">
        <div class="sk">

            <!-- <van-icon name="list-switching" />
            <van-icon name="scan" /> -->
            
        </div>
        <div class="grxx">
            <div @click="showPopup" class="avatar-container">
                <van-image round width="4rem" height="4rem" :src="avatar" />
            </div>
            <van-popup :show="show" @update:show="show = $event" position="left" :style="{ height: '100%', width: '60%' }">
                <div class="kb"></div>
                <van-cell v-for="item in items2" :to="{ path: item.path }" :key="item.id" :title="item.title"
                    :icon="item.icon" />
                <template v-if="state == 1">
                    <van-cell v-for="item in items3" :to="{ path: item.path }" :key="item.id"
                        :title="item.title" :icon="item.icon" />
                </template>
                <van-grid :column-num="2">
                    <van-grid-item icon="user-circle-o" @click="navigateToPage1" text="切换账号" />
                    <van-grid-item icon="contact-o" @click="navigateToPage2" text="注销账号" />
                    <van-grid-item icon="edit" @click="navigateToPage3" text="修改密码" />
                    <van-grid-item icon="close" @click="logout" text="退出登录" />
                </van-grid>
                <div class="kb2"></div>
            </van-popup>
            <div style="margin-left: 10px;font-size: 21px;margin-top: 16px;color: rgb(48, 47, 47);"
                @click="showShare = true">{{ currentUser }}</div>
            <div class="qm">{{ currentsignature }}</div>
        </div>
        <van-share-sheet v-model="showShare" title="立即分享给好友" :options="options" @select="onSelect" />
        <div class="tow">
            <van-row>
                <van-col span="8">20<br><span>换装次数</span></van-col>
                <van-col span="1">
                    <div class="sx">|</div>
                </van-col>
                <van-col span="7">3627.0<br><span>开元通宝</span></van-col>
                <van-col span="1">
                    <div class="sx">|</div>
                </van-col>
                <van-col span="7">12<br><span>收藏的服装</span></van-col>
            </van-row>
            <router-view></router-view>
        </div>
        <div class="huiyuan">
            <van-cell
                class="cell"
                is-link
                :to="{ name: 'Vip' }"
            >
                <template #title>
                    <div class="vip-title-row">
                        <van-icon name="flower-o" class="vip-icon" />
                        <span class="vip-title-text">与子同袍会员</span>
                    </div>
                </template>
                <template #value>
                    {{ state == 1 ? '已开通' : '立即开通' }}
                </template>
                <template #label>
                    {{ state == 1 ? '无限上传与无限换装' : '非会员：上传上限10套，换装上限50次' }}
                </template>
            </van-cell>
        </div>
        <div class="yjcard">
            <van-tabs type="line" animated sticky swipeable background="rgba(209, 210, 207, 0)" color="#a4b790"
                style="top: 10px; ">
                <van-tab title="换装记录">
                    <van-grid :gutter="10" :column-num="2" v-if="items && items.length > 0">
                        <van-grid-item v-for="item in items" :key="item.id || item.historyId" @click="showDialog(item.id || item.historyId)">
                            <div class="grid-item-content">
                                <img :src="item.cover_photo || ''" alt="" srcset="" class="tp" @error="handleImageError">
                                <van-cell :title="item.exhibition_name || 'AI换装记录'" :label="item.exhibition_address || ''">
                                </van-cell>
                            </div>
                        </van-grid-item>
                    </van-grid>
                    <div v-else style="padding: 20px; text-align: center; color: #999;">
                        暂无换装记录
                    </div>
                </van-tab>
                <van-tab title="收藏的衣服">
                    <van-grid :gutter="8" :column-num="2" :border="false" class="favorite-clothes-grid" v-if="subs && subs.length > 0">
                        <van-grid-item 
                            v-for="item in subs" 
                            :key="item.id"
                            class="favorite-clothes-item"
                            @click="goToClothesDetail(item.id)"
                        >
                            <div class="clothes-card">
                                <div class="clothes-image">
                                    <img :src="item.image || placeholderImage" :alt="item.name" />
                                </div>
                                <div class="clothes-info">
                                    <div class="clothes-name">{{ item.name }}</div>
                                    <div class="clothes-tags">
                                        <span v-if="item.dynasty" class="tag">{{ item.dynasty }}</span>
                                        <span v-if="item.color" class="tag">{{ item.color }}</span>
                                        <span v-if="item.season" class="tag">{{ item.season }}</span>
                                    </div>
                                </div>
                            </div>
                        </van-grid-item>
                    </van-grid>
                    <div v-else style="padding: 20px; text-align: center; color: #999;">
                        暂无收藏的衣服
                    </div>
                </van-tab>
            </van-tabs>
        </div>
        <Button></Button>
    </div>
</template>
<script>
import axios from 'axios';
import { ref } from 'vue';
import Button from "../views/button/button.vue";
export default {
    components: {
        Button,
    },
    data() {
        return {
            showShare: false,
            state: false,
            options: [
                { name: '微信', icon: 'wechat' },
                { name: '微博', icon: 'weibo' },
                { name: '复制链接', icon: 'link' },
                { name: '分享海报', icon: 'poster' },
                { name: '二维码', icon: 'qrcode' },
            ],
            items2: [
                { id: 10, title: '常见问题', icon: 'question-o', path: 'question' },
                { id: 11, title: '修改个人信息', icon: 'contact-o', path: 'personal' },
            ],
            items3: [
                { id: 4, title: '管理展览', icon: 'records-o', path: 'Manageexhibitions' },
                { id: 5, title: '管理用户', icon: 'friends-o', path: 'users' },
                { id: 6, title: '管理文物', icon: 'notes-o', path: 'ww' },
            ],
            items: [],
            itemss: [],
            // 收藏的衣服列表（从后端 favorite_clothes 表加载）
            subs: [],
            show: false,
            img: sessionStorage.getItem('avatar') || sessionStorage.getItem('user_img'),
            api: 'http://127.0.0.1:8083/',
            avatar: require("../assets/头像.png"),
            currentsignature: sessionStorage.getItem('signature'),
            placeholderImage: require("../assets/头像.png"), // 占位图
        };
    },
    mounted() {
        this.state = sessionStorage.getItem('state')
        console.log(this.state)
        // CCI接口调用已禁用（cci表已删除，不再需要此数据）
        // axios.get('http://127.0.0.1:8083/api/cci')
        //     .then(response => {
        //         this.itemss = Array.isArray(response.data) ? response.data : [];
        //     })
        //     .catch(error => {
        //         console.warn('获取CCI内容失败:', error);
        //         this.itemss = [];
        //     });
        // 直接设置为空数组，避免接口调用
        this.itemss = [];
    },
    created() {
        this.fetchExhibitions();
        this.fetchFavoriteClothes();
        // 优先使用 user_img，如果没有则使用 avatar
        const userImg = sessionStorage.getItem('user_img');
        const avatarImg = sessionStorage.getItem('avatar');
        const imgPath = userImg || avatarImg;
        
        if (imgPath) {
            // 如果已经是完整URL，直接使用；否则拼接基础URL
            if (imgPath.startsWith('http') || imgPath.startsWith('data:')) {
                this.avatar = imgPath;
            } else {
                // 确保路径以 / 开头
                const path = imgPath.startsWith('/') ? imgPath : '/' + imgPath;
                this.avatar = this.api + path.replace(/^\/+/, '');
            }
        }
    },
    methods: {
        // 换装记录：从后端 dress_history 表读取在换装结果页保存的记录
        fetchExhibitions() {
            const userId = sessionStorage.getItem('user_id') || null;
            const params = {};
            if (userId) {
                params.user_id = userId;
            }

            axios.get('http://127.0.0.1:8083/api/dress-history/list', { params })
                .then((response) => {
                    if (response.data && response.data.success) {
                        // 适配原有模板字段
                        this.items = response.data.data.map((row) => {
                            // 处理图片URL，确保是完整URL
                            let imageUrl = row.result_image || '';
                            
                            // 如果图片URL为空，使用默认图片
                            if (!imageUrl) {
                                imageUrl = require('../assets/头像.png');
                            } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('data:') && !imageUrl.includes('require')) {
                                // 如果是相对路径，转换为完整URL
                                if (imageUrl.startsWith('/') || imageUrl.startsWith('img/')) {
                                    imageUrl = `http://127.0.0.1:8083/${imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl}`;
                                }
                            }
                            
                            // 格式化时间显示
                            let timeDisplay = '';
                            if (row.create_time) {
                                try {
                                    const date = new Date(row.create_time);
                                    timeDisplay = date.toLocaleString('zh-CN', {
                                        year: 'numeric',
                                        month: '2-digit',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    });
                                } catch (e) {
                                    timeDisplay = row.create_time;
                                }
                            }
                            
                            return {
                                id: row.id,
                                cover_photo: imageUrl,
                                exhibition_name: 'AI换装记录',
                                exhibition_address: timeDisplay,
                                historyId: row.id // 保存历史记录ID，用于点击时跳转
                            };
                        });
                    } else {
                        this.items = [];
                    }
                })
                .catch((error) => {
                    console.error('Error loading dress history:', error);
                    this.items = [];
                });
        },

        // 收藏的衣服：从后端 favorite_clothes 表读取
        fetchFavoriteClothes() {
            const userId = sessionStorage.getItem('user_id') || null;
            if (!userId) {
                this.subs = [];
                return;
            }

            axios.get('http://127.0.0.1:8083/api/favorite-clothes/list', {
                params: { user_id: userId }
            })
                .then((response) => {
                    if (response.data && response.data.success) {
                        this.subs = response.data.data.map((row) => ({
                            id: row.clothes_id,
                            name: row.name,
                            image: row.image ? `http://127.0.0.1:8083/img/${row.image.replace('img/', '')}` : '',
                            dynasty: row.dynasty,
                            color: row.color || '',
                            season: row.season || '',
                            detailed: row.detailed
                        }));
                    } else {
                        this.subs = [];
                    }
                })
                .catch((error) => {
                    console.error('Error loading favorite clothes:', error);
                    this.subs = [];
                });
        },

        // 跳转到衣服详情页
        goToClothesDetail(clothesId) {
            if (!clothesId) {
                console.error('缺少衣服ID');
                return;
            }
            this.$router.push({
                name: 'goodlist',
                params: {
                    id: clothesId
                }
            });
        },
        // 进入会员页面
        goVip() {
            this.$router.push({ name: 'Vip' });
        },
        logout() {
            location.href = "about:blank";
            window.close();
            sessionStorage.clear();
            localStorage.setItem('isLoggedIn', 'false');
        },
        onSelect(option) {
            Toast(option.name);
            this.showShare = false;
        },
        showPopup() {
            console.log('头像被点击了', '当前 show 值:', this.show);
            this.show = !this.show;
            console.log('切换后 show 值:', this.show);
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
        showDialog(historyId) {
            // 如果提供了历史记录ID，跳转到换装结果页面
            if (historyId) {
                try {
                    this.$router.push({
                        name: 'DressResult',
                        query: {
                            historyId: String(historyId)
                        }
                    });
                } catch (error) {
                    console.error('跳转失败:', error);
                }
            } else {
                this.visible = true;
            }
        },
        
        // 处理图片加载错误
        handleImageError(event) {
            // 如果图片加载失败，显示默认占位图
            const defaultImage = require('../assets/头像.png');
            if (event.target.src !== defaultImage) {
                event.target.src = defaultImage;
                event.target.style.objectFit = 'contain';
            } else {
                // 如果默认图片也加载失败，隐藏图片
                event.target.style.display = 'none';
            }
        },
    },
    setup() {
        const name = sessionStorage.getItem("name");

        const currentUser = ref(name);
        const signature = sessionStorage.getItem("signature");

        const currentsignature = ref(signature);

        return {
            currentUser,
            currentsignature
        };
    },


};
</script>
<style scoped lang="scss">
body {
    margin: 0;
    padding: 0;
    /* background-color: rgb(253, 252, 252); */
}


.com {
    background-image: url(../assets/bz.png);
    background-size: contain;
    /* 背景图片缩放以完全适应元素 */
    font-family: "STLiti";
}

.van-grid {
    margin-top: 10px;
    border-radius: 25px;
}

.yjcard {
    height: 800px;
    width: 90%;
    margin: auto;
    border-radius: 30px;
    background-color: rgba(210, 203, 188, 0.5);
    /* 使用 rgba() 函数设置背景颜色并指定透明度 */
    /* opacity: 0.5; */
    margin-top: 10px;
    border-radius: 25px;
    /* margin-top: -380px;
    clip-path: polygon(0% 50%, 5% 45%, 10% 55%, 15% 40%, 20% 60%, 25% 35%, 30% 65%, 35% 40%, 40% 60%, 45% 45%, 50% 55%, 55% 45%, 60% 55%, 65% 40%, 70% 60%, 75% 35%, 80% 65%, 85% 40%, 90% 60%, 95% 45%, 100% 50%, 100% 100%, 0% 100%);
  border-top-left-radius: 50%;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%; */
}

.grid-item-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    /* 设置你想要的圆角半径 */
}

.tp {
    width: 80%;
    border-radius: 5px;
}

.bz {

    background-image: url(../assets/bj.png);
}

.sk {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    /* margin-top:10px ; */
}

.grxx {
    /* position: fixed; */
    display: flex;
    margin-left: 19px;
    margin-top: 5px;
    margin-bottom: 20px;
}

a {
    color: #000;
}

.nv {
    margin-top: 48px;
    margin-left: -12px;
}

.tow {
    padding: auto;
    text-align: center;
    margin-top: 15px;
}

.tow span {
    font-size: 10px;
    color: rgb(147, 145, 145);
}

.sx {
    font-size: 25px;
    color: rgb(211, 209, 209);
    font-weight: lighter;
}

.three {
    width: 90vw;
    height: 100%;
    margin-left: 21px;
    border-radius: 10px;
    margin-top: 12px;
    box-shadow: 1px 1px 2px rgba(152, 151, 151, 0.4);
    font-family: "宋体";

}

.huiyuan {
    width: 90vw;
    margin-left: 21px;
    border-radius: 10px;
    margin-top: 12px;
    overflow: hidden;
}

.cell {
    background-image: url('../assets/hy.png') !important;
    background-size: cover !important;
    background-repeat: no-repeat !important;
    background-position: center !important;
    background-color: transparent !important;
    box-shadow: 1px 1px 4px rgba(0, 0, 0, 0.4);
    color: white !important;
    border-radius: 10px;
    font-family: "宋体";
    /* 增加整体高度，并让文字稍微靠上 */
    padding: 16px 16px 26px;
    min-height: 90px;
    display: flex;
    align-items: flex-start;
    border: none;
}

.vip-title-row {
    display: flex;
    align-items: center;
    gap: 6px;
}

.vip-icon {
    font-size: 18px;
    color: #5c4a3a;
}

.vip-title-text {
    font-size: 16px;
    font-weight: 600;
    color: #5c4a3a;
}

.cell :deep(.van-cell__title),
.cell :deep(.van-cell__value),
.cell :deep(.van-cell__label) {
    color: #5c4a3a !important;
}

.cell :deep(.van-icon) {
    color: #5c4a3a !important;
}

.xszn {
    width: 90vw;
    height: 100%;
    margin-left: 21px;
    margin-top: 12px;
    box-shadow: 1px 1px 4px rgba(152, 151, 151, 0.4);
}

.kb {
    background-image: url(../assets/smbj.png);
    width: 100%;
    height: 80px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}


.gongju {
    margin-top: 12px;
    width: 90vw;
    margin-left: 21px;
    font-size: 12px;
    box-shadow: 1px 1px 4px rgba(152, 151, 151, 0.4);
}

.van-grid-item {
    background-color: rgb(251, 251, 251, 0);
}

/* 收藏的衣服卡片样式 - 与柜笥页保持一致 */
.favorite-clothes-grid {
    width: 100%;
    box-sizing: border-box;
    padding: 10px;
    
    :deep(.van-grid-item) {
        width: 50% !important;
        flex: 0 0 50% !important;
        max-width: 50% !important;
        box-sizing: border-box;
        padding: 6px;
    }
}

.favorite-clothes-item {
    width: 100%;
    height: 100%;
    display: flex;
}

.clothes-card {
    position: relative;
    background-color: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 240px;
    cursor: pointer;
    
    &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .clothes-image {
        width: 100%;
        height: 160px;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .clothes-info {
        padding: 8px 12px;
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 60px;
        justify-content: flex-start;

        .clothes-name {
            font-size: 13px;
            color: #333;
            font-weight: bold;
            margin-bottom: 1px !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex-shrink: 0;
            height: 18px;
            line-height: 18px;
        }
        
        .clothes-tags {
            display: flex;
            flex-wrap: nowrap;
            gap: 4px;
            overflow-x: auto;
            margin-top: 0 !important;
            
            .tag {
                display: inline-block;
                padding: 2px 6px;
                font-size: 10px;
                border-radius: 0;
                border: 1px solid #d4a574;
                background: transparent;
                color: #d4a574;
                font-weight: 500;
                white-space: nowrap;
                flex-shrink: 0;
            }
        }
    }
}

.qm {
    margin-top: 45px;
    margin-left: -20%;
    font-size: 10px;
    text-align: center;
    color: #868685;
}

.avatar-container {
    cursor: pointer;
    display: inline-block;
    position: relative;
    z-index: 10;
    pointer-events: auto;
}

.avatar-container:hover {
    opacity: 0.8;
}
</style>