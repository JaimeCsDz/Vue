import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import 'tailwindcss/tailwind.css';  
import '@fortawesome/fontawesome-free/css/all.css'
import { initializeApp } from "firebase/app"; 
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const firebaseConfig = {
    apiKey: "AIzaSyAgYh5r-FxyOOfVtCmytdstmNYOYSwQOK8",
    authDomain: "myevents-6ae75.firebaseapp.com",
    projectId: "myevents-6ae75",
    storageBucket: "myevents-6ae75.appspot.com",
    messagingSenderId: "964232367480",
    appId: "1:964232367480:web:f2dc0ff3c067d1fc72cc8d"
};
    initializeApp(firebaseConfig);
const app = createApp(App)
app.use(VueSweetalert2)
app.use(createPinia())
app.use(router)

app.mount('#app')
