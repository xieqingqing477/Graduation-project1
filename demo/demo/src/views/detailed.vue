<template>
    <div class="detailed">
        <h1>详细页面</h1>
        <div class="details">
            <img :src="item.image" :alt="item.name">
            <h2>{{ item.name }}</h2>
            <p>{{ item.description }}</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            item: null
        };
    },
    mounted() {
        // 在这里根据传递的id值获取相应的数据
        const id = this.$route.params.id;
        this.item = this.getItemById(id);
    },
    methods: {
        getItemById(id) {
            // 根据id获取相应的数据，这里可以是从服务器或本地数据源获取
            // 这里只是一个示例
            const data = [
                {
                    id: 1,
                    name: "珐琅彩楼转心瓶",
                    image: require("../assets/gc5.png"),
                    description: "这是珐琅彩楼转心瓶的详细描述"
                },
                // 其他数据项...
            ];

            return data.find(item => item.id === parseInt(id));
        }
    }
};
</script>

<style scoped>
.detailed {
    text-align: center;
}

.details {
    margin-top: 20px;
}

img {
    width: 200px;
    height: 200px;
    object-fit: cover;
}
</style>
