import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        api_token: localStorage.api_token || '',
        loading: false,
    }
})
