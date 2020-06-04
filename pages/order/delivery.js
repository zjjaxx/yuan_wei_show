import React, { useCallback } from "react"
import { View, Text, SafeAreaView, StyleSheet, TouchableHighlight, ScrollView, Image } from "react-native"
import Header from "../../components/Header"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"

function Delivery({ navigation }) {
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header wrapStyle={{ backgroundColor: "#fff" }} leftEvent={leftEvent} title="订单跟踪"></Header>
                <ScrollView style={style.scrollView}>
                    <View style={style.deliveryInfoWrap}>
                        <View style={style.deliveryItemWrap}>
                            <Text style={style.deliveryLabel}>运单号: </Text>
                            <Text style={style.deliveryCode}>12064393260</Text>
                            <TouchableHighlight style={style.copy} underlayColor="#fff" onPress={() => { }}>
                                <Text style={style.copyText}>复制</Text>
                            </TouchableHighlight>
                        </View>
                        <View style={[style.deliveryItemWrap, { marginTop: scaleHeight(10) }]}>
                            <Text style={style.deliveryLabel}>国内承运人: </Text>
                            <Text style={style.deliveryCode}>京东快递</Text>
                        </View>
                    </View>
                    <View style={style.deliveryDetailWrap}>
                        {[1, 2, 3, 4, 5, 6, 7, 7, 8].map((item,index)=>
                            <View style={[style.detailItemWrap,index<4?style.activeItemWrap:{}]}>
                                <View style={[style.dot,index<4?style.redDot:{}]}></View>
                                <Text style={[style.detailItemText,index<4?{color:"#333"}:{}]}>感谢购买，欢迎下次光临</Text>
                                <Text style={style.time}>2019-02-15  15:20:52</Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
export default Delivery
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6"
    },
    scrollView: {
        flex: 1
    },
    deliveryInfoWrap: {
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(5),
        backgroundColor: "#fff"
    },
    deliveryItemWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    deliveryLabel: {
        fontSize: setSpText2(14)
    },
    deliveryCode: {
        marginLeft: scaleSize(5),
        marginRight: scaleSize(5),
        fontWeight: "500",
        fontSize: setSpText2(14)
    },
    copy: {
        marginLeft: scaleSize(15),
        borderRadius: scaleSize(10),
        paddingHorizontal: scaleSize(5),
        paddingVertical: scaleHeight(2),
        backgroundColor: "#eee",
        alignItems: "center",
        justifyContent: "center"
    },
    copyText: {
        fontSize: setSpText2(12)
    },
    deliveryDetailWrap:{
        marginTop:scaleHeight(10),
        paddingHorizontal:scaleSize(15),
        paddingVertical:scaleHeight(10),
        backgroundColor:"#fff"
    },
    detailItemWrap:{
        position:"relative",
        paddingLeft:scaleSize(20),
        borderLeftWidth:scaleSize(1),
        borderLeftColor:"#999",
        paddingBottom:scaleHeight(20)
    },
    activeItemWrap:{
        borderLeftColor:"#fca413",
    },
    detailItemText:{
        fontSize:setSpText2(14),
        fontWeight:"500",
        color:"#999"
    },
    time:{
        marginTop:scaleHeight(10),
        fontSize:setSpText2(12),
        color:"#999"
    },
    dot:{
        position:"absolute",
        top:0,
        left:0,
        width:scaleSize(5),
        height:scaleSize(5),
        backgroundColor:"#999",
        transform:[{translateX:-scaleSize(2.5)}],
        borderRadius:scaleSize(2.5)
    },
    redDot:{
        position:"absolute",
        top:0,
        left:0,
        width:scaleSize(10),
        height:scaleSize(10),
        backgroundColor:"#fca413",
        transform:[{translateX:-scaleSize(5)}],
        borderRadius:scaleSize(5)
    }

})