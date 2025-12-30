<template>
    <div class="ai-dress-page">
        <!-- 顶部导航栏 -->
        <div class="top-navbar">
            <div class="nav-title">AI换装体验</div>
        </div>
        <!-- 主要内容区域：上传区域居中占满全屏 -->
        <div class="main-content-section">
            <!-- 居中上传区域 -->
            <div class="upload-main-area">
            <van-uploader
                v-model="fileList"
                :max-count="1"
                :after-read="afterRead"
                :before-delete="beforeDelete"
                accept="image/*"
                :preview-full-image="false"
                    class="main-uploader"
            >
                <template #default>
                        <div class="upload-main-placeholder" @click="triggerFileSelect">
                            <div class="upload-main-content" v-if="uploadedImage">
                                <img :src="uploadedImage" alt="上传的照片" class="uploaded-main-image" ref="uploadedImageRef">
                                <van-icon name="cross" class="remove-main-icon" @click.stop="removeUploadedImage" />
                            </div>
                            <div class="upload-main-content" v-else>
                                <img :src="defaultImage" alt="上传图片开始换装吧" class="default-upload-image">
                            </div>
                    </div>
                </template>
            </van-uploader>
            </div>
        </div>
        
        <!-- 生成的试衣效果图 -->
        <div class="result-section" v-if="resultImage">
            <div class="preview-title">
                <div class="wrap">
                    生成的试衣效果图
                    <div class="wrap_left_top"></div>
                    <div class="wrap_right_top"></div>
                    <div class="wrap_left_bottom"></div>
                    <div class="wrap_right_bottom"></div>
                </div>
            </div>
            <div class="result-image-wrapper">
                <img :src="resultImage" alt="试衣效果" class="result-image">
            </div>
        </div>

        <!-- 已选择的汉服显示 -->
        <div class="selected-hanfu-section" v-if="selectedHanfu">
            <div class="selected-hanfu-title">已选择的汉服</div>
            <div class="selected-hanfu-list">
                <!-- 套装显示 -->
                <div v-if="selectedHanfu.categoryId === 'suit'" class="selected-item suit-item">
                    <img :src="selectedHanfu.image" :alt="selectedHanfu.name" class="selected-image" />
                    <div class="selected-info">
                        <div class="selected-name">{{ selectedHanfu.name }}</div>
                        <div class="selected-type">套装</div>
                    </div>
                    <van-icon name="cross" class="remove-icon" @click="removeSelectedHanfu" />
                </div>
                <!-- 上装+下装显示 -->
                <template v-else-if="selectedHanfu.categoryId === 'upper'">
                    <div class="selected-item upper-item">
                        <img :src="selectedHanfu.image" :alt="selectedHanfu.name" class="selected-image" />
                        <div class="selected-info">
                            <div class="selected-name">{{ selectedHanfu.name }}</div>
                            <div class="selected-type">上装</div>
                        </div>
                        <van-icon name="cross" class="remove-icon" @click="removeSelectedHanfu" />
                    </div>
                    <div v-if="selectedLowerHanfu" class="selected-item lower-item">
                        <img :src="selectedLowerHanfu.image" :alt="selectedLowerHanfu.name" class="selected-image" />
                        <div class="selected-info">
                            <div class="selected-name">{{ selectedLowerHanfu.name }}</div>
                            <div class="selected-type">下装</div>
                        </div>
                        <van-icon name="cross" class="remove-icon" @click="removeSelectedLowerHanfu" />
                    </div>
                    <div v-else class="selected-item placeholder-item">
                        <van-icon name="plus" size="24px" color="#999" />
                        <div class="selected-info">
                            <div class="selected-name">请选择下装</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>

        <!-- 一键换装按钮 -->
        <div class="top-action-section">
            <van-button
                type="primary"
                size="large"
                block
                round
                :disabled="!canStartDress || isProcessing"
                @click="startDress('aliyun')"
                class="dress-button aliyun-button"
                :loading="isProcessing && currentProvider === 'aliyun'"
            >
                <van-icon name="magic-wand-o" />
                <span>一键换装</span>
            </van-button>
            <div class="action-hint" v-if="!canStartDress">
                <span v-if="!uploadedImage">请先上传照片</span>
                <span v-else-if="!selectedHanfu">请选择汉服样式</span>
                <span v-else-if="selectedHanfu && selectedHanfu.categoryId === 'upper' && !selectedLowerHanfu">请继续选择下装</span>
            </div>
        </div>

        <!-- 汉服选择区域 -->
        <div class="hanfu-section">
            <div class="section-title">
                <van-icon name="apps-o" size="18px" />
                <span>选择汉服样式</span>
            </div>
            <van-tabs v-model="activeTab" @change="onTabChange" swipeable>
                <van-tab title="全部" name="all">
                    <van-grid :gutter="12" :column-num="2" :border="false">
                        <van-grid-item
                            v-for="item in filteredHanfuList"
                            :key="item.id"
                            @click="selectHanfu(item)"
                            class="hanfu-item"
                        >
                            <div class="hanfu-card" :class="{ 
                                active: (selectedHanfu && selectedHanfu.id === item.id) || 
                                        (selectedLowerHanfu && selectedLowerHanfu.id === item.id)
                            }">
                                <img :src="item.image" :alt="item.name" class="hanfu-image" />
                                <div class="hanfu-info">
                                    <div class="hanfu-name">{{ item.name }}</div>
                                    <div class="hanfu-dynasty">{{ item.dynasty }}</div>
                                </div>
                                <div class="selected-badge" v-if="(selectedHanfu && selectedHanfu.id === item.id) || 
                                                                  (selectedLowerHanfu && selectedLowerHanfu.id === item.id)">
                                    <van-icon name="success" color="#fff" />
                                </div>
                            </div>
                        </van-grid-item>
                    </van-grid>
                </van-tab>
                <van-tab 
                    v-for="category in categories" 
                    :key="category.id"
                    :title="category.name" 
                    :name="category.id"
                >
                    <van-grid :gutter="12" :column-num="2" :border="false">
                        <van-grid-item
                            v-for="item in filteredHanfuList"
                            :key="item.id"
                            @click="selectHanfu(item)"
                            class="hanfu-item"
                        >
                            <div class="hanfu-card" :class="{ 
                                active: (selectedHanfu && selectedHanfu.id === item.id) || 
                                        (selectedLowerHanfu && selectedLowerHanfu.id === item.id)
                            }">
                                <img :src="item.image" :alt="item.name" class="hanfu-image" />
                                <div class="hanfu-info">
                                    <div class="hanfu-name">{{ item.name }}</div>
                                    <div class="hanfu-dynasty">{{ item.dynasty }}</div>
                                </div>
                                <div class="selected-badge" v-if="(selectedHanfu && selectedHanfu.id === item.id) || 
                                                                  (selectedLowerHanfu && selectedLowerHanfu.id === item.id)">
                                    <van-icon name="success" color="#fff" />
                                </div>
                            </div>
                        </van-grid-item>
                    </van-grid>
                </van-tab>
            </van-tabs>
        </div>


        <!-- 底部导航 -->

        <!-- 加载提示 -->
        <van-loading v-if="isProcessing" type="spinner" color="#ae8e66" class="loading-overlay">
            <div class="loading-text">{{ loadingMessage || 'AI正在为您换装，请稍候...' }}</div>
            <div class="loading-tip">预计需要15-30秒，请耐心等待</div>
        </van-loading>
        <Button></Button>
    </div>
    
