<!-- CommentPage.vue -->
<template>
    <div>
        <h2>评论</h2>
        <div v-for="comment in comments" :key="comment.comment_id">
            <div>{{ comment.nickname }}</div>
            <div>{{ comment.content }}</div>
            <button @click="replyToComment(comment.comment_id)">回复</button>
            <div v-if="comment.replies.length > 0">
                <div v-for="reply in comment.replies" :key="reply.comment_id">
                    <div>{{ reply.nickname }}</div>
                    <div>{{ reply.content }}</div>
                </div>
            </div>
            <hr />
        </div>
        <form @submit.prevent="submitComment">
            <input v-model="newComment.nickname" type="text" placeholder="昵称" required />
            <textarea v-model="newComment.content" placeholder="评论内容" required></textarea>
            <button type="submit">发表评论</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            comments: [],
            newComment: {
                nickname: '',
                content: ''
            }
        };
    },
    methods: {
        fetchComments() {
            // 模拟从后端获取评论数据
            // 实际应用中，可以使用异步请求库（如 axios）向后端发送请求获取评论数据
            // 在获取到数据后将其赋值给 this.comments
            this.comments = [
                {
                    comment_id: 1,
                    nickname: 'Alice',
                    content: '这是一条评论',
                    replies: [
                        {
                            comment_id: 2,
                            nickname: 'Bob',
                            content: '谢谢你的评论'
                        }
                    ]
                }
            ];
        },
        submitComment() {
            // 模拟提交评论
            // 实际应用中，可以使用异步请求库（如 axios）将新评论的信息发送给后端进行保存
            // 在成功保存后，可以将新评论的数据添加到 this.comments 数组中
            // 清空 this.newComment 对象中的数据
            const newCommentId = this.comments.length + 1;
            const newComment = {
                comment_id: newCommentId,
                nickname: this.newComment.nickname,
                content: this.newComment.content,
                replies: []
            };
            this.comments.push(newComment);
            this.newComment.nickname = '';
            this.newComment.content = '';
        },
        replyToComment(commentId) {
            // 模拟回复评论
            // 实际应用中，可以在界面上显示一个输入框和提交按钮，用户可以输入回复内容并提交
            // 在提交回复时，将回复的内容和被回复的评论ID一起发送给后端进行保存
            // 在成功保存后，可以将回复的数据添加到对应评论的 replies 数组中
            const replyComment = this.comments.find(comment => comment.comment_id === commentId);
            if (replyComment) {
                const newReplyId = replyComment.replies.length + 1;
                const newReply = {
                    comment_id: newReplyId,
                    nickname: 'John',
                    content: '谢谢你的评论'
                };
                replyComment.replies.push(newReply);
            }
        }
    },
    mounted() {
        this.fetchComments();
    }
};
</script>
