<template>
    <div>
        <div class="from--img">
            <div class="form">
                <span class="signup">注销账号</span>

                <input type="text" placeholder="用户名" class="form--input" name="" id="" :disabled="true" :value="username" />
                <input type="text" placeholder="密码" class="form--input" name="" id="" ref="Passwordref" />
                <div class="input-wrap">
                    <input class="input-text" type="text" v-model="inputText" placeholder="请输入验证码"
                        :class="{ 'success-text': isCorrect, 'error-text': !isCorrect }" />
                    <img class="result-text" :src="captchaUrl" alt="验证码" @click="getCaptcha" />
                </div>
                <button class="form--submit" @click="handleLogout"
                    :class="{ 'success-text': isCorrect, 'error-text': !isCorrect }">
                    注销账户
                </button>
                <div class="cancellation" @click="cancellation">取消注销</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
export default {
    data() {
        return {
            username: "", // 添加 username 数据
            password: "",
            error: "",
            captchaUrl: "",
            captchaText: "",
            inputText: "",
            name: ""
        };
    },
    mounted() {
        this.username = sessionStorage.getItem("name"); // 将 session 中的用户名赋值给 username 数据
        console.log(this.username)
        this.getCaptcha();
    },
    computed: {
        isCorrect() {
            return this.inputText.toLowerCase() === this.captchaText.toLowerCase();
        },
    },
    methods: {
        cancellation() {
            this.$router.back()
        },
        handleLogout() { // 将方法名改为 handleLogout
            var that = this;
            console.log(sessionStorage.getItem("name"))
            axios({
                url: "http://127.0.0.1:8083/api/logout",
                method: "post",
                data: {
                    name: sessionStorage.getItem("name"),
                    password: that.$refs.Passwordref.value,
                },
            })
                .then(function (res) {
                    console.log(res);
                    if (res.status === 200) {
                        alert("注销成功");
                        sessionStorage.clear(); // 清空 session
                        window.location.href = res.data.redirectTo;
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });
        },
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
div{
    font-family: "STLiti";
}
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