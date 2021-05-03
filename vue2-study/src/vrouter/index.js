/*
 * @Author: vuvivian
 * @Date: 2021-05-02 23:36:29
 * @LastEditors: vuvivian
 * @LastEditTime: 2021-05-02 23:48:37
 * @Descripttion:
 * @FilePath: /vue2-study/src/vrouter/index.js
 */
import Vue from 'vue'
import VRouter from './v-router'
import Home from '../views/Home.vue'

Vue.use(VRouter) // Vue.use的是插件，插件一定要有install方法，因为use内部会调用install()

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
]

const router = new VRouter({
    routes
})

export default router
