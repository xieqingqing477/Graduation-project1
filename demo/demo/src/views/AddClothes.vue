<template>
  <div class="add-clothes-page">
    <div class="top-navbar">
      <van-icon name="arrow-left" class="back-icon" @click="goBack" />
      <div class="nav-title">添加衣服</div>
    </div>

    <div class="form-container">
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
          is-link
          @click="handleCategoryFieldClick"
        />

        <van-field
          v-model="newItem.subCategory"
          name="subCategory"
          label="二级分类"
          :placeholder="newItem.category ? '请选择二级分类' : '请先选择一级分类'"
          readonly
          is-link
          :disabled="!newItem.category"
          @click="handleSubCategoryFieldClick"
        />

        <van-field
          v-model="newItem.color"
          name="color"
          label="颜色"
          placeholder="请输入颜色（限2个字）"
          maxlength="2"
        />

        <van-field
          name="season"
          label="季节"
          placeholder="请选择季节"
          readonly
        >
          <template #input>
            <div class="season-tags" v-if="seasonOptions && seasonOptions.length > 0">
              <span
                v-for="tag in seasonOptions"
                :key="tag"
                :class="['season-tag', { 'season-tag-active': newItem.season === tag }]"
                @click="selectSeason(tag)"
              >
                {{ tag }}
              </span>
            </div>
            <div v-else class="season-tags-placeholder">加载中...</div>
          </template>
        </van-field>

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
          placeholder="请输入朝代（仅限中文）"
          @input="filterChinese"
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
          rows="3"
          placeholder="请输入描述"
        />

        <van-field name="image" label="图片">
          <template #input>
            <van-uploader
              v-model="fileList"
              :max-count="1"
              :after-read="afterRead"
            />
            <div class="image-tip">请上传服饰的人台图或平铺图（仅支持一张）</div>
          </template>
        </van-field>

        <div class="dialog-footer">
          <van-button block type="primary" native-type="submit">
            确定添加
          </van-button>
          <van-button block @click="$router.back()">返回柜笥</van-button>
        </div>
      </van-form>
    </div>

    <!-- 一级分类选择器 -->
    <van-popup v-model:show="showCategoryPicker" position="bottom" round :style="{ padding: '20px' }">
      <van-picker
        :columns="categoryColumns"
        @confirm="onCategoryConfirm"
        @cancel="handleCategoryCancel"
        title="选择一级分类"
      />
    </van-popup>

    <!-- 二级分类选择器 -->
    <van-popup v-model:show="showSubCategoryPicker" position="bottom" round :style="{ padding: '20px' }">
      <van-picker
        :columns="subCategoryColumns"
        @confirm="onSubCategoryConfirm"
        @cancel="handleSubCategoryCancel"
        title="选择二级分类"
      />
    </van-popup>
  </div>
</template>

<script>
import axios from 'axios';
import { showSuccessToast, showFailToast, showToast } from 'vant';

