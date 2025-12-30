<template>
    <div class="user-management">
        <van-nav-bar title="管理用户" left-text="返回" :fixed="true" :placeholder="true" left-arrow @click-left="onClickLeft" />
        <div class="search-bar">
            <input type="text" v-model="searchQuery" placeholder="搜索用户" />
            <button class="button5" @click='look_user1'>搜索</button>
        </div>
        <div class="user-list">
            <div v-for="user in filteredUsers" :key="user.id" class="user-item">
                <div class="user-avatar">
                    <img :src="api + user.user_img" alt="暂 无 头 像" />
                </div>
                <div class="user-details">
                    <p>ID: {{ user.id }}</p>
                    <p>账号: {{ user.name }}</p>
                    <p>身份: {{ user.state == '1' ? '管理员' : '普通用户' }}</p>
                </div>
                <div class="user-actions">
                    <button class="button2" @click="deleteUser(user.id)">删除账号</button>
                    <button class="button3" @click="editUser(user)">修改账号</button>
                </div>
            </div>
        </div>
        <div class="edit-modal" v-if="showEditModal" @click="hideEditModal">
            <div class="edit-form" @click.stop>
                <h3>修改账号</h3>
                <label>账号</label>
                <input type="text" v-model="selectedUser.name" />
                <label>身份</label>
                <div class="radio-group">
                    <label>
                        <input type="radio" value="0" v-model="selectedUser.state" />
                        普通用户
                    </label>
                    <label>
                        <input type="radio" value="1" v-model="selectedUser.state" />
                        管理员
                    </label>
                </div>
                <button @click="saveUserChanges">保存</button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { Toast } from "vant";
export default {
    data() {
        return {
            searchQuery: '',
            showEditModal: false,
            selectedUser: null,
            filteredUsers: [],
            api: 'http://localhost:8080/',
        };
    },
    created() {
        var that = this;
        axios({
            url: 'http://127.0.0.1:8083/api/look_user',
            method: 'get',
            timeout: 5000,
        })
            .then(function (res) {
                console.log(res);
                if (res.status === 200) {
                    console.log(res.data);
                    that.filteredUsers = res.data;
                } else {
                    console.log('查看失败');
                }
            })
            .catch(function (error) {
                // 添加 catch 方法来捕获错误
                console.error(error);
            });
    },
    methods: {
        look_user1() {
            var that = this;
            console.log(that.searchQuery)
            axios({
                url: 'http://127.0.0.1:8083/api/look_user1',
                method: 'get',
                params: {
                    name: that.searchQuery
                },
                timeout: 5000,
            })
                .then(function (res) {
                    console.log(res);
                    if (res.status === 200) {
                        console.log(res.data);
                        that.filteredUsers = res.data;
                    } else {
                        console.log('查看失败');
                    }
                })
                .catch(function (error) {
                    // 添加 catch 方法来捕获错误
                    console.error(error);
                });
        },
        deleteUser(userId) {
            // 使用 window.confirm() 方法显示确认对话框
            if (window.confirm("确定要删除该用户吗？")) {
                console.log(userId);
                console.log(this.filteredUsers);
                this.filteredUsers = this.filteredUsers.filter(user => user.id !== userId);
                const that = this;
                axios({
                    url: "http://127.0.0.1:8083/api/delete_user",
                    method: "get",
                    params: {
                        userId: userId
                    },
                })
                    .then(function (res) {
                        Toast("删除成功");
                        location.reload();
                    })
                    .catch(function (error) {
                        // 添加 catch 方法来捕获错误
                        console.error(error);
                    });
            } else {
                Toast("删除成功");
            }
        },
        editUser(user) {
            this.selectedUser = { ...user };
            this.showEditModal = true;
        },
        saveUserChanges() {
            this.hideEditModal();
            const index = this.filteredUsers.findIndex(user => user.id === this.selectedUser.id);
            if (index !== -1) {
                this.filteredUsers[index] = { ...this.selectedUser };

                // 发送修改后的用户数据到后端
                axios.post("http://127.0.0.1:8083/api/upUser", {
                    new_name: this.selectedUser.name,
                    new_state: this.selectedUser.state,
                    new_id: this.selectedUser.id
                })
                    .then((res) => {
                        console.log(res);
                        Toast("用户信息已保存");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        },
        hideEditModal() {
            this.showEditModal = false;
        },
        onClickLeft() {
            this.$router.go(-1);
        },
    },
};
</script>
<style scoped>
/* 其他样式保持不变 */
.button1 {
    font-family: monospace;
    background-color: #f3f7fe;
    color: rgb(59, 162, 246);
    border: none;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
}

.button4 {
    font-family: monospace;
    background-color: #f3f7fe;
    color: rgb(79, 66, 223);
    border: none;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
}

.button2 {
    font-family: monospace;
    background-color: #f3f7fe;
    color: rgb(246, 59, 103);
    border: none;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
}

.button5 {
    font-family: monospace;
    background-color: #f3f7fe;
    /* border: none; */
    border-radius: 8px;
    font-weight: bold;
    padding: 10px;
    font-size: 12px;
}

.button3 {
    font-family: monospace;
    background-color: #f3f7fe;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    margin-top: 10px;
}

.radio-group {
    display: flex;
    gap: 10px;
}

.user-management {
    font-family: monospace;
    width: 90%;
    margin: 5%;
}

.search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.search-bar input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 10px;
}

.user-list {
    display: grid;
    grid-gap: 10px;
}

.user-item {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px;
    display: flex;
    align-items: center;
}

.user-avatar {
    flex: 0 0 80px;
    margin-right: 10px;
}

.user-avatar img {
    width: 100%;
    height: 100%;
    border-radius: 5px;
}

.user-details {
    flex: 1;
}

.user-details p {
    line-height: 0.5;
}

.user-actions {
    display: flex;
    flex-direction: column;
}


.edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
}

.edit-form {
    background-color: #fff;
    border-radius: 8px;
    width: 80%;
    padding: 20px;
    text-align: center;
}

.edit-form h3 {
    margin-bottom: 20px;
}

.edit-form label {
    display: block;
    margin-bottom: 10px;
}

.edit-form input {
    width: 90%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
}

.edit-form button {
    font-family: monospace;
    background-color: #f3f7fe;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    padding: 10px 20px;
    margin-top: 10px;
}

.radio-group {
    display: flex;
    justify-content: center;
    align-items: center;
}

.radio-group label {
    align-items: center;
}
</style>
