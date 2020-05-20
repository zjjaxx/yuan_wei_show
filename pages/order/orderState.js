import React, { useCallback, useState, memo } from "react"
import { View, Text, TouchableHighlight, ScrollView, StyleSheet, SafeAreaView, Image, StatusBar } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
import useStatusBarHeight from "../../customUse/useStatusBarHeight"
import { useNodeRect } from "../../customUse/useClientRect"
import ProductItem from "../../components/prodcutItem"
import ProductItemLarge from "../../components/ProductItemLarge"

function OrderStatus({ navigation }) {
    const [orderStatus] = useState(2)
    const [statusBarHeight] = useStatusBarHeight()
    const [rectInfo, rectRef] = useNodeRect()
    const [headerOpacity, setHeaderOpacity] = useState(0)
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    const toDelivery = useCallback(() => {
        navigation.navigate("delivery")
    }, [])
    const onScroll = useCallback(({
        nativeEvent: {
            contentInset: { bottom, left, right, top },
            contentOffset: { x, y },
        }
    }) => {
        setHeaderOpacity(y / (rectInfo.height - scaleHeight(100)))
    }, [rectInfo])
    return (
        <View style={{ flex: 1, position: "relative" }}>
            <View style={[style.statusBar, { height: statusBarHeight, opacity: headerOpacity }]}></View>
            {headerOpacity < 0.5 ? (
                <View style={[style.headerOne, { top: statusBarHeight, backgroundColor: `rgba(255,255,255,${headerOpacity})` }]}>
                    <TouchableHighlight style={style.leftWrap} underlayColor="#f2140c" onPress={leftEvent}>
                        <Image style={style.leftIcon} source={require("../../assets/imgs/arrow-left-white.png")}></Image>
                    </TouchableHighlight>
                </View>
            ) : (
                    <Header wrapStyle={[style.headerWrap, { top: statusBarHeight, opacity: headerOpacity }]} leftEvent={leftEvent} title="订单详情"></Header>
                )}
            <ScrollView scrollEventThrottle={16} style={style.scrollView} onScroll={onScroll}>
                <View onLayout={rectRef} style={[style.orderStatusWrap, { paddingTop: statusBarHeight }]}>
                    <View style={style.orderStatus}>
                        <Image style={style.statusIcon} source={require("../../assets/imgs/time.png")}></Image>
                        <Text style={style.statusText}>{orderStatus == 1 ? '等待付款' : orderStatus == 2 ? '待收货' : '谢谢惠顾'}</Text>
                    </View>
                    {
                        orderStatus == 1 ? <View style={style.orderInfo}>
                            <Text style={style.tip}>需付款:￥</Text>
                            <Text style={style.price}>179</Text>
                            <Text style={style.priceTail}>.00</Text>
                            <Text style={style.restTime}>剩余:06小时11分钟</Text>
                        </View> : null
                    }
                    {
                        orderStatus == 1 ? <TouchableHighlight style={style.payWrap} >
                            <Text style={style.payBtn}>去支付</Text>
                        </TouchableHighlight> : null
                    }
                    <View style={style.addressBottomWrap}>
                        {orderStatus == 2 ? <TouchableHighlight underlayColor="#fff" onPress={() => toDelivery()}>
                            <View style={style.deliveryInfo}>
                                <Image style={style.deliveryIcon} source={require("../../assets/imgs/delivery.png")}></Image>
                                <View style={style.deliveryInfoWrap}>
                                    <Text numberOfLines={2} ellipsizeMode="tail" style={style.deliveryDetail}>您的订单预计2020-05-18 14:16开始处理,请您耐心等待</Text>
                                    <Text style={style.deliveryTime}>2020-05-18 14:16:30</Text>
                                </View>
                                <Image style={style.arrowRight} source={require("../../assets/imgs/arrow-right.png")}></Image>
                            </View>
                        </TouchableHighlight> : null}
                        <View style={style.userWrap}>
                            <Image style={style.locationIcon} source={require("../../assets/imgs/location.png")}></Image>
                            <Text style={style.userInfo}>绿灯 17855827436</Text>
                        </View>
                        <Text style={style.addressDetail}>地址：浙江省杭州市余杭区莫干山路3111号梦想小镇设计中心9号楼</Text>
                    </View>
                </View>
                <ProductItem></ProductItem>
                <View style={style.orderInfoWrap}>
                    <View style={style.orderInfoItem}>
                        <Text style={style.orderLabel}>订单编号: </Text>
                        <Text style={style.orderItemContent}>12064393260</Text>
                        <TouchableHighlight style={style.copy} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.copyText}>复制</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={[style.orderInfoItem, style.mt10]}>
                        <Text style={style.orderLabel}>下单时间: </Text>
                        <Text style={style.orderItemContent}>2020-05-17 17:19:23</Text>
                    </View>
                    <View style={[style.orderInfoItem, style.mt10]}>
                        <Text style={style.orderLabel}>配送方式: </Text>
                        <Text style={style.orderItemContent}>京东配送</Text>
                    </View>
                    <View style={[style.orderInfoItem, style.productPrice]}>
                        <Text style={style.orderLabel}>商品总额: </Text>
                        <Text style={style.orderItemContent}>￥14.90</Text>
                    </View>
                    <View style={[style.orderInfoItem, style.deliveryFee]}>
                        <Text style={style.orderLabel}>运费: </Text>
                        <Text style={style.orderItemContent}>+￥0.00</Text>
                    </View>
                    <View style={style.totalPay}>
                        <Text style={style.needPay}>需付款:<Text style={style.totalPrice}>￥14</Text><Text style={style.totalPriceTail}>.90</Text></Text>
                    </View>
                </View>
                <Text style={style.recommandText}>为你推荐</Text>
                    <View style={style.recommandProductWrap}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => <ProductItemLarge productPress={()=>navigation.navigate("productDetail")}></ProductItemLarge>)}
                    </View>
            </ScrollView>
            <BottomBar type={orderStatus}></BottomBar>
        </View>
    )
}
const BottomBar = memo((props) => {
    const { type } = props
    const _renderItem = () => {
        switch (type) {
            case 1:
                return (
                    <View style={style.bottomBar}>
                        <TouchableHighlight style={style.bottomCancelWrap} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.cancelPay}>取消订单</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={style.bottomPayWrap} underlayColor="#f2140c" onPress={() => { }}>
                            <Text style={style.toPayText}>去支付</Text>
                        </TouchableHighlight>
                    </View>
                )
            case 2:
                return (
                    <View style={style.bottomBar}>
                        <TouchableHighlight style={style.bottomCancelWrap} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.cancelPay}>查看物流</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={style.bottomPayWrap} underlayColor="#f2140c" onPress={() => { }}>
                            <Text style={style.toPayText}>确认收货</Text>
                        </TouchableHighlight>
                    </View>
                )
            case 3:
                return (<View style={style.orderBottomWrap}>
                    <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => { }}>
                        <Text style={style.remainPayText}>谢谢惠顾</Text>
                    </TouchableHighlight>
                </View>)
            default:
                return null
        }
    }
    return _renderItem()
})
export default OrderStatus

