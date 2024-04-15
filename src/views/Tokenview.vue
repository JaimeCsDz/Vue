<template>
  <div>
    <h1>Verificación de correo electrónico</h1>
    <p v-if="loading">Verificando...</p>
    <p v-else-if="error">Error en la verificación: {{ error }}</p>
    <p v-else>Correo electrónico verificado con éxito. ¡Gracias!</p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { verifyEmailToken } from '@/services/authService';


    const loading = ref(true);
    const error = ref(null);
    const route = useRoute(); // Utiliza useRoute para acceder a la ruta

    onMounted(async () => {
      try {
        const token = route.query.token; // Obtén el token de la URL
        if (!token) {
          throw new Error('Token no válido.');
        }

        // Llama a la función para verificar el token
        await verifyEmailToken(token);

        loading.value = false; // Verificación exitosa
      } catch (error: any) {
        error.value = error.message;
        loading.value = false; // Hubo un error en la verificación
      }
    });
</script>