</template>

<script>
import axios from 'axios';
import { showToast, showSuccessToast, showFailToast, showLoadingToast, showConfirmDialog, closeToast } from "vant";
import Button from "../views/button/button.vue";

export default {
    components: {
        Button,
    },
    data() {
        return {
            // 上传相关
            fileList: [],
            uploadedImage: '',
            uploadedFile: null,
            defaultImage: require('../assets/hzrw.jpg'),
            
            // 汉服相关
            hanfuList: [],
            selectedHanfu: null, // 选中的套装或上装
            selectedLowerHanfu: null, // 选中的下装（仅在选择上装时需要）
            activeTab: 'all',
            
            // 分类数据（与分类页面一致）
            categories: [
                {
                    id: 'suit',
                    name: '套装',
                    subCategories: [
                        { id: 'suit_1', name: '衣裳制' },
                        { id: 'suit_2', name: '深衣制' },
                        { id: 'suit_3', name: '袍服制' },
                        { id: 'suit_4', name: '襦裙制' },
                    ]
                },
                {
                    id: 'upper',
                    name: '上装',
                    subCategories: [
                        { id: 'upper_1', name: '襦' },
                        { id: 'upper_2', name: '袄（含短袄、长袄）' },
                        { id: 'upper_3', name: '衫' },
                        { id: 'upper_4', name: '深衣上装' },
                        { id: 'upper_5', name: '半臂' },
                        { id: 'upper_6', name: '比甲' },
                        { id: 'upper_7', name: '短款褙子' },
                        { id: 'upper_8', name: '披袄' },
                        { id: 'upper_9', name: '短褐' },
                        { id: 'upper_10', name: '直裾上衣' },
                        { id: 'upper_11', name: '曲裾上衣' },
                        { id: 'upper_12', name: '中单' },
                        { id: 'upper_13', name: '中衣（中襌）' },
                        { id: 'upper_14', name: '裲裆' },
                        { id: 'upper_15', name: '两当衫' },
                        { id: 'upper_16', name: '道袍（上衣部分）' },
                        { id: 'upper_17', name: '直裰' },
                    ]
                },
                {
                    id: 'lower',
                    name: '下装',
                    subCategories: [
                        { id: 'lower_1', name: '裙' },
                        { id: 'lower_2', name: '马面裙' },
                        { id: 'lower_3', name: '襦裙（下裙部分）' },
                        { id: 'lower_4', name: '褶裙' },
                        { id: 'lower_5', name: '交窬裙' },
                        { id: 'lower_6', name: '破裙' },
                        { id: 'lower_7', name: '旋裙' },
                        { id: 'lower_8', name: '百迭裙' },
                        { id: 'lower_9', name: '两片裙' },
                        { id: 'lower_10', name: '裈' },
                        { id: 'lower_11', name: '袴' },
                        { id: 'lower_12', name: '犊鼻裈' },
                        { id: 'lower_13', name: '缚袴' },
                        { id: 'lower_14', name: '穷袴' },
                        { id: 'lower_15', name: '胫衣' },
                        { id: 'lower_16', name: '裳' },
                        { id: 'lower_17', name: '蔽膝' },
                        { id: 'lower_18', name: '围裳' },
                        { id: 'lower_19', name: '战裙' },
                    ]
                },
                {
                    id: 'hairstyle',
                    name: '发型',
                    subCategories: [
                        { id: 'hairstyle_1', name: '男' },
                        { id: 'hairstyle_2', name: '女' },
                    ]
                }
            ],
            currentCategory: 'all',
            currentSubCategory: null,
            
            // 换装结果
            resultImage: '',
            isProcessing: false,
            loadingMessage: 'AI正在为您换装，请稍候...',
            currentProvider: 'aliyun', // 当前使用的服务提供商：aliyun 或 volcano
            
            // API配置（请替换为您的实际配置）
            apiConfig: {
                // 阿里云DashScope API Key（请替换为您的实际API Key）
                apiKey: process.env.VUE_APP_DASHSCOPE_API_KEY || 'sk-your-api-key-here',
                // 图片上传服务地址（用于将本地图片上传到服务器获取公网URL）
                // 如果您的图片已经是公网URL，可以留空
                imageUploadUrl: process.env.VUE_APP_IMAGE_UPLOAD_URL || '/api/upload/image',
                // DashScope API基础地址
                dashScopeBaseUrl: 'https://dashscope.aliyuncs.com',
                // 火山引擎API配置
                volcanoConfig: {
                    accessKeyId: process.env.VUE_APP_VOLCANO_ACCESS_KEY_ID || 'AKLTNzZiODk3OTVlM2ExNDk2ZTk1OTRhNjdiYzBmM2JmZWY',
                    secretAccessKey: process.env.VUE_APP_VOLCANO_SECRET_ACCESS_KEY || 'TWprek9UVXdOekpoWmpWa05HTmlNR0poWlRneU1XWmxNR0V4TjJFMk5ESQ==',
                    region: 'cn-north-1',
                    service: 'cv'
                }
            }
        };
    },
    computed: {
        // 过滤汉服列表（根据分类过滤）
        filteredHanfuList() {
            // 根据当前选中的分类过滤
            if (this.activeTab !== 'all') {
                return this.hanfuList.filter(item => item.categoryId === this.activeTab);
            }
            return this.hanfuList;
        },
        // 是否可以开始换装
        canStartDress() {
            if (!this.uploadedImage || this.isProcessing) return false;
            
            // 如果选择了套装，直接可以换装
            if (this.selectedHanfu && this.selectedHanfu.categoryId === 'suit') {
                return true;
            }
            
            // 如果选择了上装，必须同时选择下装才能换装
            if (this.selectedHanfu && this.selectedHanfu.categoryId === 'upper') {
                return !!this.selectedLowerHanfu;
            }
            
            return false;
        }
    },
    mounted() {
        // 加载汉服数据
        this.loadHanfuList();
    },
    watch: {
        // 监听汉服列表变化，当数据加载完成后自动选中从首页传递的汉服
        hanfuList: {
            handler(newList) {
                if (newList.length > 0) {
                    const hanfuId = this.$route.query.hanfuId;
                    if (hanfuId) {
                        this.$nextTick(() => {
                            const hanfu = newList.find(item => item.id == hanfuId);
                            if (hanfu && !this.selectedHanfu) {
                                this.selectHanfu(hanfu);
                                // 滚动到汉服选择区域
                                setTimeout(() => {
                                    const hanfuSection = document.querySelector('.hanfu-section');
                                    if (hanfuSection) {
                                        hanfuSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }, 300);
                            }
                        });
                    }
                }
            },
            immediate: true
        }
    },
    methods: {
        // 触发文件选择
        triggerFileSelect() {
            if (!this.uploadedImage) {
                // 创建一个隐藏的 input 元素来触发文件选择
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.style.display = 'none';
                
                const cleanup = () => {
                    setTimeout(() => {
                        if (input.parentNode) {
                            input.parentNode.removeChild(input);
                        }
                    }, 100);
                };
                
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            this.uploadedImage = event.target.result;
                            this.uploadedFile = file;
                            this.fileList = [{
                                file: file,
                                content: event.target.result
                            }];
                            showSuccessToast('照片上传成功');
                            // 确保图片正确加载后调整大小
                            this.$nextTick(() => {
                                const img = this.$refs.uploadedImageRef;
                                if (img) {
                                    const ensureImageSize = () => {
                                        img.style.width = '100%';
                                        img.style.height = '100%';
                                        img.style.objectFit = 'cover';
                                        img.style.objectPosition = 'center center';
                                    };
                                    if (img.complete) {
                                        ensureImageSize();
                                    } else {
                                        img.onload = ensureImageSize;
                                    }
                                }
                            });
                        };
                        reader.readAsDataURL(file);
                    }
                    cleanup();
                };
                
                input.oncancel = cleanup;
                
                document.body.appendChild(input);
                input.click();
            }
        },
        
        // 加载汉服列表（根据分类过滤）
        loadHanfuList() {
            const params = {};
            if (this.currentSubCategory) {
                params.sub_category_id = this.currentSubCategory;
            } else if (this.currentCategory !== 'all') {
                params.category_id = this.currentCategory;
            }
            
            axios.get('http://127.0.0.1:8083/api/clothes/list', { params })
                .then(response => {
                    if (response.data.success) {
                        this.hanfuList = response.data.data.map(item => ({
                            id: item.id,
                            name: item.name,
                            dynasty: item.dynasty || '',
                            categoryId: item.category_id,
                            subCategoryId: item.sub_category_id,
                            categoryName: item.category_name || '',
                            subCategoryName: item.sub_category_name || '',
                            image: item.image ? `http://127.0.0.1:8083/img/${item.image.replace('img/', '')}` : ''
                        }));
                    } else {
                        showFailToast('加载汉服数据失败');
                    }
                })
                .catch(error => {
                    console.error('加载汉服列表失败:', error);
                    showFailToast('加载汉服数据失败，请稍后重试');
                });
        },
        // 上传照片后处理
        afterRead(file) {
            // 如果是文件对象
            if (file.file) {
                this.uploadedFile = file.file;
                this.uploadedImage = file.content;
            } else {
                // 如果是base64
                this.uploadedImage = file.content;
            }
            showSuccessToast('照片上传成功');
            // 确保图片正确加载后调整大小
            this.$nextTick(() => {
                const img = this.$refs.uploadedImageRef;
                if (img) {
                    const ensureImageSize = () => {
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        img.style.objectPosition = 'center center';
                    };
                    if (img.complete) {
                        ensureImageSize();
                    } else {
                        img.onload = ensureImageSize;
                    }
                }
            });
        },
        
        // 删除照片前确认
        beforeDelete() {
            return new Promise((resolve) => {
                showConfirmDialog({
                    title: '确认删除',
                    message: '确定要删除这张照片吗？',
                })
                .then(() => {
                    this.uploadedImage = '';
                    this.uploadedFile = null;
                    this.fileList = [];
                    this.resultImage = '';
                    resolve(true);
                })
                .catch(() => {
                    resolve(false);
                });
            });
        },
        
        // 移除上传的照片
        removeUploadedImage() {
            this.uploadedImage = '';
            this.uploadedFile = null;
            this.fileList = [];
            this.resultImage = '';
        },
        
        
        // 选择汉服
        selectHanfu(item) {
            // 如果选择的是套装，直接完成选择，清除下装
            if (item.categoryId === 'suit') {
            this.selectedHanfu = item;
                this.selectedLowerHanfu = null;
                showSuccessToast(`已选择套装：${item.name}`);
            }
            // 如果选择的是上装，需要再选择下装
            else if (item.categoryId === 'upper') {
                this.selectedHanfu = item;
                this.selectedLowerHanfu = null; // 清除之前的下装选择
                showSuccessToast(`已选择上装：${item.name}，请继续选择下装`);
                // 自动切换到下装标签页
                this.activeTab = 'lower';
                this.onTabChange('lower');
            }
            // 如果选择的是下装，且已选择上装
            else if (item.categoryId === 'lower') {
                if (!this.selectedHanfu || this.selectedHanfu.categoryId !== 'upper') {
                    showFailToast('请先选择上装');
                    return;
                }
                this.selectedLowerHanfu = item;
                showSuccessToast(`已选择下装：${item.name}`);
            }
            // 其他情况
            else {
                this.selectedHanfu = item;
                this.selectedLowerHanfu = null;
                showSuccessToast(`已选择：${item.name}`);
            }
        },
        
        // 移除选中的上装或套装
        removeSelectedHanfu() {
            this.selectedHanfu = null;
            this.selectedLowerHanfu = null; // 同时清除下装
        },
        
        // 移除选中的下装
        removeSelectedLowerHanfu() {
            this.selectedLowerHanfu = null;
        },
        
        // 标签页切换
        onTabChange(name) {
            this.activeTab = name;
            if (name === 'all') {
                this.currentCategory = 'all';
                this.currentSubCategory = null;
            } else {
                this.currentCategory = name;
                this.currentSubCategory = null;
            }
            // 重新加载数据
            this.loadHanfuList();
        },
        
        // 跳转到搜索页
        toSearch() {
            this.$router.push({
                name: 'Search'
            });
        },
        
        // 开始换装
        async startDress(provider = 'aliyun') {
            if (!this.canStartDress) {
                showFailToast('请先上传照片并选择汉服样式');
                return;
            }
            
            this.isProcessing = true;
            this.currentProvider = provider;
            this.resultImage = '';
            
            try {
                let resultImageUrl;
                if (provider === 'volcano') {
                    // 调用火山引擎API
                    resultImageUrl = await this.callVolcanoDressAPI();
                } else {
                    // 调用阿里云API
                    resultImageUrl = await this.callDressAPI();
                }
                
                this.resultImage = resultImageUrl;
                
                showSuccessToast('换装完成！');
                
                // 延迟跳转，让用户看到结果
                setTimeout(() => {
                    // 使用 query 传递参数，更可靠
                    // 确保URL正确编码，避免特殊字符问题
                    this.$router.push({
                        name: 'DressResult',
                        query: {
                            resultImage: resultImageUrl || '',
                            personImage: this.uploadedImage || '',
                            garmentImage: this.selectedHanfu?.image || ''
                        }
                    });
                }, 1500);
            } catch (error) {
                console.error('换装失败:', error);
                const errorMessage = error.message || '换装失败，请重试';
                showFailToast(errorMessage);
            } finally {
                this.isProcessing = false;
            }
        },
        
        // 模拟换装过程（后续替换为真实API调用）
        simulateDressProcess() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    // 模拟返回结果图片（实际应该从API获取）
                    this.resultImage = this.uploadedImage; // 临时使用原图，后续替换为API返回的结果
                    resolve();
                }, 2000);
            });
        },
        
        // 上传图片到服务器获取公网URL
        // 将本地图片URL转换为公网URL（优先使用后端OSS，否则使用免费图床）
        async convertToPublicUrl(imageUrl) {
            // 如果已经是公网URL，直接返回
            if (imageUrl.startsWith('https://') || 
                (imageUrl.startsWith('http://') && !imageUrl.includes('127.0.0.1') && !imageUrl.includes('localhost'))) {
                return imageUrl;
            }
            
            try {
                // 优先使用后端转换接口（如果配置了OSS会自动使用OSS）
                const response = await axios.post('http://127.0.0.1:8083/api/dress/convert-image-url', {
                    imageUrl: imageUrl
                });
                
                if (response.data && response.data.success) {
                    return response.data.publicUrl;
                } else {
                    throw new Error(response.data?.message || '转换图片URL失败');
                }
            } catch (error) {
                console.error('后端转换失败，尝试前端上传:', error);
                
                // 如果后端转换失败（可能没有配置OSS），尝试前端直接上传到免费图床
                try {
                    // 获取图片文件
                    const imgResponse = await axios.get(imageUrl, {
                        responseType: 'blob'
                    });
                    
                    const blob = imgResponse.data;
                    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
                    
                    // 尝试使用imgur.com的匿名上传API
                    const formData = new FormData();
                    formData.append('image', file);
                    
                    try {
                        const uploadResponse = await axios.post('https://api.imgur.com/3/image', formData, {
                            headers: {
                                'Authorization': 'Client-ID 546c25a59c58ad7'
                            },
                            timeout: 30000
                        });
                        
                        if (uploadResponse.data && uploadResponse.data.success && uploadResponse.data.data && uploadResponse.data.data.link) {
                            return uploadResponse.data.data.link;
                        } else {
                            throw new Error('图床上传失败：' + (uploadResponse.data?.data?.error || '未知错误'));
                        }
                    } catch (imgurError) {
                        console.warn('imgur上传失败:', imgurError);
                        throw new Error('免费图床服务不可用。AI试衣功能需要公网可访问的图片URL。\n\n解决方案：\n1. 配置阿里云OSS等对象存储服务（推荐）\n   - 请参考 OSS_CONFIG.md 文件进行配置\n2. 在.env文件中设置VUE_APP_IMAGE_UPLOAD_URL指向您的图片上传服务\n3. 或使用其他公网可访问的图片存储服务');
                    }
                } catch (frontendError) {
                    console.error('前端上传失败:', frontendError);
                    if (frontendError.message.includes('免费图床服务不可用')) {
                        throw frontendError;
                    }
                    throw new Error('转换图片URL失败：' + (error.response?.data?.message || error.message));
                }
            }
        },
        
        // 调用火山引擎AI换装API
        async callVolcanoDressAPI() {
            try {
                // 1. 验证输入
                if (!this.uploadedFile && !this.uploadedImage) {
                    throw new Error('请先上传照片');
                }
                if (!this.selectedHanfu) {
                    throw new Error('请先选择汉服样式');
                }
                
                // 2. 上传用户照片获取公网URL
                this.loadingMessage = '正在上传图片...';
                showLoadingToast({
                    message: '正在上传图片...',
                    forbidClick: true,
                    duration: 0
                });
                
                let personImageUrl, garmentImageUrl;
                
                try {
                    // 上传用户照片
                    if (this.uploadedFile) {
                        const localUrl = await this.uploadImageToServer(this.uploadedFile);
                        personImageUrl = await this.convertToPublicUrl(localUrl);
                    } else {
                        throw new Error('请配置图片上传服务，API需要公网可访问的图片URL');
                    }
                    
                    // 验证汉服图片URL并转换为公网URL
                    let topGarmentUrl, bottomGarmentUrl = null;
                    
                    // 如果选择了套装，使用套装图片作为上装
                    if (this.selectedHanfu.categoryId === 'suit') {
                        const localGarmentUrl = this.selectedHanfu.image;
                        if (!localGarmentUrl || !localGarmentUrl.startsWith('http')) {
                            throw new Error('汉服图片URL无效');
                        }
                        topGarmentUrl = await this.convertToPublicUrl(localGarmentUrl);
                    }
                    // 如果选择了上装+下装
                    else if (this.selectedHanfu.categoryId === 'upper' && this.selectedLowerHanfu) {
                        // 上装URL
                        const localTopUrl = this.selectedHanfu.image;
                        if (!localTopUrl || !localTopUrl.startsWith('http')) {
                            throw new Error('上装图片URL无效');
                        }
                        topGarmentUrl = await this.convertToPublicUrl(localTopUrl);
                        
                        // 下装URL
                        const localBottomUrl = this.selectedLowerHanfu.image;
                        if (!localBottomUrl || !localBottomUrl.startsWith('http')) {
                            throw new Error('下装图片URL无效');
                        }
                        bottomGarmentUrl = await this.convertToPublicUrl(localBottomUrl);
                    }
                    else {
                        throw new Error('请选择完整的汉服样式（套装或上装+下装）');
                    }
                } catch (error) {
                    closeToast();
                    throw error;
                }
                
                // 3. 调用后端代理接口
                this.loadingMessage = '正在生成换装效果...';
                showLoadingToast({
                    message: '正在生成换装效果...',
                    forbidClick: true,
                    duration: 0
                });
                
                const requestData = {
                    personImageUrl: personImageUrl,
                    topGarmentUrl: topGarmentUrl
                };
                
                // 如果提供了下装URL，添加到请求中
                if (bottomGarmentUrl) {
                    requestData.bottomGarmentUrl = bottomGarmentUrl;
                }
                
                const response = await axios.post('http://127.0.0.1:8083/api/dress/volcano', requestData, {
                    timeout: 120000 // 120秒超时
                });
                
                closeToast();
                
                if (response.data && response.data.success) {
                    if (response.data.imageUrl) {
                        return response.data.imageUrl;
                    } else if (response.data.image_urls && response.data.image_urls.length > 0) {
                        return response.data.image_urls[0];
                    } else {
                        throw new Error('未返回结果图片');
                    }
                } else {
                    throw new Error(response.data?.message || '换装失败');
                }
            } catch (error) {
                closeToast();
                console.error('火山引擎换装API调用失败:', error);
                if (error.response && error.response.data) {
                    throw new Error(error.response.data.message || '换装失败');
                }
                throw error;
            }
        },
        
        // 将 base64 转换为 File 对象
        base64ToFile(base64String, filename = 'image.jpg') {
            // 移除 base64 前缀（如 data:image/jpeg;base64,）
            const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            return new File([blob], filename, { type: 'image/jpeg' });
        },
        
        async uploadImageToServer(imageFile) {
            // 如果图片已经是URL（公网地址），直接返回
            if (typeof imageFile === 'string' && imageFile.startsWith('http')) {
                return imageFile;
            }
            
            // 如果没有文件对象，尝试从 base64 转换
            if (!imageFile && this.uploadedImage) {
                // 如果 uploadedImage 是 base64，转换为 File 对象
                if (this.uploadedImage.startsWith('data:image')) {
                    imageFile = this.base64ToFile(this.uploadedImage, 'uploaded-image.jpg');
                } else {
                    throw new Error('无法处理图片格式，请重新上传');
                }
            }
            
            if (!imageFile) {
                throw new Error('请先上传图片');
            }
            
            // 验证文件大小（5KB - 5MB）
            if (imageFile.size < 5 * 1024) {
                throw new Error('图片文件太小，请上传至少5KB的图片');
            }
            if (imageFile.size > 5 * 1024 * 1024) {
                throw new Error('图片文件太大，请上传不超过5MB的图片');
            }
            
            // 优先使用本地后端上传接口
            const localUploadUrl = 'http://127.0.0.1:8083/api/upload/image';
            
            // 如果配置了自定义图片上传服务，优先使用
            const uploadUrl = (this.apiConfig.imageUploadUrl && 
                              this.apiConfig.imageUploadUrl !== '/api/upload/image') 
                              ? this.apiConfig.imageUploadUrl 
                              : localUploadUrl;
            
            try {
                const formData = new FormData();
                formData.append('image', imageFile);
                
                const response = await axios.post(uploadUrl, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 30000
                    });
                
                    // 支持多种返回格式
                    const imageUrl = response.data?.url || 
                                   response.data?.imageUrl || 
                                   response.data?.data?.url ||
                                   response.data?.data?.imageUrl;
                
                    if (imageUrl && imageUrl.startsWith('http')) {
                        return imageUrl;
                    } else {
                        throw new Error('服务器返回的图片URL格式不正确');
                    }
                } catch (error) {
                    console.error('图片上传失败:', error);
                
                // 如果本地上传失败，尝试使用免费图床作为备选方案
                if (uploadUrl === localUploadUrl) {
                    try {
                        const formData = new FormData();
                        formData.append('smfile', imageFile);
                        
                        const response = await axios.post('https://sm.ms/api/v2/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            },
                            timeout: 30000
                        });
                        
                        // sm.ms API 返回格式: { code: 'success', data: { url: '...' } }
                        if (response.data && response.data.code === 'success' && response.data.data && response.data.data.url) {
                            return response.data.data.url;
                        } else if (response.data && response.data.data && response.data.data.url) {
                            return response.data.data.url;
                        } else {
                            throw new Error('免费图床服务返回格式异常');
                        }
                    } catch (smError) {
                        console.error('免费图床上传失败:', smError);
                        // 如果免费图床也失败，提供更详细的错误信息
                        throw new Error('图片上传失败。\n\n请配置图片上传服务（VUE_APP_IMAGE_UPLOAD_URL）：\n1. 使用阿里云OSS等对象存储服务\n2. 或配置您自己的图片上传接口\n\n当前已尝试使用本地服务器和免费图床，但上传失败，请检查网络连接或配置专用上传服务。');
                    }
                } else {
                    // 自定义上传服务失败
                    if (error.response) {
                        throw new Error(`图片上传失败：${error.response.data?.message || '服务器错误'}`);
                    } else if (error.code === 'ECONNABORTED') {
                        throw new Error('图片上传超时，请检查网络连接');
                    } else {
                        throw new Error('图片上传失败，请检查图片上传服务配置');
                    }
                }
            }
        },
        
        // 创建试衣任务（通过后端代理接口，解决CORS问题）
        async createDressTask(personImageUrl, topGarmentUrl, bottomGarmentUrl = null) {
            try {
                // 验证必需参数
                if (!personImageUrl) {
                    throw new Error('人物图片URL不能为空');
                }
                if (!topGarmentUrl) {
                    throw new Error('上装图片URL不能为空');
                }
                
                const requestData = {
                    personImageUrl: personImageUrl,
                    topGarmentUrl: topGarmentUrl,
                    apiKey: this.apiConfig.apiKey
                };
                
                // 如果提供了下装URL，添加到请求中
                if (bottomGarmentUrl) {
                    requestData.bottomGarmentUrl = bottomGarmentUrl;
                }
                
                console.log('发送创建任务请求:', {
                    personImageUrl: personImageUrl ? personImageUrl.substring(0, 50) + '...' : 'null',
                    topGarmentUrl: topGarmentUrl ? topGarmentUrl.substring(0, 50) + '...' : 'null',
                    bottomGarmentUrl: bottomGarmentUrl ? bottomGarmentUrl.substring(0, 50) + '...' : 'null',
                    hasApiKey: !!this.apiConfig.apiKey
                });
                
                const response = await axios.post('http://127.0.0.1:8083/api/dress/create-task', requestData, {
                    timeout: 30000 // 30秒超时
                });
                
                if (response.data && response.data.success) {
                    if (response.data.taskId) {
                        return response.data.taskId;
                    } else {
                        throw new Error('创建任务失败：未返回task_id');
                    }
                } else {
                    const errorMsg = response.data?.message || '创建任务失败';
                    throw new Error(errorMsg);
                }
            } catch (error) {
                console.error('创建试衣任务失败:', error);
                if (error.response) {
                    const responseData = error.response.data || {};
                    const errorCode = responseData.code || responseData.data?.output?.code;
                    const errorMsg = responseData.message || responseData.data?.output?.message || '创建任务失败';
                    // 使用友好的错误信息
                    const friendlyMsg = this.getFriendlyErrorMessage(errorCode, errorMsg);
                    throw new Error(friendlyMsg);
                } else if (error.code === 'ECONNABORTED') {
                    throw new Error('请求超时，请检查网络连接');
                } else if (error.message) {
                    throw error;
                } else {
                    throw new Error('创建任务失败，请稍后重试');
                }
            }
        },
        
        // 查询任务结果（轮询，通过后端代理接口）
        async queryTaskResult(taskId, maxAttempts = 60, interval = 3000) {
            // 状态映射，用于显示友好的提示信息
            const statusMap = {
                'PENDING': '排队中',
                'PRE-PROCESSING': '前置处理中',
                'RUNNING': '处理中',
                'POST-PROCESSING': '后置处理中'
            };
            
            for (let attempt = 0; attempt < maxAttempts; attempt++) {
                try {
                    const response = await axios.post('http://127.0.0.1:8083/api/dress/query-task', {
                        taskId: taskId,
                        apiKey: this.apiConfig.apiKey
                    });
                    
                    if (!response.data || !response.data.success) {
                        throw new Error(response.data?.message || '查询任务失败');
                    }
                    
                    const output = response.data.data?.output || {};
                    const taskStatus = output.task_status;
                    
                    if (taskStatus === 'SUCCEEDED') {
                        const imageUrl = output.image_url;
                        if (imageUrl) {
                            return imageUrl;
                        } else {
                            throw new Error('任务成功但未返回图片URL');
                        }
                    } else if (taskStatus === 'FAILED') {
                        const errorCode = output.code || 'Unknown';
                        const errorMsg = output.message || '任务处理失败';
                        // 根据错误码返回友好的错误信息
                        const friendlyMsg = this.getFriendlyErrorMessage(errorCode, errorMsg);
                        throw new Error(friendlyMsg);
                    } else if (['PENDING', 'PRE-PROCESSING', 'RUNNING', 'POST-PROCESSING'].includes(taskStatus)) {
                        // 更新加载提示
                        const statusText = statusMap[taskStatus] || '处理中';
                        this.loadingMessage = `AI正在生成试衣效果（${statusText}）...`;
                        showLoadingToast({
                            message: `AI正在生成试衣效果（${statusText}）...`,
                            forbidClick: true,
                            duration: 0
                        });
                        // 任务处理中，继续等待
                        await new Promise(resolve => setTimeout(resolve, interval));
                        continue;
                    } else if (taskStatus === 'CANCELED') {
                        throw new Error('任务已取消');
                    } else if (taskStatus === 'UNKNOWN') {
                        throw new Error('任务不存在或状态未知');
                    } else {
                        throw new Error(`未知的任务状态: ${taskStatus}`);
                    }
                } catch (error) {
                    if (error.response) {
                        if (error.response.status === 404) {
                            throw new Error('任务不存在或已过期（任务结果仅保留24小时）');
                        } else if (error.response.status === 401) {
                            throw new Error('API Key 无效，请检查配置');
                        } else if (error.response.status === 403) {
                            throw new Error('API Key 权限不足');
                        }
                    }
                    // 如果是最后一次尝试，抛出错误
                    if (attempt === maxAttempts - 1) {
                        throw error;
                    }
                    // 否则等待后重试
                    await new Promise(resolve => setTimeout(resolve, interval));
                }
            }
            
            throw new Error('查询任务结果超时，请稍后重试');
        },
        
        // 获取友好的错误信息
        getFriendlyErrorMessage(errorCode, errorMsg) {
            const errorMap = {
                'InvalidParameter': '请求参数错误，请检查图片是否符合要求',
                'InvalidURL': '图片URL无效，请确保图片是公网可访问的地址',
                'InvalidPerson': '模特图不合规，请确保图片中有且仅有一个完整的人',
                'InvalidGarment': '缺少服饰图片，请至少提供一张上装或下装的图片',
                'InvalidInputLength': '图片尺寸或文件大小不符合要求（5KB-5MB，150px-4096px）'
            };
            
            // 如果错误信息中包含中文，直接返回
            if (/[\u4e00-\u9fa5]/.test(errorMsg)) {
                return errorMsg;
            }
            
            // 否则返回映射的友好信息
            return errorMap[errorCode] || errorMsg || '处理失败，请重试';
        },
        
        // 调用AI换装API（完整实现）
        async callDressAPI() {
            try {
                // 1. 检查API Key配置
                if (!this.apiConfig.apiKey || this.apiConfig.apiKey === 'sk-your-api-key-here') {
                    throw new Error('请先配置阿里云DashScope API Key（在 .env 文件中设置 VUE_APP_DASHSCOPE_API_KEY）');
                }
                
                // 2. 验证输入
                if (!this.uploadedFile && !this.uploadedImage) {
                    throw new Error('请先上传照片');
                }
                if (!this.selectedHanfu) {
                    throw new Error('请先选择汉服样式');
                }
                
                // 3. 上传用户照片获取公网URL
                this.loadingMessage = '正在上传图片...';
                showLoadingToast({
                    message: '正在上传图片...',
                    forbidClick: true,
                    duration: 0
                });
                
                let personImageUrl;
                let topGarmentUrl = null;
                let bottomGarmentUrl = null;
                
                try {
                    // 上传用户照片
                    if (this.uploadedFile) {
                        const localUrl = await this.uploadImageToServer(this.uploadedFile);
                        // 将本地URL转换为公网URL
                        personImageUrl = await this.convertToPublicUrl(localUrl);
                    } else {
                        // 如果没有文件对象，说明可能是 base64，需要提示用户配置上传服务
                        throw new Error('请配置图片上传服务，API需要公网可访问的图片URL');
                    }
                    
                    // 验证汉服图片URL并转换为公网URL
                    
                    // 如果选择了套装，使用套装图片作为上装
                    if (this.selectedHanfu.categoryId === 'suit') {
                        const localGarmentUrl = this.selectedHanfu.image;
                        if (!localGarmentUrl || !localGarmentUrl.startsWith('http')) {
                            throw new Error('汉服图片URL无效');
                        }
                        topGarmentUrl = await this.convertToPublicUrl(localGarmentUrl);
                    }
                    // 如果选择了上装+下装
                    else if (this.selectedHanfu.categoryId === 'upper' && this.selectedLowerHanfu) {
                        // 上装URL
                        const localTopUrl = this.selectedHanfu.image;
                        if (!localTopUrl || !localTopUrl.startsWith('http')) {
                            throw new Error('上装图片URL无效');
                        }
                        topGarmentUrl = await this.convertToPublicUrl(localTopUrl);
                        
                        // 下装URL
                        const localBottomUrl = this.selectedLowerHanfu.image;
                        if (!localBottomUrl || !localBottomUrl.startsWith('http')) {
                            throw new Error('下装图片URL无效');
                        }
                        bottomGarmentUrl = await this.convertToPublicUrl(localBottomUrl);
                    }
                    // 如果只选择了上装（不应该发生，但做容错处理）
                    else if (this.selectedHanfu.categoryId === 'upper') {
                        const localGarmentUrl = this.selectedHanfu.image;
                        if (!localGarmentUrl || !localGarmentUrl.startsWith('http')) {
                            throw new Error('上装图片URL无效');
                        }
                        topGarmentUrl = await this.convertToPublicUrl(localGarmentUrl);
                    }
                    else {
                        throw new Error('请选择完整的汉服样式（套装或上装+下装）');
                    }
                } catch (error) {
                    closeToast();
                    throw error;
                }
                
                // 4. 创建试衣任务
                this.loadingMessage = '正在创建试衣任务...';
                showLoadingToast({
                    message: '正在创建试衣任务...',
                    forbidClick: true,
                    duration: 0
                });
                
                // 验证参数
                if (!topGarmentUrl) {
                    closeToast();
                    throw new Error('上装图片URL无效，请重新选择汉服样式');
                }
                
                let taskId;
                try {
                    console.log('创建任务参数:', {
                        personImageUrl: personImageUrl ? personImageUrl.substring(0, 50) + '...' : 'null',
                        topGarmentUrl: topGarmentUrl ? topGarmentUrl.substring(0, 50) + '...' : 'null',
                        bottomGarmentUrl: bottomGarmentUrl ? bottomGarmentUrl.substring(0, 50) + '...' : 'null'
                    });
                    taskId = await this.createDressTask(personImageUrl, topGarmentUrl, bottomGarmentUrl);
                    console.log('任务创建成功，task_id:', taskId);
                } catch (error) {
                    closeToast();
                    throw error;
                }
                
                // 5. 轮询查询任务结果
                this.loadingMessage = 'AI正在生成试衣效果，请稍候...';
                showLoadingToast({
                    message: 'AI正在生成试衣效果，请稍候...',
                    forbidClick: true,
                    duration: 0
                });
                
                try {
                    const resultImageUrl = await this.queryTaskResult(taskId);
                    closeToast();
                    console.log('试衣结果生成成功:', resultImageUrl);
                    return resultImageUrl;
                } catch (error) {
                    closeToast();
                    throw error;
                }
            } catch (error) {
                console.error('AI换装API调用失败:', error);
                // 确保清除加载提示
                closeToast();
                throw error;
            }
        },
        
    }
};
</script>

