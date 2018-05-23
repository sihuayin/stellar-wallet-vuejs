<template>
  <div class="content">
    <div class="column">
      <h2 class="blue-text">已有账户?</h2>
      <p class="sub-title">输入密钥解锁</p>
      <div class="form-area">
        <div class="form-input fn-flex">
          <i class="iconfont icon-suo"></i>
          <span>密钥</span>
          <input type="text" v-model="secretKey" />
        </div>
      </div>
      <div class="action">
        <button type="button" v-on:click="unlockWithSecretKey" class="ui-btn">解锁</button>
      </div>
    </div>

    <div class="column-no">
      <h2>还没有账户?</h2>
      <p class="sub-title">创建一个</p>
      <div class="form-area" v-if="showKey">
        <div class="form-input fn-flex">
          <i class="iconfont icon-wallet"></i>
          <span>公钥</span>
          <input type="text" readonly v-model="publicKey" />
        </div>
        <div class="form-input fn-flex">
          <i class="iconfont icon-suo"></i>
          <span>私钥</span>
          <input type="text" readonly v-model="secretKey" />
        </div>
      </div>
      <div class="action">
        <button v-if="!showKey" type="button" v-on:click="generateKeypair" class="ui-btn">创建</button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions } from 'vuex'
var StellarSdk = require('stellar-sdk')

var getKeypairFromSecretKey = function (StellarSdk, secretKey) {
  var keyPair, publicKey
  try {
    keyPair = StellarSdk.Keypair.fromSecret(secretKey)
    publicKey = keyPair.publicKey()
  } catch (e) {
    console.log('无效值')
    return false
  }

  return {'publicKey': publicKey, 'secretKey': secretKey}
}

export default {
  name: 'AddPanel',
  props: ['redirect'],
  methods: {
    ...mapActions([
      'setWallets',
      'updateWalletBySecretKey'
    ]),
    unlockWithSecretKey: function () {
      if (!this.secretKey) {
        Vue.toast('输入的私钥')
        return false
      }

      var keyPair = getKeypairFromSecretKey(StellarSdk, this.secretKey)

      if (!keyPair) {
        Vue.toast('输入的私钥错误')
        return false
      }

      var wallet = {
        publicKey: keyPair.publicKey,
        secretKey: keyPair.secretKey,
        active: true,
        name: ''
      }
      this.updateWalletBySecretKey({wallet: wallet, secretKey: keyPair.secretKey, force: true})
      this.secretKey = ''
      this.publicKey = ''
      this.$emit('onComplete')
    },
    generateKeypair: function () {
      var keypair = StellarSdk.Keypair.random()
      this.publicKey = keypair.publicKey()
      this.secretKey = keypair.secret()
      this.showKey = true
    }
  },
  data: () => {
    return {
      publicKey: '',
      secretKey: '',
      showKey: false
    }
  }
}
</script>

<style scoped>
  .content{max-width: 60em; margin: 0 auto; box-sizing: border-box; background-color: #fff;}
  .column{padding: 3em 6em; background-color: #f6f6f6;}
  .column-no{padding: 3em 6em; border-top: 1px solid #f3f3f3;}
  h2{margin-bottom: 0.625em; font-size: 1.25em;}
  .sub-title{color: #9e9e9e;}
  .form-area{margin-top: 2em;}
  .form-input{margin-bottom: 2em;}
  .form-input .iconfont{margin-right: 0.15em; font-size: 1.625em; color: #888;}
  .form-input input{flex-grow: 1; padding: 0.25em 0.5em; margin-top: 0.5em; background-color: transparent; border-bottom: 1px solid #a5a5a5; font-size: 1.125em;}
  .form-input span{padding-top: 0.35em; margin-right: 0.5em; font-size: 1.125em;}
  .action{margin-top: 2em;}

  @media screen and (max-width: 480px) {
    .column{padding: 1.5em 0.625em;}
    .column-no{padding: 1.5em 0.625em;}
    .form-input{flex-wrap: wrap;}
    .form-input input{display: block; width: 100%;}
  }
</style>
