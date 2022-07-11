import Vue from 'vue';
import Router from 'vue-router';
// eslint-disable-next-line no-unused-vars
import Login from '../views/Login.vue';
import HomeApp from '../views/HomeApp.vue'
import Payment from '../views/PixPagamentoPedidos.vue'
import PixPagamentoDuplicatas from '../views/PixPagamentoDuplicatas.vue'
import PageNotFound from '../views/PageNotFound.vue';
import LoginLayout from '../components/Layouts/LoginLayout.vue'

Vue.use(Router);

let routes = [{
        path: '/',
        name: 'login',
        component: LoginLayout,
        meta: {
            layout: 'login',
            title: 'Login - Pagamentos ROFE - RCA'
        }
    },
    {
        path: '/home',
        name: 'HOME',
        component: HomeApp,
        meta: {
            title: 'HOME'
        },
    },
    {
        path: '/pagamentopixpedido',
        name: 'pagamentopixpedido',
        component: Payment,
        meta: {
            title: 'PAGAMENTOS PIX - PEDIDOS'
        },
    },
    {
        path: '/pagamentopixduplic',
        name: 'pagamentopixduplic',
        component: PixPagamentoDuplicatas,
        meta: {
            title: 'PAGAMENTOS PIX - DUPLICATAS'
        },
    },
    {
        path: "*",
        component: PageNotFound,
        meta: {
            title: 'Pagina Nao Encontrada'
        },

    },
]

export const router = new Router({
    mode: 'history',
    routes
})


router.beforeEach((to, from, next) => {
    document.title = to.meta.title
    if (to.name !== 'login' && to.name !== 'register' && !localStorage.getItem('token')) {
        next({ name: 'login' });
    } else {
        next();
    }
})