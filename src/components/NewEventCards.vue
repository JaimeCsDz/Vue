  <template>
    <div class="bg-white rounded-lg shadow-md p-6">
      <input type="text" placeholder="Agregar título" class="focus:outline-none" v-model="titulo"/>
      <hr class="border-b border-blue-500 w-full mb-4">  

      <label class="flex items-center mb-5">
        <input type="date" v-model="fechaSeleccionada" @input="ocultarSelectorFecha">
        <input class="mx-9" type="time" v-model="horaSeleccionada" @input="ocultarSelectorFecha">
      </label>

      <router-link to="#" class="flex items-center mb-5" @click="mostrarSelect" v-model="guests">  
      <img src="@/assets/img/group.svg" class="w-5 mr-2"></img>
      Agregar invitados
    </router-link>

    <select v-if="mostrarSelectorInvitados" v-model="invitadosSeleccionados" multiple style="overflow: hidden;">
      <option v-for="invitado in invitados" :key="invitado.id" :value="invitado">{{ invitado.name }}</option>
    </select>

      <textarea placeholder="Agregar descripción o comentarios." class="
        border border-gray-300 rounded-md p-4 w-full text-base
        focus:border-blue-500 focus:outline-none mt-4"  v-model="desc">
      </textarea>

      <label class="flex items-center">
        <div class="flex items-center">
          <i class="fa-regular fa-bell mr-2"></i>
          <span class="mr-2">{{ fechaSeleccionada }}</span>
          <span>{{ horaSeleccionada }}</span>
        </div>
        <button class="fa-regular fa-square-check mr-2"></button>
        <button class="fa-regular fa-rectangle-xmark"></button>
      </label>
      
      <div class="flex justify-center">
        <button class="pt-3 mt-2 bg-blue-600 text-white font-bold py-3 px-10 rounded-full flex" @click="validarEvento">
          <span>Guardar</span>
        </button>
      </div>
      
    </div>
  </template>

  <script lang="ts" setup>
  import { ref as VueRef, onMounted } from 'vue';
  import type { Ref } from 'vue'
  import { getFirestore, collection, addDoc, where, getDocs, query } from 'firebase/firestore';
  import swal from 'sweetalert2'
  import { useRoute } from 'vue-router';
  import { getAuth } from 'firebase/auth';
  import type IGuests from '@/interface/IGuests';

  const titulo = VueRef('');
  const fechaSeleccionada = VueRef('');
  const horaSeleccionada = VueRef('');
  const desc = VueRef('');
  const mostrarDatePicker = VueRef(false);
  const guests = VueRef([])
  const invitados: Ref<IGuests[]> = VueRef([]);
  const invitadosSeleccionados: Ref<IGuests[]> = VueRef([]);
  const mostrarSelectorInvitados: Ref<boolean> = VueRef(false);

  const guardarEvento = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser; // Obtén el usuario actual
        if (user) {
            const db = getFirestore();
            const eventosCollection = collection(db, 'events');
            const fecha = fechaSeleccionada.value;
            const newEvent = { 
                userId: user.uid, // Asocia el evento con el ID del usuario actual
                title: titulo.value,
                date: fecha,
                hour: horaSeleccionada.value,
                description: desc.value,
                guests: invitadosSeleccionados.value
            };
            await addDoc(eventosCollection, newEvent);
            swal.fire('Evento creado correctamente', "", "success").then(() => {
                    window.location.href = '/eventos';
                });;
            titulo.value = '';
            fechaSeleccionada.value = '';
            horaSeleccionada.value = '';
            desc.value = '';
            invitadosSeleccionados.value = []
        } else {
            swal.fire('Debes iniciar sesión para crear un evento', "", "warning");
        }
    } catch (error) {
        console.error('Error al crear evento:', error);
        swal.fire('Ocurrió un error al crear el evento');
    }
}

  const validarEvento = () =>{
    if (!titulo.value || !fechaSeleccionada.value || !horaSeleccionada.value || !invitadosSeleccionados.value || !desc.value) {
      swal.fire('Por favor, completa todos los campos', "", "warning");
      return;
      }
      guardarEvento()
  }
  // Función para ocultar el selector de fecha
  const ocultarSelectorFecha = () => {
    mostrarDatePicker.value = false;
  };

  const route = useRoute();

  const prellenarFecha = () => {
    if (Array.isArray(route.params.day)) {
        fechaSeleccionada.value = route.params.day[0];
    } else {
        fechaSeleccionada.value = route.params.day;
    }
};
prellenarFecha();


const mostrarSelect = () => {
  mostrarSelectorInvitados.value = !mostrarSelectorInvitados.value
}

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