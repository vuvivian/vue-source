/*
 * @Author: vuvivian
 * @Date: 2021-05-02 23:38:25
 * @LastEditors: vuvivian
 * @LastEditTime: 2021-05-03 22:40:59
 * @Descripttion: 自定义实现vue-router插件
 * @FilePath: /vue2-study/src/vrouter/v-router.js
 */

// 需求1. spa页面不能刷新: hash / history api
// 需求2. url发生变化，显示对应的内容：router-view组件（占位容器）/ 数据响应式

let Vue

// 实现插件
class VRouter {
    constructor(options) {
        this.options = options

        // 数据响应式， current必须是响应式的，这样他变化，使用他的组件就会重新render
        // 如何造一个响应式的数据： 
        // way1: 借鸡生蛋- new Vue({data: {current: '/'}})
        // way2: Vue.util.defineReactive(obj, 'current','/')
        Vue.util.defineReactive(this, 'current', window.location.hash.slice(1) || '/')
        // this.current = window.location.hash.slice(1) || '/'

        // Vue.set(obj, 'key', 'val') obj必须是响应式的
        // 监控url的变化
        window.addEventListener('hashchange', () => {
            this.current = window.location.hash.slice(1)
        })
    }
}

// 插件要实现一个install方法
VRouter.install = function (_Vue) {
    Vue = _Vue


    // 注册router实例
    // 通过全局混入： Vue.mixin({beforeCreate})
    Vue.mixin({
        // new Vue之后走
        beforeCreate() {
            // 仅在根组件创建时执行一次
            if (this.$options.router) {
                Vue.prototype.$router = this.$options.router
            }

        }
    })


    // 注册router-view和router-link
    Vue.component('router-view', {
        render(h) {
            // url => component
            // router: this.$router
            let component = null
            const { current, options } = this.$router
            const route = options.routes.find(route => route.path === current)
            if (route) {
                component = route.component
            }
            return h(component)
        }
    })

    // 使用<router-link to="/about">XXX</router-link>
    Vue.component('router-link', {
        props: {
            to: {
                type: String,
                required: true
            }
        },
        render(h) {
            // return <a href={`#${this.to}`} > {this.$slots.default} </a >
            return h('a', { attrs: { href: '#' + this.to } }, this.$slots.default)
        }
    })
}

export default VRouter