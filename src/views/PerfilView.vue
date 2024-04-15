<template>
    <div class="relative w-full flex-grow h-screen flex flex-col">
        <SidebarMenu />
        <div class="mt-10"> 
            <Profile />
        </div>
    </div>
</template>
<script lang="ts" setup>
    import SidebarMenu from '@/components/SidebarMenu.vue';
    import Profile from '@/components/Profile.vue'

</script>

<style scoped></style>
