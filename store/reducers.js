import {
    SET_LOGIN,
    SET_LOADING,
    SET_TOKEN,
    SET_USER_INFO,
    SET_YW,
    SET_WEBSOCKET
} from "./action"

export default {
    isLogin(state = false, action) {
        const { type, payload } = action
        switch (type) {
            case SET_LOGIN:
                return payload
            default:
                return state
        }
    },
    isLoading(state = false, action) {
        const { type, payload } = action
        switch (type) {
            case SET_LOADING:
                return payload
            default:
                return state
        }
    },
    token(state = "", action) {
        const { type, payload } = action
        switch (type) {
            case SET_TOKEN:
                return payload
            default:
                return state
        }
    },
    webSocket(state=null,action){
        const { type, payload } = action
        switch (type) {
            case SET_WEBSOCKET:
                return payload
            default:
                return state
        }
    },
    device_code(state=8,action){
        return 8
    },
    userInfo(state=0,action){
        const { type, payload } = action
        switch (type) {
            case SET_USER_INFO:
                return payload
            default:
                return state
        }
    },
    yw(state="",action){
        const { type, payload } = action
        switch (type) {
            case SET_YW:
                return payload
            default:
                return state
        }
    }
}