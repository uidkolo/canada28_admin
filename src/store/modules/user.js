import { login, logout } from '@/api/admin'
import { getToken, setToken, removeToken, setUserInfo, getUserInfo, removeUserInfo } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: getUserInfo(),
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { phone, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ phone: phone.trim(), password: password }).then(res => {
        const { token, userInfo } = res
        commit('SET_TOKEN', token)
        commit('SET_USERINFO', userInfo)
        setToken(token)
        setUserInfo(userInfo)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserInfo()
      resetRouter()

      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  },

  // 获取用户的角色
  async getRoles({ commit }) {
    const roles = []
    const { role } = getUserInfo()
    roles.push(role)
    commit('SET_ROLES', roles)
    return roles
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      removeUserInfo()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
