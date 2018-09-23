import '@babel/polyfill'
import Vue from 'vue'
import VueRouter from 'vue-router'
import './plugins/vuetify'
import App from './App.vue'

import Dashboard from './components/Dashboard'
import Records from './components/Records'
import Record from './components/Record'
import Add from './components/Add'

// plugins
import Eosio from './plugins/eosio';

Vue.config.productionTip = false
Vue.use(VueRouter)
Vue.use(Eosio)


var router = new VueRouter({
  routes: [
    { path: '/', component: Dashboard },
    { path: '/records', component: Records},
    { path: '/record', component: Record},
    { path: '/add', component: Add },
  ],
  mode: 'history'
})

new Vue({
  	render: h => h(App),
  	router: router,
}).$mount('#app')
