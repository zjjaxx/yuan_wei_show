import {
    SET_LOGIN,
    SET_LOADING,
    SET_TOKEN,
} from "./action"

export default {
    isLogin(state=false, action) {
        const { type, payload } = action
        switch (type) {
            case SET_LOGIN:
                return payload
            default:
                return state
        }
    },
    isLoading(state=false, action) {
        const { type, payload } = action
        switch (type) {
            case SET_LOADING:
                return payload
            default:
                return state
        }
    },
    token(state="", action) {
        const { type, payload } = action
        switch (type) {
            case SET_TOKEN:
                return payload
            default:
                return state
        }
    },
}