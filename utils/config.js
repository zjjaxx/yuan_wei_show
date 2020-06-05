export const baseURL="https://api.yuanwei.show" //域名
export const wsURL="wss://api.yuanwei.show" //websocket url
export const validTimeCount=1000*60*60*24*7 //token有效时长
export const TOKEN_KEY="TOKEN" //token KEY
export const YW_KEY="YW" //token KEY
export const VALID_TIME="VALID_TIME" //token有效时长 KEY
export const USER_INFO="USER_INFO" //USER_INFO KEY
export const APP_KEY_CONFIG={
    ios: {
        appId: 1,
        appKey: "0UImBTMucSpDucl-PPeHRluBLr-fbqb4"
    },
    android: {
        appId: 2,
        appKey: "9Jh-pkadKvsDeha79eOMJGVzEylTkp4t"
    }
}
//聊天字段定义 
export const RECEIVE_ERROR = "1001" 
export const RECEIVE_MAIN = "2000" 
export const RECEIVE_CHAT_RESULT = "2001" 
export const RECEIVE_CHAT_MSG = "2002" 
export const RECEIVE_CHAT_LIST = "2003" 
export const RECEIVE_UPDATE = "2005" 
export const RECEIVE_SYSTEM_MSG="3001"
export const RECEIVE = "RECEIVE" 
export const SEND = "SEND" 
export const CLEAR = "CLEAR"

