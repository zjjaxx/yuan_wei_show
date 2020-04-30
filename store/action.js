import { TOKEN_KEY, getLocalStorage, setLocalStorage } from "../utils/common"
export const SET_LOGIN = "SET_LOGIN"
export const SET_LOADING = "SET_LOADING"
export const SET_TOKEN = "SET_TOKEN"


export function asyncToken() {
    return (dispatch, getState) => {
        dispatch({
            type: SET_LOADING,
            payload: true
        })
        setTimeout(() => {
            getLocalStorage(TOKEN_KEY).then(token => {
                token && dispatch(login(token))
            })
                .finally(res => {
                    dispatch({
                        type: SET_LOADING,
                        payload: false
                    })
                })
        }, 3000)

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
    }

}
