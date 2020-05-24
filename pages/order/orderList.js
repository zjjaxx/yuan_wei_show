import React, { useCallback, useContext, createContext, memo, useState, useEffect, useMemo, useRef } from "react"
import { View, Text, SafeAreaView, TouchableHighlight, FlatList, StyleSheet, Animated, Image } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
//渐变
import LinearGradient from 'react-native-linear-gradient';
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { useNodeRect, useNodeListRect } from "../../customUse/useClientRect"
const Context = createContext()
function OrderList({ navigation }) {
    const [lineRectInfo, lineRef] = useNodeRect()
    const [tabListRectInfo, tabListRefs] = useNodeListRect(5)
    const [orderStatus] = useState(["全部", "待付款", "待收货", "已完成"])
    const [tabIndex, setTabIndex] = useState(0)
    const [translateYAnimate] = useState(new Animated.Value(0))
    const scrollTabRef = useRef()
    useEffect(() => {
        if (lineRectInfo && tabListRectInfo) {
            _animationEvent(0, lineRectInfo.width, tabListRectInfo.width)
        }
    }, [lineRectInfo, tabListRectInfo])
    const viewPageSwitch = useCallback((i) => {
        scrollTabRef.current.goToPage(i)
    }, [])
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //跳转订单详情
    const toOrderStatus = useCallback(() => {
        navigation.navigate("orderState")
    }, [])
    //tab切换
    const tabChange = useCallback(({ i, from }) => {
        setTabIndex(i)
        _animationEvent(i, lineRectInfo.width, tabListRectInfo.width)
    }, [lineRectInfo, tabListRectInfo])
    const _animationEvent = useCallback((index, lineWidth, tabItemWidth) => {
        let calcLeft = tabItemWidth * index + (tabItemWidth - lineWidth) / 2
        Animated.timing(
            translateYAnimate,
            {
                toValue: calcLeft,
                duration: 400,
            }
        ).start()
    }, [translateYAnimate])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} title="我的订单"></Header>
                <Context.Provider value={{
                    orderStatus,
                    scrollTabRef,
                    viewPageSwitch,
                    tabListRefs,
                    tabChange,
                    translateYAnimate,
                    lineRef,
                    tabIndex
                }}>
                    <ScrollableTabView
                        ref={scrollTabRef}
                        style={style.viewPager}
                        renderTabBar={() => <Tab></Tab>}
                        onChangeTab={tabChange}
                    >
                        {orderStatus.map((pageItem, pageIndex) => (
                            <View style={{ flex: 1 }} key={pageIndex} tabLabel={"item" + pageIndex}>
                                <FlatList
                                    style={style.flatList}
                                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                    renderItem={({ item, index }) => (
                                        <OrderItem toOrderStatus={toOrderStatus} item={item}></OrderItem>
                                    )}
                                />
                            </View>
                        ))}
                    </ScrollableTabView>
                </Context.Provider>
            </View>
        </SafeAreaView>
    )
}
const Tab = memo((props) => {
    const { translateYAnimate, viewPageSwitch, lineRef, orderStatus } = useContext(Context)
    const TabItem = memo((props) => {
        const { tabListRefs } = useContext(Context)
        const { item, index } = props
        return (
            <View style={style.tabItem} onLayout={tabListRefs[index]}>
                <Text style={style.tabTitle}>{item}</Text>
            </View>
        )
    })
    const tabPress = useCallback((index) => {
        viewPageSwitch(index)
    }, [])
    return (
        <View style={style.tabWrap}>
            {orderStatus.map((item, index) => {
                return (
                    <TouchableHighlight style={{ flex: 1 }} key={index} underlayColor="#fff" onPress={() => tabPress(index)}>
                        <TabItem index={index} item={item}></TabItem>
                    </TouchableHighlight>
                )
            })}
            <Animated.View onLayout={lineRef} style={[style.lineWrap, { left: translateYAnimate }]}>
                <LinearGradient useAngle={true} angle={90} colors={["#f2140c", "#fff"]} style={style.line}></LinearGradient>
            </Animated.View>
        </View>
    )
})
const OrderItem = memo((props) => {
    const { index, item, toOrderStatus } = props
    const {tabIndex}=useContext(Context)
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
                <BottomBar type={tabIndex}></BottomBar>
            </View>
        </TouchableHighlight >
    )
})
const BottomBar = memo((props) => {
    const { type } = props
    const _renderItem=()=>{
        switch (type) {
            case 1:
                return (
                    <View style={style.orderBottomWrap}>
                        <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.remainPayText}>去支付</Text>
                        </TouchableHighlight>
                    </View>
                )
            case 2:
                return (
                    <View style={style.orderBottomWrap}>
                        <TouchableHighlight style={style.delivery} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.deliveryText}>查看物流</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={style.remainPay} underlayColor="#fff" onPress={() => { }}>
                            <Text style={style.remainPayText}>确认收货</Text>
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
        paddingVertical: scaleHeight(20),
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
        marginTop: scaleHeight(10),
        flexDirection: "row",
        justifyContent: "flex-end"
    },
    remainPay: {
        width: scaleSize(70),
        height: scaleHeight(20),
        borderRadius: scaleSize(15),
        alignItems: "center",
        justifyContent: "center",
        borderWidth: scaleSize(0.5),
        borderColor: "#f2140c"
    },
    remainPayText: {
        fontSize: setSpText2(12),
        color: "#f2140c"
    },
    delivery: {
        marginRight:scaleSize(10),
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