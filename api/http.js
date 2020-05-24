/*
 * @Author: zjj
 * @Date: 2019-09-27 08:43:49
 * @LastEditors: zjj
 * @LastEditTime: 2019-11-15 09:10:35
 */
import axios from "axios"
import Qs from "querystring";
import { baseURL } from "../utils/config"
import {showToast} from "../utils/common"
import store from "../store/store"
const instance = axios.create({
    //表单格式
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    //格式转化
    //var a = {name:'hehe',age:10};
    //qs.stringify(a)
    // 'name=hehe&age=10'
    transformRequest: [function (data) {
        data = Qs.stringify(data);
        return data;
    }],
})
instance.defaults.baseURL = baseURL;
instance.defaults.timeout = 10000;
instance.interceptors.request.use(function (config) {
    const {token}=store.getState()
    if (token) {
        config.headers["authorization"] = "bearer " +token
    }
    return config;
}, function (error) {
    showToast(error)
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    if (!response.data.msg) {
        showToast(response.data.result)
        return Promise.reject(response.data.result);
    }
    return response;
    // }

}, function (error) {
    // Add a Toast on screen.
    showToast(error.response.data.result)
    return Promise.reject(error.response.data.result);
});

export default instance;