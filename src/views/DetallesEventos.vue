<template>
    <div class="relative w-full flex-grow h-screen flex flex-col">
        <SidebarMenu />
        <NavBar />
        <div class="mt-10"> 
            <DetallesItem />
        </div>
    </div>
</template>
<script lang="ts" setup>
import SidebarMenu from '@/components/SidebarMenu.vue';
import NavBar from '@/components/NavBar.vue';
import DetallesItem from '@/components/DetallesItem.vue';
</script>
