import axios from "./http"
export const login=(data)=>axios.post("/api/v1/auth/login",data)//登入
export const register=(data)=>axios.post("/api/v1/auth/register",data)//注册
export const msgCode=(data)=>axios.post("/api/v1/auth/msgCode",data)//验证码
export const home=()=>axios.get("/api/home")//首页数据
export const activities_v2 = (data) => axios.get("/api/v2/home/activities", { params: data })//活动
export const area=()=>axios.get("/api/area",{baseURL:"https://ces.weile999.com"})//地址