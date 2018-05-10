<template>
  <div>
    <h2>钱包账户管理</h2>
    <ul id="example-1">
      <li v-for="(wallet, index) in wallets" v-bind:key="index">
        <p>{{ index }} <input type="radio" name="active_value" v-model="activeIndex" v-bind:value="index"></p>
        <p><label>钱包名称 :</label> <input v-bind:value="wallet.name" v-on:input="updateOneWalletName($event.target.value, index)"/></p>
        <p><label>钱包密钥 :</label> <input disabled readonly v-bind:value="wallet.secretKey" /></p>
        <p><label>地址 :</label> <input disabled readonly v-bind:value="wallet.publicKey" /></p>
      </li>
    </ul>

    <mt-button type="default" v-on:click="showForm">添加</mt-button>
    <mt-popup
      v-model="popupVisible">
      <AddPanel v-on:onComplete="finishAdd" />
    </mt-popup>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import storage from '../libs/storage'
import AddPanel from './AddPanel'

export default {
  name: 'WalletList',
  computed: {
    activeIndex: {
      get () {
        return this.$store.getters.getActiveIndex
      },
      set (value) {
        this.updateWalletActive(value)
      }
    },
    ...mapGetters({
      wallets: 'getWallets'
    })
  },
  components: {
    AddPanel
  },
  methods: {
    ...mapActions([
      'setWallets',
      'updateWalletByIndex',
      'updateWalletActive'
    ]),
    showForm: function () {
      this.popupVisible = true
    },
    finishAdd: function () {
      this.popupVisible = false
    },
    updateOneWalletName: function (value, index) {
      var wallet = {...this.wallets[index]}
      if (wallet) {
        wallet.name = value
        this.updateWalletByIndex({wallet, index})
      }
    }
  },
  created: function () {
    var wallets = storage.getAllWallets()
    this.setWallets(wallets)
  },
  data: function () {
    return {
      popupVisible: false
    }
  }
}
</script>

<style scoped>

</style>
