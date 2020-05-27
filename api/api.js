import axios from "./http"
export const login=(data)=>axios.post("/api/v1/auth/login",data)//登入
export const register=(data)=>axios.post("/api/v1/auth/register",data)//注册
export const msgCode=(data)=>axios.post("/api/v1/auth/msgCode",data)//验证码
export const home=(data)=>axios.get("/api/v1/home",{params:data})//首页数据
export const productDetail=(data)=>axios.get("/api/v1/product/detail",{params:data})//产品详情
export const comment=(data)=>axios.post("/api/v1/product/comment",data)//留言
export const category=()=>axios.get("/api/v1/product/category") //分类
export const tags=(data)=>axios.get("/api/v1/product/tags",{params:data})//获取标签
export const upload=(data)=>axios.post("/api/v1/image/upload",data)//图片上传
export const publish=(data)=>axios.post("/api/v1/product/publish",data)//发布
export const activities_v2 = (data) => axios.get("/api/v2/home/activities", { params: data })//活动
export const area=()=>axios.get("/api/area",{baseURL:"https://ces.weile999.com"})//地址