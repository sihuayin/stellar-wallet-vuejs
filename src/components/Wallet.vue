<template>
  <div class="container">
    <mt-header v-bind:title="wallet && wallet.name || '钱包'">
      <mt-button icon="more" slot="right" v-on:click="showPop"></mt-button>
    </mt-header>
    <div class="right">
      <div>钱包名称: {{ wallet && wallet.name || '未命名'}}  </div>
      <div>收款地址: {{ publicKey }}</div>
      <p v-if="!isOnlineAccount">您的账户还未被网络记录，你需要发送至少20个lumens (XLM)到这个账户.</p>

      <mt-button type="default" v-on:click="askForSomeLumens">叫爸爸</mt-button>
      <div>
        <mt-button type="primary" v-on:click="showWalletSend">转账</mt-button>
      </div>

      <div>
      <label>账户余额</label> {{ balance }} XLM <br />
      <label>usd:</label> {{ usdBalance }}
      </div>

      <div>
        <TransactionList v-bind:publicKey="publicKey"/>
      </div>
    </div>

    <mt-popup
      v-model="popupVisible"
      position="bottom"
      class="page-popup mint-popup-3"
      popup-transition="popup-fade">
      <router-link to="/wallet_list">
        <mt-button class="mint-button">钱包管理</mt-button>
      </router-link>
      <router-link to="/setup">
        <mt-button class="mint-button">设置</mt-button>
      </router-link>
    </mt-popup>

    <mt-popup
      v-model="walletSend"
      popup-transition="popup-fade">
      <WalletSend />
    </mt-popup>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'mint-ui'
import TransactionList from './TransactionList.vue'
import WalletSend from './WalletSend'
import LeftSide from './LeftSide'
import request from 'superagent'
import sdk from '../libs/sdk'

export default {
  name: 'Wallet',
  computed: mapGetters({
    wallet: 'getActiveWallet',
    isOnlineAccount: 'isOnlineAccount',
    balance: 'balance',
    balanceFloat: 'balanceFloat',
    usdBalance: 'usdBalance'
  }),
  components: {
    TransactionList,
    LeftSide,
    WalletSend
  },
  created: function () {
    var wallet = this.wallet
    var that = this
    if (!wallet) {
      return this.$router.go(-1)
    }
    this.publicKey = wallet.publicKey
    this.loadAccound(wallet)

    // 监听变更
    var server = sdk.getServer()
    server.payments()
      .cursor('now')
      .forAccount(wallet.publicKey)
      .stream({
        onmessage: function (message) {
          console.log(message)
          that.loadAccound(wallet)
        }
      })
  },
  methods: {
    ...mapActions([
      'loadAccound'
    ]),

    showPop: function () {
      this.popupVisible = true
    },
    askForSomeLumens: function () {
      request.get('http://47.75.60.214:8004').query({ addr: this.publicKey }).then(function (res) {
        Toast('好朋友给你赠送了1000个lumens，请查收!')
        this.loadAccound()
      }).catch(function () {
        Toast('要钱没有，要命一条')
      })
    },

    showWalletSend: function () {
      this.walletSend = true
    }
  },
  data () {
    return {
      publicKey: '',
      valueType: 'Coinmarketcap',
      valueTypes: ['Coinmarketcap', 'Kraken'],
      wallets: [],
      popupVisible: false,
      walletSend: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-popup .mint-popup-3 {
    width: 100%;
    height: 100%;
    background-color: #fff;
}
.page-popup .mint-popup-3 .mint-button {
    position: absolute;
    width: 90%;
    top: 50%;
    left: 5%;
    -webkit-transform: translateY(-50%);
            transform: translateY(-50%);
}
</style>
