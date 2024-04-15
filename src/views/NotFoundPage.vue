<template>
<div class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
            <div class="xl:pt-24 w-full xl:w-1/2 relative pb-12 lg:pb-0">
                <div class="relative">
                    <div class="absolute">
                        <div class="">
                            <h1 class="my-0 text-gray-800 font-bold text-2xl">
                                ¡Ups! Parece que has encontrado una vista a la nada.
                            </h1>
                            <p class="my-5 text-gray-800">¡Lo lamento! Visite nuestra página de inicio para llegar a donde necesitas ir.</p>
                            <button class="sm:w-full lg:w-auto my-2 border rounded md py-4 px-6 text-center bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-700 focus:ring-opacity-50" @click="regresar">Regresar</button>
                        </div>
                    </div>
                    <div>
                        <img src="https://i.ibb.co/G9DC8S0/404-2.png" />
                    </div>
                </div>
            </div>
            <div>
                <img src="https://i.ibb.co/ck1SGFJ/Group.png" />
            </div>
        </div>
</template>
<script lang="ts" setup>
import router from '@/router';

const regresar = () =>{
    router.push('/')
}
</script>

<style scoped></style>