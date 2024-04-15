<template>
    <div class="flex h-screen">
        <div class="m-auto bg-white shadow-lg rounded-3xl overflow-hidden md:flex h-4/5  max-w-screen-md">
            <img class="w-full md:w-1/2 object-cover" src="../assets/img/login2.jpg" alt="imagen">
            <div class="w-full md:w-1/2 p-8 bg-98A6DA">
                <h1 class="text-black text-3xl font-bold text-center mb-6">Registrate.</h1>
                <form>
                    <!-- Campo de Nombre -->
                    <div class="field mb-4">
                        <label for="username" class="sr-only">Nombre</label>
                        <div class="relative">
                            <input class="input w-full p-2 pl-10 text-sm leading-tight text-gray-700 border rounded-xl shadow appearance-none focus:outline-none focus:shadow-outline" 
                                name="username" type="text" placeholder="Nombre" id="username" v-model="name">
                            <i class="absolute top-2.5 left-0 flex items-center pl-3 h-full text-gray-600 fas fa-user"></i>
                        </div>
                    </div>
                    <!-- Campo de Apellido Paterno -->
                    <div class="field mb-4">
                        <label for="lastname" class="sr-only">Apellido paterno</label>
                        <div class="relative">
                            <input class="input w-full p-2 pl-10 text-sm leading-tight text-gray-700 border rounded-xl shadow appearance-none focus:outline-none focus:shadow-outline" 
                                name="lastname" type="text" placeholder="Apellido paterno" id="lastname" v-model="apater">
                            <i class="absolute top-2.5 left-0 flex items-center pl-3 h-full text-gray-600 fas fa-user"></i>
                        </div>
                    </div>

                    <!-- Campo de Apellido Materno -->
                    <div class="field mb-4">
                        <label for="lastname2" class="sr-only">Apellido materno</label>
                        <div class="relative">
                            <input class="input w-full p-2 pl-10 text-sm leading-tight text-gray-700 border rounded-xl shadow appearance-none focus:outline-none focus:shadow-outline" 
                                name="lastname2" type="text" placeholder="Apellido materno" id="lastname2" v-model="amater">
                            <i class="absolute top-2.5 left-0 flex items-center pl-3 h-full text-gray-600 fas fa-user"></i>
                        </div>
                    </div>

                    <!-- Campo de Correo -->
                    <div class="field mb-4">
                        <label for="email" class="sr-only">Correo</label>
                        <div class="relative">
                            <input class="input w-full p-2 pl-10 text-sm leading-tight text-gray-700 border rounded-xl shadow appearance-none focus:outline-none focus:shadow-outline" 
                                name="email" type="text" placeholder="Correo" id="email" v-model="email">
                            <i class="absolute top-2.5 left-0 flex items-center pl-3 h-full text-gray-600 fas fa-envelope"></i>
                        </div>
                    </div>

                    <!-- Campo de Contraseña -->
                    <div class="field mb-4">
                        <label for="password" class="sr-only">Password</label>
                        <div class="relative">
                            <input class="input w-full p-2 pl-10 text-sm leading-tight text-gray-700 border rounded-xl shadow appearance-none focus:outline-none focus:shadow-outline"
                                name="user_password" type="password" placeholder="Contraseña" id="password" v-model="pass">
                            <i class="absolute top-2.5 left-0 flex items-center pl-3 h-full text-gray-600 fas fa-key"></i>
                        </div>
                    </div>

                    <div class="field mb-6">
                        <button class="button w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" 
                            type="submit" @click.prevent="registerUser">Registrarse</button>
                    </div>
                    <div class="text-center">
                        <h5 class="text-black">¿Ya tienes una cuenta?
                            <router-link class="inline-block text-sm text-blue-700 hover:text-black" to="/">Inicia sesión.</router-link>                          
                        </h5> 
                    </div>
                </form>
            </div>
        </div>  
    </div>
</template>



<script lang="ts" setup>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirestore, doc, setDoc, collection, getDocs, where, query } from 'firebase/firestore'
import swal from 'sweetalert2'

const name = ref('');
const apater = ref('');
const amater = ref('');
const email = ref('');
const pass = ref('');

const registerUser = async () => {
    const auth = getAuth();
    const db = getFirestore();
    try {
        if (!validarEmail(email.value)) {
            swal.fire('Formato de correo electrónico inválido.', "", "warning")
            return
        }
        const existingUser = await correoExist(email.value)
        if (existingUser) {
            swal.fire('El correo electrónico ya está en uso.',"", "error")
            return
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, pass.value)
        await updateProfile(userCredential.user, { displayName: name.value })
        // Guardar los datos del usuario en Firestore
        await setDoc(doc(db, 'users', userCredential.user.uid), {
            name: name.value,
            apater: apater.value,
            amater: amater.value,
            email: userCredential.user.email,
            password: pass.value
        });
        swal.fire('Usuario registrado correctamente',"", "success").then(()=>{
            window.location.href = '/dashboard'
        })
    } catch (error: any) {
        // Manejar errores específicos de Firebase
        if (error.code === 'auth/weak-password') {
            swal.fire('La contraseña es vulnerable.', "", "warning")
        } else {
            swal.fire('Error al registrar el usuario.', "", "error")
        }
    }
};

const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
};

const correoExist = async (email: string) => {
    const db = getFirestore()
    const usersRef = collection(db, 'users')
    const Q = query(usersRef, where('email', '==', email))
    const querySnapshot = await getDocs(Q)
    return querySnapshot.empty ? null : querySnapshot.docs[0].data()
};

</script>
