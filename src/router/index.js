import { createRouter, createWebHistory } from 'vue-router'

// Professional/Career routes
const StartPage = () => import('../components/01_Profession/StartPage.vue')
const TimeLine = () => import('../components/01_Profession/TimeLine.vue')
const Portfolio = () => import('../components/01_Profession/Portfolio.vue')
const Diplomas = () => import('../components/01_Profession/Diplomas.vue')
const Chatbot = () => import('../components/01_Profession/Chatbot.vue')

// Art/Creative routes
const Cube = () => import('../components/00_Art/Cube.vue')
const Galaxy = () => import('../components/00_Art/galaxy.vue')
const Network = () => import('../components/00_Art/Network.vue')
const Coliders = () => import('../components/00_Art/Coliders.vue')

// Layout component
const Layout = () => import('../components/Layout.vue')

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      // Default route - redirect to start page
      { path: '', redirect: '/start' },
      
      // Professional/Career sections
      { path: '/start', name: 'Start', component: StartPage },
      { path: '/timeline', name: 'Timeline', component: TimeLine },
      { path: '/portfolio', name: 'Portfolio', component: Portfolio },
      { path: '/diplomas', name: 'Diplomas', component: Diplomas },
      { path: '/chatbot', name: 'Chatbot', component: Chatbot },
      
      // Art/Creative sections
      { path: '/art/cube', name: 'Cube', component: Cube },
      { path: '/art/galaxy', name: 'Galaxy', component: Galaxy },
      { path: '/art/network', name: 'Network', component: Network },
      { path: '/art/coliders', name: 'Coliders', component: Coliders },
    ]
  },
  
  // Catch-all route for 404 pages
  { path: '/:pathMatch(.*)*', redirect: '/start' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 