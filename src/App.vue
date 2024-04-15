<template>
  <div class="login-screen">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.login-screen {
  width: 200%;
  height: 100%; 
  display: flex;
  justify-content: center; 
  align-items: center; 
}
@media (width <= 768px) {
  .login-screen{
    width: 100%;
  height: 100%; 
  display: flex;
  justify-content: center; 
  align-items: center; 
  }
}
</style>