<style scoped>
.ai-dress-page {
    min-height: 90vh;
    background: #fff; /* 改为白色背景 */
    padding-bottom: 80px;
    padding-left: 0;
    padding-right: 0;
    margin: 0;
    font-family: STLiti, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    overflow-x: hidden;
    width: 100%;
}

/* 顶部导航栏 */
.top-navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    background: #fff;
    padding: 12px 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    margin-bottom: 0;
}

.nav-title {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
    color: #ae8e66;
    letter-spacing: 1px;
}

/* 顶部标题 */
.bt {
    display: flex;
    margin: 15px 10px;
    justify-content: center;
    align-items: center;
    color: #ae8e66;
}

.wrap {
    width: 120px;
    height: 24px;
    border: 1px solid rgb(121, 119, 119);
    position: relative;
    margin-left: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 500;
}

.wrap_left_top,
.wrap_right_top,
.wrap_left_bottom,
.wrap_right_bottom {
    position: absolute;
    width: 3px;
    height: 3px;
    border: 2px solid #fff;
    z-index: 1;
    background: rgb(251, 250, 251);
}

.wrap_left_top {
    top: -1px;
    left: -1px;
    border-radius: 0 0 40px 0;
    border-bottom: 2px solid #ae8e66;
    border-right: 2px solid #ae8e66;
}

