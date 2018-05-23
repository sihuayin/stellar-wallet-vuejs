<template>
  <div id="container">
    <div class="head">
      <router-link to="/wallet">
        <div class="navbar fn-flex">
          <i class="iconfont icon-wallet logo"></i>
          <h1>钱包</h1>
        </div>
      </router-link>
    </div>
    <AddPanel v-on:onComplete="redirect"/>
  </div>
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
  .head{background-color: #fff; box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05); position: relative; z-index: 1;}
  .navbar{box-sizing: border-box; margin: 0 auto; padding: 0 0.625em; height: 3.5em; max-width: 60em; line-height: 3.5em;}
  .navbar .logo{font-size: 1.5em; color: #2196f3;}
  h1{margin-left: 0.35em; font-size: 1.25em;}
</style>
