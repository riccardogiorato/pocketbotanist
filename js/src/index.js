import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'

import './main.scss'

// custom pages
import RouteTransition from './components/RouteTransition';
import Guide from './pages/Guide';
import Splashscreen from './pages/SplashScreen';
import App from './pages/App.vue';
import Loading from './pages/Loading.vue';
import Settings from './pages/Settings.vue';
import Results from './pages/Results.vue';

Vue.use(VueRouter);
Vue.use(VueMaterial);

const routes = [{
  path: '/',
  component: RouteTransition,
  children: [{
      path: '',
      component: Splashscreen
    },
    {
      path: '/guide',
      component: Guide
    },
    {
      path: '/app',
      component: App
    },
    {
      path: '/loading',
      component: Loading
    },
    {
      path: '/settings',
      component: Settings
    },
    {
      path: '/result',
      component: Results
    }
  ]
}]
const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  el: '#app',
  router,
  template: `
    <div id="app">
      <transition name="fade" mode="out-in">
        <router-view class="view"></router-view>
      </transition>
    </div>
  `
});