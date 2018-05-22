// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Toast from 'vue-easy-toast'
import 'vue-easy-toast/dist/vue-easy-toast.css'

import VModal from 'vue-js-modal'

Vue.use(VModal, { dialog: true, dynamic: true })

Vue.use(Toast, {
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  duration: 2000
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
