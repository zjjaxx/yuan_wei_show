import React,{} from "react"
import {View,Text,StyleSheet,ScrollView,SafeAreaView, Image} from "react-native"

import {scaleHeight,scaleSize,setSpText2} from "../../utils/ScreenUtil"
import Header from "../../components/Header"
function Info({navigation}){
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={()=>{navigation.goBack()}}></Header>
                <ScrollView style={style.scrollView}>
                    <View style={style.infoWrap}>
                        <Image source={require("../../assets/imgs/alipay.png")} style={style.avatar}></Image>
                        <View style={style.infoContentWrap}>
                            <View style={style.infoContent}>
                                <View style={style.thumbUpWrap}>
                                    <Text style={style.count}>1375</Text>
                                    <Text style={style.label}>超赞</Text>
                                </View>
                                <View style={style.careWrap}>
                                    <Text style={style.count}>65</Text>
                                    <Text style={style.label}>关注</Text>
                                </View>
                                <View style={style.fansWrap}>
                                    <Text style={style.count}>7485</Text>
                                    <Text style={style.label}>粉丝</Text>
                                </View>
                            </View>
                            <View style={style.careBtn}>
                                <Text style={style.careText}>+ 关注</Text>
                            </View>
                        </View>
                    </View>
                    <Text style={style.name}>
                        切格瓦拉 * 手工艺人
                    </Text>
                    <Text style={style.disc}>
                        喜欢的话就来关注我吧
                    </Text>
                </ScrollView>
            </View>
           
        </SafeAreaView>
    )
}
const style=StyleSheet.create({
    safeAreaView:{
        flex:1
    },
    container:{
        flex:1
    },
    scrollView:{
        flex:1
    },
    infoWrap:{
        paddingHorizontal:scaleSize(15),
        flexDirection:"row"
    },
    avatar:{
        marginRight:scaleSize(15),
        height:scaleSize(80),
        width:scaleSize(80)
    },
    infoContentWrap:{
        flex:1,
    },
    infoContent:{
        flex:1,
        paddingRight:scaleSize(20),
        flexDirection:"row",
        justifyContent:"space-between",
    },
    count:{
        fontSize:setSpText2(16),
        fontWeight:"500"
    },
    label:{
        marginTop:scaleHeight(5),
        fontSize:setSpText2(12),
        color:"#999",
    },
    careBtn:{
        flex:1,
        paddingRight:scaleSize(20),
        borderRadius:scaleSize(15),
        height:scaleHeight(15),
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#fbcc7a"
    },
    careText:{
        fontSize:setSpText2(14),
        fontWeight:"500"
    },
    name:{
        fontSize:setSpText2(16),
        fontWeight:"500"
    },
    disc:{
        fontSize:setSpText2(14),
        lineHeight:setSpText2(18)
    }
})

export default Info