.wrap_right_top {
    top: -1px;
    right: -1px;
    border-radius: 0 0 0 40px;
    border-bottom: 2px solid #ae8e66;
    border-left: 2px solid #ae8e66;
}

.wrap_left_bottom {
    left: -1px;
    bottom: -1px;
    border-radius: 0 40px 0 0;
    border-top: 2px solid #ae8e66;
    border-right: 2px solid #ae8e66;
}

.wrap_right_bottom {
    right: -1px;
    bottom: -1px;
    border-radius: 40px 0 0 0;
    border-top: 2px solid #ae8e66;
    border-left: 2px solid #ae8e66;
}

/* 搜索框区域 */
.search-header {
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 主要内容区域：上传区域居中占满全屏 */
.main-content-section {
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
    align-items: flex-start;
    width: 100vw;
    max-width: 100vw;
    margin-left: calc(-50vw + 50%);
    margin-right: calc(-50vw + 50%);
}

/* 上传主区域 - 占满全屏宽度 */
.upload-main-area {
    width: 100vw;
    max-width: 100vw;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
}

.preview-title {
    display: flex;
    justify-content: center;
    margin-bottom: 15px;
}

/* 主上传器样式 */
.main-uploader {
    width: 100%;
    height: 100%;
}

.main-uploader :deep(.van-uploader__wrapper) {
    width: 100% !important;
    height: 100% !important;
    display: block !important;
}

/* 覆盖 Vant Uploader 的预览图片样式 */
.main-uploader :deep(.van-uploader__preview) {
    width: 100% !important;
    height: 100% !important;
    margin: 0 !important;
}

.main-uploader :deep(.van-uploader__preview-image) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
}

