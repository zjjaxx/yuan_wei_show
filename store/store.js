import React from "react"
import { createStore, applyMiddleware, combineReducers } from "redux"
import reducers from "./reducers"
import thunk from "redux-thunk"

const reducer = combineReducers(reducers)
const store = createStore(reducer,{isLoading:false,isLogin:false,token:""}, applyMiddleware(thunk))

export default store