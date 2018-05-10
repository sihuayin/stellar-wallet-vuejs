import storage from '../../libs/storage'

var settings = storage.getSetting()
console.log(settings)

const state = {
  showToolTip: settings.showToolTip || true,
  usd: settings.usd || 'Kraken'
}

const getters = {
  showToolTip: (state) => state.showToolTip,
  usd: (state) => state.usd
}

const actions = {
  saveSetting: function ({ state, commit }, settings) {
    commit('setSetting', settings)
  }
}

const mutations = {
  setSetting (state, value) {
    state.showToolTip = value.showToolTip
    state.usd = value.usd

    storage.setSetting({
      showToolTip: value.showToolTip,
      usd: value.usd
    })
  },

  updateToolTip (state, value) {
    state.showToolTip = value
  },

  updateUsd (state, value) {
    state.usd = value
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
