<template>
    <div class="flex min-h-screen">
        <div class="m-auto bg-white shadow-lg rounded-lg overflow-hidden md:flex w-full max-w-6xl">
            <div class="w-full md:w-2/4 bg-344687 text-white flex items-center justify-center p-12 text-center md:text-left">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="150" height="300" viewBox="0,0,256,256">
                <g fill="#ffffff" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(8.53333,8.53333)"><path d="M15,2c-3.85433,0 -7,3.14567 -7,7v2h-2c-1.105,0 -2,0.895 -2,2v12c0,1.105 0.895,2 2,2h18c1.105,0 2,-0.895 2,-2v-12c0,-1.105 -0.895,-2 -2,-2h-2v-2c0,-3.72842 -2.96342,-6.73143 -6.64453,-6.92773c-0.11309,-0.04556 -0.23356,-0.07005 -0.35547,-0.07227zM15,4c2.77367,0 5,2.22633 5,5v2h-10v-2c0,-2.77367 2.22633,-5 5,-5z"></path></g></g>
                </svg>
            </div>

            <!-- Formulario de inicio de sesión -->
            <div class="w-full md:w-1/2 p-8">
                <div class="mb-4">
                    <h1 class="text-black text-3xl font-bold text-center mb-6">Bienvenido de nuevo!</h1>
                    <form @submit.prevent="AuthUser()">
                        <!-- Email Input -->
                        <div class="field mb-4">
                            <label for="username" class="sr-only">Correo</label>
                            <input class="input w-full p-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline" 
                                name="username" type="text" placeholder="Correo" id="username" v-model="email" @input="clearEmailError()">
                                <span v-if="emailError" class="text-red-500 text-xs">{{ emailError }}</span>
                        </div>
                        <div class="field mb-4 relative">
                            <label for="password" class="sr-only">Contraseña</label>
                            <input 
                                :type="showPassword ? 'text' : 'password'"
                                class="input w-full p-2 text-sm leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                name="user_password" 
                                placeholder="Contraseña" 
                                id="password" 
                                v-model="password" @input="limitarLongitudContraseña">
                            <button 
                                class="absolute right-4 top-5 bottom- transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none"
                                @click="showPassword = !showPassword" 
                                type="button" v-if="password.length > 0"> 
                                <i v-if='!showPassword' class='fas fa-eye'></i>
                                <i v-if='showPassword' class='fas fa-eye-slash'></i>  
                            </button>
                            <div class="relative">
                            <span v-if="password.length >= 12" class="text-red-600 top-0">Longitud excedida</span>
                            </div>
                        </div>
                        <!-- Submit Button -->
                        <div class="field mb-6">
                            <button class="button w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" 
                                type="submit"  :disabled="!camposCompletos()">Iniciar sesión.</button>
                        </div>
                        <div class="text-center">
                            <h5 class="text-black">¿Aún no tienes cuenta?
                                <router-link class="inline-block text-sm text-blue-500 hover:text-blue-800" to="/registro">Registrate aquí.</router-link>                          
                            </h5> 
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
    import swal from 'sweetalert2'

    let email = ref('')
    let password = ref('')
    let emailError = ref('')
    let showPassword = ref(false) 

    const AuthUser = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email.value, password.value)
        .then((userCredential) => {
            window.location.href = '/dashboard';
        })
        .catch((error) => {
            swal.fire('Correo o contraseña incorrecta', "", "error");
        });
}
const limitarLongitudContraseña = () => {
    if (password.value.length > 12  ) {
      password.value = password.value.slice(0, 8) // Limita la longitud a 8 caracteres
    }
}

    //desabilitar boton enviar si los campos estan vacios
    const camposCompletos = () => {
        return email.value && password.value;
    }

    // Función para validar el formato del correo electrónico
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(String(email).toLowerCase())
    }

    //Limpiar el error cuando se vuelve a escribir
    const clearEmailError = () => {
        emailError.value = ''
    }
</script>