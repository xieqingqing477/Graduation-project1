<template>
    <div class="login-page">
        <!-- 顶部装饰横幅 -->
        <div class="top-banner">
            <img src="../assets/retouch_2025121817035759.png" alt="装饰横幅" class="banner-image" />
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content">
            <!-- 左侧汉服女孩 -->
            <div class="left-girl">
                <img src="../assets/retouch_2025121816290152.png" alt="汉服女孩" class="girl-image" />
            </div>

            <!-- 中央登录卡片 -->
            <div class="login-card">
                <div class="login-title">登录</div>
                
                <input 
                    type="text" 
                    placeholder="手机号码" 
                    class="form-input" 
                    ref="usernameref" 
                    maxlength="11" 
                />
                
                <input 
                    type="password" 
                    placeholder="密码" 
                    class="form-input" 
                    ref="passwordref" 
                />
                
                <div class="captcha-wrapper">
                    <input 
                        class="captcha-input" 
                        type="text" 
                        v-model="inputText" 
                        placeholder="验证码"
                        :class="{ 'success-text': isCorrect, 'error-text': !isCorrect }" 
                    />
                    <img 
                        class="captcha-image" 
                        :src="captchaUrl" 
                        alt="验证码" 
                        @click="getCaptcha" 
                    />
                </div>
                
                <div class="auxiliary-text">
                    <span>注册/忘记密码等辅助功能</span>
                </div>
                
                <button 
                    class="login-button" 
                    @click="handleLogin"
                    :class="{ 'success-text': isCorrect, 'error-text': !isCorrect }"
                >
                    立即登录
                </button>
            </div>

            <!-- 右侧汉服女孩 -->
            <div class="right-girl">
                <img src="../assets/retouch_2025121816260587.png" alt="汉服女孩" class="girl-image" />
            </div>
        </div>

        <!-- 底部装饰元素 -->
        <div class="bottom-decoration"></div>
    </div>
</template>

