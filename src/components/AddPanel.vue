<template>
  <div id="container">
    <h4 class="blue-text darken-1">已有账户?</h4>
    <h5 class="grey-text darken-1 light margin-UB">输入密钥来解锁</h5>
    <div>
      <mt-field label="密钥" v-model="secretKey">
        <img src="https://cn.vuejs.org/images/bmqb.png" height="45px" width="100px">
      </mt-field>

      <mt-button type="primary" @click.native="unlockWithSecretKey">解锁</mt-button>
    </div>
    <hr />
    <section>
      <h4 class="blue-text darken-1">还没有账户?</h4>
      <h5 class="grey-text darken-1 light margin-UB">创建一个</h5>
      <p>publicKey: {{ publicKey }}</p>
      <p>secretKey: {{ secretKey }}</p>
      <mt-button type="primary" @click.native="generateKeypair">生成</mt-button>
    </section>
  </div>
</template>

<script>
import {Toast} from 'mint-ui'
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
        Toast('输入的私钥')
        return false
      }

      var keyPair = getKeypairFromSecretKey(StellarSdk, this.secretKey)

      if (!keyPair) {
        Toast('输入的私钥错误')
        return false
      }

      var wallet = {
        publicKey: this.publicKey,
        secretKey: this.secretKey,
        active: true,
        name: '钱包'
      }
      this.updateWalletBySecretKey({wallet: wallet, secretKey: this.secretKey})
      this.secretKey = ''
      this.publicKey = ''
      this.$emit('onComplete')
    },
    generateKeypair: function () {
      var keypair = StellarSdk.Keypair.random()
      this.publicKey = keypair.publicKey()
      this.secretKey = keypair.secret()
    }
  },
  data: () => {
    return {
      publicKey: '',
      secretKey: ''
    }
  }
}
</script>

<style scoped>

</style>
