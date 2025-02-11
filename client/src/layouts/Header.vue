<template>
    <div 
    class="header w-full bg-sky-200 flex justify-between items-center h-12 pl-3 pr-3 fixed">
        <div class="logo font-bold text-2xl caret-amber-100">Mou1ght</div>
        <div class="category">
            <a href="/">首页</a>
        </div>
        <div class="option">Option</div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.header{
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    &:hover{
        opacity: 1;
    }
}
</style>