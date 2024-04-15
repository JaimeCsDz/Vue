<template>
    <div class="mt-3"> 
            <form >
                <div class="mb-3">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Nombre</label>
                    <input type="text" id="name" v-model="name" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                </div>
                <div class="mb-4">
                    <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Correo electrónico</label>
                    <input type="email" id="email" v-model="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400">
                </div>
                <div class="mb-4">
                    <label for="comment" class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Comentario</label>
                    <textarea id="comment" v-model="comment" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"></textarea>
                </div>
                        <button class="button w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 focus:outline-none focus:shadow-outline" 
                        type="submit" @click.prevent="registerUser">Registrar</button> 
            </form>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { getAuth } from 'firebase/auth';
import { getFirestore, addDoc, collection, setDoc } from 'firebase/firestore';
import swal from 'sweetalert2'

const name = ref('');
const email = ref('');
const comment = ref('');

const generateToken = (length: any) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return token;
};

const registerUser = async () => {
    const auth = getAuth();
    const db = getFirestore();

    const currentUser = auth.currentUser;
    if (!currentUser) {
        console.error("No se encontró al usuario");
        return;
    }

    // Genera un token aleatorio
    const token = generateToken(16);

    try {
        const docRef = await addDoc(collection(db, "guests"), {
            name: name.value,
            email: email.value,
            comment: comment.value,
            userId: currentUser.uid,
            token: token,  // Guarda el token en Firestore
        });

        swal.fire("Usuario registrado", "", "success").then((result) => {
            if (result.isConfirmed) {
                window.location.href = '/contacts';
            }
        });

        // Enviar correo electrónico de bienvenida con el enlace de confirmación
        const response = await fetch('http://localhost:3000/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                subject: 'Bienvenido al grupo de trabajo',
                html: `
                    <html>
                        <head>
                            <style>
                                /* Estilos aquí */
                                body {
                                    font-family: Arial, sans-serif;
                                    background-color: #f4f4f4;
                                    padding: 20px;
                                }
                                h1 {
                                    color: #333;
                                }
                                p {
                                    color: #555;
                                }
                                .container {
                                    background-color: #fff;
                                    padding: 20px;
                                    border-radius: 5px;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                                }
                                a {
                                    color: #007BFF;
                                    text-decoration: none;
                                }
                                .footer {
                                    margin-top: 20px;
                                    font-size: 12px;
                                    color: #777;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>¡Bienvenido, ${name.value}!</h1>
                                <p>Gracias por unirte a nuestro grupo de trabajo. Nos complace tenerte a bordo.</p>
                                <p>Por favor, confirma tu correo electrónico haciendo clic en el siguiente enlace:</p>
                                <p><a href="http://localhost:5173/tokenview?token=${token}" target="_blank">Confirmar correo electrónico</a></p>
                            </div>
                            <div class="footer">
                                <p>Este es un correo automático, por favor no respondas a este correo.</p>
                            </div>
                        </body>
                    </html>
                `
            }),
        });

        if (!response.ok) {
            console.error('Error al enviar el correo:', await response.text());
            swal.fire("Error", "Hubo un error al enviar el correo", "error");
            return;
        }

        const data = await response.json();
        console.log('Correo enviado con éxito:', data);
        swal.fire("Correo enviado", "El correo fue enviado con éxito", "success");
    } catch (error) {
        console.error("Error registrando usuario:", error);
        swal.fire("Error", "Hubo un error al registrar al usuario", "error");
    }
};


</script>