<template>
    <div class="home-wrapper">
        <div class="lead h-screen flex flex-col justify-center items-center">
            <h1>欢迎来到我的博客</h1>
            <p>在这里，你可以分享你的故事，也可以倾听他人的故事。</p>
        </div>
        <div class="content">
            <h2>最新文章</h2>
            <div class="articles">
                <div class="article" v-for="article in articles" :key="article.id">
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.content }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.lead{
    background-image: url('https://img-baofun.zhhainiao.com/pcwallpaper_ugc/static/6a3c529ebda0178d42e72686c934ab6f.jpg?x-oss-process=image%2fresize%2cm_lfit%2cw_1920%2ch_1080');
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-size: cover;
}
</style>