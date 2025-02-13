<template>
    <div 
    class="header w-full  flex justify-between items-center h-12 pl-3 pr-3 fixed">
        <div class="logo font-bold text-2xl caret-amber-100">Mou1ght</div>
        <div class="category">
            <a href="/">
                <img src="../assets/home.svg">
            </a>
        </div>
        <div class="option">Option</div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.header{
    
    transition: all 0.5s ease-in-out;
    background-color: transparent;
    &:hover{
        box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);
        background-color: #B8E6FE;
    }
}
</style>