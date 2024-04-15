<template>
  <div class="container mx-auto p-4">

    <!-- Overlay background -->
    <transition name="fade">
      <div v-if="modal" @click="closeModal" class="fixed inset-0 z-40 bg-black bg-opacity-50"></div>
    </transition>

    <!-- Main modal -->
    <transition name="slide-up">
      <div v-if="modal" id="authentication-modal" tabindex="-1" aria-hidden="true" class="flex justify-center items-center overflow-y-auto overflow-x-hidden fixed inset-0 z-50">
        <div class="relative w-full max-w-md p-4">
          <!-- Modal content -->
          <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <!-- Modal header -->
            <div class="flex items-center justify-between p-5 border-b rounded-t dark:border-gray-600">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                Registra un nuevo invitado
              </h3>
              <button type="button" @click="closeModal" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-2 dark:hover:bg-gray-600 dark:hover:text-white">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                <span class="sr-only">Cerrar</span>
              </button>
            </div>
            <!-- Modal body -->
            <div class="p-5">
              <RegisterContacts />
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="flex justify-end w-full mb-4 lg:ml-60 mt-0 md:ml-4">
      <button type="button" @click="modalOpen" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
        Registrar
      </button>
    </div>
    <!-- Lista de usuarios -->
    <div class="flex justify-center">
  <div>
    <h2 class="text-2xl font-bold text-center my-4">Lista de usuarios</h2>
    <ul class="list-disc pl-4">
      <li v-for="(inv, index) in filteredInv" :key="index" class="mb-4">
        <div class="bg-white rounded-lg p-2 w-72 shadow flex items-center justify-between">
          <span class="text-lg font-medium">{{ inv.name }}</span>
          <button @click="deleteInv(inv.id)" class="text-gray-600 hover:text-gray-600 rounded-full p-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </li>
    </ul>
  </div>
</div>
  </div>
</template>

<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform .5s, opacity .5s ease;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>

<script lang="ts" setup>
import { onSnapshot, query, where, doc, deleteDoc} from 'firebase/firestore';
import { computed, ref } from 'vue';
import { getFirestore, collection } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import type IGuest from '@/interface/IGuests'
import RegisterContacts from './RegisterContacts.vue';
import swal from 'sweetalert2'


const props = defineProps<{
    searchQuery: string;
    }>();
    
    const filteredInv = computed(() => {
    if (typeof props.searchQuery === 'string') {
        return users.value.filter(user =>user.name.toLowerCase().includes(props.searchQuery.toLowerCase()));
    } else {
        return users.value;
    }
});
    const auth = getAuth();
     const user = auth.currentUser; // Obtén el usuario actual
    if(user){
      const db = getFirestore();
      const guestsRef = collection(db, "guests");
      const q = query(guestsRef, where('userId', '==', user.uid), where('emailVerified', '==', true));
      onSnapshot(q, (snapshot) => {
        users.value = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          email:doc.data().email,
          documentId: doc.data().documentId
        }));
      });
    }    
const users = ref<IGuest[]>([]);

const modal = ref(false)

const modalOpen = () =>{
  modal.value = true
}
const closeModal = () =>{
  modal.value = false
}

const deleteInv = async (documentId: string) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, 'guests', documentId);
    swal.fire({
      title: '¿Seguro que quieres eliminar al invitado?',                
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then(async(result)=>{
      if(result.isConfirmed){
      await deleteDoc(docRef);
      swal.fire('Invitado eliminado correctamente', "" , "success");
      }
    })
  } catch (error) {
    console.error('Error al eliminar el documento:', error);
  }
}
</script>
