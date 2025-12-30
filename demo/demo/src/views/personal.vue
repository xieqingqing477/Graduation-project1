<template>
    <div class="page">
        <van-nav-bar title="标题" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight" />
        <van-cell-group>
            <van-image round width="5rem" height="5rem" :src="avatarUrl" @click="openFileInput" />
            <input ref="fileInput" type="file" style="display: none" @change="handleImageUpload" accept="image/*" />
            <van-cell title="用户名" :value="username" @click="editUsername" is-link></van-cell>
            <!-- <van-cell title="性别" :value="gender" @click="editGender" is-link></van-cell> -->
            <van-cell title="生日" :value="birthday" @click="editBirthday" is-link></van-cell>
            <!-- <van-cell title="地区" :value="location" @click="editLocation" is-link></van-cell> -->
            <van-cell title="签名" :value="signature" @click="editSignature" is-link></van-cell>
        </van-cell-group>

        <van-popup v-model="showPopup" position="bottom" round>
            <div class="popup-content">
                <van-field v-if="editingField === 'username'" v-model="tempUsername" label="用户名"
                    placeholder="请输入用户名"></van-field>
                <van-radio-group v-if="editingField === 'gender'" v-model="tempGender" direction="horizontal">
                    <van-radio name="male" label="男"></van-radio>
                    <van-radio name="female" label="女"></van-radio>
                </van-radio-group>
                <van-datetime-picker v-if="editingField === 'birthday'" v-model="tempBirthday" type="date" title="选择日期"
                    format="YYYY-MM-DD"></van-datetime-picker>

                <van-area v-if="editingField === 'location'" v-model="tempLocation" :area-list="areaList"
                    title="选择地区"></van-area>
                <van-field v-if="editingField === 'signature'" v-model="tempSignature" label="签名" placeholder="请输入签名"
                    type="textarea" rows="4"></van-field>
            </div>
            <div class="popup-buttons">
                <van-button @click="cancelEdit">取消</van-button>
                <van-button type="primary" @click="saveEdit">保存</van-button>
            </div>
        </van-popup>
        <button class="btn-23" @click="updateUser">
            <span class="text">保存修改</span>
            <span aria-hidden="" class="marquee">Button</span>
        </button>

    </div>
</template>

<script>
import axios from 'axios';
import { showToast } from 'vant';
export default {
    data() {
        return {
            avatarUrl: '', // 当前头像的URL
            username: '',
            birthday: '',
            signature: '',
            showPopup: false,
            editingField: '',
            tempUsername: '',
            tempGender: '',
            tempBirthday: '',
            tempLocation: [],
            tempSignature: '',
            file: '',
            items: [],
            api: 'http://localhost:8080/',
        };
    },
    created() {
        this.fetchxgxx();
    },
    methods: {
        fetchxgxx() {
            const _this = this
            axios({
                url: 'http://127.0.0.1:8083/api/xgxx',
                method: 'post',
                params: {
                    userid: sessionStorage.getItem('userid')
                }
            })
                .then(response => {
                    const userData = response.data;
                    console.log(userData)
                    _this.avatarUrl = _this.api + userData[0].user_img,
                    _this.username = userData[0].name,
                    _this.birthday = userData[0].birthday,
                    _this.signature = userData[0].signature,
                    console.log(_this.avatarUrl)
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        },

        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            showToast('按钮');
        },
        openFileInput() {
            this.$refs.fileInput.click();
        },
        editUsername() {
            this.editingField = 'username';
            this.tempUsername = this.username;
            this.showPopup = true;
        },
        editGender() {
            this.editingField = 'gender';
            this.tempGender = this.gender;
            this.showPopup = true;
        },
        editBirthday() {
            this.editingField = 'birthday';
            this.tempBirthday = new Date(this.birthday); // 修改这里，将字符串转换为日期对象
            this.showPopup = true;
        },
        editLocation() {
            this.editingField = 'location';
            this.tempLocation = this.location.split(' ');
            this.showPopup = true;
        },
        editSignature() {
            this.editingField = 'signature';
            this.tempSignature = this.signature;
            this.showPopup = true;
        },
        cancelEdit() {
            this.showPopup = false;
        },
        saveEdit() {
            if (this.editingField === 'username') {
                this.username = this.tempUsername;
            } else if (this.editingField === 'gender') {
                this.gender = this.tempGender;
            } else if (this.editingField === 'birthday') {
                if (this.tempBirthday instanceof Date) {
                    const year = this.tempBirthday.getFullYear();
                    const month = (this.tempBirthday.getMonth() + 1).toString().padStart(2, '0');
                    const day = this.tempBirthday.getDate().toString().padStart(2, '0');
                    this.birthday = `${year}-${month}-${day}`;
                }
            } else if (this.editingField === 'location') {
                this.location = this.tempLocation.join(' ');
            } else if (this.editingField === 'signature') {
                this.signature = this.tempSignature;
            }
            this.showPopup = false;
        },
        handleImageUpload() {
            const file = this.$refs.fileInput.files[0];
            this.file = file
            const reader = new FileReader();
            reader.onload = (event) => {
                // 读取图片文件成功后，将其转换为数据URL
                const dataUrl = event.target.result;
                // 将数据URL赋值给avatarUrl，临时替换本地头像
                this.avatarUrl = dataUrl;
            };
            // 读取图片文件
            reader.readAsDataURL(file);
        },
        updateUser() {
            const formData = new FormData();
            formData.append('new_name', this.username);
            formData.append('new_tempBirthday', this.tempBirthday);
            formData.append('new_tempSignature', this.tempSignature);
            formData.append('new_image', this.file); // 使用 file 属性作为文件对象
            formData.append('new_id', sessionStorage.getItem('userid')); // 使用 file 属性作为文件对象
            axios({
                url: "http://127.0.0.1:8083/api/updateUser",
                method: "post",
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data' // 设置请求头为multipart/form-data
                },
            })
                .then((res) => {
                    sessionStorage.setItem('name', res.data.data.name);
                    sessionStorage.setItem('avatar', res.data.data.avatar);
                    sessionStorage.setItem('signature', res.data.data.signature);
                    console.log(res.data.data.signature)
                    alert('修改成功');
                    // this.$router.go(-1);
                })
                .catch((err) => {
                    // 添加 catch 方法来捕获错误
                    console.error('404', err);
                });
        },
    }
};
</script>

