import {request} from '@/network/request'

// 手机号
export const wechatPhone = (data) => request({url: '/admin/wx/addPone', method: 'post', data});

// 微信登录
export const wechatLogin = (data) => request({url: '/admin/wx/wxLogin', method: 'post', data});
