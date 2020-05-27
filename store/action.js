import { getLocalStorage, setLocalStorage } from "../utils/common"
export const SET_LOGIN = "SET_LOGIN"
export const SET_LOADING = "SET_LOADING"
export const SET_TOKEN = "SET_TOKEN"
export const SET_WEBSOCKET = "SET_WEBSOCKET"
export const SET_USER_INFO = "SET_USER_INFO"
export const SET_YW = "SET_YW"
import { wsURL, TOKEN_KEY, VALID_TIME, validTimeCount, baseURL, USER_INFO, YW_KEY } from "../utils/config"
import { showToast } from "../utils/common"


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
                return Promise.all([getLocalStorage(VALID_TIME), getLocalStorage(USER_INFO), getLocalStorage(YW_KEY)])
            }
            else {
                throw "no token"
            }
        })
            .then(([validTime, userInfo, yw]) => {
                var _yw = JSON.parse(yw) 
                let now = new Date().getTime()
                if (now - parseInt(validTime) > validTimeCount) {
                    dispatch(logout())
                }
                else {
                    dispatch(login(_token, JSON.parse(userInfo), _yw))
                }
            })
            .catch(res => {
                dispatch({
                    type: SET_LOADING,
                    payload: false
                })
            })
            .finally(res => {

            })
    }
}
export function login(token, userInfo, yw) {
    return (dispatch, getState) => {
        console.log("yw",yw)
        Promise.all([
            setLocalStorage(TOKEN_KEY, token),
            setLocalStorage(YW_KEY, JSON.stringify(yw)),
            setLocalStorage(VALID_TIME, new Date().getTime() + ""),
            setLocalStorage(USER_INFO, JSON.stringify(userInfo))
        ])
            .then(res => {
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
                dispatch({
                    type: SET_LOADING,
                    payload: false
                })
                dispatch({
                    type: SET_YW,
                    payload: yw
                })

            })
        dispatch(initWebSocket(token))

    }
}
export function logout() {
    return (dispatch, getState) => {
        Promise.all([setLocalStorage(TOKEN_KEY, ""), setLocalStorage(SET_YW, ""), setLocalStorage(VALID_TIME, ""), setLocalStorage(USER_INFO, "")])
            .then(res => {
                dispatch({
                    type: SET_LOGIN,
                    payload: false
                })
                dispatch({
                    type: SET_TOKEN,
                    payload: ""
                })
                dispatch({
                    type: SET_YW,
                    payload: false
                })
                dispatch({
                    type: SET_USER_INFO,
                    payload: {}
                })
                dispatch({
                    type: SET_LOADING,
                    payload: false
                })
            })

    }

}
export function initWebSocket(token) {
    return (dispatch, getState) => {
        const ws = new WebSocket(wsURL);
        ws.onopen = () => {
            let param = JSON.stringify({ channel: 'auth', data: { token: token, content: "auth" } });
            ws.send(param);
            dispatch({
                type: SET_WEBSOCKET,
                payload: ws
            })
        };
        ws.onmessage = (e) => {
        };
        ws.onerror = (e) => {
            showToast(e.message)
        };
        ws.onclose = (e) => {
            showToast(e.code + e.reason)
        };
    }
}




