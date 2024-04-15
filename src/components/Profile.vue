<template>
    <h1 class="text-center text-3xl font-bold ">Perfil</h1>
    <form class="max-w-md mx-auto mt-20">
    <div class="relative z-0 w-full mb-5 group">
        <input type="email" name="floating_email" id="floating_email" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" v-model="userData.email" required />
        <label for="floating_email" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Correo</label>
    </div>
    <div class="relative z-0 w-full mb-5 group">
        <input :type="showPassword ? 'text' : 'password'" 
        v-model="userData.password" 
        name="user_password" 
        id="password" 
        @input="limitarLongitudContraseña"
        class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
        <label for="floating_password" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Contraseña</label>
        <button 
                class="absolute right-4 top-5 bottom- transform -translate-y-1/2 text-sm text-gray-500 hover:text-gray-800 focus:outline-none"
                @click="showPassword = !showPassword" 
                type="button" v-if="userData.password.length > 0"> 
                <i v-if='!showPassword' class='fas fa-eye'></i>
                <i v-if='showPassword' class='fas fa-eye-slash'></i>  
            </button>
            <div class="relative">
            <span v-if="userData.password.length >= 12" class="text-red-600 top-0">Longitud excedida</span>
            </div>
    </div>
    
    <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" v-model="userData.name"  name="floating_first_name" id="floating_first_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_first_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Nombre</label>
        </div>
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" v-model="userData.apater" name="floating_last_name" id="floating_last_name" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_last_name" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Ap. Paterno</label>
        </div>
    </div>
    <div class="grid md:grid-cols-2 md:gap-6">
        <div class="relative z-0 w-full mb-5 group">
            <input type="text" v-model="userData.amater" name="floating_phone" id="floating_phone" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " required />
            <label for="floating_phone" class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Ap. Materno</label>
        </div>
    </div>
    <button type="submit" 
    @click.prevent="Perfil"
    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Guardar</button>
</form>

</template>

<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
    import { getAuth } from 'firebase/auth';
    import type IUsers from '@/interface/IUsers'
    import swal from 'sweetalert2'

    const userData = ref<IUsers>({
        name: '',
        amater: '',
        apater: '',
        email: '',
        password: ''
    });
    let showPassword = ref(false) 

    const limitarLongitudContraseña = () => {
    if (userData.value.password.length > 12  ) {
      userData.value.password = userData.value.password.slice(0, 12) // Limita la longitud a 12 caracteres
    }
}

    const Perfil = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser
            if (user) {
            const db = getFirestore();
            const userRef = doc(db, 'users', user.uid)
            if (!userData.value.name || !userData.value.email || !userData.value.password){
                swal.fire('no se pueden guardar datos vacios', "", "warning")
                return
            }
            swal.fire({
                    title: '¿Seguro que quieres guardar los cambios?',                
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar'
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        await setDoc(userRef, userData.value)
                        swal.fire('Datos guardados', '', 'success').then(() => {
                            window.location.href = '/perfil';
                        });
                    }else{
                        window.location.reload()
                    }
                });
            }else {
            console.error('No hay un usuario autenticado.')
            }
        } catch (error) {
            console.error('Error al guardar datos:', error)
        }
    }


    onMounted(async () => {
        try {
            const auth = getAuth()
            const user = auth.currentUser
            if (user) {
            const db = getFirestore()
            const userRef = doc(db, 'users', user.uid)
            const userDoc = await getDoc(userRef)
            if (userDoc.exists()) {
                const userDataFromFirestore = userDoc.data() as IUsers
                userData.value = {
                name: userDataFromFirestore.name,
                amater: userDataFromFirestore.amater,
                apater: userDataFromFirestore.apater,
                email: userDataFromFirestore.email,
                password: userDataFromFirestore.password
                };
            } else {
                console.error('No se encontraron datos para el usuario.')
            }
            } else {
            console.error('No hay un usuario autenticado.')
            }
        } catch (error) {
            console.error('Error al obtener datos:', error)
        }
    });
</script>
