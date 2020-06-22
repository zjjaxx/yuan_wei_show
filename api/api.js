import axios from "./http"
export const login=(data)=>axios.post("/api/v1/auth/login",data)//登入
export const register=(data)=>axios.post("/api/v1/auth/register",data)//注册
export const msgCode=(data)=>axios.post("/api/v1/auth/msgCode",data)//验证码
export const registrationId=(data)=>axios.post("/api/v1/user/registrationId",data)//极光推送
export const home=(data)=>axios.get("/api/v1/home",{params:data})//首页数据
export const productDetail=(data)=>axios.get("/api/v1/product/detail",{params:data})//产品详情
export const comment=(data)=>axios.post("/api/v1/product/comment",data)//留言
export const like=(data)=>axios.post("/api/v1/product/like",data)//点赞
export const collect=(data)=>axios.post("/api/v1/product/collect",data)//收藏
export const create=(data)=>axios.get("/api/v1/order/create",{params:data})//创建订单详情
export const pay=(data)=>axios.post("/api/v1/order/pay",data)//支付
export const address=()=>axios.get("/api/v1/address")//地址列表
export const store=(data)=>axios.post("/api/v1/address/store",data)//新建地址列表
export const destroy=(data)=>axios.post("/api/v1/address/destroy",data)//删除地址
export const edit =(data)=>axios.get("/api/v1/address/edit",{params:data}) //编辑地址
export const update =(data)=>axios.post("/api/v1/address/update",data) //更新地址
export const set_default =(data)=>axios.post("/api/v1/address/set_default",data) //设置默认地址
export const category=()=>axios.get("/api/v1/product/category") //分类
export const tags=(data)=>axios.get("/api/v1/product/tags",{params:data})//获取标签
export const upload=(data)=>axios.post("/api/v1/image/upload",data)//图片上传
export const publish=(data)=>axios.post("/api/v1/product/publish",data)//发布
export const productEdit=(data)=>axios.get("/api/v1/product/edit",{params:data})//编辑发布
export const productUpdate=(data)=>axios.post("/api/v1/product/update",data)
export const info=()=>axios.get("/api/v1/user/info")//个人中心
export const activities_v2 = (data) => axios.get("/api/v2/home/activities", { params: data })//活动
export const area=()=>axios.get("/api/area",{baseURL:"https://ces.weile999.com"})//地址
export const categoryHome=(data)=>axios.get("/api/v1/category",{params:data})//首页分类