<style>
div {
    font-family: "STLiti";
}

.btn-23,
.btn-23 *,
.btn-23 :after,
.btn-23 :before,
.btn-23:after,
.btn-23:before {
    border: 0 solid;
    box-sizing: border-box;
    margin: auto;
}

.btn-23 {
    -webkit-tap-highlight-color: transparent;
    /* -webkit-appearance: button; */
    background-color: #284a24;
    background-image: none;
    color: #fff;
    cursor: pointer;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
        Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
        Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji;
    font-size: 100%;
    font-weight: 900;
    line-height: 1.5;
    margin: 0;
    /* -webkit-mask-image: -webkit-radial-gradient(#000, #fff); */
    padding: 0;
    font-family: "STLiti";
    text-transform: uppercase;
}

.btn-23:disabled {
    cursor: default;
}

.btn-23:-moz-focusring {
    outline: auto;
}

.btn-23 svg {
    display: block;
    /* vertical-align: middle; */
}

.btn-23 [hidden] {
    display: none;
}

.btn-23 {
    border-radius: 99rem;
    border-width: 2px;
    overflow: hidden;
    padding: 0.8rem 3rem;
    position: relative;
}

.btn-23 span {
    display: grid;
    inset: 0;
    place-items: center;
    position: absolute;
    transition: opacity 0.2s ease;
}

.btn-23 .marquee {
    --spacing: 5em;
    --start: 0em;
    --end: 5em;
    -webkit-animation: marquee 1s linear infinite;
    animation: marquee 1s linear infinite;
    -webkit-animation-play-state: paused;
    animation-play-state: paused;
    opacity: 0;
    position: relative;
    text-shadow: #fff var(--spacing) 0, #fff calc(var(--spacing) * -1) 0,
        #fff calc(var(--spacing) * -2) 0;
}

.btn-23:hover .marquee {
    -webkit-animation-play-state: running;
    animation-play-state: running;
    opacity: 1;
}

.btn-23:hover .text {
    opacity: 0;
}

@-webkit-keyframes marquee {
    0% {
        transform: translateX(var(--start));
    }

    to {
        transform: translateX(var(--end));
    }
}

@keyframes marquee {
    0% {
        transform: translateX(var(--start));
    }

    to {
        transform: translateX(var(--end));
    }
}

.page {
    padding: 20px;
}

.popup-content {
    padding: 20px;
}

.popup-buttons {
    display: flex;
    justify-content: center;
    padding: 10px;
}
</style>

