import Vue from 'vue/dist/vue.js';
import App from './App.vue';
import VueRouter from 'vue-router'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

// custom pages
import RouteTransition from './components/RouteTransition';
import Guide from './pages/Guide';
import splashscreen from './pages/SplashScreen';

Vue.use(VueRouter);
Vue.use(VueMaterial);

const routes = [{
  path: '/',
  component: RouteTransition,
  children: [{
      path: '',
      component: splashscreen
    },
    {
      path: '/guide',
      component: Guide
    },
    {
      path: '/app',
      component: App
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