.main-uploader :deep(.van-image) {
    width: 100% !important;
    height: 100% !important;
}

.main-uploader :deep(.van-image__img) {
    width: auto !important;
    height: 100% !important;
    max-width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
}

.main-uploader :deep(.van-uploader__upload) {
    width: 100% !important;
    height: 45vh !important;
    min-height: 450px !important;
    max-height: none !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    background: transparent !important;
    display: block !important;
}

.upload-main-placeholder {
    width: 100vw !important;
    height: 45vh !important;
    min-height: 450px !important;
    max-height: none !important;
    border-radius: 0;
    background: #fff; /* 改为白色背景 */
    border: none;
    display: block !important;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
    overflow: hidden;
}

.upload-main-placeholder:active {
    transform: scale(0.98);
    background: #f9f9f9; /* 改为浅灰色悬停效果 */
}

.upload-main-content {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box;
}

.uploaded-main-image {
    position: absolute !important;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%, -50%) !important;
    width: auto !important;
    height: 100% !important;
    max-width: 100% !important;
    object-fit: contain !important;
    object-position: center center;
    border-radius: 0;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
    /* 适配容器高度，保持比例不变 */
    min-height: 0 !important;
    max-height: 100% !important;
}

.remove-main-icon {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    border-radius: 50%;
    padding: 8px;
    font-size: 18px;
    cursor: pointer;
    z-index: 10;
}

