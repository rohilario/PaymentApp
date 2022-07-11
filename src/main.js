import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { router } from './router/index';
import LoginLayout from './components/Layouts/LoginLayout.vue'

Vue.config.productionTip = false
Vue.component('login-layout', LoginLayout)


new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount('#app')