import {  getLocalStorage, setLocalStorage } from "../utils/common"
export const SET_LOGIN = "SET_LOGIN"
export const SET_LOADING = "SET_LOADING"
export const SET_TOKEN = "SET_TOKEN"
export const SET_WEBSOCKET = "SET_WEBSOCKET"
import { wsURL,TOKEN_KEY,VALID_TIME,validTimeCount } from "../utils/config"
import {showToast} from "../utils/common"

export function asyncToken() {
    return (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true
        })
        let _token=""
        getLocalStorage(TOKEN_KEY).then(token => {
            if (token) {
                _token=token
                return getLocalStorage(VALID_TIME)
            }
            else{
                throw "no token"
            }
        })
            .then(validTime => {
                let now = new Date().getTime()
                if (now - parseInt(validTime) > validTimeCount) {
                    dispatch(logout())
                }
                else {
                    dispatch(login(_token))
                }
            })
            .catch(res=>{
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
export function login(token) {
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
        })
        setLocalStorage(VALID_TIME, new Date().getTime()+"").then(res => {

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
    }

}
export function initWebSocket(token) {
    return (dispatch, getState) => {
        console.log("token",token)
        const ws = new WebSocket(wsURL);
        ws.onopen = () => {
            let param = JSON.stringify({ channel: 'auth', data: { token:token, content: "auth" } });
            ws.send(param);
            console.log("send",param)
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
            showToast(e.code+e.reason)
        };
    }
}