.upload-main-text {
    margin-top: 15px;
    font-size: 16px;
    color: #ae8e66;
    font-weight: 500;
}

.default-upload-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    display: block;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


/* 结果区域 */
.result-section {
    margin: 20px 15px;
}

.result-image-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 15px;
}

.result-image {
    max-width: 100%;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.preview-container {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
}

.preview-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
}

.garment-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.garment-item {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.garment-name {
    margin-top: 8px;
    font-size: 11px;
    color: #ae8e66;
    font-weight: 500;
    text-align: center;
}

.garment-label {
    font-size: 11px;
    color: #666;
    margin-bottom: 5px;
    font-weight: 500;
}

.garment-image-wrapper {
    width: 100%;
    max-width: 140px;
    aspect-ratio: 1;
    border-radius: 8px;
    overflow: hidden;
    background: #fff; /* 改为白色背景 */
    border: 2px solid #e8e8e8;
}

.garment-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.preview-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 500;
}

.preview-image-wrapper {
    position: relative;
    width: 100%;
    max-width: 140px;
    aspect-ratio: 3/4;
    border-radius: 12px;
    overflow: hidden;
    background: #fff; /* 改为白色背景 */
    border: 2px solid #e8e8e8;
}

.preview-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.remove-icon {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    border-radius: 50%;
    padding: 4px;
    font-size: 14px;
    cursor: pointer;
    z-index: 10;
}

