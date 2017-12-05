import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
    hotelQuery: {},
    roomTypeDetail: {},
    hotelList: [],
    optionalCity: [],
    previewImgsOptions: {
        captionEl: false,
        fullscreenEl: false,
        history: false,
        shareEl: false,
        tapToClose: true,
        showAnimationDuration: 0,
        hideAnimationDuration: 0
    }
}

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
})
