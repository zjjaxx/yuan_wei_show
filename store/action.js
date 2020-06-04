import { getLocalStorage, setLocalStorage } from "../utils/common"
export const SET_LOGIN = "SET_LOGIN"
export const SET_LOADING = "SET_LOADING"
export const SET_TOKEN = "SET_TOKEN"
export const SET_WEBSOCKET = "SET_WEBSOCKET"
export const SET_USER_INFO = "SET_USER_INFO"
export const SET_YW = "SET_YW"
import { wsURL, TOKEN_KEY, VALID_TIME, validTimeCount, baseURL, USER_INFO, YW_KEY } from "../utils/config"
import { showToast } from "../utils/common"
import { send, parseReceiveMessage } from "../utils/toBuffer"
var reconnectCount = 10
var pingId = -1
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
        if (yw) {
            dispatch(initWebSocket(token, yw))
        }
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
export function initWebSocket(token, yw) {
    return (dispatch, getState) => {
        console.log("initWebSocket enter")
        const ws = new WebSocket(wsURL + `?token=${token}&yw=${yw}`);
        ws.binaryType = "arraybuffer";
        ws.onopen = () => {
            console.log("websocket connect")
            dispatch({
                type: SET_WEBSOCKET,
                payload: ws
            })
            pingId = setInterval(() => {
                send({ y: 'ping', d: {} }, ws)
            }, 30000)
        };
        ws.onmessage = (e) => {
            console.log("e action", e)
        };
        ws.onerror = (e) => {
            console.log("e onerror", e.message)
        };
        ws.onclose = (e) => {
            console.log("websocket close")
            dispatch(reconnect(token, yw))
        };
    }
}
export function reconnect(token, yw) {
    return (dispatch, getState) => {
        clearInterval(pingId)
        pingId = -1
        if (reconnectCount < 0) {
            return
        }
        reconnectCount--
        setTimeout(() => {
            dispatch(initWebSocket(token, yw))
        }, 3000)
    }
}




