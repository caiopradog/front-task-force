import Vue from 'vue'
import VueTheMask from 'vue-the-mask'
import VTooltip from 'v-tooltip'
import VCalendar from 'v-calendar'
import Notifications from 'vue-notification'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './http'

Vue.use(VueTheMask)
Vue.use(VTooltip)
Vue.use(VCalendar, {
    locales: {
        'pt-PT': {
            firstDayOfWeek: 1,
            masks: {
                L: 'DD/MM/YYYY',
            }
        }
    }
})
Vue.use(Notifications)

// JS imports
import 'bootstrap'

// Css imports
import '@/assets/style/main.scss'

// font-awesome imports
import {library} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {fas} from "@fortawesome/free-solid-svg-icons";

library.add(fas);
Vue.component('fa', FontAwesomeIcon)

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

Vue.filter('date', function (date) {
    date = date.split('-');
    return date[2]+'/'+date[1]+'/'+date[0];
});

Vue.filter('datetime', function (datetime) {
    datetime = datetime.split(' ');
    let date = datetime[0];
    let time = datetime[1];
    date = date.split('-');
    return date[2]+'/'+date[1]+'/'+date[0]+" "+time;
});

Vue.config.productionTip = false
Vue.prototype.$http = http

const defaultTitle = 'TCC - Front-End'

new Vue({
    router,
    store,
    render: h => h(App),
    watch: {
        $route(to) {
            document.title = to.meta.title || defaultTitle
        },
        "store.state.user": function (data) {
            if (data){
                localStorage.user = data;
            } else {
                this.$router.go(-100);
                if (this.$route.name != 'login') {
                    this.$router.replace('/');
                }
            }
        }
    },
    mounted() {
        document.title = this.$route.meta.title || defaultTitle

        if (!store.state.user) {
            this.$router.go(-100);
            if (this.$route.name != 'login') {
                this.$router.replace('/');
            }
        }
    }
}).$mount('#app')
