import Vue from 'vue'
import VueTheMask from 'vue-the-mask'
import VTooltip from 'v-tooltip'
import VCalendar from 'v-calendar'
import money from 'v-money'
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
Vue.use(money, {
    decimal: ',',
    thousands: '.',
    prefix: '',
    precision: 0,
    masked: false
})

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
        h > 9 ? h : (h > 0 ? '0' + h : '00'),
        m > 9 ? m : (m > 0 ? '0' + m : '00'),
    ].filter(a => a).join(':');
});

Vue.filter('secToTime', function (seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [
        h > 9 ? h : (h > 0 ? '0' + h : '00'),
        m > 9 ? m : (m > 0 ? '0' + m : '00'),
        s > 9 ? s : (s > 0 ? '0' + s : '00'),
    ].filter(a => a).join(':');
});

Vue.filter('date', function (date) {
    if (date) {
        date = date.split(' ');
        date = date[0];
        date = date.split('-');
        return date[2]+'/'+date[1]+'/'+date[0];
    } return ''
});

Vue.filter('datetime', function (datetime) {
    if (datetime) {
        datetime = datetime.split(' ');
        let date = datetime[0];
        let time = datetime[1];
        date = date.split('-');
        return date[2]+'/'+date[1]+'/'+date[0]+" "+time;
    } return ''
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
