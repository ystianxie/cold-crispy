import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/translatorSettings',
        name: '翻译设置',
        component: () => import('../views/translatorSettingsView.vue')
    },
    {
        path: '/OCRSettings',
        name: 'OCR设置',
        component: () => import('../views/OCRSettingsView.vue')
    },
    {
        path: '/generalSettings',
        name: '通用设置',
        component: () => import( '../views/generalSettingsView.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
