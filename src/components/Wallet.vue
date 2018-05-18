<template>
  <div class="container">

    <div class="head">
      <div class="navbar fn-flex">
        <div class="navbar-left fn-flex">
          <i class="iconfont icon-wallet logo"></i>
          <h1 v-bind:title={{ wallet && wallet.name || '未命名'}}></h1>
        </div>
        <div class="navbar-right">
          <div class="navbar-right-select" v-on:click="showPop">管理<i class="iconfont icon-list"></i></div>
          <div class="tool-slide" v-if="showTools">
            <div class="tool-arrow"><i class="iconfont icon-arrow"></i></div>
            <ul class="tool-list">
              <li><router-link to="/wallet_list" class="fn-flex"><span>管理钱包</span><i class="iconfont icon-angle"></i></router-link></li>
              <li><router-link to="/wallet_list" class="fn-flex"><span>设置</span><i class="iconfont icon-angle"></i></router-link></li>
            </ul>
          </div>
        </div>

      </div>
    </div>
    <div class="tips" v-if="!isOnlineAccount"><p>您的账户还未被网络记录，你需要发送至少20个lumens (XLM)到这个账户。</p></div>
    <div class="content">
      <ul class="wallet-con">
        <li class="blue-text">{{ wallet && wallet.name || '未命名'}}</li>
        <li class="num">{{ balance }} XLM</li>
        <li class="cost">{{ usdBalance }} USD</li>
        <li><button type="button" v-on:click="askForSomeLumens" class="ui-btn">获取测试币</button></li>
      </ul>
      <ul class="ui-tab wallet-tab fn-flex">
        <li v-bind:class="classTab('receive')" v-on:click="changeTab('receive')"><a>收钱</a></li>
        <li v-bind:class="classTab('send')" v-on:click="changeTab('send')"><a>转账</a></li>
      </ul>
      <div class="ui-tab-content">
        <div class="wallet-receive" v-if="showTab == 'receive'">
          <div class="address">收款地址：{{ publicKey }}</div>
          <p class="gray-text">注：将收款地址提供给收款方即可</p>
        </div>
        <div class="wallet-send" v-if="showTab == 'send'">
          <WalletSend />
        </div>
      </div>

      <div class="walletHistory">
        <div class="column-title">交易记录</div>
        <TransactionList v-bind:publicKey="publicKey"/>
      </div>
    </div>

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
import sdk from '../libs/sdk'
import storage from '../libs/storage'

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
    var that = this
    var wallets = storage.getAllWallets()
    this.setWallets(wallets)

    var wallet = storage.getActiveWallet()
    if (!wallet) {
      return this.$router.go(-1)
    }
    this.publicKey = wallet.publicKey
    this.loadAccound()

    // 监听变更
    var server = sdk.getServer();
    server.payments()
      .cursor('now')
      .forAccount(wallet.publicKey)
      .stream({
        onmessage: function (message) {
          console.log(message)
          that.loadAccound()
        }
      })
  },
  methods: {
    ...mapActions([
      'loadAccound',
      'setWallets'
    ]),

    showPop: function () {
      this.showTools = !this.showTools;
    },
    askForSomeLumens: function () {
      sdk.whoIsYourDaddy(this.publicKey)
        .then((res) => {
          Toast('好朋友给你赠送了1000个lumens，请查收!')
          this.loadAccound()
        })
        .catch(function () {
          Toast('要钱没有，要命一条')
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
      classTab: function (name) {
        return {
          active: this.showTab == name,
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
  .tool-slide{position: absolute; z-index: 10; right: -0.625em;}
  .tool-list{width: 8em; background-color: #fff; box-shadow: 0 0 5px rgba(0,0,0,.2), 0 0 5px rgba(0,0,0,.2);}
  .tool-arrow{position: absolute; right: 0.5em; top: -0.2em; z-index: 9; color: #fff; text-shadow: rgba(0,0,0,.25) 0 -0.07em 0.1em;font-size: 1.25em; line-height: 0;}
  .tool-list li{border-top: 1px solid #f0f0f0; font-size: 0.875em; line-height: 150%;}
  .tool-list li .fn-flex{justify-content: space-between; padding: 0.875em 0.625em;}
  .tool-list li i{font-size: 0.625em; color: #9e9e9e;}

  .tips{box-sizing: border-box; max-width: 60em; margin: 0 auto; padding: 0.75em;}
  .tips p{font-size: 0.875em;}
  .content{box-sizing: border-box; max-width: 60em; margin: 0 auto; padding: 2em; background-color: #fff;}
  .wallet-con .blue-text{font-size: 1.25em; line-height: 150%;}
  .wallet-con li{padding-bottom: 0.5em;}
  .wallet-con .num{font-size: 2em; line-height: 120%;}
  .wallet-con .cost{font-size: 1.25em; color: #9e9e9e;}

  .wallet-receive .address{margin-bottom: 1em; white-space:normal; word-break:break-all;}
  .wallet-receive .gray-text{font-size: 0.875em;}

  .walletHistory{margin-top: 3em;}
  .column-title{margin-bottom: 1em; padding: 0.5em 1em; border-left: 3px solid #2196f3; background-color: #f5f5f5; font-size: 1.125em;}

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

  }
</style>
