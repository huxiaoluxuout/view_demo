import {request} from '@/network/request'

// 获取省份列表
export const getProvinceList = (data) => request({url: '/feiying/api.common/getProvinceList', method: 'post', data})

// 获取城市列表
export const getCityList = (data) => request({url: '/feiying/api.common/getCityList', method: 'post', data})

// 获取区、县列表
export const getCountyList = (data) => request({url: '/feiying/api.common/getCountyList', method: 'post', data})

// 获取街道列表
export const getStreetList = (data) => request({url: '/feiying/api.common/getStreetList', method: 'post', data})
