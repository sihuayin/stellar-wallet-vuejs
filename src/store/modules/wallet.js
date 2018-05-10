import sdk from '../../libs/sdk'
import * as func from '../../libs/func'
import { Toast } from 'mint-ui'
import request from 'superagent'
import storage from '../../libs/storage'
import StellarSdk from 'stellar-sdk'
// initial state
// shape: [{ id, quantity }]
const state = {
  wallets: [],
  activeWallet: {},
  testValue: 1,
  isOnlineAccount: false,
  balance: 0,
  balanceFloat: 0,
  usdBalance: 0,
  customerSecretKey: '',
  account: null
}

// getters
const getters = {
  getWallets: (state) => state.wallets,
  getTest: state => state.testValue,

  getActiveWallet: (state) => {
    return state.wallets.find(wallet => wallet.active)
  },
  isOnlineAccount: (state) => state.isOnlineAccount,
  balance: (state) => state.balance,
  balanceFloat: (state) => state.balanceFloat,
  usdBalance: (state) => state.usdBalance,
  getActiveIndex: (state) => state.wallets.findIndex(wallet => wallet.active)
}

// actions
const actions = {
  test ({ state, commit }, value) {
    commit('setTest', value)
  },

  setWallets ({ commit }, wallets) {
    if (!wallets || !Array.isArray(wallets) || wallets.length < 1) {
      return false
    }

    for (var i = 0, len = wallets.length; i < len; i++) {
      wallets[i].secretKey = func.encodeSecretKey(wallets[i].secretKey)
      wallets[i].name = wallets[i].name || '钱包 - ' + i
    }

    commit('setWallets', wallets)
  },

  loadAccound ({ dispatch, state, commit }, wallet) {
    var server = sdk.getServer()
    server.loadAccount(wallet.publicKey).then((data) => {
      // success = true
      commit('setAccount', data)
      commit('setOnline', true)
      dispatch('updateWalletBalance', {data: data})
      dispatch('updateUsdBalance', 'Kraken')
    }).catch(function (err) {
      if (err.name === 'NotFoundError') {
        // success = true
        Toast('没有入链条的key: ' + wallet.publicKey)
        commit('setOnline', false)
        return false
      }
      Toast('没有入链条的key: ' + err.detail)
    }).finally(function () {
      // if (success) {
      //   that.$router.push('/wallet')
      // }
    })
  },

  updateWalletBalance: function ({ state, commit }, wallet) {
    commit('resetBalance')
    try {
      for (var i = 0; i < wallet.data.balances.length; i++) {
        if (wallet.data.balances[i].asset_type === 'native') {
          commit('setBalance', wallet.data.balances[i].balance)
        }
      }
    } catch (e) {
      commit('resetBalance')
    }
  },

  updateUsdBalance: function ({ state, commit }, type) {
    switch (type) {
      case 'Coinmarketcap':
        request.get('https://api.coinmarketcap.com/v1/ticker/stellar/')
          .query({'convert': 'EUR'})
          .then(function (res) {
            commit('setUsdBalance', (state.balanceFloat * res.body[0].price_usd).toFixed(2).toLocaleString())
          })
        break

      case 'Kraken':
        request.get('https://api.kraken.com/0/public/Ticker')
          .query({'pair': 'XLMUSD'})
          .then(function (res) {
            commit('setUsdBalance', (state.balanceFloat * res.body.result.XXLMZUSD.a[0]).toFixed(2).toLocaleString())
          })
        break

      default:
        commit('setUsdBalance', '未知')
        break
    }
  },

  updateCustomerSecredKey: function ({state}, value) {
    state.customerSecretKey = value
  },

  updateWalletByIndex ({state, commit}, data) {
    var index = data.index
    var wallet = data.wallet
    var wallets = state.wallets
    if (wallets[index]) {
      wallets[index] = wallet
    }

    storage.setWallets(JSON.parse(JSON.stringify(wallets)))
    commit('setWallets', wallets)
  },

  updateWalletBySecretKey ({state, commit}, data) {
    var index = state.wallets.findIndex(item => item.secretKey === func.encodeSecretKey(data.secretKey))
    if (index < 0) {
      commit('addWallet', data.wallet)
      storage.setWallets(JSON.parse(JSON.stringify(state.wallets)))
    }
  },

  updateWalletActive ({state, commit}, index) {
    var wallets = JSON.parse(JSON.stringify(state.wallets))
    for (var i = 0; i < wallets.length; i++) {
      wallets[i].active = false
    }
    wallets[index].active = true
    commit('setWallets', wallets)
    storage.setWallets(wallets)
  },

  sendAccount ({state, commit}, data) {
    var activeWallet = state.wallets.find(wallet => wallet.active)
    if (!activeWallet) {
      return false
    }
    var server = sdk.getServer()
    var transaction = new StellarSdk.TransactionBuilder(state.account)
      .addOperation(StellarSdk.Operation.payment({
        destination: data.destination.account_id,
        asset: StellarSdk.Asset.native(),
        amount: data.amount
      }))
      .addMemo(StellarSdk.Memo.text('tet'))
      .build()

    transaction.sign(StellarSdk.Keypair.fromSecret(func.decodeSecretKey(activeWallet.secretKey)))
    server.submitTransaction(transaction)
      .then((transactionResult) => {
        console.log(transactionResult)
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

// mutations
const mutations = {
  setTest (state, value) {
    state.testValue = value
  },
  setWallets (state, wallets) {
    state.wallets = wallets
  },
  addWallet (state, wallet) {
    state.wallets.push(wallet)
  },
  setOnline (state, status) {
    state.isOnlineAccount = status
  },
  resetBalance (state) {
    state.balance = 0
    state.balanceFloat = 0
  },
  setBalance (state, value) {
    state.balance = func.formatLumens(value)
    state.balanceFloat = value
  },
  setUsdBalance (state, value) {
    state.usdBalance = value
  },
  setAccount (state, value) {
    state.account = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
