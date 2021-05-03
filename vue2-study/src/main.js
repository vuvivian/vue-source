/*
 * @Author: vuvivian
 * @Date: 2021-05-02 13:25:59
 * @LastEditors: vuvivian
 * @LastEditTime: 2021-05-03 22:42:43
 * @Descripttion: 引入自定义router
 * @FilePath: /vue2-study/src/main.js
 */
import Vue from 'vue'
import App from './App.vue'
import router from './vrouter'

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')
