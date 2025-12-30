<template>
    <div>
        <van-nav-bar title="文物信息管理" left-text="返回" right-text="按钮" left-arrow @click-left="onClickLeft"
            @click-right="onClickRight" />
        <div class="filters">
            <label>朝代：</label>
            <select v-model="filterDynasty">
                <option value="">全部</option>
                <option value="夏">夏</option>
                <option value="商">商</option>
                <option value="西周">西周</option>
                <option value="东周(春秋、战国)">东周(春秋、战国)</option>
                <option value="秦">秦</option>
                <option value="西楚">西楚</option>
                <option value="西汉">西汉</option>
                <option value="新朝">新朝</option>
                <option value="玄汉">玄汉</option>
                <option value="东汉">东汉</option>
                <option value="三国时期(魏、蜀、吴)">三国时期(魏、蜀、吴)</option>
                <option value="晋(西晋、东晋)">晋(西晋、东晋)</option>
                <option value="南北朝[南朝(宋、齐、梁、陈)、北朝(北魏、东魏、西魏、北齐、北周)]">南北朝</option>
                <option value="隋">隋</option>
                <option value="唐">唐</option>
                <option value="五代(后梁、后唐、后晋、后汉、后周)">五代</option>
                <option value="十国[前蜀、后蜀、南吴、南唐、吴越、闽国、南楚、南汉、南平、北汉]">十国</option>
                <option value="宋(北宋、南宋)">宋(北宋、南宋)</option>
                <option value="辽">辽</option>
                <option value="西夏">西夏</option>
                <option value="金">金</option>
                <option value="元">元</option>
                <option value="明">明</option>
                <option value="清">清</option>
                <option value="中华民国">中华民国</option>
                <option value="中华人民共和国">中华人民共和国</option>
            </select>
            <br>
            <label>I D：</label>
            <input type="text" v-model="filterId">
            <br>
            <label>名称：</label>
            <input type="text" v-model="filterName">
        </div>

        <button @click="toggleAddForm">新增</button>


        <table class="records-table">
            <thead>
                <tr>
                    <th></th>
                    <th>文物ID</th>
                    <th>文物名称</th>
                    <th>文物图片</th>
                    <th>文物描述</th>
                    <th>文物朝代</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="record in filteredRecords" :key="record.id">
                    <td><input type="checkbox" v-model="selectedItems" :value="record.id"></td>
                    <td>{{ record.id }}</td>
                    <td>{{ record.name }}</td>
                    <td>
                        <img :src="record.image" class="wimg" @click="showPreview(record.image)">
                    </td>
                    <td>{{ record.description }}</td>
                    <td>{{ record.dynasty }}</td>
                    <td>
                        <button @click="editRecord(record)">编辑</button>
                        <button @click="deleteRecord(record)">删除</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <button @click="deleteSelected">批量删除</button>
        <div class="preview-modal" v-show="showModal">
            <div class="preview-content">
                <img :src="previewImage" class="preview-image">
                <button @click="hidePreview">关闭</button>
            </div>
        </div>
        <!-- 遮罩层 -->
        <div v-if="showAddForm" class="overlay">
            <div class="add-form">
                <h3>新增文物</h3>
                <form @submit.prevent="addNewRecord">
                    <label>文物名称：</label>
                    <input type="text" v-model="newRecord.name" required>

                    <label for="image">图片:</label>
                    <input type="file" id="image" @change="handleImageUpload" accept="image/*" required>

                    <label>文物描述：</label>
                    <textarea v-model="newRecord.description" required></textarea>

                    <label>文物朝代：</label>
                    <select v-model="newRecord.dynasty" required>
                        <option value="夏">夏</option>
                        <option value="商">商</option>
                        <option value="西周">西周</option>
                        <option value="东周(春秋、战国)">东周</option>
                        <option value="秦">秦</option>
                        <option value="西楚">西楚</option>
                        <option value="西汉">西汉</option>
                        <option value="新朝">新朝</option>
                        <option value="玄汉">玄汉</option>
                        <option value="东汉">东汉</option>
                        <option value="三国时期(魏、蜀、吴)">三国时期</option>
                        <option value="晋(西晋、东晋)">晋</option>
                        <option value="南北朝[南朝(宋、齐、梁、陈)、北朝(北魏、东魏、西魏、北齐、北周)]">南北朝</option>
                        <option value="隋">隋</option>
                        <option value="唐">唐</option>
                        <option value="五代(后梁、后唐、后晋、后汉、后周)">五代</option>
                        <option value="十国[前蜀、后蜀、南吴、南唐、吴越、闽国、南楚、南汉、南平、北汉]">十国</option>
                        <option value="宋(北宋、南宋)">宋(北宋、南宋)</option>
                        <option value="辽">辽</option>
                        <option value="西夏">西夏</option>
                        <option value="金">金</option>
                        <option value="元">元</option>
                        <option value="明">明</option>
                        <option value="清">清</option>
                        <option value="中华民国">中华民国</option>
                        <option value="中华人民共和国">中华人民共和国</option>
                    </select>

                    <button type="submit">保存</button>
                    <button @click="cancelAdd">取消</button>
                </form>
            </div>
        </div>
        <div class="mask" v-show="showMask">
            <div class="form-container">
                <h2>编辑文物</h2>
                <form @submit.prevent="saveRecord">
                    <label for="name">名称:</label>
                    <input type="text" id="name" v-model="editedRecord.name" required>
                    <label for="description">描述:</label>
                    <textarea id="description" v-model="editedRecord.description" required></textarea>
                    <label for="dynasty">朝代:</label>
                    <input type="text" id="dynasty" v-model="editedRecord.dynasty" required>
                    <label for="image">图片:</label>
                    <input type="file" id="image" @change="handleImageUpload" accept="image/*" required>
                    <button type="submit">保存</button>
                    <button @click="cancelEdit">取消</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            records: [
                {
                    id: 1,
                    name: "珐琅彩楼转心瓶",
                    image: require("../../assets/gc5.png"),
                    dynasty: '清',
                    description: '暂无'
                },
                {
                    id: 2,
                    name: "画珐琅兽面纹",
                    image: require("../../assets/gc2.png"),
                    dynasty: '清',
                    description: '暂无'
                },
                {
                    id: 3,
                    name: "掐丝珐琅兽面纹出戟",
                    image: require("../../assets/gc3.png"),
                    dynasty: '清',
                    description: '暂无'
                },
                {
                    id: 4,
                    name: "康熙款画珐琅莲瓣式盘",
                    image: require("../../assets/tc4.png"),
                    dynasty: '清',
                    description: '暂无'
                },
                {
                    id: 5,
                    name: "银錾刻团花纹委角盒",
                    image: require("../../assets/gc6.png"),
                    dynasty: '清',
                    description: '暂无'
                },
                {
                    id: 6,
                    name: "乾隆款红漆描金丹凤牡丹纹银里撇口碗",
                    image: require("../../assets/gc7.png"),
                    dynasty: '清',
                    description: '暂无'
                },
                {
                    id: 7,
                    name: "冬青釉兔形香熏",
                    image: require("../../assets/cq3.png"),
                    dynasty: '清',
                    detailed: ''
                },
                {
                    id: 8,
                    name: "嘉靖款五彩鱼藻纹盖罐",
                    image: require("../../assets/cq1.png"),
                    dynasty: '清',
                    detailed: ''
                },
                {
                    id: 9,
                    name: "万历款青花五彩鱼藻纹蒜头瓶",
                    image: require("../../assets/cq2.png"),
                    dynasty: '清',
                    detailed: ''
                },
                {
                    id: 10,
                    name: "康熙款画珐琅莲瓣式盘",
                    image: require("../../assets/tc4.png"),
                    dynasty: '清',
                    detailed: ''
                },
                {
                    id: 11,
                    name: "祭红釉粉彩梅竹图瓶",
                    image: require("../../assets/tc5.png"),
                    dynasty: '清',
                    detailed: ''
                },
                {
                    id: 12,
                    name: "乾隆款珐琅彩花卉纹瓶",
                    image: require("../../assets/tc6.png"),
                    dynasty: '清',
                    detailed: ''
                }
                // 其他文物数据...
            ],
            selectedItems: [], // 用于存储选中的文物ID
            filterDynasty: '', // 朝代筛选条件
            filterId: '', // ID筛选条件
            filterName: '', // 文物名称筛选条件
            showAddForm: false, // 控制新增文物表单的显示与隐藏
            newRecord: { // 存储新增文物的数据
                name: '',
                imageFile: null, // 添加新的属性imageFile
                image: '',
                description: '',
                dynasty: ''
            },
            showModal: false,
            previewImage: '',
            showMask: false,
            editedRecord: {
                id: null,
                name: '',
                description: '',
                dynasty: '',
                image: null
            }
        };
    },
    computed: {
        filteredRecords() {
            return this.records.filter(record => {
                const matchDynasty = this.filterDynasty === '' || record.dynasty === this.filterDynasty;
                const matchId = this.filterId === '' || record.id.toString().includes(this.filterId);
                const matchName = this.filterName === '' || record.name.includes(this.filterName);

                return matchDynasty && matchId && matchName;
            });
        },
        getDistinctDynasties() {
            const dynasties = new Set();
            this.records.forEach(record => dynasties.add(record.dynasty));
            return Array.from(dynasties);
        }
    },
    methods: {
        showPreview(imageUrl) {
            this.previewImage = imageUrl;
            this.showModal = true;
        },
        hidePreview() {
            this.showModal = false;
        },
        toggleAddForm() {
            this.showAddForm = true;
        },
        cancelAdd() {
            this.showAddForm = false;
            this.resetForm();
        },
        resetForm() {
            this.newRecord = {
                name: '',
                image: '',
                description: '',
                dynasty: ''
            };
        },
        addNewRecord() {
            const newRecord = {
                id: this.records.length + 1,
                name: this.newRecord.name,
                image: this.newRecord.image,
                description: this.newRecord.description,
                dynasty: this.newRecord.dynasty
            };

            this.records.push(newRecord);
            this.cancelAdd();
        },
        viewRecord(record) {
            console.log('查看文物：', record);
        },
        deleteRecord(record) {
            const index = this.records.indexOf(record);
            if (index !== -1) {
                this.records.splice(index, 1);
            }
        },
        deleteSelected() {
            for (const id of this.selectedItems) {
                const record = this.records.find(r => r.id === id);
                if (record) {
                    this.deleteRecord(record);
                }
            }
            this.selectedItems = [];
        },
        onClickLeft() {
            this.$router.go(-1);
        },
        onClickRight() {
            Toast('按钮');
        },
        editRecord(record) {
            this.showMask = true;
            this.editedRecord.id = record.id;
            this.editedRecord.name = record.name;
            this.editedRecord.description = record.description;
            this.editedRecord.dynasty = record.dynasty;
            this.editedRecord.image = null;
        },
        saveRecord() {
            this.cancelEdit();
        },
        cancelEdit() {
            this.showMask = false;
            this.editedRecord.id = null;
            this.editedRecord.name = '';
            this.editedRecord.description = '';
            this.editedRecord.dynasty = '';
            this.editedRecord.image = null;
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            const imageUrl = URL.createObjectURL(file); // 创建临时的图片URL
            this.newRecord.image = imageUrl; // 将临时的图片URL赋值给newRecord.image
            this.newRecord.imageFile = file; // 将上传的图片文件赋值给newRecord.imageFile

            // this.editedRecord.image = imageUrl;
            // this.editedRecord.imageFile = file;
        }
    }
};
</script>

<style>
/* CSS */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.form-container {
    background-color: #fff;
    padding: 20px;
    width: 400px;
    text-align: center;
}

/* 其他样式 */

/* CSS */
.preview-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.preview-content {
    background-color: #fff;
    padding: 20px;
    max-width: 80%;
    max-height: 80%;
    text-align: center;
}

.preview-image {
    max-width: 100%;
    max-height: 100%;
}

/* 其他样式 */

.records-table {
    border-collapse: collapse;
    width: 100%;
}

.records-table th,
.records-table td {
    border: 1px solid #ccc;
    padding: 8px;
}

.records-table th {
    background-color: #f2f2f2;
}

.filters {
    margin-bottom: 10px;
}

.filters label {
    margin-right: 5px;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.add-form {
    background-color: #fff;
    padding: 20px;
    border-radius: 5px;
}

.add-form h3 {
    margin-top: 0;
    margin-bottom: 10px;
}

.add-form form label {
    display: block;
    margin-bottom: 5px;
}

.add-form form input,
.add-form form textarea {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
}

.add-form form button {
    margin-right: 5px;
}

.wimg {
    width: 50px;
}
</style>
