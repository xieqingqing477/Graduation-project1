<template>
    <div class="dress-result-page">
        <!-- 顶部标题 -->
        <div class="bt">
            <van-icon name="arrow-left" class="back-icon" @click="goBack" />
            <div class="wrap">
                &ensp; 换装结果
                <div class="wrap_left_top"></div>
                <div class="wrap_right_top"></div>
                <div class="wrap_left_bottom"></div>
                <div class="wrap_right_bottom"></div>
            </div>
        </div>

        <!-- 结果展示区域 -->
        <div class="result-section">
            <div class="result-title">
                <div class="wrap">
                    AI换装效果
                    <div class="wrap_left_top"></div>
                    <div class="wrap_right_top"></div>
                    <div class="wrap_left_bottom"></div>
                    <div class="wrap_right_bottom"></div>
                </div>
            </div>
            
            <div class="result-image-container" v-if="resultImage">
                <img 
                    :src="resultImage" 
                    alt="换装结果" 
                    class="result-image" 
                    :class="{ 'image-error': imageError }"
                    ref="resultImageRef"
                    @load="handleImageLoad"
                    @error="handleImageError"
                />
                <div class="image-loading" v-if="imageLoading">
                    <van-loading type="spinner" color="#ae8e66" />
                    <div class="loading-text">加载中...</div>
                </div>
                <div class="image-error-overlay" v-if="imageError && !imageLoading">
                    <van-icon name="photo-fail" size="40px" color="#999" />
                    <div class="error-text">图片加载失败</div>
                    <van-button size="small" type="primary" @click="retryLoadImage" style="margin-top: 10px;">
                        重试
                    </van-button>
                </div>
            </div>
            
            <div class="no-result" v-else>
                <van-icon name="photo-fail" size="60px" color="#ccc" />
                <div class="no-result-text">暂无结果</div>
            </div>
        </div>

        <!-- 对比展示区域 -->
        <div class="compare-section" v-if="personImage || garmentImage">
            <div class="compare-title">
                <div class="wrap">
                    对比展示
                    <div class="wrap_left_top"></div>
                    <div class="wrap_right_top"></div>
                    <div class="wrap_left_bottom"></div>
                    <div class="wrap_right_bottom"></div>
                </div>
            </div>
            
            <div class="compare-container">
                <div class="compare-item" v-if="personImage">
                    <div class="compare-label">原图</div>
                    <div class="compare-image-wrapper">
                        <img :src="personImage" alt="原图" class="compare-image" />
                    </div>
                </div>
                
                <div class="compare-arrow" v-if="personImage && garmentImage">
                    <van-icon name="arrow" size="24px" color="#ae8e66" />
                </div>
                
                <div class="compare-item" v-if="garmentImage">
                    <div class="compare-label">服装</div>
                    <div class="compare-image-wrapper">
                        <img :src="garmentImage" alt="服装" class="compare-image" />
                    </div>
                </div>
            </div>
        </div>

        <!-- 操作按钮区域 -->
        <div class="action-section">
            <van-button 
                type="primary" 
                block 
                class="action-button download-button"
                @click="downloadImage"
                :loading="downloading"
            >
                <van-icon name="down" size="18px" />
                <span>保存图片</span>
            </van-button>
            
            <van-button 
                type="default" 
                block 
                class="action-button retry-button"
                @click="goToDressPage"
            >
                <van-icon name="replay" size="18px" />
                <span>重新换装</span>
            </van-button>
        </div>
    </div>
</template>

<script>
import { showFailToast, showSuccessToast } from 'vant';
import axios from 'axios';

