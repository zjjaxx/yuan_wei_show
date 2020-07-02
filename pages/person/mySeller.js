import React, { useEffect, useCallback, createContext,useContext, memo } from "react"
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableHighlight, Image } from "react-native"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil.js"
import { usePage } from "../../customUse/usePage.js"
import Header from "../../components/Header.js"
import { order_list } from "../../api/api.js"
const Context = createContext()
function MySeller({ navigation }) {
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //跳转订单详情
    const toOrderStatus = useCallback(() => {
        navigation.navigate("orderState")
    }, [])
    const _api = useCallback((page) => {
        order_list({ page: page + 1 }).then(({ data: { result } }) => {
            if (result.length) {
                setList(list => [...list, ...result])
                setCurrentPage(page => page + 1)
            }
            else {
                setIsFinish(true)
            }
        }).finally(() => {
            setIsLoading(false)
        })
    }, [])
    //去发货
    const toDelivery=useCallback(()=>{
        navigation.navigate("deliveryProduct")
    },[])
    const { list, setList, setIsLoading, setCurrentPage, setIsFinish, loadMore } = usePage(_api)
    useEffect(() => {
        _api(0)
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <Header leftEvent={leftEvent} title="我卖出的"></Header>
            <Context.Provider value={{
                toDelivery
            }}>
                <FlatList
                    onEndReached={loadMore}
                    showsVerticalScrollIndicator={false}
                    style={style.flatList}
                    data={list}
                    renderItem={({ item, index }) => (
                        <OrderItem toOrderStatus={toOrderStatus} item={item}></OrderItem>
                    )}
                />

            </Context.Provider>
        </SafeAreaView>
    )
}
const OrderItem = memo((props) => {
    const { index, item, toOrderStatus } = props
    return (
        <TouchableHighlight key={index} underlayColor="#fff" onPress={() => toOrderStatus()}>
            <View style={style.orderItemWrap}>
                {/* <View style={style.orderItemHeader}>
                    <Image style={style.sellerIcon} source={{uri:item.image}}></Image>
                    <Text style={style.name} numberOfLines={1} ellipsizeMode="tail">{item.}</Text>
                </View> */}
                <View style={style.orderItemInfo}>
                    <Image style={style.productImg} source={{ uri: item.image }}></Image>
                    <Text style={style.productName} numberOfLines={2} ellipsizeMode="tail">{item.store_name}</Text>
                    <View style={style.orderItemInfoRight}>
                        <View style={style.priceWrap}>
                            <Text style={style.price}>￥{item._pay_price.i}</Text>
                            <Text style={style.priceTail}>.{item._pay_price.d}</Text>
                        </View>
                        {/* <Text style={style.productNum}>共五件</Text> */}
                    </View>
                </View>
                <BottomBar type={item.status}></BottomBar>
            </View>
        </TouchableHighlight >
    )
})
const BottomBar = memo((props) => {
    const { type, } = props
    const {toDelivery}=useContext(Context)
    const _renderItem = () => {
        switch (type) {
            case 0:
                return (
                    <View style={style.orderBottomWrap}>
                        <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <Image style={style.msgIcon} source={require("../../assets/imgs/connect-seller.png")}></Image>
                                <Text style={style.connectText}>联系卖家</Text>
                            </View>
                        </TouchableHighlight>
                        <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => toDelivery()}>
                            <Text style={style.remainPayText}>去发货</Text>
                        </TouchableHighlight>
                    </View>
                )
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
                            <Text style={style.remainPayText}>提醒发货</Text>
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
            case 4:
                return (<View style={style.orderBottomWrap}>
                    <View></View>
                    <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => { }}>
                        <Text style={style.remainPayText}>评价</Text>
                    </TouchableHighlight>
                </View>)
            default:
                return null
        }
    }
    return _renderItem()
})
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
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
        alignItems: "flex-end"
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
        justifyContent: "space-between",
        alignItems: "center"
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
export default MySeller