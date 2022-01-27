const TokenKey = 'authorization'

export function getToken() {
    return sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
    sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
    sessionStorage.removeItem(TokenKey)
}

export function getUserInfo() {
    return JSON.parse(sessionStorage.getItem('userInfo'))
}

export function setUserInfo(userInfo) {
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

export function removeUserInfo() {
    sessionStorage.removeItem('userInfo')
}