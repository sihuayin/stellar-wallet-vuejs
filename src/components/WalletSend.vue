<template>
  <div>
    <h5>转账</h5>
    <p>你可以使用 public address，email地址 或者 federatd 地址</p>
    <mt-field label="To" placeholder="接收者地址" v-model="receiver"></mt-field>

    <div>
      <mt-field label="Amount" placeholder="金额" v-model="amount"></mt-field>
      <select v-model="asset">
        <option>XLM</option>
      </select>
    </div>

    <div>
      <label>Memo type</label>
      <select v-model="memoType">
        <option value="MEMO_TEXT">MEMO_TEXT</option>
        <option value="MEMO_ID">MEMO_ID</option>
        <option value="MEMO_HASH">MEMO_HASH</option>
        <option value="MEMO_RETURN">MEMO_RETURN</option>
      </select>

      <mt-field label="Memo value" placeholder="memo value" v-model="memoValue"></mt-field>
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
      asset: 'XLM',
      memoType: '',
      memoValue: ''
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
        amount: this.amount,
        memo: this.memoValue,
        memo_type: this.memoType
      })
    }
  }
}
</script>

<style scoped>

</style>
