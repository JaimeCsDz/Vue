<template>
  <div class="relative w-full flex-grow h-screen flex flex-col">
    <SidebarMenu />
      <div class="mt-8 relative z-0">
      <Calendar />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SidebarMenu from '@/components/SidebarMenu.vue';
import Calendar from '@/components/CalendarItem.vue'
</script>