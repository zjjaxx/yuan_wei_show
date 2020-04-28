/*
 * @Author: zjj
 * @Date: 2019-09-27 08:43:49
 * @LastEditors: zjj
 * @LastEditTime: 2019-11-15 09:10:35
 */
import axios from "axios"
import  Qs from "querystring";
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
// local.weile999.com
// https://ces.weile999.com
instance.defaults.baseURL = "https://ces.weile999.com";
instance.defaults.timeout = 10000;
instance.interceptors.request.use(function (config) {
    // if (store.state.token) {
    //     config.headers["authorization"] = "bearer " + store.state.token
    // }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // if (!response.data.msg) {
    //     Notify(response.data.result)
    //     if(response.data.result=="手机号码未绑定"){
    //         router.push({name:"quickLogin",query:{type:2}})
    //     }
        
    //     return Promise.reject(response.data.result);
    // }
    // else{
        return response;
    // }
  
}, function (error) {
    // Do something with response error
    // if (error.response.data.code == 401) {
    //     store.commit("exit")
    //     router.replace("/login")
    // }
    // else if (error.response.data.code == 403) {
    //     store.commit("exit")
    //     router.replace("/login")
    // }
    // Toast(error.response.data.result);
    return Promise.reject(error.response.data.result);
});

export default instance;