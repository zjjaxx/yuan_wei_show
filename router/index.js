import React, { useEffect, useReducer, useMemo } from 'react';
import { Image, StyleSheet } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack"
import { scaleSize, setSpText2, scaleHeight } from "../utils/ScreenUtil"
import HomeScreen from "../pages/home/home"
import OrderScreen from "../pages/order/order"
import MessageScreen from "../pages/message/messageList"
import PersonScreen from "../pages/person/person"
import LoginScreen from "../pages/login/login"
import FlashScreen from "../pages/flash/flash"
import RegisterScreen from "../pages/register/register"
import ProductDetailScreen from "../pages/productDetail/productDetail"
import MessageDetailScreen from "../pages/message/messageDetail"
import PublishScreen from "../pages/publish/publish"
import CategoriesScreen from "../pages/publish/categories"
import AddressListScreen from "../pages/address/addressList"
import { connect } from "react-redux"
import { asyncToken } from "../store/action"
//tab 路由容器
const Tab = createBottomTabNavigator();
function TabContainer() {
    const iconOption = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'home') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/homeSelected.png") : require("../assets/imgs/tab/home.png")}></Image>
            } else if (route.name === 'person') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/personSelected.png") : require("../assets/imgs/tab/person.png")}></Image>
            } else if (route.name === 'message') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/serviceSelected.png") : require("../assets/imgs/tab/service.png")}></Image>
            }
        }
    })
    return (
        <Tab.Navigator screenOptions={iconOption} tabBarOptions={{
            activeTintColor: '#000',
            inactiveTintColor: '#000',
            labelStyle: { fontSize: setSpText2(10) },
            style: {

            }
        }} >
            <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false }} />
            <Tab.Screen name="message" component={MessageScreen} options={{ headerShown: false }} />
            <Tab.Screen name="person" component={PersonScreen} options={{ headerShown: false }} />
        </Tab.Navigator>
    )
}

//app路由
const AppStack = createStackNavigator()

function AppStackScreen({ isLoading, isLogin, dispatch }) {
    useEffect(() => {
        dispatch(asyncToken())
    }, [dispatch])
    if (isLoading) {
        return (
            <AppStack.Navigator>
                <AppStack.Screen name="flash" component={FlashScreen} options={{ headerShown: false }}></AppStack.Screen>
            </AppStack.Navigator>
        )
    }
    return (
        <AppStack.Navigator screenOptions={{ headerBackTitle: "返回", headerShown: false }}>
            {
                isLogin ? (
                    <>
                        <AppStack.Screen name="tabContainer" component={TabContainer}></AppStack.Screen>
                        <AppStack.Screen name="productDetail" component={ProductDetailScreen}  ></AppStack.Screen>
                        <AppStack.Screen name="publish" component={PublishScreen} ></AppStack.Screen>
                        <AppStack.Screen name="categories" component={CategoriesScreen} ></AppStack.Screen>
                        <AppStack.Screen name="messageDetail" component={MessageDetailScreen} ></AppStack.Screen>
                        <AppStack.Screen name="order" component={OrderScreen} ></AppStack.Screen>
                        <AppStack.Screen name="addressList" component={AddressListScreen} ></AppStack.Screen>
                    </>
                ) : (
                        <>
                            <AppStack.Screen name="login" component={LoginScreen}></AppStack.Screen>
                            <AppStack.Screen name="register" component={RegisterScreen}></AppStack.Screen>
                        </>
                    )
            }
        </AppStack.Navigator>
    )
}

const style = StyleSheet.create({
    icon: {
        height: scaleSize(24),
        width: scaleSize(24)
    }
})

export default connect(state => state, dispatch => ({ dispatch }))(AppStackScreen)