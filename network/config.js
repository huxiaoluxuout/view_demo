const productionUrl = 'https://feiying.ahjinti.cn'
const testURL = 'https://feiying.ahjinti.cn'

export const devURL = 'https://feiying.ahjinti.cn'
export const proxyDevURL = 'http://192.168.0.16:3000/api'
// export const devURL = 'https://h.longduosci.com'

export const BASE_URL = devURL
console.log('BASE_URL',BASE_URL)
export const uploadImgUrl = BASE_URL + '/common/api.common/upload'

// export const BASE_URL = process.env.NODE_ENV === 'development' ? devURL : ''

// console.log('环境变量',process.env)

export const TOKEN_EXPIRY_INTERVAL = 1000 * 60 * 60 * 24; // 24小时过期

// export const TOKEN_EXPIRY_INTERVAL = 1000 * 6; // 6s过期
