import React, { useCallback } from "react"
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableHighlight } from "react-native"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
//阴影
import { BoxShadow } from 'react-native-shadow'
//渐变
import LinearGradient from 'react-native-linear-gradient';
function Order({ navigation }) {
    //返回事件
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //支付
    const pay = useCallback(() => {

    }, [])
    const toAddressList = useCallback(() => {
        navigation.navigate("addressList")
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header title="购买宝贝" leftEvent={leftEvent}></Header>
                <BoxShadow setting={productBoxShadow}>
                    <View style={style.productWrap}>
                        <Image style={style.productImg} source={require("../../assets/imgs/pic3.jpg")}></Image>
                        <View style={style.productInfoWrap}>
                            <Text style={style.productName} numberOfLines={2} ellipsizeMode="tail">佛教围殴金佛风口浪尖忘记佛为我金佛按罚款服务佛排污口佛我就反问偶家放我家奇偶王府井忘记佛为</Text>
                            <View style={style.priceWrap}>
                                <Text style={style.price}>￥19</Text>
                                <Text style={style.priceTail}>.90</Text>
                            </View>
                        </View>
                    </View>
                </BoxShadow>

                <BoxShadow setting={addressBoxShadow}>
                    <View style={style.addressWrap}>
                        <TouchableHighlight underlayColor="#fff" onPress={toAddressList}>
                            <View style={style.addressInfoWrap}>
                                <Text style={style.addressTip}>收货地址</Text>
                                <View style={style.info}>
                                    <Text style={style.userInfo}>绿灯 17855845874</Text>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={style.address}>浙江省金华市婺城区罗布镇下郑村后溪路一号</Text>
                                </View>
                                <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right-gray.png")}></Image>
                            </View>
                        </TouchableHighlight>
                        <View style={style.deliverWrap}>
                            <Text style={style.deliverTip}>运费</Text>
                            <View style={style.deliverFeeWrap}>
                                <Text style={style.deliverFee}>￥0</Text>
                                <Text style={style.deliverFeeTail}>.00</Text>
                            </View>
                        </View>
                    </View>
                </BoxShadow>
                <View style={style.bottomBar}>
                    <Text style={style.buyTip}>实际付款</Text>
                    <Text style={style.price}>￥19</Text>
                    <Text style={style.priceTail}>.00</Text>
                    <TouchableHighlight underlayColor="#fff" onPress={pay}>
                        <LinearGradient colors={["#f2140c", "#f2270c"]} style={style.buyBtn}>
                            <View >
                                <Text style={style.buyText}>确认购买</Text>
                            </View>
                        </LinearGradient>
                    </TouchableHighlight>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default Order
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        position: "relative",
        flex: 1
    },

    productWrap: {
        width: scaleSize(335),
        height: scaleHeight(100),
        borderRadius: scaleSize(15),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff"
    },
    productImg: {
        marginLeft: scaleSize(10),
        marginRight: scaleSize(10),
        width: scaleSize(80),
        height: scaleSize(80),
        borderRadius: scaleSize(5)
    },
    productInfoWrap: {
        flex: 1,
        marginRight: scaleSize(10),
        height: scaleSize(80),
        justifyContent: "space-between"
    },
    productName: {
        fontSize: setSpText2(14),
    },
    priceWrap: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    price: {
        fontSize: setSpText2(14),
        color: "#f2140c",
    },
    priceTail: {
        fontSize: setSpText2(10),
        color: "#f2140c",
    },
    addressWrap: {
        paddingHorizontal: scaleSize(5),
        paddingTop: scaleHeight(10),
        width: scaleSize(335),
        height: scaleHeight(100),
        borderRadius: scaleSize(15),
        backgroundColor: "#fff"
    },
    addressInfoWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5),
        paddingBottom: scaleHeight(10)
    },
    addressTip: {
        fontSize: setSpText2(14)
    },
    info: {
        flex: 1,
        marginRight: scaleSize(10),
        marginLeft: scaleSize(50),
        alignItems: "flex-end"
    },
    userInfo: {
        fontSize: setSpText2(14),
        fontWeight: "500",
    },
    address: {
        marginTop: scaleHeight(4),
        fontSize: setSpText2(14),
        color: "#999",
        textAlign: "right"
    },
    arrowRight: {
        height: scaleSize(15),
        width: scaleSize(15)
    },
    deliverWrap: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    deliverTip: {
        fontSize: setSpText2(14)
    },
    deliverFeeWrap: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: scaleSize(5),
    },
    deliverFee: {
        fontSize: setSpText2(14),
        color: "#f2140c",
    },
    deliverFeeTail: {
        fontSize: setSpText2(10),
        color: "#f2140c",
    },
    bottomBar: {
        paddingHorizontal: scaleSize(20),
        position: "absolute",
        bottom: scaleHeight(20),
        left: 0,
        width: "100%",
        height: scaleHeight(30),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end"
    },
    buyTip: {
        fontSize: setSpText2(12),
    },
    buyBtn: {
        marginLeft: scaleSize(10),
        height: scaleHeight(25),
        borderRadius: scaleSize(15),
        width: scaleSize(90),
        alignItems: "center",
        justifyContent: "center",
    },
    buyText: {
        color: "#fff",
        fontSize: setSpText2(14),
        fontWeight: "500"
    }

})
const productBoxShadow = {
    width: scaleSize(335),
    height: scaleHeight(100),
    color: "#A2A2A2",
    border: scaleSize(3),
    radius: scaleSize(15),
    opacity: 0.19,
    x: scaleSize(3),
    y: scaleSize(3),
    style: {
        marginHorizontal: scaleSize(20),
    }
}
const addressBoxShadow = {
    width: scaleSize(335),
    height: scaleHeight(100),
    color: "#A2A2A2",
    border: scaleSize(3),
    radius: scaleSize(15),
    opacity: 0.19,
    x: scaleSize(3),
    y: scaleSize(3),
    style: {
        marginHorizontal: scaleSize(20),
        marginTop: scaleHeight(20)
    }
}