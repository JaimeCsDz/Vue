<template>
  <nav class="text-black text-base font-semibold pt-2 navbar">
      <div class="relative pr-4">
          <input type="text" v-model="searchQuery" @input="searchEvents" class="w-full bg-gray-200 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-white" placeholder="Buscar...">
          <button type="submit" class="absolute right-0 top-0 mt-3 mr-8">
              <svg class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg>
          </button>
          
      </div>
  </nav>  
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  const searchQuery = ref('');
  const emit = defineEmits()
  const searchEvents = () => {
    emit('search', searchQuery.value);
  };
</script>


<style>
.navbar {
  @apply w-full max-w-3xl mx-auto; 
}
</style>

