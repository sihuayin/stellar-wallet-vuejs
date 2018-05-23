<template>
  <div class="container">
    <div class="head">
      <div class="navbar fn-flex">
        <div class="navbar-left fn-flex">
          <i class="iconfont icon-wallet logo"></i>
          <h1>{{ wallet && wallet.name || '未命名'}}</h1>
        </div>
        <div class="navbar-right">
          <div class="navbar-right-select" v-on:click="showPop">管理<i class="iconfont icon-list"></i></div>
          <DropMenu v-bind:showTools="showTools" v-on:away="away"/>
        </div>
      </div>
    </div>
    <div class="tips" v-if="!isOnlineAccount"><p>您的账户还未被网络记录，你需要发送至少20个lumens (XLM)到这个账户。</p></div>
    <div class="content">
      <ul class="wallet-con">
        <li class="blue-text">{{ wallet && wallet.name || '未命名'}}</li>
        <li class="num">{{ balance }} XLM</li>
        <li class="cost">{{ usdBalance }} USD</li>
        <li><button v-if="!isAsking" type="button" v-on:click="askForSomeLumens" class="ui-btn">获取测试币</button><Spinner v-else /></li>
      </ul>
      <p><router-link to="/history" class="fn-flex">查看交易记录</router-link></p>
      <Tab v-bind:titles="[{text: '收钱', key: 'received'}, {text: '转账', key: 'send'}]" defaultKey="received">
        <div slot="received">
          <div class="wallet-receive">
            <div class="address">收款地址：{{ publicKey }}</div>
            <p class="gray-text">注：将收款地址提供给收款方即可</p>
          </div>
        </div>
        <div slot="send">
          <div class="wallet-send">
            <WalletSend />
          </div>
        </div>
      </Tab>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
import WalletSend from './WalletSend'
import LeftSide from './LeftSide'
import sdk from '../libs/sdk'
import DropMenu from './widget/DropMenu'
import Tab from './widget/Tab'
import Spinner from 'vue-simple-spinner'

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
    LeftSide,
    WalletSend,
    DropMenu,
    Tab,
    Spinner
  },
  created: function () {
    if (!this.wallet) {
      return this.$router.go(-1)
    }
    this.publicKey = this.wallet.publicKey
    this.loadAccound()

    // 监听变更
    // var server = sdk.getServer()
    // var that = this
    // server.payments()
    //   .cursor('now')
    //   .forAccount(wallet.publicKey)
    //   .stream({
    //     onmessage: function (message) {
    //       console.log(message)
    //       that.loadAccound()
    //     }
    //   })
  },
  methods: {
    ...mapActions([
      'loadAccound',
      'setWallets'
    ]),

    showPop: function () {
      this.showTools = !this.showTools
    },
    away: function () {
      this.showTools = false
    },
    askForSomeLumens: function () {
      this.isAsking = true
      sdk.whoIsYourDaddy(this.publicKey)
        .then((res) => {
          this.isAsking = false
          Vue.toast('好朋友给你赠送了1000个lumens，请查收!')
          this.loadAccound()
        })
        .catch(function () {
          this.isAsking = false
          Vue.toast('要钱没有，要命一条')
        })
    },

    showWalletSend: function () {
      this.walletSend = true
    },

    changeTab: function (name) {
      this.showTab = name
    }
  },
  data () {
    return {
      publicKey: '',
      valueType: 'Coinmarketcap',
      valueTypes: ['Coinmarketcap', 'Kraken'],
      wallets: [],
      popupVisible: false,
      walletSend: false,
      isTest: sdk.isTest(),
      showTools: false,
      showTab: 'receive',
      isAsking: false,
      classTab: function (name) {
        return {
          active: this.showTab === name
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .head{background-color: #fff; box-shadow: 0 2px 2px rgba(0,0,0,.05), 0 1px 0 rgba(0,0,0,.05); position: relative; z-index: 1;}
  .navbar{box-sizing: border-box; height: 3.5em; max-width: 60em; padding: 0 0.625em; margin: 0 auto; line-height: 3.5em; justify-content: space-between;}
  .navbar .logo{font-size: 1.5em; color: #2196f3;}
  h1{margin-left: 0.35em; font-size: 1.25em;}
  .navbar-right{position: relative; z-index: 1;}
  .navbar-right-select i{margin-left: 0.35em; color: #999;}

  .tips{box-sizing: border-box; max-width: 60em; margin: 0 auto; padding: 0.75em;}
  .tips p{font-size: 0.875em;}
  .content{box-sizing: border-box; max-width: 60em; margin: 0 auto; padding: 2em 1em; background-color: #fff;}
  .wallet-con .blue-text{font-size: 1.25em; line-height: 150%;}
  .wallet-con li{padding-bottom: 0.5em;}
  .wallet-con .num{font-size: 2em; line-height: 120%;}
  .wallet-con .cost{font-size: 1.25em; color: #9e9e9e;}

  .wallet-receive .address{margin-bottom: 1em; white-space:normal; word-break:break-all;}
  .wallet-receive .gray-text{font-size: 0.875em;}
  .content{box-sizing: border-box; max-width: 60em; margin: 0 auto; padding: 2em; background-color: #fff;}
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
  @media screen and (max-width: 480px) {
    .content{padding: 1.5em 0.625em;}
  }
</style>