const style = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    headerOne: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "rgba(255,255,255,0)",
        zIndex: 100,
        height: scaleHeight(45)
    },
    leftWrap: {
        position: "absolute",
        left: 0,
        top: 0,
        height: scaleHeight(45),
        minWidth: scaleSize(45),
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
    leftIcon: {
        height: scaleSize(20),
        width: scaleSize(20)
    },
    statusBar: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        zIndex: 100,
    },
    headerWrap: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        backgroundColor: "#fff",
        zIndex: 100,
    },
    orderStatusWrap: {
        marginBottom: scaleHeight(10),
        position: "relative",
        backgroundColor: "#f2140c"
    },
    orderStatus: {
        marginTop: scaleHeight(20),
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    statusIcon: {
        marginRight: scaleSize(5),
        width: scaleSize(25),
        height: scaleSize(25)
    },
    statusText: {
        fontSize: setSpText2(16),
        fontWeight: "500",
        color: "#fff"
    },
    orderInfo: {
        marginTop: scaleHeight(6),
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center"
    },
    tip: {
        fontSize: setSpText2(12),
        color: "#fff"
    },
    price: {
        fontSize: setSpText2(14),
        color: "#fff"
    },
    priceTail: {
        fontSize: setSpText2(12),
        color: "#fff"
    },
    restTime: {
        marginLeft: scaleSize(5),
        color: "#fff",
        fontSize: setSpText2(12)
    },
    payWrap: {
        marginTop: scaleHeight(20),
        width: scaleSize(100),
        height: scaleHeight(25),
        borderRadius: scaleSize(15),
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center"
    },
    payBtn: {
        fontSize: setSpText2(12),
        color: "#f2140c"
    },
    addressBottomWrap: {
        marginTop:scaleHeight(40),
        backgroundColor: "#fff",
        borderTopLeftRadius: scaleSize(10),
        borderTopRightRadius: scaleSize(10),
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(10)
    },
    deliveryInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: scaleHeight(10)
    },
    deliveryIcon: {
        marginRight: scaleSize(5),
        width: scaleSize(15),
        height: scaleSize(15),
        alignSelf: "flex-start"
    },
    deliveryInfoWrap: {
        flex: 1,
        marginRight: scaleSize(20)
    },
    deliveryDetail: {
        fontSize: setSpText2(14)
    },
    deliveryTime: {
        marginTop: scaleHeight(5),
        fontSize: setSpText2(12),
        color: "#999"
    },
    userWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    locationIcon: {
        marginRight: scaleSize(5),
        width: scaleSize(15),
        height: scaleSize(15)
    },
    userInfo: {
        fontSize: setSpText2(14),
        flex: 1
    },
    editText: {
        fontSize: setSpText2(14),
        marginRight: scaleSize(4)
    },
    arrowRight: {
        width: scaleSize(10),
        height: scaleSize(10)
    },
    addressDetail: {
        marginTop: scaleHeight(8),
        marginLeft: scaleSize(15),
        color: "#999",
        fontSize: setSpText2(12),
    },
    productWrap: {
        marginTop: scaleHeight(10),
        backgroundColor: "#fff"
    },
    orderInfoWrap: {
        marginTop: scaleHeight(10),
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(10),
        backgroundColor: "#fff"
    },
    orderInfoItem: {
        flexDirection: "row",
        alignItems: "center"
    },
    orderLabel: {
        width: scaleSize(80),
        fontSize: setSpText2(14),
        color: "#333"
    },
    orderItemContent: {
        fontSize: setSpText2(14),
        color: "#333",
        fontWeight: "500"
    },
    mt10: {
        marginTop: scaleHeight(10)
    },
    productPrice: {
        marginTop: scaleHeight(15),
        justifyContent: "space-between"
    },
    deliveryFee: {
        marginTop: scaleHeight(15),
        justifyContent: "space-between"
    },
    copy: {
        marginLeft: scaleSize(20),
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
    bottomBar: {
        height:scaleHeight(50),
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: "#fff",
        alignItems:"center",
        paddingHorizontal: scaleSize(10)
    },
    totalPay: {
        marginTop: scaleHeight(10),
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end"
    },
    needPay: {
        fontSize: setSpText2(12),
        color: "#333"
    },
    totalPrice: {
        color: "#f2140c",
        fontSize: setSpText2(14),
    },
    totalPriceTail: {
        color: "#f2140c",
        fontSize: setSpText2(12),
    },
    bottomPayWrap: {
        width: scaleSize(80),
        height: scaleHeight(25),
        borderRadius: scaleSize(15),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f2140c"
    },
    toPayText: {
        color: "#fff",
        fontSize: setSpText2(12)
    },
    bottomCancelWrap: {
        marginRight: scaleSize(10),
        width: scaleSize(80),
        height: scaleHeight(25),
        borderRadius: scaleSize(15),
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: scaleSize(0.5),
        borderColor: "#999"
    },
    cancelPay: {
        color: "#333",
        fontSize: setSpText2(12)
    },
    recommandText: {
        backgroundColor:"#fff",
        paddingHorizontal: scaleSize(20),
        paddingVertical: scaleHeight(20),
        fontWeight: "500",
        fontSize: setSpText2(16)
    },
    recommandProductWrap: {
        flexDirection: "row",
        paddingHorizontal: scaleSize(10),
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
})