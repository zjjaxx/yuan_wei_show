import axios from "./http"
export const home=()=>axios.get("/api/home")//首页数据
export const activities_v2 = (data) => axios.get("/api/v2/home/activities", { params: data })//活动