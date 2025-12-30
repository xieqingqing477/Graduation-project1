<template>
    <div>
        <div class="from--img">
            <div class="form">
                <span class="signup">修改密码</span>

                <input type="text" placeholder="原密码" class="form--input" name="" id="" ref="oldPasswordref" />
                <input type="text" placeholder="新密码" class="form--input" name="" id="" ref="newPasswordref" />
                <div class="input-wrap">
                    <input class="input-text" type="text" v-model="inputText" placeholder="请输入验证码"
                        :class="{ 'success-text': isCorrect, 'error-text': !isCorrect }" />
                    <img class="result-text" :src="captchaUrl" alt="验证码" @click="getCaptcha" />
                </div>
                <button class="form--submit" @click="handleLogin"
                    :class="{ 'success-text': isCorrect, 'error-text': !isCorrect }">
                    修改密码
                </button>
                <div class="cancellation" @click="cancellation">取消登录</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
export default {
    data() {
        return {
            username: "",
            password: "",
            error: "",
            captchaUrl: "", // 存储验证码图片地址
            captchaText: "", // 存储验证码文字
            inputText: "", // 用户输入的验证码
        };
    },
    created() {
        console.log(this.$store);
    },
    methods: {
        ...mapMutations(["setUser"]),
    },
    mounted() {
        this.getCaptcha();
    },
    computed: {
        // 当前输入的验证码是否与后端返回的验证码一致
        isCorrect() {
            return this.inputText.toLowerCase() === this.captchaText.toLowerCase();
        },
    },
    methods: {
        cancellation() {
            this.$router.back()
        },
        handleLogin() {
            var that = this;
            console.log(sessionStorage.getItem("name"))
            axios({
                url: "http://127.0.0.1:8083/api/updatePwd",
                method: "post",
                data: {
                    name: sessionStorage.getItem("name"),
                    userId: sessionStorage.getItem("userid"), // 添加用户ID，优先使用
                    oldPassword: that.$refs.oldPasswordref.value,
                    newPassword: that.$refs.newPasswordref.value,
                },
            })
                .then(function (res) {
                    console.log(res);
                    if (res.status === 200) {
                        //   console.log(res.data.name);
                        //   sessionStorage.setItem("name", res.data.name); // 将用户名保存在 sessionStorage 中
                        //   location.reload();
                        //   // const user = res.data.username;
                        //   // console.log(user)
                        //   // 将当前登入的用户信息保存到 Vuex 中
                        //   // that.$store.commit("setUser", user);
                        alert("修改成功");
                        window.location.href = res.data.redirectTo; //获取后端数据跳转到首页
                    }
                })
                .catch(function (error) {
                    // 添加 catch 方法来捕获错误
                    console.error(error);
                });
        },
        // 发送请求获取验证码图片和文本
        getCaptcha() {
            axios
                .get("http://localhost:8083/captcha")
                .then((res) => {
                    this.captchaUrl =
                        "data:image/svg+xml;charset=utf-8," +
                        encodeURIComponent(res.data.data);
                    this.captchaText = res.data.text;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
};
</script>

<style scoped="lang">
.from--img {
    width: 100vw;
    height: 100vh;
    background-image: url(../assets/bj.png);
    background-size: 100% 100%;
}

.form {
    width: 80vw;
    height: 110vw;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 5px 5px 15px -1px rgba(0, 0, 0, 0.75);
    position: absolute;
    margin: 10vw;
    margin-top: 20vw;
    padding: 15px;
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(0, 51, 255, 0.1);
}

.signup {
    color: rgb(77, 75, 75);
    text-transform: uppercase;
    letter-spacing: 2px;
    display: block;
    font-weight: bold;
    font-size: x-large;
    margin-bottom: 0.5em;
}

.form--input {
    width: 90%;
    margin-bottom: 1.25em;
    height: 40px;
    border-radius: 5px;
    border: 1px solid gray;
    padding: 0.2em;
    font-family: "Inter", sans-serif;
    outline: none;
}

.form--img {
    cursor: pointer;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    transition: filter 0.2s ease-in-out;
}

.form--input:focus {
    border: 1px solid #639;
    outline: none;
}

.form--marketing {
    display: flex;
    margin-bottom: 1.25em;
    align-items: center;
}

.form--marketing>input {
    margin-right: 0.625em;
}

.form--marketing {
    color: rgb(117, 117, 117);
}

.checkbox,
input[type="checkbox"] {
    accent-color: #639;
}

.form--submit {
    width: 50%;
    padding: 0.625em;
    border-radius: 5px;
    color: white;
    background-color: #639;
    border: 1px dashed #639;
    cursor: pointer;
}

.form--submit:hover {
    color: #639;
    background-color: white;
    border: 1px dashed #639;
    cursor: pointer;
    transition: 0.5s;
}

.input-wrap {
    display: flex;
    align-items: center;
}

.input-text {
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
    outline: none;
}

.input-text {
    width: 40vw;
    margin-bottom: 1.25em;
    height: 40px;
    border-radius: 5px;
    border: 1px solid gray;
    font-family: "Inter", sans-serif;
    outline: none;
}

.result-text {
    width: 30vw;
    color: #fff;
    border-radius: 5px;
    height: 40px;
    transition: opacity 0.2s ease-in-out;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    margin-top: -20px;
}

.success-text {
    background-color: rgba(76, 175, 80, 0.1);
}

.error-text {
    background-color: rgba(244, 67, 54, 0.1);
}
</style>