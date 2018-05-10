import store from 'store'
import * as func from './func'
var activeWallet = null

export default {
  setActiveWallet: function (wallet) {
    activeWallet = wallet
    store.set('activew', JSON.stringify(activeWallet))
  },

  getAllWallets: function () {
    var wallets = store.get('actives')
    if (wallets) {
      wallets = JSON.parse(wallets)
    } else {
      wallets = []
    }

    if (!Array.isArray(wallets)) {
      wallets = []
    }
    for (var i = 0, len = wallets.length; i < len; i++) {
      wallets[i].secretKey = func.decodeSecretKey(wallets[i].secretKey)
    }

    return wallets
  },

  setWallets: function (wallets) {
    if (!wallets || !Array.isArray(wallets) || wallets.length < 1) {
      return false
    }

    store.set('actives', JSON.stringify(wallets))
  },
  setSetting: function (obj) {
    var j
    for (var i in obj) {
      j = i
      if (!i.startsWith('setting_')) {
        i = 'setting_' + i
      }
      store.set(i, obj[j])
    }
  },
  getSetting: function () {
    var setting = {}
    store.each(function (value, key) {
      if (key && key.startsWith('setting_')) {
        setting[key.replace('setting_', '')] = value
      }
    })

    return setting
  }
}
