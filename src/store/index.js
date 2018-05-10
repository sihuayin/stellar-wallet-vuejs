import Vue from 'vue'
import Vuex from 'vuex'
import wallet from './modules/wallet'
import setting from './modules/setting'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    wallet,
    setting
  },
  strict: debug,
  plugins: []
})
