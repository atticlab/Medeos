import '@babel/polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter)

// import Home from './components/Home'
import Dashboard from './components/Dashboard'
import Records from './components/Records'
import Add from './components/Add'


var router = new VueRouter({
  routes: [
    { path: '/', component: Dashboard },
    { path: '/records', component: Records },
    { path: '/add', component: Add },
  ],
  mode: 'history'
})

new Vue({
  	render: h => h(App),
  	router: router,
}).$mount('#app')
