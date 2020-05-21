import { getLocalStorage, setLocalStorage } from "../utils/common"
export const SET_LOGIN = "SET_LOGIN"
export const SET_LOADING = "SET_LOADING"
export const SET_TOKEN = "SET_TOKEN"
export const SET_WEBSOCKET = "SET_WEBSOCKET"
export const SET_USER_INFO="SET_USER_INFO"
import { wsURL, TOKEN_KEY, VALID_TIME, validTimeCount, baseURL,USER_INFO } from "../utils/config"
import { showToast } from "../utils/common"
import axios from "axios"

export function asyncToken() {
    return (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true
        })
        let _token = ""
        getLocalStorage(TOKEN_KEY).then(token => {
            if (token) {
                _token = token
                return Promise.all([getLocalStorage(VALID_TIME),getLocalStorage(USER_INFO)])
            }
            else {
                throw "no token"
            }
        })
            .then(([validTime,userInfo]) => {
                let now = new Date().getTime()
                if (now - parseInt(validTime) > validTimeCount) {
                    dispatch(logout())
                }
                else {
                    dispatch(login(_token,JSON.parse(userInfo)))
                }
            })
            .catch(res => {
                console.log(res)
            })
            .finally(res => {
                setTimeout(() => {
                    dispatch({
                        type: SET_LOADING,
                        payload: false
                    })
                }, 3000)
            })
    }
}
export function login(token,userInfo) {
    return (dispatch, getState) => {
        setLocalStorage(TOKEN_KEY, token).then(res => {
            dispatch({
                type: SET_LOGIN,
                payload: true
            })
            dispatch({
                type: SET_TOKEN,
                payload: token
            })
            dispatch({
                type: SET_USER_INFO,
                payload: userInfo
            })
        })
        setLocalStorage(VALID_TIME, new Date().getTime() + "").then(res => {

        })
        setLocalStorage(USER_INFO, JSON.stringify(userInfo)).then(res => {

        })
        dispatch(initWebSocket(token))
    }
}
export function logout() {
    return (dispatch, getState) => {
        setLocalStorage(TOKEN_KEY, "").then(res => {
            dispatch({
                type: SET_LOGIN,
                payload: false
            })
            dispatch({
                type: SET_TOKEN,
                payload: ""
            })
        })
        setLocalStorage(VALID_TIME, "").then(res => {
        })
        setLocalStorage(USER_INFO, "").then(res => {
        })
    }

}
export function initWebSocket(token) {
    return (dispatch, getState) => {
        console.log("token", token)
        const ws = new WebSocket(wsURL);
        ws.onopen = () => {
            let param = JSON.stringify({ channel: 'auth', data: { token: token, content: "auth" } });
            ws.send(param);
            console.log("send", param)
            dispatch({
                type: SET_WEBSOCKET,
                payload: ws
            })
        };
        ws.onmessage = (e) => {
            console.log(e.data);
        };
        ws.onerror = (e) => {
            showToast(e.message)
        };
        ws.onclose = (e) => {
            showToast(e.code + e.reason)
        };
    }
}

export function imgUpload(imgData) {
    return (dispatch, getState) => {
        const { token } = getState()
        let formData = new FormData();
        formData.append("img", imgData.file);
        formData.append("tack", imgData.tack);
        console.log("formData",formData)
        axios.post(baseURL + "/api/v1/image/upload", formData, {
            headers: {
                authorization: "bearer " + token,
                'Content-Type': 'multipart/form-data'
            }
        }).then(res => {
            console.log(res)
        })
        .catch(res=>{
            console.log(res)
        });
    }
}
