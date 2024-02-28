import {request} from '@/network/request'

export const getLogin = (data) => request({url: '/index/api/login', method: 'post', data});



export const getMineOrderList = (data) => request({url: '/feiying/api.order/getMineOrderList', method: 'post', data});