export default {
  name: 'AddClothes',
  data() {
    return {
      // 与柜笥页保持一致的分类数据
      categories: [
        {
          id: 'suit',
          name: '套装',
          subCategories: [
            { id: 'suit_1', name: '衣裳制' },
            { id: 'suit_2', name: '深衣制' },
            { id: 'suit_3', name: '袍服制' },
            { id: 'suit_4', name: '襦裙制' },
          ],
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
          ],
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
          ],
        },
        {
          id: 'hairstyle',
          name: '发型',
          subCategories: [
            { id: 'hairstyle_1', name: '男' },
            { id: 'hairstyle_2', name: '女' },
          ],
        },
      ],

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
        image: '',
      },

      fileList: [],
      showCategoryPicker: false,
      showSubCategoryPicker: false,
      // 季节选项
      seasonOptions: ['春季', '夏季', '秋季', '冬季', '春夏', '春秋', '夏秋', '秋冬'],
    };
  },
  computed: {
    categoryColumns() {
      // van-picker 需要对象数组格式
      return this.categories.map((cat) => ({
        text: cat.name,
        value: cat.name
      }));
    },
    subCategoryColumns() {
      if (!this.newItem.category) return [];
      const category = this.categories.find(
        (cat) => cat.name === this.newItem.category,
      );
      if (!category) return [];
      // van-picker 需要对象数组格式
      return category.subCategories.map((sub) => ({
        text: sub.name,
        value: sub.name
      }));
    },
  },
  watch: {
    // 当一级分类改变时，重置二级分类
    'newItem.category'() {
      this.newItem.subCategory = '';
    },
  },
  methods: {
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
      if (!(this.fileList.length > 0 || this.newItem.image)) {
        showFailToast('请上传服饰图片（人台图或平铺图）');
        return;
      }

      const category = this.categories.find(
        (cat) => cat.name === this.newItem.category,
      );
      const subCategory =
        category?.subCategories.find(
          (sub) => sub.name === this.newItem.subCategory,
        ) || null;

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
      // 传递当前用户ID，用于会员上传限制
      const userId = sessionStorage.getItem('userid');
      if (userId) {
        formData.append('user_id', userId);
      }

      if (this.fileList.length > 0 && this.fileList[0].file) {
        formData.append('image', this.fileList[0].file);
      } else if (this.newItem.image) {
        formData.append('image', this.newItem.image);
      }

      axios
        .post('http://127.0.0.1:8083/api/clothes/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          if (response.data.success) {
            showSuccessToast('添加成功');
            // 返回柜笥页，列表按 create_time DESC，新记录会在第一个卡片
            this.$router.push({ name: 'Classification' });
          } else if (response.data.code === 'UPLOAD_LIMIT_REACHED') {
            // 非会员上传次数已满，提示充值会员
            showFailToast(response.data.message || '非会员上传数量已达上限，请充值会员');
          } else {
            showFailToast(response.data.message || '添加失败');
          }
        })
        .catch((error) => {
          console.error('添加衣服失败:', error);
          showFailToast('添加失败，请稍后重试');
        });
    },

    afterRead(file) {
      showToast('请确认上传的人台图或平铺图清晰完整');
      this.fileList = [file];
      this.newItem.image = file.content || file.url || '';
    },

    onCategoryConfirm({ selectedValues, selectedIndexes }) {
      console.log('选择一级分类:', selectedValues, selectedIndexes);
      // van-picker 返回对象，selectedValues 是数组，取第一个值
      const selectedValue = selectedValues && selectedValues.length > 0 ? selectedValues[0] : '';
      // 如果是对象格式，提取 value 或 text；否则直接使用值
      const categoryName = typeof selectedValue === 'object' && selectedValue !== null 
        ? (selectedValue.value || selectedValue.text || '') 
        : (selectedValue || '');
      this.newItem.category = categoryName;
      this.newItem.subCategory = ''; // 重置二级分类
      this.showCategoryPicker = false;
    },

    onSubCategoryConfirm({ selectedValues, selectedIndexes }) {
      console.log('选择二级分类:', selectedValues, selectedIndexes);
      if (!this.newItem.category) {
        showFailToast('请先选择一级分类');
        this.showSubCategoryPicker = false;
        return;
      }
      // van-picker 返回对象，selectedValues 是数组，取第一个值
      const selectedValue = selectedValues && selectedValues.length > 0 ? selectedValues[0] : '';
      // 如果是对象格式，提取 value 或 text；否则直接使用值
      const subCategoryName = typeof selectedValue === 'object' && selectedValue !== null 
        ? (selectedValue.value || selectedValue.text || '') 
        : (selectedValue || '');
      this.newItem.subCategory = subCategoryName;
      this.showSubCategoryPicker = false;
    },

    handleCategoryCancel() {
      this.showCategoryPicker = false;
    },

    handleSubCategoryCancel() {
      this.showSubCategoryPicker = false;
    },

    goBack() {
      // 优先返回上一页，否则回到柜笥
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push({ name: 'Classification' });
      }
    },

    // 选择季节
    selectSeason(tag) {
      if (this.newItem.season === tag) {
        // 如果已选中，则取消选择
        this.newItem.season = '';
      } else {
        this.newItem.season = tag;
      }
    },

    // 处理一级分类字段点击
    handleCategoryFieldClick() {
      console.log('点击一级分类字段，当前 showCategoryPicker:', this.showCategoryPicker);
      this.showCategoryPicker = true;
      console.log('设置后 showCategoryPicker:', this.showCategoryPicker);
      // 强制更新
      this.$nextTick(() => {
        console.log('nextTick 后 showCategoryPicker:', this.showCategoryPicker);
      });
    },

    // 处理二级分类字段点击
    handleSubCategoryFieldClick() {
      console.log('点击二级分类字段');
      if (!this.newItem.category) {
        showFailToast('请先选择一级分类');
        return;
      }
      this.showSubCategoryPicker = true;
    },

    // 过滤非中文字符
    filterChinese(value) {
      // 确保 value 是字符串类型
      if (value === null || value === undefined) {
        this.newItem.dynasty = '';
        return;
      }
      // 转换为字符串并只保留中文字符
      const strValue = String(value);
      this.newItem.dynasty = strValue.replace(/[^\u4e00-\u9fa5]/g, '');
    },
  },
};
</script>

<style scoped>
.add-clothes-page {
  min-height: 100vh;
  background: #f5f2ec;
}

.top-navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: #fff;
  padding: 12px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: #ae8e66;
}

.back-icon {
  font-size: 20px;
  color: #ae8e66;
}

.form-container {
  padding: 12px 16px 80px;
}

.dialog-footer {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}

.season-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px 0;
  min-height: 40px;
}

.season-tag {
  display: inline-block;
  padding: 4px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  user-select: none;
  font-size: 14px;
  transition: all 0.3s;
}

.season-tag:hover {
  border-color: #ae8e66;
  color: #ae8e66;
}

.season-tag-active {
  background-color: #ae8e66;
  color: #fff;
  border-color: #ae8e66;
}

.season-tags-placeholder {
  padding: 8px 0;
  color: #999;
  font-size: 14px;
}
</style>


