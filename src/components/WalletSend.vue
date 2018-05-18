<template>
  <div>
    <p class="gray-text">你可以使用public address，email地址或者federatd地址</p>
    <div class="form-area">
      <div class="form-input fn-flex">
        <span>支付给</span>
        <input type="text" v-model="receiver" />
      </div>
      <div class="form-input fn-flex">
        <span>说明</span>
        <input type="text" v-model="message" />
      </div>
      <div class="form-input fn-flex form-amount">
        <span>金额</span>
        <input type="text" v-model="amount" />
        <select v-model="asset">
          <option>XLM</option>
        </select>
      </div>
    </div>
    <div class="action">
      <button type="button" v-on:click="send" class="ui-btn">发送</button>
    </div>
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
  .form-area{margin-top: 1em;}
  .form-input{margin-bottom: 1em;}
  .form-input .iconfont{margin-right: 0.15em; font-size: 1.625em; color: #888;}
  .form-input input{flex-grow: 1; padding: 0.25em 0.5em; margin-top: 0.5em; background-color: transparent; border-bottom: 1px solid #a5a5a5; font-size: 1.125em;}
  .form-input span{padding-top: 0.35em; width: 4em;}
  .form-amount input{flex-grow: 0;}
  .form-amount select{margin-left: 1em; height: 2.25em;}
  .action{margin-top: 2em;}
</style>
