<template>
  <div>
    <h5>转账</h5>
    <p>你可以使用 public address，email地址 或者 federatd 地址</p>
    <mt-field label="To" placeholder="接收者地址" v-model="receiver"></mt-field>
    <mt-field label="Amount" placeholder="金额" v-model="amount"></mt-field>
    <div>
      <select v-model="asset">
        <option>XLM</option>
      </select>
    </div>

    <mt-button type="primary" v-on:click="send">发送</mt-button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Toast } from 'mint-ui'

export default {
  name: 'WalletSend',
  data: function () {
    return {
      receiver: '',
      amount: 0,
      asset: 'XLM'
    }
  },

  methods: {
    ...mapActions([
      'sendAccount'
    ]),
    send: function () {
      // 检测输入金额
      if (!this.amount || this.amount < 0 || isNaN(this.amount) || isNaN(parseFloat(this.amount))) {
        Toast('请输入数字')
        return false
      }

      // 检测地址的输入
      if (!this.receiver) {
        Toast('请输入收钱人的地址')
        return false
      }

      // todo 分析地址 按照不同的方式组装
      this.sendAccount({
        destination: {
          account_id: this.receiver
        },
        asset: 'XLM',
        amount: this.amount
      })
    }
  }
}
</script>

<style scoped>

</style>
