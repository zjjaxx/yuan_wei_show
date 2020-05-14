import React, { useCallback } from "react"
import { View, Text, Button, SafeAreaView,StyleSheet, Image } from "react-native"
import { connect } from "react-redux"
import { logout } from "../../store/action"
import {scaleHeight,scaleSize,setSpText2} from "../../utils/ScreenUtil"
function Person({ dispatch }) {
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
                    <View style={style.menuItem}>
                        <Text style={style.num}>4</Text>
                        <Text style={style.menuTitle}>发布</Text>
                    </View>
                    <View style={style.menuItem}>
                        <Text style={style.num}>14</Text>
                        <Text style={style.menuTitle}>粉丝</Text>
                    </View>
                    <View style={style.menuItem}>
                        <Text style={style.num}>24</Text>
                        <Text style={style.menuTitle}>关注</Text>
                    </View>
                    <View style={style.menuItem}>
                        <Text style={style.num}>44</Text>
                        <Text style={style.menuTitle}>卡券</Text>
                    </View>
                </View>
                <Button title="logout" onPress={_logout}></Button>
            </View>
        </SafeAreaView>
    )
}
const style=StyleSheet.create({
    container:{
        flex:1
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
    userInfoWrap:{
        paddingHorizontal:scaleSize(15),
        flexDirection:"row",
    },
    userInfo:{
        marginLeft:scaleSize(20)
    },
    name:{
        fontSize:setSpText2(16),
        fontWeight:"bold"
    },
    phone:{
        marginTop:scaleHeight(8),
        fontSize:setSpText2(12),
        color:"#999"
    },
    avatar:{
        width:scaleSize(50),
        height:scaleSize(50),
        borderRadius:scaleSize(25)
    },
    menuWrap:{
        flexDirection:"row",
        paddingVertical:scaleHeight(10)
    },
    menuItem:{
        flex:1,
        paddingVertical:scaleHeight(10),
        alignItems:"center",
        justifyContent:"center"
    },
    num:{
        fontSize:setSpText2(16),
        fontWeight:"500"
    },
    menuTitle:{
        marginTop:scaleHeight(8),
        color:"#999",
        fontSize:setSpText2(12)
    }
})

export default connect(state => state, dispatch => ({ dispatch }))(Person)