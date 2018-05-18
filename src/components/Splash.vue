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

    var wallet = storage.getActiveWallet()
    setTimeout(() => {
      Indicator.close()
      if (wallet) {
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
