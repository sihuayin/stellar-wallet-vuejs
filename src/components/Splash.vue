<template>
  <div id="app">
    <h1>Welcome! {{ testValue }}</h1>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui'
import storage from '../libs/storage'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Splash',
  computed: mapGetters({
    testValue: 'getTest',
    wallet: 'getActiveWallet'
  }),
  created: function () {
    Indicator.open('加载中...')
    var wallets = storage.getAllWallets()
    this.setWallets(wallets)
    // var settings = storage.getSetting()
    // todo 设置本地存储的设置
    setTimeout(() => {
      Indicator.close()
      if (this.wallet) {
        this.$router.push('/wallet')
      } else {
        this.$router.push('/unlock')
      }
    }, 2000)
  },
  methods: mapActions([
    'test',
    'setWallets'
  ])
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