.upload-placeholder {
    width: 100%;
    max-width: 140px;
    aspect-ratio: 3/4;
    border-radius: 12px;
    background: #fff; /* 改为白色背景 */
    border: 2px dashed #ae8e66;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
}

.upload-placeholder:active {
    transform: scale(0.98);
    background: #f9f9f9; /* 改为浅灰色悬停效果 */
}

.upload-text {
    margin-top: 8px;
    font-size: 12px;
    color: #ae8e66;
}

.preview-arrow {
    flex-shrink: 0;
    color: #ae8e66;
    display: flex;
    align-items: center;
    justify-content: center;
}

.arrow-icon {
    font-size: 28px;
    color: #ae8e66;
    font-weight: 300;
}



/* 汉服选择区域 */
/* 已选择的汉服显示区域 */
.selected-hanfu-section {
    margin: 15px;
    background: #fff;
    border-radius: 16px;
    padding: 15px;
    box-shadow: 0 2px 12px rgba(174, 142, 102, 0.1);
}

.selected-hanfu-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
}

.selected-hanfu-title::before {
    content: '';
    width: 4px;
    height: 16px;
    background: linear-gradient(135deg, #ae8e66 0%, #c9a87a 100%);
    border-radius: 2px;
    margin-right: 8px;
}

.selected-hanfu-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.selected-item {
    display: flex;
    align-items: center;
    padding: 10px;
    background: #fff; /* 改为白色背景 */
    border-radius: 12px;
    border: 2px solid #e8e3d8;
    position: relative;
    transition: all 0.3s;
}

.selected-item.suit-item {
    border-color: #ae8e66;
    background: #fff; /* 改为白色背景 */
}

.selected-item.upper-item {
    border-color: #8b9dc3;
    background: #fff; /* 改为白色背景 */
}

.selected-item.lower-item {
    border-color: #c9a87a;
    background: #fff; /* 改为白色背景 */
}

.selected-item.placeholder-item {
    border: 2px dashed #d4c5b0;
    background: #fff; /* 改为白色背景 */
    justify-content: center;
    padding: 20px;
    color: #999;
}

.selected-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    margin-right: 12px;
    border: 2px solid #e8e3d8;
}

