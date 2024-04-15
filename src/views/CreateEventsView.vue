<template>
    <div class="relative w-full flex-grow h-screen flex flex-col">
      <SidebarMenu />
      <NavBar />
      <div class="mt-10"> 
          <NewEventCards />
      </div>
    </div>
  </template>
  
<script lang="ts" setup>
import SidebarMenu from '@/components/SidebarMenu.vue';
import NavBar from '@/components/NavBar.vue';
import NewEventCards from '@/components/NewEventCards.vue';
</script>