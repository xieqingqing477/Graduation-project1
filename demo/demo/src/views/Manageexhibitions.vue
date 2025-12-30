<template>
    <div class="exhibition-container">
        <van-nav-bar title="管理展览" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight" />
        <van-list>
            <van-cell v-for="exhibition in exhibitionList" :key="exhibition.exhibition_information_id">
                <div class="exhibition-wrapper">
                    <div class="exhibition-image">
                        <img class="cpo" :src="exhibition.cover_photo" />
                    </div>
                    <div class="exhibition-info">
                        <div class="exhibition-name">{{ exhibition.exhibition_name }}</div>
                        <div class="exhibition-address">{{ exhibition.exhibition_address }}</div>
                        <div>开始时间：{{ formatDate(exhibition.start_time) }}  结束时间：{{ formatDate(exhibition.end_time) }}</div>
                    </div>
                </div>
                <div class="exhibition-buttons">
                    <van-button type="warning" size="small" @click="handleEdit(exhibition)">编辑</van-button>
                    <van-button type="primary" size="small" @click="handleCopy(exhibition)">查看</van-button>
                    <van-button type="danger" size="small" @click="handleDelete(exhibition)">删除</van-button>
                </div>
            </van-cell>
        </van-list>
        <van-dialog v-model="showEditModal" title="编辑展览信息">
          <form @submit.prevent="submitEdit">
            <label for="exhibitionName">展览名称</label>
            <input type="text" id="exhibitionName" v-model="editedExhibition.exhibition_name" />

            <label for="exhibitionAddress">展览地点</label>
            <input type="text" id="exhibitionAddress" v-model="editedExhibition.exhibition_address" />

            <label for="startTime">开始时间</label>
            <input type="text" id="startTime" v-model="editedExhibition.start_time" />

            <label for="endTime">结束时间</label>
            <input type="text" id="endTime" v-model="editedExhibition.end_time" />

            <label for="coverPhoto">更换展览图片</label>
            <input type="file" id="coverPhoto" @change="handleCoverPhotoChange" />

            <button type="submit">提交</button>
          </form>
        </van-dialog>
    </div>
</template>

<style scoped>
.exhibition-container {
    padding: 20px;
}

.cpo {
    height: 80px;
    display: block;
    margin: 0 auto;
}

.exhibition-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}

.exhibition-info {
    text-align: center;
}

.exhibition-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}
</style>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            showEditModal: false,
            exhibitionList: [],
            editedExhibition: {
                exhibition_name: '',
                exhibition_address: '',
                start_time: '',
                end_time: '',
                cover_photo: null


            }
        }
    },
    mounted() {
        this.fetchExhibitionList()
    },
    methods: {
        formatDate(time) {
            const date = new Date(time);
            const year = date.getFullYear();
            const month = ('0' + (date.getMonth() + 1)).slice(-2);
            const day = ('0' + date.getDate()).slice(-2);
            return `${year}-${month}-${day}`;
        },
        fetchExhibitionList() {
            axios.get('http://localhost:8083/api/look_exhibitions')
                .then(response => {
                    this.exhibitionList = response.data;
                })
                .catch(error => {
                    console.error(error);
                });
        },
        onClickLeft() {
            this.$router.go(-1)
        },
        handleCopy(exhibition) {
            // 查看展览信息
        },
        handleDelete(exhibition) {
            const index = this.exhibitionList.indexOf(exhibition);
            if (index !== -1) {
                this.exhibitionList.splice(index, 1);
            }
        },
        handleEdit(exhibition) {
            this.showEditModal = true;
            this.editedExhibition = { ...exhibition };
        },
        submitEdit() {
            // 发送编辑后的展览信息至后端进行保存
            axios.post('http://localhost:8083/api/edit_exhibition', this.editedExhibition)
                .then(response => {
                    // 处理成功后的逻辑，如关闭遮罩层、刷新展览列表等
                    this.showEditModal = false;
                    this.fetchExhibitionList();
                })
                .catch(error => {
                    console.error(error);
                });
        },
        handleCoverPhotoChange(event) {
            // 处理更换展览图片的逻辑
            const file = event.target.files[0];
            // 将文件上传至服务器或进行其他操作
            // 更新this.editedExhibition.cover_photo的值
        }
    }
}
</script>
