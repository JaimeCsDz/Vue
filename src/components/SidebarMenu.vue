<template>
  <div>
    <!-- Sidebar -->
    <aside v-show="!isMobile || isSidebarOpen" class="fixed top-0 left-0 bg-white text-black p-4 shadow-xl h-full z-10"
            :class="{ 'w-64': isSidebarOpen, 'w-0': !isSidebarOpen, 'hidden': !isSidebarOpen && !isSidebarHover }"
            @mouseenter="isSidebarHover = true" @mouseleave="isSidebarHover = false">
      <!-- Contenido del sidebar -->
      <div class="p-6">
        <a href="/dashboard" class="text-black text-3xl font-semibold uppercase hover:text-gray-300">MyEvents</a>
        <router-link to="/createEvents" class="block w-full bg-white cta-btn font-semibold py-2 mt-5 rounded-br-lg rounded-bl-lg rounded-tr-lg shadow-lg hover:shadow-xl hover:bg-gray-300 items-center justify-center text-center text-black">
          <i class="fas fa-plus mr-3"></i> Nuevo evento
        </router-link>
      </div>
      <nav class="text-black text-base font-semibold pt-3">
        <a href="/dashboard" class="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
          <img src="@/assets/img/home.svg" alt="Inicio" class="w-6 h-6 mr-3" /> 
          Inicio
        </a>
        <a href="/eventos" class="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
          <img src="@/assets/img/calendar.svg" alt="Inicio" class="w-6 h-6 mr-3" /> 
          Eventos
        </a>
        <a href="/contacts" class="flex items-center text-black opacity-75 hover:opacity-100 py-4 pl-6 nav-item">
          <img src="@/assets/img/group.svg" alt="Inicio" class="w-6 h-6 mr-3" /> 
          Contactos
        </a>
      </nav>
      <a href="/perfil" class="flex items-center  pl-6 py-4">
        <img src="@/assets/img/config.svg" alt="Inicio" class="w-6 h-6 mr-3" /> 
        Perfil
      </a>
      <a @click="logout()" class="flex items-center  pl-6 py-4 cursor-pointer">
        <img src="@/assets/img/logout.svg" alt="Inicio" class="w-6 h-6 mr-3" /> 
        Cerrar sesión
      </a>
    </aside>

    <!-- Botón para mostrar/ocultar el sidebar en pantallas pequeñas -->
    <button v-show="isMobile" @click="toggleSidebar" class="md:hidden fixed top-0 right-0 p-4 z-20">
      <img src="@/assets/img/icons8-menu.svg" alt="" class="w-4 h-4 mr-3">
    </button>
</div>
</template>

<script lang="ts" setup>
import { getAuth, signOut } from 'firebase/auth'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()

const isMobile = ref(window.innerWidth <= 768)
const isSidebarOpen = ref(!isMobile.value)
const isSidebarHover = ref(false)

const logout = () => {
  const auth = getAuth() //obtiene el token del usuario logueado 
  signOut(auth) //signOut validacion de firebase
    .then(() => {
      router.push('/')
    })
    .catch((error) => {
      console.error('Error al cerrar sesión:', error)
    })
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleResize = () => {
  isMobile.value = window.innerWidth <= 768
  if (isMobile.value) {
    isSidebarOpen.value = false
  }else{
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@media (max-width: 768px) {
  .fixed {
    position: fixed !important;
    top: 0;
    left: 0;
    right: auto;
  }
}
</style>
