<template>
  <div class="listItem">
    <div class="listItem-date">{{ date }}</div>
    <div class="listItem-del fn-flex">
      <div class="left">
        <span class="fn-break">{{ key }}</span>
        <span class="text-gray">{{ memo }}：{{ memo_type }}</span>
      </div>
      <div class="right fn-break">{{ action === 'send' ? '-' : '+' }} {{ amount | formatLumens }} {{ asset }}</div>
    </div>
  </div>
</template>

<script>
import sdk from '../libs/sdk'
import * as func from '../libs/func'

export default {
  name: 'TransactionList',
  props: ['transaction_id', 'item'],
  created: function () {
    var that = this
    var item = this.item
    var server = sdk.getServer()

    server.transactions()
      .transaction(this.transaction_id)
      .call()
      .then(function (transaction) {
        var date = new Date(transaction.created_at)
        that.date = date.toLocaleString()

        switch (item.type) {
          case 'create_account':
            that.amount = item.starting_balance
            that.asset = 'XLM'
            if (item.account === that.publicKey) {
              that.key = item.funder
              that.action = 'received'
            } else {
              that.key = item.account
              that.action = 'send'
            }

            break
          case 'account_merge':
            that.amount = false
            this.asset = 'XLM'
            if (item.source_account === that.publicKey) {
              that.key = item.into
              that.action = 'send'
            } else {
              that.key = item.source_account
              that.action = 'received'
            }
            break
          case 'payment':
            that.amount = item.amount
            if (item.from === that.publicKey) {
              that.key = item.to
              that.action = 'send'
            } else {
              that.key = item.from
              that.action = 'received'
            }
            break
          default:
            break
        }

        that.memo_type = (transaction.memo_type !== 'none' ? 'MEMO_' + transaction.memo_type : '').toUpperCase()
        that.memo = transaction.memo ? transaction.memo : ''
      })

      // todo account_merge 的情况
  },

  methods: {
    init: function () {}
  },
  filters: {
    formatLumens: function (value) {
      return func.formatLumens(value)
    }
  },
  data () {
    return {
      date: '',
      key: '',
      action: '',
      asset: 'XLM',
      amount: 0,
      memo_type: '',
      memo: ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .listItem{font-size: 0.875em;}
  .listItem-date{padding: 0.5em 1em; background-color: #f5f5f5; font-size: 0.875em;}
  .listItem-del{justify-content: space-between; padding: 0.5em 1em; border-bottom: 1px solid #e5e5e5;}
  .listItem-del .left{flex: 2;}
  .listItem-del .left span{display: block;}
  .listItem-del .right{flex: 1; padding-left: 1em; text-align: right;}
  .listItem-del .left .text-gray{font-size: 0.75em; color: #9e9e9e;}
  @media screen and (max-width: 480px) {
    .listItem-date{padding: 0.5em 0.625em;}
    .listItem-del{padding: 0.5em 0.625em;}
  }
</style>
