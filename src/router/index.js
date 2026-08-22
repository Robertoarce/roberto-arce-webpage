import { createRouter, createWebHistory } from 'vue-router'

// New editorial scroll-story landing (mosaic × Tokyo print)
const Experience = () => import('../experience/Experience.vue')

// Professional/Career routes (legacy, kept functional)
const StartPage = () => import('../components/01_Profession/StartPage.vue')
const TimeLine = () => import('../components/01_Profession/TimeLine.vue')
const Portfolio = () => import('../components/01_Profession/Portfolio.vue')
const Diplomas = () => import('../components/01_Profession/Diplomas.vue')
const Chatbot = () => import('../components/01_Profession/Chatbot.vue')
const LinearRegression = () => import('../components/01_Profession/LinearRegression.vue')
const DynamicGraphs = () => import('../components/01_Profession/DynamicGraphs.vue')

// Art/Creative routes (legacy)
const Cube = () => import('../components/00_Art/Cube.vue')
const Galaxy = () => import('../components/00_Art/galaxy.vue')
const Network = () => import('../components/00_Art/Network.vue')
const Coliders = () => import('../components/00_Art/Coliders.vue')

const Layout = () => import('../components/Layout.vue')

const routes = [
  // ---- New experience: the whole scroll story lives here ------------
  { path: '/', name: 'Experience', component: Experience },

  // ---- Legacy sections (reachable by URL, share Layout + Navbar) -----
  {
    path: '/start',
    component: Layout,
    children: [
      { path: '', name: 'Start', component: StartPage },
      { path: '/timeline', name: 'Timeline', component: TimeLine },
      { path: '/portfolio', name: 'Portfolio', component: Portfolio },
      { path: '/diplomas', name: 'Diplomas', component: Diplomas },
      { path: '/chatbot', name: 'Chatbot', component: Chatbot },
      { path: '/linear-regression', name: 'LinearRegression', component: LinearRegression },
      { path: '/linear-regression/dynamic-graphs', name: 'DynamicGraphs', component: DynamicGraphs },
      { path: '/art/cube', name: 'Cube', component: Cube },
      { path: '/art/galaxy', name: 'Galaxy', component: Galaxy },
      { path: '/art/network', name: 'Network', component: Network },
      { path: '/art/coliders', name: 'Coliders', component: Coliders },
    ],
  },

  // Catch-all → new experience
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
