import React, { useCallback, useEffect, useState } from "react"
import { View, Text, SafeAreaView, StyleSheet, Image, TouchableHighlight } from "react-native"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
import { create } from "../../api/api"
//渐变
import LinearGradient from 'react-native-linear-gradient';
import ProductItem from "../../components/prodcutItem"
function Order({ navigation, route }) {
    const [createOrderInfo, setCreateOrderInfo] = useState({totalMoney:{},charge_detail:{}})
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
    //订单信息
    useEffect(() => {
        if (route.params?.goods_id) {
            create({ goods_id: route.params?.goods_id }).then(({ data: { result } }) => {
                setCreateOrderInfo(result)
            })
        }
    }, [route.params?.goods_id])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header wrapStyle={{ backgroundColor: "#fff" }} title="填写订单" leftEvent={leftEvent}></Header>
                <TouchableHighlight underlayColor="#fff" onPress={toAddressList}>
                    {
                        createOrderInfo.address ? <View style={style.addressWrap}>
                            <View style={style.addressInfoWrap}>
                                <Text style={style.address}>浙江省 金华市 婺城区</Text>
                                <Text numberOfLines={1} ellipsizeMode="tail" style={style.addressDetail}>罗布镇下郑村后溪路一号</Text>
                                <Text style={style.userInfo}>绿灯 17855845874</Text>
                            </View>
                            <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right-gray.png")}></Image>
                            <Image style={style.bar} source={require("../../assets/imgs/baba.png")}></Image>
                        </View> :<Text style={style.createAddressTip}>请设置收货地址</Text>
                    }
                </TouchableHighlight>
                <ProductItem productItemData={createOrderInfo.goods}></ProductItem>
                <View style={style.orderInfo}>
                    <View style={style.orderPriceWrap}>
                        <Text style={style.productPriceTip}>商品金额</Text>
                        <Text style={style.productPrice}>￥{createOrderInfo.charge_detail.price}</Text>
                    </View>
                    <View style={style.orderDeliveryWrap}>
                        <Text style={style.productDeliveryTip}>运费</Text>
                        <Text style={style.deliveryPrice}>+ ￥{createOrderInfo.charge_detail.postage}</Text>
                    </View>
                </View>
                <View style={style.bottomBar}>
                    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                        <Text style={style.buyTip}>实际付款</Text>
                        <Text style={style.price}>￥{createOrderInfo.totalMoney.i}</Text>
                        <Text style={style.priceTail}>.{createOrderInfo.totalMoney.d}</Text>
                    </View>

                    <TouchableHighlight underlayColor="#fff" onPress={pay}>
                        <LinearGradient useAngle={true} angle={90} colors={["#f2140c", "#f2270c", "#fff"]} style={style.buyBtn}>
                            <Text style={style.buyText}>提交订单</Text>
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
        flex: 1,
        backgroundColor: "#f9f9f9"
    },

    productWrap: {
        width: scaleSize(335),
        height: scaleHeight(100),
        borderRadius: scaleSize(10),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff"
    },
    createAddressTip:{
        width:"100%",
        textAlign:"center",
        paddingVertical:scaleHeight(10),
        backgroundColor:"#fff",
        fontSize:setSpText2(14),
        fontWeight:"500",
        color:"#fca143"
    },
    addressWrap: {
        position: "relative",
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(20),
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
    },
    bar: {
        position: "absolute",
        bottom: 0,
        left: scaleSize(10),
        width: "100%",
        height: scaleHeight(4)
    },
    addressInfoWrap: {
        marginRight: scaleSize(20),
        flex: 1
    },
    address: {
        fontSize: setSpText2(12)
    },
    addressDetail: {
        marginTop: scaleHeight(6),
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    userInfo: {
        marginTop: scaleHeight(6),
        fontSize: setSpText2(12)
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
    arrowRight: {
        height: scaleSize(10),
        width: scaleSize(10)
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
        paddingVertical: scaleHeight(10),
        backgroundColor: "#fff",
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    buyTip: {
        marginRight: scaleSize(4),
        color: "#f2140c",
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
    },
    orderInfo: {
        marginTop: scaleHeight(10),
        borderRadius: scaleSize(10),
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(10),
        backgroundColor: "#fff"
    },
    orderPriceWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    productPriceTip: {
        fontSize: setSpText2(12)
    },
    productPrice: {
        fontSize: setSpText2(12)
    },
    orderDeliveryWrap: {
        marginTop: scaleHeight(4),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    productDeliveryTip: {
        fontSize: setSpText2(12)
    },
    deliveryPrice: {
        color: "#f2140c",
        fontSize: setSpText2(12)
    },
    price: {
        fontSize: setSpText2(16),
        color: "#f2140c",
    },
    priceTail: {
        fontSize: setSpText2(10),
        color: "#f2140c",
    },
})
