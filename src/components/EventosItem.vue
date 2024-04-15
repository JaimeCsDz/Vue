<template>
    <div class="xl:pl-52 md:40">
        <div v-if="filteredEvents.length === 0" class="flex justify-center items-center mt-48">
            <p class="text-gray-500 text-xl text-center">Sin eventos registrados</p>
        </div>
        <div class="flex flex-wrap justify-center">
            <div v-for="(event, index) in filteredEvents" :key="index" class="flex flex-col bg-white w-72 h-40 rounded-md py-4 px-6 border xl:m-4 md:m-3">
                <h3 class="text-center font-bold text-xl text-gray-800 pb-2">{{ event.title }}</h3>
                <p class="text-sm text-gray-500 pb-3">{{ event.description }}</p>
                <div class="flex gap-2 text-sm text-gray-500 border-b pb-2">
                    <p class="">Fecha del evento:</p>
                    <p>{{ event.date }}</p>
                </div>
                <div class="flex justify-around items-center py-3">
                    <div class="flex gap-2 text-gray-600 hover:scale-110 duration-200 hover:cursor-pointer">
                        <svg class="w-5  h-5 stroke-green-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="16"></line>
                            <line x1="8" y1="12" x2="16" y2="12"></line>
                        </svg>
                        <button class="font-semibold text-sm" @click="Detalles(event.id)">Detalles</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { onMounted, computed, defineProps, ref } from 'vue';
    import { getDocs, getFirestore, collection, where, query } from 'firebase/firestore';
    import router from '@/router';
    import type IEvent from '@/interface/IEvent';
    import { getAuth } from 'firebase/auth';

    const props = defineProps<{
    searchQuery: string;
    }>();

    const events = ref<IEvent[]>([]);

    const getEvents = async () => {
    try {
        const auth = getAuth();
        const user = auth.currentUser; // Obtener el usuario actual
        if (user) {
        const db = getFirestore();
        const eventosCollection = collection(db, 'events');
        const q = query(eventosCollection, where('userId', '==', user.uid)); // Filtra por el ID del usuario actual
        const querySnapshot = await getDocs(q);
        events.value = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
            date: doc.data().date,
            hour: doc.data().hour,
            guests: doc.data().guests,
            userId: doc.data().uid,
            description: doc.data().description
        }));
        console.log(events.value);
        }
    } catch (error) {
        console.error('Error al obtener los eventos:', error);
    }
    };

    onMounted(() => {
    getEvents();
    });

    const Detalles = (id:string) => {
    router.push({ name: 'Detalles', params: { id: id } });
    };

    const filteredEvents = computed(() => {
    if (typeof props.searchQuery === 'string') {
        return events.value.filter(event => event.title.toLowerCase().includes(props.searchQuery.toLowerCase()));
    } else {
        return events.value;
    }
});
</script>
