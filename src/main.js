import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

// JS imports
import 'bootstrap'

// Css imports
import '@/assets/style/main.scss'

// font-awesome imports
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faTimes, faSpinner);

Vue.component('fa', FontAwesomeIcon);

Vue.config.productionTip = false;

const defaultTitle = 'TCC - Front-End';

document.title = defaultTitle;

const http = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {'Authorization': 'Bearer ' + store.state.api_token}
});
Vue.prototype.$http = http;

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
