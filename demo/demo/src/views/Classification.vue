<template>
    <div class="treasure-house">
        <!-- 顶部工具栏 -->
        <div class="toolbar">
            <van-button type="primary" size="small" icon="plus" @click="handleAdd">添加</van-button>
            <van-button 
                v-if="!isBatchMode"
                type="default" 
                size="small" 
                icon="checked" 
                @click="enterBatchMode"
            >
                批量选择
            </van-button>
            <van-button 
                v-if="isBatchMode"
                type="danger" 
                size="small" 
                icon="delete" 
                :disabled="selectedItems.length === 0"
                @click="handleBatchDelete"
            >
                删除({{ selectedItems.length }})
            </van-button>
            <van-search
                v-model="searchKeyword"
                placeholder="搜索衣服..."
                @search="handleSearch"
                @clear="handleSearch"
                class="search-box"
                :disabled="isBatchMode"
            />
        </div>

        <div class="content-wrapper">
            <!-- 左侧分类 -->
            <div class="category-sidebar">
                <div 
                    class="category-item" 
                    :class="{ active: currentCategory === 'all' }"
                    @click="selectCategory('all')"
                >
                    <span>全部</span>
                </div>
                <div 
                    v-for="category in categories" 
                    :key="category.id"
                    class="category-item"
                    :class="{ active: currentCategory === category.id, expanded: expandedCategories.includes(category.id) }"
                >
                    <div class="category-header" @click="toggleCategory(category.id)">
                        <span>{{ category.name }}</span>
                        <van-icon :name="expandedCategories.includes(category.id) ? 'arrow-down' : 'arrow'" />
                    </div>
                    <div 
                        v-if="expandedCategories.includes(category.id)" 
                        class="sub-categories"
                    >
                        <div 
                            v-for="subCategory in category.subCategories" 
                            :key="subCategory.id"
                            class="sub-category-item"
                            :class="{ active: currentSubCategory === subCategory.id }"
                            @click="selectSubCategory(category.id, subCategory.id)"
                        >
                            {{ subCategory.name }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧内容区域 -->
            <div class="content-area">
                <div class="batch-mode-bar" v-if="isBatchMode">
                    <span>已选择 {{ selectedItems.length }} 项</span>
                    <van-button size="mini" @click="exitBatchMode">取消</van-button>
                </div>
                
                <van-grid 
                    :gutter="8" 
                    :column-num="2" 
                    :border="false"
                    class="clothes-grid"
                >
                    <van-grid-item 
                        v-for="item in filteredItems" 
                        :key="item.id"
                        class="clothes-item"
                    >
                        <div 
                            class="clothes-card"
                            :class="{ selected: selectedItems.includes(item.id) }"
                            @click="handleItemClick(item)"
                            @touchstart="handleTouchStart(item, $event)"
                            @touchend="handleTouchEnd"
                        >
                            <div class="checkbox-wrapper" v-if="isBatchMode">
                                <van-checkbox 
                                    :value="selectedItems.includes(item.id)"
                                    @click.stop="toggleSelect(item.id)"
                                />
                            </div>
                            <div class="clothes-image">
                                <img :src="item.image || placeholderImage" :alt="item.name" />
                            </div>
                            <div class="clothes-info">
                                <div class="clothes-name">{{ item.name }}</div>
                                <div class="clothes-tags">
                                    <span 
                                        v-if="item.dynasty" 
                                        class="tag"
                                    >
                                        {{ item.dynasty }}
                                    </span>
                                    <span 
                                        v-if="item.color" 
                                        class="tag"
                                    >
                                        {{ item.color }}
                                    </span>
                                    <span 
                                        v-if="item.season" 
                                        class="tag"
                                    >
                                        {{ item.season }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </van-grid-item>
                </van-grid>

                <van-empty v-if="filteredItems.length === 0" description="暂无数据" />
            </div>
        </div>

        <Button></Button>

        <!-- 添加衣服弹窗 -->
        <van-popup v-model="showAddDialog" position="bottom" :style="{ height: '70%' }">
            <div class="add-dialog">
                <div class="dialog-header">
                    <h3>添加衣服</h3>
                    <van-icon name="cross" @click="showAddDialog = false" />
                </div>
                <van-form @submit="handleSubmitAdd">
                    <van-field
                        v-model="newItem.name"
                        name="name"
                        label="名称"
                        placeholder="请输入衣服名称"
                        :rules="[{ required: true, message: '请输入衣服名称' }]"
                    />
                    <van-field
                        v-model="newItem.category"
                        name="category"
                        label="一级分类"
                        placeholder="请选择一级分类"
                        readonly
                        @click="showCategoryPicker = true"
                    />
                    <van-field
                        v-model="newItem.subCategory"
                        name="subCategory"
                        label="二级分类"
                        placeholder="请选择二级分类"
                        readonly
                        @click="showSubCategoryPicker = true"
                    />
                    <van-field
                        v-model="newItem.color"
                        name="color"
                        label="颜色"
                        placeholder="请输入颜色"
                    />
                    <van-field
                        v-model="newItem.season"
                        name="season"
                        label="季节"
                        placeholder="请输入季节（如：春季/秋季）"
                    />
                    <van-field
                        v-model="newItem.purchase_time"
                        name="purchase_time"
                        label="购入时间"
                        type="date"
                        placeholder="请选择购入时间"
                    />
                    <van-field
                        v-model="newItem.brand"
                        name="brand"
                        label="品牌"
                        placeholder="请输入品牌"
                    />
                    <van-field
                        v-model="newItem.price"
                        name="price"
                        label="价格"
                        type="number"
                        placeholder="请输入价格"
                    />
                    <van-field
                        v-model="newItem.dynasty"
                        name="dynasty"
                        label="朝代"
                        placeholder="请输入朝代"
                    />
                    <van-field
                        v-model="newItem.location"
                        name="location"
                        label="位置"
                        placeholder="请输入位置（如：三号衣柜↓4抽屉）"
                    />
                    <van-field
                        v-model="newItem.detailed"
                        name="detailed"
                        label="描述"
                        type="textarea"
                        placeholder="请输入描述"
                        rows="3"
                    />
                    <van-field
                        name="image"
                        label="图片"
                    >
                        <template #input>
                            <van-uploader 
                                v-model="fileList" 
                                :max-count="1"
                                :after-read="afterRead"
                            />
                        </template>
                    </van-field>
                    <div class="dialog-footer">
                        <van-button block type="primary" native-type="submit">确定</van-button>
                        <van-button block @click="showAddDialog = false">取消</van-button>
                    </div>
                </van-form>
            </div>
        </van-popup>

        <!-- 分类选择器 -->
        <van-popup v-model="showCategoryPicker" position="bottom">
            <van-picker
                :columns="categoryColumns"
                @confirm="onCategoryConfirm"
                @cancel="showCategoryPicker = false"
            />
        </van-popup>

        <van-popup v-model="showSubCategoryPicker" position="bottom">
            <van-picker
                :columns="subCategoryColumns"
                @confirm="onSubCategoryConfirm"
                @cancel="showSubCategoryPicker = false"
            />
        </van-popup>
    </div>
</template>

<script>
import axios from 'axios';
import { showToast, showSuccessToast, showFailToast, showConfirmDialog } from 'vant';
import Button from "../views/button/button.vue";
import BScroll from 'better-scroll';

export default {
    components: {
        Button,
    },
    data() {
        return {
            // 分类数据
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
            
            // 当前选中的分类
            currentCategory: 'all',
            currentSubCategory: null,
            expandedCategories: [],
            
            // 所有衣服数据（示例数据，后续会从后端获取）
            allItems: [],
            
            // 搜索关键词
            searchKeyword: '',
            
            // 批量操作
            isBatchMode: false,
            selectedItems: [],
            
            // 添加弹窗
            showAddDialog: false,
            newItem: {
                name: '',
                category: '',
                subCategory: '',
                color: '',
                season: '',
                purchase_time: '',
                brand: '',
                price: '',
                dynasty: '',
                location: '',
                detailed: '',
                image: ''
            },
            fileList: [],
            
            // 选择器
            showCategoryPicker: false,
            showSubCategoryPicker: false,
            
            // 占位图
            placeholderImage: 'https://via.placeholder.com/200x200?text=暂无图片',
            
            // 长按相关
            touchTimer: null,
            touchTarget: null,
            
            // BScroll 相关数据
            menus: [],
            currentIndex: 0,
            newMenus: [
                {
                    name: "馆藏精品",
                    id: 1,
                    subs: [
                        {
                            id: 1,
                            name: "珐琅彩楼转心瓶",
                            image: require("../assets/gc5.png"),
                            dynasty: '清',
                            detailed: '瓶口外撇，短粗颈，颈两侧堆塑象耳，垂肩，鼓腹，圈足。瓶内套一直腹小瓶，与外瓶颈部相接，可以转动。小瓶白釉地上饰粉彩。瓶颈与肩两部位，各绘12个开光，上下相对。颈部开光中，有楷书"万年"、"甲子"及篆书天干名；肩部开光内篆书地支名。腹部饰黄地轧道的缠枝花纹，并镂空出4组四季园景开光景窗，透过景窗可以看到套瓶上的婴戏图，童子们或骑马、或打太极旗、或持伞盖、或击鼓、或打灯笼，千姿百态。瓶之象耳、口沿及镂空景窗边缘部位均施金彩。瓶内施松石绿釉。底青花篆书"大清乾隆年制"六字款。此瓶的口、颈部位皆能转动，尤其是颈、肩部开光对合组成一部万年历。瓶体须三部分分别烧绘，在工艺过程中，各部位的收缩比例要控制好，避免在组装、粘接、补彩后出现纰漏。这件陈设器是乾隆八年（1743年）后特制的新式品种。'
                        },
                        {
                            id: 2,
                            name: "画珐琅兽面纹",
                            image: require("../assets/gc2.png"),
                            dynasty: '清',
                            detailed:'甗为上甑下鬲，双桥形立耳，三足，三道铜镀金出戟。通体施仿古铜绿色珐琅，其间泛出蓝色，器身以描金回纹作地，上饰螭纹和兽面纹。此器系仿青铜器甗的造型制成，其色彩效果又似瓷器中的古铜彩瓷，斑斓绚丽，是清乾隆朝广东珐琅器别具特色的仿古作品。'
                        },
                        {
                            id: 3,
                            name: "掐丝珐琅兽面纹出戟",
                            image: require("../assets/gc3.png"),
                            dynasty: '清',
                            detailed: '铜胎镀金，仿古彝器。四方体，粗颈，四方弧腹，口及底外撇，八面出戟，口边及戟线宽厚，金色亮灿。通体蓝釉地，以红、黑、深蓝彩嵌纹饰，图案层次分明，繁密工细，四面纹饰相同。腹部饰兽面纹，上下分别饰夔龙纹，纹饰对称分布，口沿下及底边饰仰、覆蕉叶纹，口沿内装饰勾莲纹。底有双方框錾刻阳文"乾隆年制"楷书款。造型浑厚凝重，装饰富丽堂皇，极具皇家气派。'
                        },
                        {
                            id: 4,
                            name: "画珐琅兽面纹",
                            image: require("../assets/gc2.png"),
                        },
                        {
                            id: 5,
                            name: "珐琅彩楼转心瓶",
                            image: require("../assets/gc5.png"),
                        },
                        {
                            id: 6,
                            name: "康熙款画珐琅莲瓣式盘",
                            image: require("../assets/tc4.png")
                        },
                        {
                            id: 7,
                            name: "乾隆款珐琅彩花卉纹瓶",
                            image: require("../assets/tc6.png")
                        },
                    ]
                },
                {
                    name: "雕刻工艺",
                    id: 6,
                    subs: [
                        {
                            id: 1,
                            name: "康熙款匏制蒜头瓶 ",
                            image: require("../assets/d1.png")
                        },
                        {
                            id: 2,
                            name: "象牙编织锦地嵌花鸟图团扇",
                            image: require("../assets/d2.png")
                        },
                        {
                            id: 3,
                            name: "紫檀百宝嵌花果纹长方盒",
                            image: require("../assets/d3.png")
                        },
                    ]
                },
                {
                    name: "漆器",
                    id: 7,
                    subs: [
                        {
                            id: 1,
                            name: "黑漆嵌螺钿云龙纹盖碗",
                            image: require("../assets/q1.png")
                        },
                        {
                            id: 2,
                            name: "黑漆描金缠枝莲蝙蝠纹梅花式盘",
                            image: require("../assets/q2.png")
                        },
                        {
                            id: 3,
                            name: "金漆团花纹盖碗",
                            image: require("../assets/q3.png")
                        },
                        {
                            id: 4,
                            name: "黑漆描金开光山水图手炉",
                            image: require("../assets/q4.png")
                        },
                        {
                            id: 5,
                            name: "黑漆描金三多袱系纹长方匣",
                            image: require("../assets/q5.png")
                        },
                    ]
                },
            ],
            
            // BScroll 实例
            leftBScroll: null,
            rightBScroll: null,
            rightLiTop: []
        }
    },
    computed: {
        // 分类选择器的选项
        categoryColumns() {
            return this.categories.map(cat => cat.name);
        },
        
        // 二级分类选择器的选项
        subCategoryColumns() {
            if (!this.newItem.category) return [];
            const category = this.categories.find(cat => cat.name === this.newItem.category);
            if (!category) return [];
            return category.subCategories.map(sub => sub.name);
        },
        
        // 过滤后的衣服列表（现在直接从后端获取，这里只做前端过滤作为补充）
        filteredItems() {
            return this.allItems;
        }
    },
    mounted() {
        // 初始化数据，后续从后端获取
        this.loadItems();
    },
    methods: {
        // 加载衣服数据
        loadItems() {
            const params = {};
            if (this.currentSubCategory) {
                params.sub_category_id = this.currentSubCategory;
            } else if (this.currentCategory !== 'all') {
                params.category_id = this.currentCategory;
            }
            if (this.searchKeyword) {
                params.keyword = this.searchKeyword;
            }
            
            axios.get('http://127.0.0.1:8083/api/clothes/list', { params })
                .then(response => {
                    if (response.data.success) {
                        const mapped = response.data.data.map(item => ({
                            id: item.id,
                            name: item.name,
                            image: item.image ? `http://127.0.0.1:8083/img/${item.image.replace('img/', '')}` : this.placeholderImage,
                            categoryId: item.category_id,
                            subCategoryId: item.sub_category_id,
                            category: item.category_name,
                            subCategory: item.sub_category_name,
                            dynasty: item.dynasty,
                            detailed: item.detailed,
                            color: item.color,
                            season: item.season,
                            purchase_time: item.purchase_time,
                            brand: item.brand,
                            price: item.price,
                            location: item.location,
                            create_time: item.create_time
                        }));
                        // 新增数据在最前：按创建时间倒序，没有时间则按id倒序
                        mapped.sort((a, b) => {
                            const aTime = a.create_time ? new Date(a.create_time).getTime() : 0;
                            const bTime = b.create_time ? new Date(b.create_time).getTime() : 0;
                            if (aTime !== bTime) return bTime - aTime;
                            return (b.id || 0) - (a.id || 0);
                        });
                        this.allItems = mapped;
                    } else {
                        showFailToast('加载数据失败');
                    }
                })
                .catch(error => {
                    console.error('加载衣服数据失败:', error);
                    showFailToast('加载数据失败');
                });
        },
        
        // 选择分类
        selectCategory(categoryId) {
            this.currentCategory = categoryId;
            this.currentSubCategory = null;
            if (categoryId !== 'all' && !this.expandedCategories.includes(categoryId)) {
                this.expandedCategories.push(categoryId);
            }
            this.loadItems(); // 重新加载数据
        },
        
        // 展开/折叠分类
        toggleCategory(categoryId) {
            const index = this.expandedCategories.indexOf(categoryId);
            if (index > -1) {
                this.expandedCategories.splice(index, 1);
                if (this.currentCategory === categoryId) {
                    this.currentCategory = 'all';
                    this.currentSubCategory = null;
                }
            } else {
                this.expandedCategories.push(categoryId);
                this.currentCategory = categoryId;
                this.currentSubCategory = null;
            }
        },
        
        // 选择二级分类
        selectSubCategory(categoryId, subCategoryId) {
            this.currentCategory = categoryId;
            this.currentSubCategory = subCategoryId;
            if (!this.expandedCategories.includes(categoryId)) {
                this.expandedCategories.push(categoryId);
            }
            this.loadItems(); // 重新加载数据
        },
        
        // 搜索
        handleSearch() {
            this.loadItems(); // 重新加载数据
        },
        
        // 添加衣服
        handleAdd() {
            // 跳转到添加页面，完成后返回柜笥
            this.$router.push({ name: 'AddClothes' });
        },
        
        // 提交添加
        handleSubmitAdd() {
            if (!this.newItem.name) {
                showFailToast('请输入衣服名称');
                return;
            }
            if (!this.newItem.category) {
                showFailToast('请选择一级分类');
                return;
            }
            if (!this.newItem.subCategory) {
                showFailToast('请选择二级分类');
                return;
            }
            
            // 找到对应的分类ID
            const category = this.categories.find(cat => cat.name === this.newItem.category);
            const subCategory = category?.subCategories.find(sub => sub.name === this.newItem.subCategory);
            
            // 构建FormData
            const formData = new FormData();
            formData.append('name', this.newItem.name);
            formData.append('category_id', category?.id || '');
            formData.append('category_name', this.newItem.category);
            formData.append('sub_category_id', subCategory?.id || '');
            formData.append('sub_category_name', this.newItem.subCategory);
            formData.append('color', this.newItem.color || '');
            formData.append('season', this.newItem.season || '');
            formData.append('purchase_time', this.newItem.purchase_time || '');
            formData.append('brand', this.newItem.brand || '');
            formData.append('price', this.newItem.price || '');
            formData.append('dynasty', this.newItem.dynasty || '');
            formData.append('location', this.newItem.location || '');
            formData.append('detailed', this.newItem.detailed || '');
            
            // 如果有图片文件，添加到FormData
            if (this.fileList.length > 0 && this.fileList[0].file) {
                formData.append('image', this.fileList[0].file);
            } else if (this.newItem.image) {
                formData.append('image', this.newItem.image);
            }
            
            axios.post('http://127.0.0.1:8083/api/clothes/add', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then(response => {
                    if (response.data.success) {
                        showSuccessToast('添加成功');
                        this.showAddDialog = false;
                        this.loadItems(); // 重新加载列表
                    } else {
                        showFailToast(response.data.message || '添加失败');
                    }
                })
                .catch(error => {
                    console.error('添加衣服失败:', error);
                    showFailToast('添加失败，请稍后重试');
                });
        },
        
        // 图片上传
        afterRead(file) {
            // TODO: 上传图片到服务器
            this.newItem.image = file.content || file.url;
        },
        
        // 分类选择确认
        onCategoryConfirm(value) {
            this.newItem.category = value;
            this.newItem.subCategory = ''; // 重置二级分类
            this.showCategoryPicker = false;
        },
        
        // 二级分类选择确认
        onSubCategoryConfirm(value) {
            this.newItem.subCategory = value;
            this.showSubCategoryPicker = false;
        },
        
        // 点击衣服项
        handleItemClick(item) {
            if (this.isBatchMode) {
                this.toggleSelect(item.id);
            } else {
                // 跳转到详情页
                this.$router.push({
                    name: 'goodlist',
                    params: {
                        id: item.id,
                        name: item.name,
                        image: item.image,
                        dynasty: item.dynasty,
                        detailed: item.detailed
                    }
                });
            }
        },
        
        // 切换选择状态
        toggleSelect(itemId) {
            const index = this.selectedItems.indexOf(itemId);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            } else {
                this.selectedItems.push(itemId);
            }
            
            // 如果没有选中的项，退出批量模式
            if (this.selectedItems.length === 0) {
                this.isBatchMode = false;
            }
        },
        
        // 批量删除
        async handleBatchDelete() {
            if (this.selectedItems.length === 0) {
                showFailToast('请先选择要删除的项');
                return;
            }
            
            try {
                await showConfirmDialog({
                    title: '确认删除',
                    message: `确定要删除选中的 ${this.selectedItems.length} 项吗？`
                });
                
                // 调用后端API删除
                axios.post('http://127.0.0.1:8083/api/clothes/delete', {
                    ids: this.selectedItems
                })
                    .then(response => {
                        if (response.data.success) {
                            this.selectedItems = [];
                            this.isBatchMode = false;
                            showSuccessToast('删除成功');
                            this.loadItems(); // 重新加载列表
                        } else {
                            showFailToast(response.data.message || '删除失败');
                        }
                    })
                    .catch(error => {
                        console.error('删除衣服失败:', error);
                        showFailToast('删除失败，请稍后重试');
                    });
            } catch {
                // 用户取消
            }
        },
        
        // 进入批量模式
        enterBatchMode() {
            this.isBatchMode = true;
            this.selectedItems = [];
            showToast('已进入批量选择模式，点击物品进行选择');
        },
        
        // 退出批量模式
        exitBatchMode() {
            this.isBatchMode = false;
            this.selectedItems = [];
        },
        
        // 长按开始
        handleTouchStart(item, event) {
            if (this.isBatchMode) return;
            
            this.touchTarget = item;
            this.touchTimer = setTimeout(() => {
                // 长按超过500ms，进入批量模式
                this.enterBatchMode();
                this.toggleSelect(item.id);
                showToast('已进入批量选择模式');
            }, 500);
        },
        
        // 长按结束
        handleTouchEnd() {
            if (this.touchTimer) {
                clearTimeout(this.touchTimer);
                this.touchTimer = null;
            }
            this.touchTarget = null;
        },
        
        // 获取朝代样式类
        getDynastyClass(dynasty) {
            const dynastyMap = {
                '唐': 'tang',
                '宋': 'song',
                '明': 'ming',
                '清': 'qing',
                '汉': 'han',
                '魏晋': 'weijin',
                '南北朝': 'nanbei',
                '元': 'yuan'
            };
            return dynastyMap[dynasty] || 'default';
        },
        
        // 获取季节样式类
        getSeasonClass(season) {
            if (season.includes('春')) return 'spring';
            if (season.includes('夏')) return 'summer';
            if (season.includes('秋')) return 'autumn';
            if (season.includes('冬')) return 'winter';
            return 'default';
        },
        
        // 获取颜色值
        getColorValue(color) {
            const colorMap = {
                '红色': '#ff4757',
                '蓝色': '#3742fa',
                '绿色': '#2ed573',
                '黄色': '#ffa502',
                '紫色': '#a55eea',
                '粉色': '#ff6b9d',
                '白色': '#c7ecee',
                '黑色': '#57606f',
                '灰色': '#747d8c',
                '橙色': '#ff6348',
                '青色': '#00d2d3',
                '棕色': '#8b4513'
            };
            return colorMap[color] || '#ae8e66';
        },
        
        // BScroll 相关方法
        _initRightHeight() {
            let itemArray = [];
            let top = 0;
            itemArray.push(top);

            var allList = this.$refs.itemList?.getElementsByClassName('cate');

            if (allList) {
                for (var i = 0; i < allList.length; i++) {
                    top += allList[i].clientHeight;
                    itemArray.push(top);
                }
            }

            this.rightLiTop = itemArray;
            console.log(this.rightLiTop);
        },

        clickMenu(index) {
            this.currentIndex = index;
        },

        _initScroll() {
            this.$nextTick(() => {
                this.leftBScroll = new BScroll('.menu-left', {
                    click: true,
                    mouseWheel: true
                });

                this.rightBScroll = new BScroll('.menu-right', {
                    click: true,
                    mouseWheel: true
                });
            });
        },

        clickList(index) {
            let y = -this.rightLiTop[index];
            this.rightBScroll?.scrollTo(0, y);
            this.currentIndex = index;
        }
    },
    
    watch: {
        menus() {
            this.$nextTick(() => {
                this._initScroll();
                this._initRightHeight();
            });
        }
    }
}
</script>

<style lang="scss" scoped>
.treasure-house {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50px;
    background-color: #fff; // 改为白色背景
    font-family: "STLiti";
}

.toolbar {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    
    .search-box {
        flex: 1;
    padding: 0;
    }
}

.content-wrapper {
    display: flex;
    flex: 1;
    overflow: hidden;
}

.category-sidebar {
    width: 100px;
        background-color: #fff; // 改为白色背景
    overflow-y: auto;
    border-right: 1px solid #eee;

    .category-item {
        border-bottom: 1px solid #f0f0f0;
        
        &.active {
            background-color: #fff;

            .category-header span {
                color: rgb(190, 143, 82);
            }
        }

        .category-header {
    display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 10px;
            cursor: pointer;
            
            span {
                font-size: 14px;
                color: #333;
            }
            
            .van-icon {
                font-size: 12px;
                color: #999;
            }
        }
        
        .sub-categories {
            background-color: #fff; // 改为白色背景
            
            .sub-category-item {
                padding: 10px 10px 10px 25px;
                font-size: 13px;
                color: #666;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                
                &:hover {
                    background-color: #f9f9f9; // 改为浅灰色悬停效果
                }
                
                &.active {
            background-color: #fff;
                color: rgb(190, 143, 82);
                    font-weight: bold;
                }
            }
            }
        }
    }

.content-area {
    flex: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #fff; // 改为白色背景
    min-width: 0; // 防止flex布局溢出

    .batch-mode-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        background-color: #fff3cd;
        border-radius: 4px;
        margin-bottom: 10px;
                font-size: 14px;
    }
    
    .clothes-grid {
        width: 100%;
        box-sizing: border-box;
        background-color: transparent; // 移除网格背景颜色
        
        // 确保在任何设备上都是一行两个，宽度完全一致
        :deep(.van-grid-item) {
            width: 50% !important;
            flex: 0 0 50% !important;
            max-width: 50% !important;
            min-width: 0 !important; // 防止内容溢出
            box-sizing: border-box;
            padding: 6px !important; // 统一内边距
            margin: 0 !important; // 移除外边距
            background-color: #fff !important; // 改为白色背景
        }
        
        // 确保所有可能的类名组合都是白色背景
        :deep(.van-grid-item.m),
        :deep(.van-grid-item.hanfu-item),
        :deep(.van-grid-item.m.hanfu-item) {
            background-color: #fff !important;
        }
        
        // 响应式优化
        @media (max-width: 480px) {
            :deep(.van-grid-item) {
                width: 50% !important;
                flex: 0 0 50% !important;
                max-width: 50% !important;
                min-width: 0 !important;
                background-color: #fff !important; // 确保响应式下也是白色
            }
        }
        
        @media (min-width: 481px) and (max-width: 768px) {
            :deep(.van-grid-item) {
                width: 50% !important;
                flex: 0 0 50% !important;
                max-width: 50% !important;
                min-width: 0 !important;
                background-color: #fff !important; // 确保响应式下也是白色
            }
        }
        
        @media (min-width: 769px) {
            :deep(.van-grid-item) {
                width: 50% !important;
                flex: 0 0 50% !important;
                max-width: 50% !important;
                min-width: 0 !important;
                background-color: #fff !important; // 确保响应式下也是白色
            }
        }
    }
    
    .clothes-item {
        padding: 0 !important; // 移除内边距，由grid-item统一控制
        width: 100% !important;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        background-color: #fff !important; // 改为白色背景
    }

    .clothes-card {
        position: relative;
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        width: 100% !important; // 确保宽度100%
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 240px; // 设置最小高度，确保卡片大小一致
        box-sizing: border-box; // 确保盒模型一致
        
        &:hover {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        &.selected {
            border: 2px solid rgb(190, 143, 82);
        }
        
        .checkbox-wrapper {
            position: absolute;
            top: 5px;
            left: 5px;
            z-index: 10;
            background-color: rgba(255, 255, 255, 0.8);
            border-radius: 4px;
            padding: 2px;
        }
        
        .clothes-image {
            width: 100% !important; // 确保宽度100%
            height: 160px; // 固定图片高度，确保所有卡片图片区域一致
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
            box-sizing: border-box;

            img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100% !important; // 确保图片宽度100%
                height: 100%;
                object-fit: cover; // 图片适应卡片宽度，保持比例
                display: block; // 移除图片底部空白
            }
        }

        .clothes-info {
            padding: 8px 12px;
            flex: 1;
            display: flex;
            flex-direction: column;
            min-height: 60px; // 固定信息区域最小高度
            justify-content: flex-start; // 改为从顶部开始排列，不使用space-between

            .clothes-name {
                font-size: 13px;
                color: #333;
                font-weight: bold;
                margin-bottom: 1px !important; // 名称和标签之间的间距
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                flex-shrink: 0;
                height: 18px; // 固定名称高度
                line-height: 18px;
            }
            
            .clothes-tags {
                display: flex;
                flex-wrap: nowrap;
                gap: 4px;
                overflow-x: auto;
                margin-top: 0 !important; // 确保标签紧贴名称
                
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
}

.add-dialog {
    padding: 20px;
    
    .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        h3 {
            margin: 0;
            font-size: 18px;
        }
        
        .van-icon {
            font-size: 20px;
            cursor: pointer;
        }
    }
    
    .dialog-footer {
        margin-top: 20px;
        
        .van-button {
            margin-bottom: 10px;
        }
    }
}
</style>
<style lang="scss" scoped>
div {
    font-family: "STLiti";
}

ul {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
}


.menu {

    display: flex;
    position: absolute;
    top: 0px;
    bottom: 50px;
    text-align: center;
    overflow: hidden;

    .menu-left {
        width: 80px;
        flex: 0 0 80px;
        background-color: #fffcfc;

        .menu-item {
            width: 100%;
            height: 54px;

            .text {
                width: 100%;
                margin-bottom: 0;
                line-height: 54px;
            }
        }

        .current {
            background-color: #fff;
            width: 100%;

            .text {
                color: rgb(190, 143, 82);
            }
        }
    }

    .menu-right {

        flex: 1;

        background-color: #fff;

        .cate {

            height: 100%;

            .cate-title {

                font-size: 14px;

                color: #333;

                font-weight: bold;

                text-align: left;

                margin: 0;

                padding: 10px;
            }

            .cate-item {

                display: flex;

                flex-flow: row wrap;

                padding: 7px 10px 10px;

                overflow: hidden;

                li {

                    width: 50%;

                    .cate-item-warpper {

                        .cate-img {

                            width: 100%;

                            img {
                                width: 120px;
                                height: 130px;
                                margin-bottom: 3px;

                            }

                        }

                        .proName {

                            display: inline-block;

                            font-size: 14px;

                            color: #333;

                        }

                    }

                }
            }
        }

    }
}

// 全局覆盖 van-grid-item 的背景色，确保所有情况都是白色
:deep(.van-grid-item) {
    background-color: #fff !important;
    background: #fff !important;
}

:deep(.van-grid-item.m),
:deep(.van-grid-item.hanfu-item),
:deep(.van-grid-item.m.hanfu-item),
:deep(.van-grid-item.clothes-item) {
    background-color: #fff !important;
    background: #fff !important;
}
</style>
