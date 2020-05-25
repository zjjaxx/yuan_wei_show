import React from "react"
import { createStore, applyMiddleware, combineReducers } from "redux"
import reducers from "./reducers"
import thunk from "redux-thunk"

const reducer = combineReducers(reducers)
const store = createStore(reducer, {
    isLoading: true,
    isLogin: false,
    token: "",
    webSocket: null,
    device_code: 8,
    yw:"",
    userInfo:{userId: 0}
}, applyMiddleware(thunk))

export default store