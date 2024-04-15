<template>
    <div class="relative w-full flex-grow h-screen flex flex-col">
        <SidebarMenu />
        <NavBar @search="handleSearch" />
        <div class="mt-10"> 
            <EventosItem :searchQuery="searchQuery" />
        </div>
    </div>
</template>

<script setup lang="ts">
import SidebarMenu from '@/components/SidebarMenu.vue';
import NavBar from '@/components/NavBar.vue';
import EventosItem from '@/components/EventosItem.vue';
import { ref } from 'vue';

const searchQuery = ref('');

const handleSearch = (query: string) => {
    searchQuery.value = query;
};
</script>
