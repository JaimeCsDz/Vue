import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Registro from '@/views/Registro.vue'
import DashboardView from '@/views/DashboardView.vue'
import CreateEventsView from '@/views/CreateEventsView.vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import EventosView from '@/views/EventosView.vue'
import DetallesEventos from '@/views/DetallesEventos.vue'
import Contacts from '@/views/ContactsView.vue'
import PerfilView from '@/views/PerfilView.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import Tokenview from '@/views/Tokenview.vue'

const router = createRouter({
  history: createWebHistory('#'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta:{
        requireAuth: false
      }
    },
    {
      path: '/registro',
      name: 'Registro',
      component: Registro,
      meta:{
        requireAuth: false
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: DashboardView,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/createEvents',
      name: 'CreateEvents',
      component: CreateEventsView,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/createEvents/:day',
      name: 'CreateEventsDay',
      component: CreateEventsView,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/eventos',
      name: 'VerEventos',
      component: EventosView,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/detalles/:id',
      name: 'Detalles',
      component: DetallesEventos,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/contacts',
      name: 'Contacts',
      component: Contacts,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/perfil',
      name: 'Profile',
      component: PerfilView,
      meta:{
        requireAuth: true
      }
    },
    {
      path: '/:pathMatch(.*)',
      name: 'notFound',
      component: NotFoundPage,
    },
    {
      path: '/tokenview',
      name: 'Tokenview',
      component: Tokenview,
    },
  ]
})
router.beforeEach((to, from, next) => {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    const isAuthenticated = !!user
    const requiresAuth = to.matched.some(record => record.meta.requireAuth)

    if (requiresAuth && !isAuthenticated) {
      next('/')
    } else {
      next() 
    }
  })
})
export default router
