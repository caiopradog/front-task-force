import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: localStorage.user ? JSON.parse(localStorage.user) : false,
        loading: true,
    }
})
