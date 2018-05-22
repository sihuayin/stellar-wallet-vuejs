<template>
  <div class="container">
    <Head />
    <div class="content">
      <div class="fn-flex column-top"><h2 class="column-title">钱包账户管理</h2><button type="button" class="ui-btn" v-on:click="showForm">添加</button></div>
      <ul id="example-1" class="wallet-list">
        <li class="fn-flex" v-for="(wallet, index) in wallets" v-bind:key="index">
          <div class="checkBox"><input type="radio" name="active_value" v-model="activeIndex" v-bind:value="index"></div>
          <div class="wallet">
            <p><span class="label">名称：</span><input v-bind:value="wallet.name" v-on:input="updateOneWalletName($event.target.value, index)"/></p>
            <p class="fn-break"><span class="label">密钥：</span><span>{{wallet.secretKey}}</span></p>
            <p class="fn-break"><span class="label">地址：</span><span>{{wallet.publicKey}}</span></p>
          </div>
        </li>
      </ul>
      <div class="submitBtn"><button type="button" class="ui-btn">保存</button></div>
    </div>
    <modals-container />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import storage from '../libs/storage'
import AddPanel from './AddPanel'
import Head from './Head'

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
    AddPanel,
    Head
  },
  methods: {
    ...mapActions([
      'setWallets',
      'updateWalletByIndex',
      'updateWalletActive'
    ]),
    showForm: function () {
      this.$modal.show(AddPanel, {
        onComplate: () => {}
      }, {
        height: 'auto'
      }, {
        'before-close': (event) => { console.log('this will be called before the modal closes') }
      })
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
  .fn-break{white-space:normal; word-break:break-all;}
  .column-top{margin-bottom: 1em; padding: 0.5em 0; justify-content: space-between;}
  .content{box-sizing: border-box; max-width: 60em; min-height: 36em; margin: 0 auto; padding: 1.5em 1em; background-color: #fff;}
  .column-title{font-size: 1.125em;}
  .wallet-list{border-top: 1px solid #e5e5e5;}
  .wallet-list li{padding: 1em 0.625em; border-bottom: 1px solid #e5e5e5;}
  .wallet-list li .checkBox{margin:  0 1em;}
  .submitBtn{margin-top: 2.5em; text-align: center;}
  .submitBtn .ui-btn{width: 100%;}

  @media screen and (max-width: 480px) {
    .content{padding: 1em 0; min-height: auto;}
    .column-top{padding: 0.5em 0.625em;}
    .submitBtn{margin-left: 0.625em; margin-right: 0.625em;}
  }
</style>
