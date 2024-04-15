<template>
    <div class="bg-white rounded-lg shadow-md p-6">
        <input type="text" placeholder="Agregar título" class="focus:outline-none" v-model="evento.title"/>
        <hr class="border-b border-blue-500 w-full mb-4">  

        <label class="flex items-center mb-5">
            <input type="date" v-model="evento.date" >
            <input class="mx-9" type="time" v-model="evento.hour" >
        </label>
        <router-link to="#" class="flex items-center mb-5" @click="mostrarSelect" v-model="guests">  
            <img src="@/assets/img/group.svg" class="w-5 mr-2"></img>
            Agregar invitados
        </router-link>

        <select v-if="mostrarSelectorInvitados" v-model="invitadosSeleccionados" multiple >
            <option v-for="invitado in invitados" :key="invitado.id" :value="invitado">{{ invitado.name }}</option>
        </select>

        <div class="mb-5">
            <label class="flex items-center text-center">Invitados:</label>
            <ul>
                <li v-for="invitado in evento.guests" :key="invitado.name">{{ invitado.name }} <button @click.prevent="eliminarInv(evento.id, invitado.name)" ><i class="fa-solid fa-x text-red-600 ml-1"></i></button></li>
            </ul>
        </div>

        <textarea placeholder="Agregar descripción o comentarios." class="
            border border-gray-300 rounded-md p-4 w-full text-base
            focus:border-blue-500 focus:outline-none mt-4" style="overflow: hidden;" v-model="evento.description">
        </textarea>

        
        <div class="flex justify-center">
            <button class="pt-3 mt-2 mx-5 bg-green-600 text-white font-bold py-3 px-10 rounded-full flex" @click="Editar(evento.id)" >
                <span>Guardar</span>
            </button>
            <button class="pt-3 mt-2 bg-red-600 text-white font-bold py-3 px-10 rounded-full flex" @click="borrar(evento.id)" >
                <span>Eliminar</span>
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, type Ref } from 'vue';
    import { useRoute } from 'vue-router';
    import { getFirestore, getDoc, collection, doc,  updateDoc, deleteDoc, query, where, getDocs} from 'firebase/firestore';
    import type IEvent from '@/interface/IEvent';
    import swal from 'sweetalert2'
    import { getAuth } from 'firebase/auth';
    import type IGuests from '@/interface/IGuests';

    const guests = ref([])
    const route = useRoute();
    const eventoId = route.params.id;
    const evento = ref<IEvent>({id: '', title: '', date: '', hour: '', description: '', guests: [], userId: '' });

    onMounted(async () => {
    try {
        const db = getFirestore();
        if (typeof eventoId === 'string') {
            const docRef = doc(db, 'events', eventoId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                evento.value = { id: docSnap.id, ...docSnap.data() } as IEvent;
            } else {
                console.log('No such document!');
            }
        } else {
            console.error('Error: eventoId debe ser una cadena.');
        }
    } catch (error) {
        console.error('Error al obtener el evento:', error);
    }
})
const Editar = async (id: string) => {
    try {
        const db = getFirestore();
        const eventoRef = collection(db, 'events');
        if (typeof id === 'string') {
            let invitadoDuplicado = false;

            invitadosSeleccionados.value.forEach((invitado: IGuests) => {
                if (agregarInvitado(invitado)) {
                    invitadoDuplicado = true;
                }
            });

            if (!invitadoDuplicado) {
                // Obtén la lista de invitados actual del evento
                const invitadosActuales = [...evento.value.guests];
                
                // Agrega los nuevos invitados seleccionados a la lista actual
                invitadosSeleccionados.value.forEach((invitado: IGuests) => {
                    if (!invitadosActuales.some(g => g.id === invitado.id)) {
                        invitadosActuales.push(invitado);
                    }
                });
                

                swal.fire({
                    title: '¿Seguro que quieres guardar los cambios?',                
                    icon: 'warning',
                    showCancelButton: true,
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Guardar',
                    cancelButtonText: 'Cancelar'
                }).then(async(result) => {
                    if (result.isConfirmed) {
                        await updateDoc(doc(eventoRef, id), {
                            title: evento.value.title,
                            date: evento.value.date,
                            hour: evento.value.hour,
                            description: evento.value.description,
                            guests: invitadosActuales,
                        });
                        swal.fire('Evento actualizado', '', 'success').then(() => {
                            window.location.href = '/eventos';
                        });
                    }else{
                        window.location.reload()
                    }
                })
            }
        } else {
            console.error('Error: eventoId debe ser una cadena.');
        }
    } catch (error) {
        console.error('Error al actualizar el evento:', error);
    }
}


const agregarInvitado = (invitado: IGuests): boolean => {
    const invitadoExistente = evento.value.guests.some(g => g.name === invitado.name);
    
    console.log('ID del invitado que intenta agregar:', invitado.documentId);
    console.log('IDs de los invitados existentes en la lista:');
    evento.value.guests.forEach(g => console.log(g.id));

    if (!invitadoExistente) {
        evento.value.guests.push(invitado);
        return false; 
    } else {
        swal.fire({
            title: 'Error',
            text: 'No puedes agregar al mismo usuario dos veces.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return true;
    }
};

const eliminarInv = async (eventId: string, name: string) => {
    try {
        const db = getFirestore();
        const eventoRef = doc(db, 'events', eventId);
        const eventoSnap = await getDoc(eventoRef);
        
        if (eventoSnap.exists()) {
            const eventoData = eventoSnap.data();
            if (eventoData && eventoData.guests) {
                const nuevosInvitados = eventoData.guests.filter((invitado: any) => invitado.name !== name);
                await updateDoc(eventoRef, { guests: nuevosInvitados });
                // Actualizar el estado local después de eliminar el invitado
                evento.value.guests = nuevosInvitados;
                swal.fire('Invitado eliminado', '', 'success');
            } else {
                swal.fire('Error', 'No se encontraron invitados en el evento', 'error');
            }
        } else {
            swal.fire('Error', 'El evento no existe', 'error');
        }
    } catch (error) {
        console.error(error);
        swal.fire('Error', 'Ocurrió un error al eliminar el invitado', 'error');
    }
};


const borrar = async (eventsId: string) => {
    try {
        swal.fire({
            title: '¿Seguro que quieres eliminar el evento?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonColor: '#d33',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const db = getFirestore();
                const docu = doc(db, 'events', eventsId);
                await deleteDoc(docu);

                swal.fire('Evento eliminado', '', 'success').then(() => {
                    window.location.href = '/eventos';
                });
            }
        });
    } catch (error) {
        console.error(error);
    }
};


const invitados: Ref<IGuests[]> = ref([]);
const invitadosSeleccionados: Ref<IGuests[]> = ref([]);
const mostrarSelectorInvitados: Ref<boolean> = ref(false);

const mostrarSelect = () => {
    mostrarSelectorInvitados.value = !mostrarSelectorInvitados.value;
};

const cargarInvitados = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser; // Obtén el usuario actual
        if (user) {
        const db = getFirestore();
        const usuariosCollection = collection(db, 'guests');
        const q = query(usuariosCollection, where("userId", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const invitadosUsuario:IGuests[] = [];
        querySnapshot.forEach((doc) => {
            invitadosUsuario.push(doc.data() as IGuests);
        });
        invitados.value = invitadosUsuario;
        }
    } catch (error) {
        console.error('Error al cargar invitados:', error);
    }
};

    onMounted(cargarInvitados);
</script>
