<template>
  <div>
    <div class="walletHistory">
      <div class="column-title">交易记录</div>
      <TransactionList v-bind:publicKey="publicKey"/>
    </div>
  </div>
</template>

<script>
import storage from '../libs/storage'
import TransactionList from './TransactionList.vue'

export default {
  name: 'TransactionHistory',
  components: {
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
.walletHistory{margin-top: 3em;}
.column-title{margin-bottom: 1em; padding: 0.5em 1em; border-left: 3px solid #2196f3; background-color: #f0f0f0; font-size: 1.125em;}
</style>