export default {
    name: 'DressResult',
    data() {
        return {
            resultImage: '',
            personImage: '',
            garmentImage: '',
            imageLoading: true,
            downloading: false,
            imageRetryCount: 0, // 图片重试次数
            maxRetries: 3, // 最大重试次数（增加到3次）
            imageError: false, // 图片加载错误标志
            historyId: null // 历史记录ID（如果从历史记录打开）
        };
    },
    mounted() {
        // 从路由参数获取图片（优先使用 query，如果没有则使用 params）
        const query = this.$route.query;
        const params = this.$route.params;
        
        // 检查是否有历史记录ID
        this.historyId = query.historyId || params.historyId || null;
        
        // 解码URL，确保特殊字符正确处理
        let resultImageUrl = query.resultImage || params.resultImage || '';
        if (resultImageUrl) {
            // 如果URL被编码了，尝试解码
            try {
                resultImageUrl = decodeURIComponent(resultImageUrl);
            } catch (e) {
                console.warn('URL解码失败，使用原始URL:', e);
            }
        }
        
        this.resultImage = resultImageUrl;
        this.personImage = query.personImage || params.personImage || '';
        this.garmentImage = query.garmentImage || params.garmentImage || '';
        
        // 如果没有URL但有历史记录ID，尝试从历史记录加载
        if (!this.resultImage && this.historyId) {
            this.loadFromHistory(this.historyId);
        }
        
        // 预加载结果图片
        if (this.resultImage) {
            this.preloadImage(this.resultImage);
            // 将本次换装结果保存到换装记录表（异步执行，不阻塞图片显示）
            this.$nextTick(() => {
                this.saveToHistory();
            });
        } else {
            this.imageLoading = false;
        }
    },
    methods: {
        // 预加载图片
        preloadImage(url) {
            if (!url) {
                this.imageLoading = false;
                return;
            }
            
            const img = new Image();
            // 对于跨域图片，尝试设置crossOrigin，但如果服务器不支持CORS，可能会导致加载失败
            // 如果遇到CORS错误，可以尝试移除 crossOrigin 设置
            // 暂时不设置 crossOrigin，因为阿里云OSS可能不支持CORS
            // if (url.startsWith('http')) {
            //     img.crossOrigin = 'anonymous';
            // }
            
            // 设置超时
            const timeout = setTimeout(() => {
                if (this.imageLoading) {
                    this.imageLoading = false;
                    console.warn('图片加载超时:', url);
                    // 不显示toast，避免干扰用户体验
                }
            }, 30000); // 30秒超时
            
            img.onload = () => {
                clearTimeout(timeout);
                this.imageLoading = false;
                this.imageRetryCount = 0; // 重置重试次数
                this.imageError = false; // 清除错误标志
                console.log('图片加载成功:', url);
            };
            
            img.onerror = (error) => {
                clearTimeout(timeout);
                this.imageLoading = false;
                console.error('图片预加载失败:', url, error);
                // 不显示错误提示，让用户看到图片加载状态
            };
            
            img.src = url;
        },
        
        // 处理图片加载错误
        handleImageError(event) {
            console.error('图片显示失败:', this.resultImage);
            this.imageLoading = false;
            this.imageError = true;
            
            // 检查是否是OSS临时URL过期
            const isOssUrl = this.resultImage && this.resultImage.includes('oss-cn-beijing.aliyuncs.com');
            if (isOssUrl) {
                // 检查URL中是否包含Expires参数
                const expiresMatch = this.resultImage.match(/Expires=(\d+)/);
                if (expiresMatch) {
                    const expiresTime = parseInt(expiresMatch[1]) * 1000; // 转换为毫秒
                    const now = Date.now();
                    if (now > expiresTime) {
                        console.warn('OSS临时URL已过期:', {
                            expires: new Date(expiresTime).toLocaleString(),
                            now: new Date(now).toLocaleString()
                        });
                        // 如果URL已过期，不再重试
                        if (this.imageRetryCount >= this.maxRetries) {
                            showFailToast('图片链接已过期，请重新生成换装结果');
                            return;
                        }
                    }
                }
            }
            
            // 限制重试次数，避免无限重试
            if (this.imageRetryCount >= this.maxRetries) {
                console.warn('图片加载失败，已达到最大重试次数:', this.maxRetries);
                // 显示友好的错误提示，但不清空URL，让用户知道有图片但加载失败
                const errorMsg = isOssUrl ? '图片链接可能已过期，请重新生成换装结果' : '图片加载失败，可能是网络问题';
                showFailToast(errorMsg);
                // 重要：不清空 resultImage，保留URL以便用户重试或查看
                return;
            }
            
            // 尝试重新加载
            if (this.resultImage) {
                this.imageRetryCount++;
                const img = event.target;
                console.log(`尝试重新加载图片 (第 ${this.imageRetryCount} 次):`, this.resultImage);
                
                // 移除可能的 crossOrigin 属性，避免CORS问题
                img.removeAttribute('crossorigin');
                
                // 处理图片URL，确保正确编码
                let imageUrl = this.processImageUrl(this.resultImage);
                
                // 对于OSS URL，确保签名中的特殊字符正确编码
                if (imageUrl.includes('oss-cn-beijing.aliyuncs.com')) {
                    try {
                        // 分离URL和查询参数
                        const urlParts = imageUrl.split('?');
                        if (urlParts.length > 1) {
                            // 对查询参数进行编码，特别是Signature中的+号
                            const baseUrl = urlParts[0];
                            const queryString = urlParts[1];
                            // 如果Signature中包含未编码的+号，需要编码
                            const encodedQuery = queryString.replace(/Signature=([^&]+)/, (match, sig) => {
                                // 如果签名包含未编码的+号，进行编码
                                if (sig.includes('+') && !sig.includes('%2B')) {
                                    return 'Signature=' + encodeURIComponent(sig);
                                }
                                return match;
                            });
                            imageUrl = baseUrl + '?' + encodedQuery;
                        }
                    } catch (e) {
                        console.warn('URL编码处理失败，使用原始URL:', e);
                    }
                }
                
                setTimeout(() => {
                    // 添加时间戳避免缓存（但不要破坏OSS签名）
                    if (imageUrl.includes('oss-cn-beijing.aliyuncs.com')) {
                        // OSS URL不要添加时间戳，可能会破坏签名
                        img.src = imageUrl;
                    } else {
                        const separator = imageUrl.includes('?') ? '&' : '?';
                        img.src = imageUrl + separator + 't=' + Date.now();
                    }
                }, 1000);
            }
        },
        
        // 从历史记录加载图片
        async loadFromHistory(historyId) {
            try {
                const response = await axios.get(`http://127.0.0.1:8083/api/dress-history/detail/${historyId}`);
                if (response.data && response.data.success && response.data.data) {
                    const history = response.data.data;
                    this.resultImage = this.processImageUrl(history.result_image);
                    this.personImage = this.processImageUrl(history.original_image);
                    this.garmentImage = this.processImageUrl(history.garment_image);
                    
                    if (this.resultImage) {
                        this.preloadImage(this.resultImage);
                    } else {
                        this.imageLoading = false;
                    }
                }
            } catch (error) {
                console.error('从历史记录加载失败:', error);
                this.imageLoading = false;
            }
        },
        
        // 处理图片URL，确保是完整URL
        processImageUrl(url) {
            if (!url) return '';
            
            // 如果已经是完整URL，直接返回
            if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
                return url;
            }
            
            // 如果是相对路径，转换为完整URL
            if (url.startsWith('/') || url.startsWith('img/')) {
                return `http://127.0.0.1:8083/${url.startsWith('/') ? url.substring(1) : url}`;
            }
            
            return url;
        },
        
        // 保存当前结果到后端换装记录表（用于“换装记录”页面展示）
        saveToHistory() {
            // 从 sessionStorage 获取当前用户ID（若有）
            const userId = sessionStorage.getItem('userid') || null;
            
            // 确保图片URL不为空
            if (!this.resultImage) {
                console.warn('结果图片URL为空，跳过保存');
                return;
            }
            
            // 处理图片URL：如果是过长的 base64 data URL，则不发送（数据库字段限制为500字符）
            const processImageUrl = (url) => {
                if (!url) return null;
                // 如果是 base64 data URL 且超过 500 字符，则不存储
                if ((url.startsWith('data:image/') || url.startsWith('data:application/')) && url.length > 500) {
                    console.warn('Base64 data URL 过长，跳过存储:', url.length, '字符');
                    return null;
                }
                return url;
            };
            
            const payload = {
                user_id: userId ? parseInt(userId) : null,
                result_image: processImageUrl(this.resultImage),
                original_image: processImageUrl(this.personImage),
                garment_image: processImageUrl(this.garmentImage),
                clothes_id: null,
                provider: 'aliyun',
                status: 'success',
                message: null
            };

            axios.post('http://127.0.0.1:8083/api/dress-history/add', payload)
                .then((response) => {
                    if (response.data && response.data.success) {
                        console.log('换装记录已保存');
                    } else if (response.data && response.data.code === 'DRESS_LIMIT_REACHED') {
                        // 非会员换装次数达到上限，给出提示
                        showFailToast(response.data.message || '非会员换装次数已达上限，请充值会员');
                    } else {
                        console.warn('保存换装记录返回异常:', response.data);
                    }
                })
                .catch((error) => {
                    // 保存失败不影响图片显示，只记录错误
                    console.error('保存换装记录失败:', error);
                    if (error.response) {
                        console.error('错误状态码:', error.response.status);
                        console.error('错误详情:', error.response.data);
                    }
                });
        },
        
        // 下载图片
        async downloadImage() {
            if (!this.resultImage) {
                showFailToast('没有可下载的图片');
                return;
            }
            
            this.downloading = true;
            
            try {
                // 创建临时链接下载
                const link = document.createElement('a');
                link.href = this.resultImage;
                link.download = `AI换装_${Date.now()}.jpg`;
                link.target = '_blank';
                
                // 如果是跨域图片，需要先转换为blob
                if (this.resultImage.startsWith('http')) {
                    const response = await fetch(this.resultImage);
                    const blob = await response.blob();
                    const blobUrl = URL.createObjectURL(blob);
                    link.href = blobUrl;
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    // 清理blob URL
                    setTimeout(() => {
                        URL.revokeObjectURL(blobUrl);
                    }, 100);
                } else {
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
                
                showSuccessToast('图片保存成功');
            } catch (error) {
                console.error('下载失败:', error);
                showFailToast('图片保存失败，请重试');
            } finally {
                this.downloading = false;
            }
        },
        
        // 返回上一页
        goBack() {
            this.$router.go(-1);
        },
        
        // 返回换装页面
        goToDressPage() {
            this.$router.push({ name: 'Clothes' });
        },
        
        // 处理图片加载成功
        handleImageLoad() {
            this.imageLoading = false;
            this.imageError = false;
            this.imageRetryCount = 0;
        },
        
        // 重试加载图片
        retryLoadImage() {
            if (!this.resultImage) return;
            
            this.imageLoading = true;
            this.imageError = false;
            this.imageRetryCount = 0;
            
            // 处理图片URL
            const imageUrl = this.processImageUrl(this.resultImage);
            
            // 重新设置图片src
            this.$nextTick(() => {
                if (this.$refs.resultImageRef) {
                    const separator = imageUrl.includes('?') ? '&' : '?';
                    this.$refs.resultImageRef.src = imageUrl + separator + 't=' + Date.now();
                }
            });
        }
    }
};
</script>

