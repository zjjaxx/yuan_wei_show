import React, { useEffect, useReducer, useMemo } from 'react';
import { Image, StyleSheet } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack"
import { scaleSize, setSpText2, scaleHeight } from "../utils/ScreenUtil"
import HomeScreen from "../pages/home/home"
import CategoryScreen from "../pages/category/category"
import OrderScreen from "../pages/order/order"
import MessageScreen from "../pages/message/messageList"
import PersonScreen from "../pages/person/person"
import LoginScreen from "../pages/login/login"
import ForgetPasswordScreen from "../pages/login/forgetPassword"
import RegisterScreen from "../pages/register/register"
import ProductDetailScreen from "../pages/productDetail/productDetail"
import MessageDetailScreen from "../pages/message/messageDetail"
import NewAddressScreen from "../pages/address/newAddress"
import EditAddressScreen from "../pages/address/editAddress"
import PublishScreen from "../pages/publish/publish"
import CategoriesScreen from "../pages/publish/categories"
import AddressListScreen from "../pages/address/addressList"
import OrderListScreen from "../pages/order/orderList"
import OrderStautsScreen from "../pages/order/orderState"
import DeliveryScreen from "../pages/order/delivery"
import SearchScreen from "../pages/category/search"
import MyPublishScreen from "../pages/publish/myPublish"
import UnshelveScreen from "../pages/person/unshelve"
import CustomTagsScreen from "../pages/publish/customTags"
import { connect } from "react-redux"
import { asyncToken } from "../store/action"
import SplashScreen from 'react-native-splash-screen'

//tab 路由容器
const Tab = createBottomTabNavigator();
function TabContainer() {
    const iconOption = ({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
            if (route.name === 'home') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/homeSelected.png") : require("../assets/imgs/tab/home.png")}></Image>
            } else if (route.name === 'category') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/categorySelected.png") : require("../assets/imgs/tab/category.png")}></Image>
            } else if (route.name === 'person') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/personSelected.png") : require("../assets/imgs/tab/person.png")}></Image>
            } else if (route.name === 'message') {
                return <Image style={style.icon} source={focused ? require("../assets/imgs/tab/messageSelected.png") : require("../assets/imgs/tab/message.png")}></Image>
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
            <Tab.Screen name="home" component={HomeScreen} options={{ headerShown: false, title: "爆款推荐" }} />
            <Tab.Screen name="category" component={CategoryScreen} options={{ headerShown: false, title: "分类" }} />
            <Tab.Screen name="message" component={MessageScreen} options={{ headerShown: false, title: "消息中心" }} />
            <Tab.Screen name="person" component={PersonScreen} options={{ headerShown: false, title: "个人中心" }} />
        </Tab.Navigator>
    )
}

//app路由
const AppStack = createStackNavigator()

function AppStackScreen({ isLoading, isLogin, dispatch }) {
    useEffect(() => {
        dispatch(asyncToken())
    }, [])
    if (isLoading) {
        return null
    }
    SplashScreen.hide();
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
                        <AppStack.Screen name="newAddress" component={NewAddressScreen} ></AppStack.Screen>
                        <AppStack.Screen name="editAddress" component={EditAddressScreen} ></AppStack.Screen>
                        <AppStack.Screen name="orderList" component={OrderListScreen} ></AppStack.Screen>
                        <AppStack.Screen name="orderState" component={OrderStautsScreen}></AppStack.Screen>
                        <AppStack.Screen name="delivery" component={DeliveryScreen}></AppStack.Screen>
                        <AppStack.Screen name="search" component={SearchScreen}></AppStack.Screen>
                        <AppStack.Screen name="myPublish" component={MyPublishScreen}></AppStack.Screen>
                        <AppStack.Screen name="unshelve" component={UnshelveScreen}></AppStack.Screen>
                        <AppStack.Screen name="customTags" component={CustomTagsScreen}></AppStack.Screen>
                    </>
                ) : (
                        <>
                            <AppStack.Screen name="login" component={LoginScreen}></AppStack.Screen>
                            <AppStack.Screen name="register" component={RegisterScreen}></AppStack.Screen>
                            <AppStack.Screen name="forgetPassword" component={ForgetPasswordScreen}></AppStack.Screen>

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