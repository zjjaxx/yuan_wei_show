import React, { useCallback } from "react"
import { View, Text, Button, SafeAreaView, StyleSheet, Image, TouchableHighlight } from "react-native"
import { connect } from "react-redux"
import { logout } from "../../store/action"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
function Person({ dispatch, navigation }) {
    const _logout = useCallback(() => {
        dispatch(logout())
    }, [dispatch])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>我的</Text>
                </View>
                <View style={style.userInfoWrap}>
                    <Image source={require("../../assets/imgs/avatar.jpeg")} style={style.avatar}></Image>
                    <View style={style.userInfo}>
                        <Text style={style.name}>Hello DENG</Text>
                        <Text style={style.phone}>17855827456</Text>
                    </View>
                </View>
                <View style={style.menuWrap}>
                    <TouchableHighlight style={style.touchWrap} underlayColor="#fff" onPress={() => navigation.navigate("myPublish")}>
                        <View style={style.menuItem}>
                            <Text style={style.num}>4</Text>
                            <Text style={style.menuTitle}>发布</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={style.touchWrap} underlayColor="#fff" onPress={() => navigation.navigate("unshelve")}>
                        <View style={style.menuItem}>
                            <Text style={style.num}>44</Text> 
                            <Text style={style.menuTitle}>下架</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={style.touchWrap} underlayColor="#fff" onPress={() => { }}>
                        <View style={style.menuItem}>
                            <Text style={style.num}>14</Text>
                            <Text style={style.menuTitle}>粉丝</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight style={style.touchWrap} underlayColor="#fff" onPress={() => { }}>
                        <View style={style.menuItem}>
                            <Text style={style.num}>24</Text>
                            <Text style={style.menuTitle}>关注</Text>
                        </View>
                    </TouchableHighlight>
                </View>
                <TouchableHighlight underlayColor="#fff" onPress={() => navigation.navigate("orderList")}>
                    <View style={style.menuListItem}>
                        <Image style={style.menuListIcon} source={require("../../assets/imgs/order.png")}></Image>
                        <Text style={style.menuListText}>我的订单</Text>
                        <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right.png")}></Image>
                    </View>
                </TouchableHighlight>
                <View style={style.menuListItem}>
                    <Image style={style.menuListIcon} source={require("../../assets/imgs/love.png")}></Image>
                    <Text style={style.menuListText}>我的收藏</Text>
                    <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right.png")}></Image>
                </View>
                <View style={style.menuListItem}>
                    <Image style={style.menuListIcon} source={require("../../assets/imgs/icon_seller.png")}></Image>
                    <Text style={style.menuListText}>我的出售</Text>
                    <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right.png")}></Image>
                </View>
                <TouchableHighlight underlayColor="#fff" onPress={() => navigation.navigate("addressList")}>
                    <View style={style.menuListItem}>
                        <Image style={style.menuListIcon} source={require("../../assets/imgs/location.png")}></Image>
                        <Text style={style.menuListText}>地址管理</Text>
                        <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right.png")}></Image>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight style={style.logout} underlayColor="#fca413" onPress={_logout}>
                    <Text style={style.logoutText}>退出登录</Text>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    },
    headerWrap: {
        flexDirection: "row",
        alignItems: "center",
        height: scaleHeight(50),
        paddingHorizontal: scaleSize(15)
    },
    headerTitle: {
        fontSize: setSpText2(16),
        lineHeight: setSpText2(50),
        fontWeight: "500"
    },
    userInfoWrap: {
        paddingHorizontal: scaleSize(15),
        flexDirection: "row",
    },
    userInfo: {
        marginLeft: scaleSize(20)
    },
    name: {
        fontSize: setSpText2(16),
        fontWeight: "bold"
    },
    phone: {
        marginTop: scaleHeight(8),
        fontSize: setSpText2(12),
        color: "#999"
    },
    avatar: {
        width: scaleSize(50),
        height: scaleSize(50),
        borderRadius: scaleSize(25)
    },
    menuWrap: {
        flexDirection: "row",
        paddingVertical: scaleHeight(10)
    },
    touchWrap: {
        flex: 1,
    },
    menuItem: {
        width: "100%",
        paddingVertical: scaleHeight(10),
        alignItems: "center",
        justifyContent: "center"
    },
    num: {
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    menuTitle: {
        marginTop: scaleHeight(8),
        color: "#999",
        fontSize: setSpText2(12)
    },
    menuListItem: {
        paddingVertical: scaleHeight(15),
        paddingHorizontal: scaleSize(20),
        flexDirection: "row",
        alignItems: "center"
    },
    menuListIcon: {
        marginRight: scaleSize(10),
        width: scaleSize(20),
        height: scaleSize(20)
    },
    menuListText: {
        marginRight: "auto",
        fontSize: setSpText2(14)
    },
    arrowRight: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    logout: {
        position: "absolute",
        bottom: scaleHeight(20),
        left: scaleSize(20),
        right: scaleSize(20),
        height: scaleHeight(40),
        backgroundColor: "#fca413",
        borderRadius: scaleSize(10),
        justifyContent: "center",
        alignItems: "center"
    },
    logoutText: {
        fontSize: setSpText2(16),
        color: "#fff"
    }
})

export default connect(state => state, dispatch => ({ dispatch }))(Person)