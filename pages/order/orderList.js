import React, { useCallback, createContext, memo } from "react"
import { View, Text, SafeAreaView, TouchableHighlight, FlatList, StyleSheet, Image } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
const Context = createContext()
function OrderList({ navigation }) {
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //跳转订单详情
    const toOrderStatus = useCallback(() => {
        navigation.navigate("orderState")
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} title="我的订单"></Header>
                <Context.Provider value={{
                }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={style.flatList}
                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                        renderItem={({ item, index }) => (
                            <OrderItem toOrderStatus={toOrderStatus} item={item}></OrderItem>
                        )}
                    />

                </Context.Provider>
            </View>
        </SafeAreaView>
    )
}

const OrderItem = memo((props) => {
    const { index, item, toOrderStatus } = props
    return (
        <TouchableHighlight key={index} underlayColor="#fff" onPress={() => toOrderStatus()}>
            <View style={style.orderItemWrap}>
                <View style={style.orderItemHeader}>
                    <Image style={style.sellerIcon} source={require("../../assets/imgs/avatar.jpeg")}></Image>
                    <Text style={style.name} numberOfLines={1} ellipsizeMode="tail">小可爱</Text>
                </View>
                <View style={style.orderItemInfo}>
                    <Image style={style.productImg} source={require("../../assets/imgs/pic3.jpg")}></Image>
                    <Text style={style.productName} numberOfLines={2} ellipsizeMode="tail">见覅偶尔玩家佛我我if叫我我交付物金额非叫我我见附件为佛我经济分解为of及文件夹违法未接诶飞机</Text>
                    <View style={style.orderItemInfoRight}>
                        <View style={style.priceWrap}>
                            <Text style={style.price}>￥39</Text>
                            <Text style={style.priceTail}>.00</Text>
                        </View>
                        <Text style={style.productNum}>共五件</Text>
                    </View>
                </View>
                <BottomBar type={2}></BottomBar>
            </View>
        </TouchableHighlight >
    )
})
const BottomBar = memo((props) => {
    const { type } = props
    const _renderItem = () => {
        switch (type) {
            case 1:
                return (
                    <View style={style.orderBottomWrap}>
                        <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image style={style.msgIcon} source={require("../../assets/imgs/connect-seller.png")}></Image>
                                <Text style={style.connectText}>联系卖家</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.remainPayText}>去支付</Text>
                        </TouchableHighlight>
                    </View>
                )
            case 2:
                return (
                    <View style={style.orderBottomWrap}>
                        <View></View>
                        <View style={{ flexDirection: "row" }}>
                            <TouchableHighlight style={style.delivery} underlayColor="#fff" onPress={() => { }}>
                                <Text style={style.deliveryText}>查看物流</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => { }}>
                                <Text style={style.remainPayText}>确认收货</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                )
            case 3:
                return (<View style={style.orderBottomWrap}>
                    <View></View>
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
export default OrderList
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1
    },
    viewPager: {
        flex: 1
    },
    tabWrap: {
        position: "relative",
        height: scaleHeight(30),
        flexDirection: "row",
    },
    tabItem: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    tabTitle: {
        fontSize: setSpText2(14),
    },
    lineWrap: {
        position: "absolute",
        bottom: 0,
    },
    line: {
        width: scaleSize(25),
        height: scaleHeight(3),
        borderRadius: scaleSize(2.5)
    },
    flatList: {
        flex: 1
    },
    orderItemWrap: {
        paddingHorizontal: scaleSize(15),
        paddingVertical: scaleHeight(10),
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#eee"
    },
    orderItemHeader: {
        flexDirection: "row",
        alignItems: "center"
    },
    sellerIcon: {
        marginRight: scaleSize(10),
        width: scaleSize(20),
        height: scaleSize(20),
        borderRadius: scaleSize(10)
    },
    name: {
        marginRight: scaleSize(40),
        flex: 1,
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    orderItemInfo: {
        marginTop: scaleHeight(15),
        flexDirection: "row",
        alignItems: "center"
    },
    productImg: {
        height: scaleSize(60),
        width: scaleSize(60),
        borderRadius: scaleSize(5)
    },
    orderItemInfoRight: {
        justifyContent: "flex-end"
    },
    priceWrap: {
        flexDirection: "row",
        alignItems: "flex-end"
    },
    productName: {
        flex: 1,
        marginRight: scaleSize(10),
        marginLeft: scaleSize(8),
        fontSize: setSpText2(12)
    },
    price: {
        fontSize: setSpText2(16),
    },
    priceTail: {
        fontSize: setSpText2(10),
    },
    productNum: {
        marginTop: scaleHeight(2),
        fontSize: setSpText2(10),
        color: "#999"
    },
    orderBottomWrap: {
        paddingVertical: scaleHeight(5),
        marginTop: scaleHeight(10),
        flexDirection: "row",
        justifyContent: "space-between"
    },
    msgIcon: {
        marginRight: scaleSize(5),
        width: scaleSize(15),
        height: scaleSize(15)
    },
    connectText: {
        fontSize: setSpText2(14)
    },
    remainPay: {
        width: scaleSize(70),
        height: scaleHeight(20),
        borderRadius: scaleSize(15),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: scaleSize(0.5),
        borderColor: "#fca413"
    },
    remainPayText: {
        fontSize: setSpText2(12),
        color: "#fca413"
    },
    delivery: {
        marginRight: scaleSize(10),
        width: scaleSize(70),
        height: scaleHeight(20),
        borderRadius: scaleSize(15),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: scaleSize(0.5),
        borderColor: "#999"
    },
    deliveryText: {
        fontSize: setSpText2(12),
        color: "#333"
    }
})