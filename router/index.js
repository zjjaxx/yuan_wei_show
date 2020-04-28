import React, { useEffect, useReducer, useMemo } from 'react';
import { Image, StyleSheet } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack"
import HomeScreen from "../pages/home/home"
import PersonScreen from "../pages/person/person"
import { scaleSize, setSpText2 } from "../utils/ScreenUtil"
import { getLocalStorage } from "../utils/common"
import LoginScreen from "../pages/login/login"
import FlashScreen from "../pages/flash/flash"
import {AppContext} from "../context/context"
//tab 路由容器
const Tab = createBottomTabNavigator();
function TabContainer() {
    const iconOption = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'home') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/homeSelected.png") : require("../assets/imgs/tab/home.png")}></Image>
            } else if (route.name === 'person') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/personSelected.png") : require("../assets/imgs/tab/person.png")}></Image>
            }
        }
    })
    return (
        <Tab.Navigator screenOptions={iconOption} tabBarOptions={{
            activeTintColor: '#000',
            inactiveTintColor: '#000',
            labelStyle: { fontSize: setSpText2(10) },
            style: {
                height: scaleSize(50),
                paddingBottom: 0
            }
        }} >
            <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="person" component={PersonScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

//app路由
const AppStack = createStackNavigator()

export default function AppStackScreen() {
    const [state,dispatch]=useReducer((state,action)=>{
        switch(action.type){
            case "LOGIN":
                return {
                    ...state,
                    token:action.token,
                    isLogin:true
                }
            case "LOGOUT":
                return {
                    ...state,
                    isLogin:false,
                    token:""
                }
            case "RESTORE_TOKEN":
                return {
                    ...state,
                    isLoading:false,
                    token:action.token,
                    isLogin:action.isLogin
                }
        }
    },{isLoading:true,isLogin:false,token:""})
    const appContext=useMemo(()=>({
        $login:(token)=>{
            dispatch({type:"LOGIN",token})
        },
        $logout:()=>{
            dispatch({type:"LOGOUT"})
        }
    }))
    useEffect(async () => {
        let token = await getLocalStorage("token")
        dispatch({type:"RESTORE_TOKEN",token,isLogin:token?true:false})
    }, [])
    if(state.isLoading){
        return (
            <AppStack.Navigator>
                <AppStack.Screen name="flash" component={FlashScreen}></AppStack.Screen>
            </AppStack.Navigator>
        )
    }
    return (
        <AppContext.Provider value={appContext}>
            <AppStack.Navigator>
            {
                state.isLogin ? (
                    <>
                        <AppStack.Screen name="tabContainer" options={{ headerShown: false }} component={TabContainer}></AppStack.Screen>
                    </>
                ) : (
                        <>
                            <AppStack.Screen name="login" component={LoginScreen}></AppStack.Screen>
                        </>
                    )
            }
        </AppStack.Navigator>
        </AppContext.Provider>
    )
}

const style = StyleSheet.create({
    icon: {
        height: scaleSize(24),
        width: scaleSize(24)
    }
})