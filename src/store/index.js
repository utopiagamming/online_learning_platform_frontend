import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const store = new Vuex.Store({

    state: {
        // 存储token
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : ''
    },

    mutations: {
        // 修改token，并将token存入localStorage
        storeLogin(state, user) {

            state.Authorization = user.Authorization;

            localStorage.setItem('Authorization', user.Authorization);

        }
    }
});

export default store;