<template>
  <div id="app">
    <h1>Welcome!</h1>
    <Spinner />
  </div>
</template>

<script>
import Spinner from 'vue-simple-spinner'
import { mapGetters } from 'vuex'

export default {
  name: 'Splash',
  components: {
    Spinner
  },
  computed: mapGetters({
    wallet: 'getActiveWallet'
  }),
  created: function () {
    setTimeout(() => {
      // Indicator.close()
      if (this.wallet) {
        this.$router.push('/wallet')
      } else {
        this.$router.push('/unlock')
      }
    }, 2000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
