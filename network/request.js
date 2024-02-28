import {BASE_URL} from "@/network/config";


// 请求函数
export const request = (options) => {

    return new Promise((resolve, reject) => {
        options.url = BASE_URL + options.url;

        uni.request({
            ...options,
            header: {
                token: uni.getStorageSync('token')
            },
            success(response) {
                const mappingKey = {
                    "success": 200,// 正常情况
                    "expired": 403,// token过期
                }
                if (response.data['code'] === mappingKey['success'] || response.data['status'] === mappingKey['success']) {
                    return resolve(response.data);
                } else if (response.data['code'] === mappingKey['expired']) {

                    return reject(response.data);

                } else {
                    console.error(response.data)
                    return reject(response.data);
                }
            },
        });

    })
};


/*
import {baseURL} from "@/network/config";


import {TokenManager} from "./TokenManager";


// 请求函数
export const request = async (options) => {
    // console.log('options11111', options);

    options.url = baseURL + options.url;

    await TokenManager.updateToken();
    const token = TokenManager.getToken();

    try {

        const response = await uni.request({
            ...options,
            header: {
                token: token,
            }
        });

        const mappingKey = {
            "success": 200,// 正常情况
            "tokenExpired": 401,// token失效
        }

        const resData = response.data;

        if (resData.code === mappingKey['success']) {
            return Promise.resolve(resData);
        } else if (resData.code === mappingKey['tokenExpired']) {

            return new Promise((resolve, reject) => {
                // 将因为 Token 失效而中断的请求暂存起来
                TokenManager.requestQueue.push({options, resolve, reject});
            });
        } else {
            console.error(resData.msg);
            return Promise.reject(new Error(resData.msg));
        }
    } catch (error) {
        console.error('请求失败', error);
        return Promise.reject(error);
    }
};
*/