<script>
import axios from "axios";
import { showFailToast, showSuccessToast } from "vant";
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
        ...mapMutations(["setUser"]),
        cancellation() {
            this.$router.back()
        },
        handleLogin() {
            var that = this;
            
            // 检查验证码是否正确
            if (!this.isCorrect) {
                showFailToast('验证码错误，请重新输入');
                this.getCaptcha(); // 刷新验证码
                this.inputText = ''; // 清空输入
                return;
            }
            
            // 检查手机号和密码是否为空
            const phone = that.$refs.usernameref.value.trim();
            const password = that.$refs.passwordref.value.trim();
            
            if (!phone) {
                showFailToast('请输入手机号');
                return;
            }
            
            // 手机号格式验证
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                showFailToast('手机号格式不正确，请输入11位有效手机号');
                return;
            }
            
            if (!password) {
                showFailToast('请输入密码');
                return;
            }
            
            axios({
                url: "http://127.0.0.1:8083/api/login",
                method: "post",
                data: {
                    username: phone, // 将手机号作为username传递
                    password: password,
                },
            })
                .then(function (res) {
                    console.log(res);
                    if (res.status === 200 && res.data) {
                        // 检查 userData 是否存在且有效
                        if (res.data.userData && res.data.userData.length > 0) {
                            const userData = res.data.userData[0];
                            console.log(userData, 1);
                            
                            // 确保 userid 有值，否则路由守卫会拦截
                            const userId = userData.id || userData.userid || '';
                            if (!userId) {
                                console.warn('警告：用户ID为空', userData);
                            }
                            
                            // 保存用户信息到 sessionStorage（直接使用当前登录用户的name和签名）
                            sessionStorage.setItem("name", userData.name || ''); 
                            sessionStorage.setItem("userid", userId);
                            sessionStorage.setItem("user_id", userId); // 同时存储 user_id 用于API调用
                            sessionStorage.setItem("signature", userData.signature || '');
                            sessionStorage.setItem("state", userData.state || '');
                            // 同时存储 user_img 和 avatar，确保兼容性
                            const userImg = userData.user_img || '';
                            sessionStorage.setItem("user_img", userImg);
                            sessionStorage.setItem("avatar", userImg);

                            showSuccessToast(res.data.message || '登录成功');
                            
                            // 调试信息：打印后端返回的 redirectTo
                            console.log('后端返回的 redirectTo:', res.data.redirectTo);
                            console.log('完整的 res.data:', res.data);
                            
                            // 强制使用 /home 作为跳转路径，确保登录后跳转到首页
                            const redirectPath = '/home';
                            console.log('准备跳转到:', redirectPath);
                            console.log('sessionStorage userid:', sessionStorage.getItem('userid'));
                            
                            // 使用 nextTick 确保 sessionStorage 已设置，然后跳转
                            that.$nextTick(() => {
                                // 再次确认 userid 已设置
                                const checkUserid = sessionStorage.getItem('userid');
                                console.log('跳转前检查 userid:', checkUserid);
                                
                                if (!checkUserid || checkUserid.trim() === '') {
                                    console.error('错误：userid 未设置，无法跳转');
                                    showFailToast('登录状态异常，请重新登录');
                                    return;
                                }
                                
                                that.$router.push(redirectPath).catch(err => {
                                    console.error('路由跳转失败:', err);
                                    // 如果跳转失败，尝试跳转到默认页面
                                    that.$router.push('/home').catch(e => {
                                        console.error('跳转到默认页面也失败:', e);
                                        showFailToast('页面跳转失败，请手动刷新');
                                    });
                                });
                            });
                        } else {
                            showFailToast('登录失败：用户数据异常');
                            console.error('用户数据为空', res.data);
                        }
                    }
                })
                .catch(function (error) {
                    // 添加 catch 方法来捕获错误
                    console.error(error);
                    let errorMessage = '登录失败，请稍后重试';
                    
                    if (error.response) {
                        // 服务器返回了错误响应
                        const status = error.response.status;
                        const message = error.response.data || error.response.statusText;
                        
                        if (status === 403) {
                            errorMessage = '密码错误，请重新输入';
                        } else if (status === 500) {
                            errorMessage = '服务器错误，请稍后重试';
                        } else if (message) {
                            errorMessage = typeof message === 'string' ? message : '登录失败';
                        }
                    } else if (error.request) {
                        errorMessage = '网络错误，检查网络连接';
                    }
                    
                    showFailToast(errorMessage);
                    that.getCaptcha(); // 刷新验证码
                    that.inputText = ''; // 清空验证码输入
                });
        },
        // 发送请求获取验证码图片和文本
        getCaptcha() {
            axios
                .get("http://127.0.0.1:8083/captcha")
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

<style scoped lang="scss">
.login-page {
    width: 100vw;
    min-height: 100vh;
    background: #f5f2ec; // 奶油色/浅米色背景
    font-family: "STLiti", -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    position: relative;
    overflow-x: hidden;
}

// 顶部装饰横幅
.top-banner {
    width: 100%;
    height: 20vh;
    position: relative;
    overflow: hidden;
    margin-top: -15vh; // 让横幅更多重叠登录卡片
}

.banner-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
}

// 主要内容区域
.main-content {
    position: relative;
    width: 100%;
    min-height: 60vh;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 10;
}

// 左侧和右侧汉服女孩
.left-girl,
.right-girl {
    position: absolute;
    width: 48vw;
    max-width: 500px;
    height: auto;
    z-index: 5;
    pointer-events: none; // 不阻挡点击事件
}

.left-girl {
    left: -2vw;
    transform: translateX(0);
}

.right-girl {
    right: -2vw;
    transform: translateX(0);
}

.girl-image {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
}

// 中央登录卡片
.login-card {
    width: 75vw;
    max-width: 200px;
    border-radius: 16px;
    border: 2px solid #ffa500; // 亮金色/橙色边框
    padding: 35px 28px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 20;
    margin-top: 20vh;
}

.login-title {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    text-align: center;
    margin-bottom: 30px;
    font-family: "STLiti", serif;
    letter-spacing: 2px;
}

