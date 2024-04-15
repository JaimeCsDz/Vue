<template>
    <div class="pt-10 flex justify-center xl:ml-48 md:ml-auto">
        <div class="mx-auto text-center">
            <div class="grid grid-cols-7 gap-2 p-2 max-w-screen-xl space-x-2">
                <div v-for="dayOfWeek in isMobile ? daysOfWeekRes : daysOfWeek" :key="dayOfWeek" class="p-4 font-bold md:ml-0">
                    {{ dayOfWeek }}
                </div>
                <router-link
                    v-for="day in daysInMonth"
                    :key="day"
                    :to="`/createEvents/${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`"
                    class="p-4 border flex items-center justify-center relative"
                >
                    <span class="z-10">{{ day }}</span>
                    <div
                    v-if="typeof day === 'number' && dayEvents[day]"
                    :class="{ 'bg-gray-400': isEventPassed(day), 'bg-blue-400': !isEventPassed(day) }" 
                    class="absolute w-5 h-5 rounded-full"
                    ></div>
                </router-link>
            </div>
            <div class="mt-4">
                <button @click="changeMonth(-1)" class="hover:text-blue-600">Anterior</button>
                <span class="px-2 normal-case">{{ currentMonth }}</span>
                <button @click="changeMonth(1)" class="hover:text-blue-600">Siguiente</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
    import { getAuth, type User } from 'firebase/auth';
    import type IEvent from '@/interface/IEvent';
    
    const daysOfWeek = ref(['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']);
    const daysOfWeekRes = ref(['Dom', 'Lun', 'Mart', 'Miér', 'Jue', 'Vie', 'Sáb']);
    const selectedDate = ref(new Date());
    const daysInMonth = ref<Array<number | string>>([]);
    const dayEvents = ref<{ [key: number]: IEvent[] }>({});
    const isMobile = ref(false);
    
    const auth = getAuth();
    let currentUser: User | null = null;
    
    // Obtener el usuario actualmente autenticado
    onMounted(() => {
        currentUser = auth.currentUser;
        isMobile.value = window.innerWidth <= 768;
    });
    
    // Actualizar isMobile cuando se cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
        isMobile.value = window.innerWidth <= 768; // Definir si la pantalla es móvil
    });
    
    const getDaysInMonth = (year: number, month: number): Array<number | string> => {
        const numDaysInMonth = new Date(year, month, 0).getDate()
        const daysArray: Array<number | string> = []
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay()
    
        // Insertar espacios en blanco al principio según el primer día de la semana
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push('')
        }
    
        // Agregar los números de los días del mes
        for (let i = 1; i <= numDaysInMonth; i++) {
            daysArray.push(i)
        }
        return daysArray
    };
    
    const getCalendarEvents = async (year: number, month: number) => {
        if (!currentUser) return // Si no hay usuario autenticado, salir de la función
        
        const db = getFirestore()
        const eventosCollection = collection(db, 'events')
        const q = query(eventosCollection, 
            where('userId', '==', currentUser.uid), // Filtrar por ID del usuario actual
        );
        
        const querySnapshot = await getDocs(q);
        const eventsData: { [key: number]: IEvent[] } = {}
    
        querySnapshot.forEach(doc => {
            const event = doc.data() as IEvent
            const eventDate = new Date(event.date)
            const day = eventDate.getUTCDate()
    
            if (eventDate.getUTCFullYear() === year && eventDate.getUTCMonth() + 1 === month) {
                if (!eventsData[day]) {
                    eventsData[day] = []
                }
                eventsData[day].push(event)
            }
        });
    
        dayEvents.value = eventsData;
    };
    
    const changeMonth = (monthOffset: number) => {
        const newDate = new Date(selectedDate.value.getTime())
        newDate.setMonth(newDate.getMonth() + monthOffset)
        selectedDate.value = newDate
    };
    
    const currentMonth = computed(() => {
        const rawMonth = selectedDate.value.toLocaleString('default', { month: 'long' })
        return rawMonth.charAt(0).toUpperCase() + rawMonth.slice(1) + ` ${selectedDate.value.getFullYear()}`
    });

    const isEventPassed = (day: string | number) => {
        // Verificar si day es un número antes de continuar
        if (typeof day !== 'number') return false; // No es un número, entonces no ha pasado

        const dayNumber = Number(day); // Convertir day a número
        if (!dayEvents.value[dayNumber]) return false; // No hay eventos para este día

        const today = new Date();
        const selectedYear = selectedDate.value.getFullYear();
        const selectedMonth = selectedDate.value.getMonth() + 1;
        const eventDate = new Date(selectedYear, selectedMonth - 1, dayNumber);
        return today > eventDate; // Si la fecha actual es posterior a la fecha del evento, devuelve true
    };

    
    watch(selectedDate, () => {
        const year = selectedDate.value.getFullYear()
        const month = selectedDate.value.getMonth() + 1
        daysInMonth.value = getDaysInMonth(year, month)
        getCalendarEvents(year, month)
    });
    
    onMounted(() => {
        const year = selectedDate.value.getFullYear()
        const month = selectedDate.value.getMonth() + 1
        daysInMonth.value = getDaysInMonth(year, month)
        getCalendarEvents(year, month)
    });
</script>