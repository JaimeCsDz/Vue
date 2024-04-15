<template>
    <div class="relative w-full flex-grow h-screen flex flex-col">
        <SidebarMenu />
        <NavBar  @search="handleSearch"/>
        <div class="mt-10"> 
            <invitacion :searchQuery="searchQuery"/>
        </div>
    </div>
</template>

<script lang="ts" setup>
import SidebarMenu from '@/components/SidebarMenu.vue';
import NavBar from '@/components/NavBarInv.vue';
import invitacion from '@/components/invitacion.vue';
import { ref } from 'vue';

const searchQuery = ref('');

const handleSearch = (query: string) => {
    searchQuery.value = query;
}
</script>