.selected-info {
    flex: 1;
}

.selected-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.selected-type {
    font-size: 12px;
    color: #999;
}

.selected-item .remove-icon {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(255, 255, 255, 0.9);
    color: #666;
    border-radius: 50%;
    padding: 4px;
    font-size: 16px;
    cursor: pointer;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.selected-item .remove-icon:active {
    transform: scale(0.9);
}

.hanfu-section {
    margin: 0 15px 20px;
    background: #fff;
    border-radius: 16px;
    padding: 15px;
    box-shadow: 0 2px 12px rgba(174, 142, 102, 0.1);
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
}

.section-title span {
    color: #ae8e66;
}

.hanfu-item {
    padding: 5px;
}

.hanfu-card {
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    background: #fff; /* 改为白色背景 */
    border: 2px solid transparent;
    transition: all 0.3s;
    cursor: pointer;
}

.hanfu-card:active {
    transform: scale(0.98);
}

.hanfu-card.active {
    border-color: #ae8e66;
    box-shadow: 0 4px 12px rgba(174, 142, 102, 0.3);
}

.hanfu-image {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    display: block;
}

.hanfu-info {
    padding: 10px;
    background: #fff;
}

.hanfu-name {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.hanfu-dynasty {
    font-size: 12px;
    color: #999;
}

.selected-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 28px;
    height: 28px;
    background: #ae8e66;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

/* 顶部操作按钮区域 */
.top-action-section {
    margin: 15px;
    padding: 0;
}

.dress-button {
    height: 52px;
    background: linear-gradient(135deg, #ae8e66 0%, #c9a87a 100%);
    border: none;
    font-size: 16px;
    font-weight: 600;
    box-shadow: 0 4px 16px rgba(174, 142, 102, 0.4);
    transition: all 0.3s;
}

.dress-button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 12px rgba(174, 142, 102, 0.4);
}

.dress-button:disabled {
    background: #e0e0e0;
    color: #999;
    box-shadow: none;
}

.dress-button .van-icon {
    margin-right: 6px;
}

.action-hint {
    text-align: center;
    font-size: 12px;
    color: #999;
    margin-top: 8px;
}

/* 加载遮罩 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(4px);
}

.loading-text {
    margin-top: 20px;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
}

.loading-tip {
    margin-top: 10px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 12px;
    font-weight: 400;
}

/* Vant组件样式覆盖 */
.van-tabs__nav {
    background: transparent;
}

.van-tab {
    color: #666;
    font-size: 14px;
}

.van-tab--active {
    color: #ae8e66;
    font-weight: 600;
}

.van-tabs__line {
    background: #ae8e66;
    height: 3px;
    border-radius: 2px;
}

.van-grid-item {
    padding: 0;
}

.van-uploader__upload {
    margin: 0;
    width: 100%;
    border: none;
    background: transparent;
}

.main-uploader .van-uploader__upload {
    width: 100%;
    height: 100%;
    min-height: 500px;
    border: none;
    background: transparent;
    padding: 0;
}

.main-uploader .van-uploader__upload::after {
    display: none;
}

/* 完全隐藏 Vant 的默认预览 */
.van-uploader__preview {
    display: none !important;
}

/* 覆盖所有可能的 Vant Image 组件样式 - 适配容器高度，保持比例 */
.main-uploader :deep(.van-image) {
    width: 100% !important;
    height: 100% !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

.main-uploader :deep(.van-image__img),
.main-uploader :deep(.van-image__error),
.main-uploader :deep(.van-image__loading),
.main-uploader :deep(img.van-image__img) {
    width: auto !important;
    height: 100% !important;
    max-width: 100% !important;
    object-fit: contain !important;
    object-position: center center !important;
    position: relative !important;
}

/* 确保上传的图片正确显示 */
.main-uploader :deep(img.uploaded-main-image),
.main-uploader :deep(.uploaded-main-image) {
    width: 100% !important;
    height: 100% !important;
    min-width: 100% !important;
    min-height: 100% !important;
    max-width: none !important;
    max-height: none !important;
    object-fit: cover !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .upload-main-placeholder {
        height: 45vh !important;
        min-height: 450px !important;
    }
    
    .upload-main-content {
        height: 100% !important;
        min-height: 450px !important;
    }
    
    .uploaded-main-image {
        height: 100% !important;
        max-height: 100% !important;
    }
    
    .main-uploader .van-uploader__upload {
        min-height: 400px;
    }
}

@media (max-width: 375px) {
    .preview-container {
        gap: 8px;
        flex-wrap: wrap;
    }
    
    .preview-item {
        flex: 1 1 calc(50% - 4px);
        min-width: calc(50% - 4px);
    }
    
    .preview-image-wrapper,
    .upload-placeholder,
    .garment-image-wrapper {
        max-width: 100%;
    }
    
    .garment-container {
        gap: 8px;
    }
    
    .upload-main-placeholder {
        height: 45vh !important;
        min-height: 450px !important;
    }
    
    .upload-main-content {
        height: 100% !important;
        min-height: 450px !important;
    }
    
    .uploaded-main-image {
        height: 100% !important;
        max-height: 100% !important;
    }
    
    .main-uploader .van-uploader__upload {
        min-height: 350px;
    }
}
</style>

