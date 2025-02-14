<template>
    <div class="home-wrapper">
        <div class="lead h-screen flex flex-col justify-center items-center">
            <h1>欢迎来到我的博客</h1>
            <p>在这里，你可以分享你的故事，也可以倾听他人的故事。</p>
        </div>
        <div class="content">
            <h2>最新文章</h2>
            <div class="articles">
                <div class="article">
                    <div class="thumb">
                        <img src="" alt="哪吒">
                    </div>
                    <div class="t">
                        <div class="title">
                            <h3>article.title </h3>
                        </div>
                        <div class="intro">
                            <p>article.content </p>
                        </div>
                    </div>

                </div>
                <div class="article">
                    <h3>article.title </h3>
                    <p>article.content </p>
                </div>
                <div class="article">
                    <h3> article.title </h3>
                    <p>article.content </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>

<style scoped>
.lead {
    background-image: url('https://img-baofun.zhhainiao.com/pcwallpaper_ugc/static/6a3c529ebda0178d42e72686c934ab6f.jpg?x-oss-process=image%2fresize%2cm_lfit%2cw_1920%2ch_1080');
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: fixed;
    background-size: cover;
    backdrop-filter: blur(5px);
}

.articles {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
}

.article {
    width: 40%;
    margin: 20px;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-around;
}
</style>