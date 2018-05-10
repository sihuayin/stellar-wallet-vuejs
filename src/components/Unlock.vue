<template>
  <AddPanel v-on:onComplete="redirect"/>
</template>

<script>
import AddPanel from './AddPanel'
import storage from '../libs/storage'
import { mapActions } from 'vuex'

export default {
  name: 'Unlock',
  components: {
    AddPanel
  },
  created: function () {
    var wallets = storage.getAllWallets()
    this.setWallets(wallets)
  },
  methods: {
    ...mapActions([
      'setWallets'
    ]),
    redirect: function () {
      this.$router.push('/wallet')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