<style scoped>
.dress-result-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f2ec 0%, #e8e3d8 100%);
    padding-bottom: 20px;
}

/* 顶部标题 */
.bt {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: relative;
}

.back-icon {
    font-size: 20px;
    color: #ae8e66;
    margin-right: 10px;
    cursor: pointer;
    padding: 5px;
}

.wrap {
    position: relative;
    font-size: 18px;
    font-weight: 600;
    color: #333;
    padding: 8px 20px;
    background: linear-gradient(135deg, #f5f2ec 0%, #e8e3d8 100%);
    border: 2px solid #ae8e66;
    border-radius: 8px;
    flex: 1;
    text-align: center;
}

.wrap_left_top,
.wrap_right_top,
.wrap_left_bottom,
.wrap_right_bottom {
    position: absolute;
    width: 8px;
    height: 8px;
    background: #ae8e66;
}

.wrap_left_top {
    top: -2px;
    left: -2px;
    border-radius: 0 0 8px 0;
}

.wrap_right_top {
    top: -2px;
    right: -2px;
    border-radius: 0 0 0 8px;
}

.wrap_left_bottom {
    bottom: -2px;
    left: -2px;
    border-radius: 0 8px 0 0;
}

.wrap_right_bottom {
    bottom: -2px;
    right: -2px;
    border-radius: 8px 0 0 0;
}

/* 结果展示区域 */
.result-section {
    margin: 20px 15px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(174, 142, 102, 0.1);
}

.result-title {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.result-image-container {
    position: relative;
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    background: #f5f5f5;
    border: 2px solid #e8e8e8;
    min-height: 300px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.result-image {
    width: 100%;
    height: auto;
    display: block;
    max-height: 70vh;
    object-fit: contain;
}

.result-image.image-error {
    opacity: 0.3;
}

.image-error-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    z-index: 10;
}

.error-text {
    font-size: 14px;
    color: #999;
}

.image-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

.loading-text {
    font-size: 14px;
    color: #ae8e66;
}

.no-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 15px;
}

.no-result-text {
    font-size: 14px;
    color: #999;
}

/* 对比展示区域 */
.compare-section {
    margin: 0 15px 20px;
    background: #fff;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 2px 12px rgba(174, 142, 102, 0.1);
}

.compare-title {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.compare-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
}

.compare-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
}

.compare-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 500;
}

.compare-image-wrapper {
    width: 100%;
    max-width: 150px;
    aspect-ratio: 3/4;
    border-radius: 12px;
    overflow: hidden;
    background: #f5f5f5;
    border: 2px solid #e8e8e8;
}

.compare-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.compare-arrow {
    flex-shrink: 0;
    color: #ae8e66;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 操作按钮区域 */
.action-section {
    margin: 0 15px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-button {
    height: 50px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(174, 142, 102, 0.3);
    transition: all 0.3s;
}

.action-button:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(174, 142, 102, 0.3);
}

.download-button {
    background: linear-gradient(135deg, #ae8e66 0%, #c9a87a 100%);
    border: none;
    color: #fff;
}

.retry-button {
    background: #fff;
    border: 2px solid #ae8e66;
    color: #ae8e66;
}

.action-button span {
    color: inherit;
}
</style>
