<template>
  <div class="container">
    <Head />
    <div class="content">
      <h2 class="column-title">交易记录</h2>
      <TransactionList v-bind:publicKey="publicKey"/>
    </div>
  </div>
</template>

<script>
import storage from '../libs/storage'
import Head from './Head'
import TransactionList from './TransactionList.vue'

export default {
  name: 'TransactionHistory',
  components: {
    Head,
    TransactionList
  },
  created: function () {
    var wallet = storage.getActiveWallet()
    if (!wallet) {
      return this.$router.go(-1)
    }
    this.publicKey = wallet.publicKey
  },
  data: function () {
    return {
      publicKey: ''
    }
  }
}
</script>

<style scoped>
  .content{box-sizing: border-box; max-width: 60em; min-height: 36em; margin: 0 auto; padding: 1.5em 1em; background-color: #fff;}
  .column-title{margin-bottom: 1em; padding: 0.5em 0; font-size: 1.125em;}

  @media screen and (max-width: 480px) {
    .content{padding: 1em 0 0; min-height: auto;}
    .column-title{margin-bottom: 1em; padding: 0.5em 0.625em;}
  }
</style>