// 输入框样式
.form-input {
    width: 100%;
    height: 48px;
    border: 1.5px solid #ffa500; // 金色/橙色边框
    border-radius: 8px;
    padding: 0 16px;
    margin-bottom: 18px;
    font-size: 16px;
    background: #fff;
    color: #333;
    outline: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
    
    &::placeholder {
        color: #999;
    }
    
    &:focus {
        border-color: #ff8c00;
        box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.15);
    }
}

// 验证码区域
.captcha-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
}

.captcha-input {
    flex: 1;
    width:60%;
    height: 30px;
    border: 1.5px solid #ffa500;
    border-radius: 8px;
    font-size: 16px;
    background: #ffe4e1; // 浅粉色背景
    color: #333;
    outline: none;
    transition: all 0.3s ease;
    box-sizing: border-box;
    
    &::placeholder {
        color: #999;
    }
    
    &:focus {
        border-color: #ff8c00;
        box-shadow: 0 0 0 3px rgba(255, 165, 0, 0.15);
        background: #fff;
    }
}

.captcha-image {
    width: 30px;
    height: 38px;
    border: 1.5px solid #333; // 深色边框
    border-radius: 8px;
    cursor: pointer;
    transition: opacity 0.2s ease;
    object-fit: contain;
    background: #fff;
    
    &:hover {
        opacity: 0.8;
    }
    
    &:active {
        opacity: 0.6;
    }
}

// 辅助功能文字
.auxiliary-text {
    margin-bottom: 25px;
    text-align: left;
    
    span {
        color: #999; // 浅灰色文字
        font-size: 13px;
        user-select: none;
    }
}

// 登录按钮
.login-button {
    width: 100%;
    height: 52px;
    background: #6b8e23; // 柔和的橄榄绿色
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: "STLiti", sans-serif;
    letter-spacing: 1px;
    
    &:hover {
        background: #556b2f;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(107, 142, 35, 0.4);
    }
    
    &:active {
        transform: translateY(0);
    }
}

// 验证码状态样式
.success-text {
    background-color: rgba(76, 175, 80, 0.1) !important;
    border-color: rgba(76, 175, 80, 0.5) !important;
}

.error-text {
    background-color: rgba(244, 67, 54, 0.1) !important;
    border-color: rgba(244, 67, 54, 0.5) !important;
}

// 底部装饰
.bottom-decoration {
    width: 100%;
    height: 12vh;
    background: linear-gradient(to top, rgba(139, 69, 19, 0.03), transparent);
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
}

// 响应式设计
@media (max-width: 768px) {
    .main-content {
        padding: 0 1vw;
    }
    
    .login-card {
        width: 92vw;
        padding: 30px 24px;
    }
    
    .left-girl,
    .right-girl {
        width: 24vw;
        max-width: 180px;
        top: -3vh;
    }
    
    .left-girl {
        left: -1vw;
    }
    
    .right-girl {
        right: -1vw;
    }
}

@media (max-width: 480px) {
    .top-banner {
        height: 35vh;
        margin-bottom: -6vh;
    }
    
    .login-card {
        width: 94vw;
        padding: 28px 20px;
        margin-top: 6vh;
        border-width: 1.5px;
    }
    
    .login-title {
        font-size: 28px;
        margin-bottom: 25px;
    }
    
    .form-input,
    .captcha-input {
        height: 44px;
        font-size: 15px;
        padding: 0 14px;
    }
    
    .captcha-image {
        width: 110px;
        height: 44px;
    }
    
    .login-button {
        height: 48px;
        font-size: 17px;
    }
    
    .auxiliary-text span {
        font-size: 12px;
    }
    
    .left-girl,
    .right-girl {
        width: 22vw;
        max-width: 150px;
        top: -2vh;
    }
    
    .left-girl {
        left: 0;
    }
    
    .right-girl {
        right: 0;
    }
}

@media (max-width: 375px) {
    .left-girl,
    .right-girl {
        display: none; // 超小屏幕隐藏侧边图片
    }
    
    .login-card {
        width: 96vw;
    }
}
</style>