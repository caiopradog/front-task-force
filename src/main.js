import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './http'

// JS imports
import 'bootstrap'

// Css imports
import '@/assets/style/main.scss'

// font-awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {faCaretDown, faCaretLeft, faCaretRight, faCaretUp, faSearch, faTimes} from "@fortawesome/free-solid-svg-icons";

library.add(faCaretLeft, faCaretRight, faCaretUp, faCaretDown, faTimes, faSearch);

Vue.component('fa', FontAwesomeIcon);

Vue.config.productionTip = false;
Vue.prototype.$http = http;

const defaultTitle = 'TCC - Front-End';

document.title = defaultTitle;

Vue.filter('secToHourMin', function (seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
  ].filter(a => a).join(':');
});

Vue.filter('secToTime', function (seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    s > 9 ? s : '0' + s,
  ].filter(a => a).join(':');
});

new Vue({
  router,
  store,
  render: h => h(App),
  watch: {
    $route (to) {
      document.title = to.title || defaultTitle
    }
  }
}).$mount('#app')
