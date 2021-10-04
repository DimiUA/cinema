import { createStore } from "vuex"

const store = createStore({
  state: {
    error: null,
    alert: null,
  },
  mutations: {
    SET_ERROR(state, error) {
      state.error = error
    },
    SET_ALERT(state, alert) {
      state.alert = alert
    },
  },
  getters: {
    error: s => s.error,
    alert: s => s.alert,
  },
  actions: {

  }
})
export default store