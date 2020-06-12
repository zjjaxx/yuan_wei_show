import React, { useRef, useState, useCallback, memo, useEffect } from "react"
import { View, Text, SafeAreaView, StyleSheet, ScrollView, Dimensions, Image, Button } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
//阴影
import { BoxShadow } from 'react-native-shadow'
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNodeListRect,useNodeRect } from "../../customUse/useClientRect"
import { pay } from "../../api/api"
import Alipay from '@0x5e/react-native-alipay';
const { width: viewportWidth } = Dimensions.get('window');
function Members({ navigation }) {
    const [tabList, setTabList] = useState([])
    const scrollRef = useRef()
    const [tabIndex, setTabIndex] = useState(0)
    //tab 切换 
    const scrollMove = useCallback((index,tabItemWidth) => {
        let distance = tabItemWidth * index - viewportWidth / 2 + tabItemWidth / 2
        scrollRef.current.scrollTo({ x: distance, animated: true })
    }, [])
    //支付
    const payConfirm = useCallback(() => {
        // APP支付
        // pay({ goods_id: route.params.goods_id, pay_type: 1 }).then(({ data: { result } }) => {
        //     let orderStr = result.config
        //     return Alipay.pay(orderStr)
        // })
        //     .then(response => {
        //         Alert.alert(
        //             '提示',
        //             "支付成功",
        //             [
        //                 { text: 'OK', onPress: () => { navigation.goBack() } },
        //             ],
        //         )
        //     })
        //     .catch(res => {
        //         console.log("res", res)
        //     })
    }, [])
    const _tabChange = useCallback((index,tabItemWidth=0) => {
        setTabIndex(index)
        scrollMove(index,tabItemWidth)
    }, [])
    useEffect(() => {
        setTabList([1, 2, 3, 4, 5, 6, 7, 8, 9])
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.memberContainer}>
                <Header leftEvent={() => { navigation.goBack() }} title="会员中心"></Header>
                <Text style={style.memberTitle}>会员特权</Text>
                <View style={style.tqWrap}>
                    {[1, 2, 3, 4, 5].map(item => (
                        <View style={style.tqItemWrap}>
                            <View style={style.tqTitleWrap}>
                                <Text style={style.tqTitle}>看得更多</Text>
                            </View>
                            <Text style={style.tqText}>每天不限次数查看用户</Text>
                        </View>
                    ))}
                </View>
                <Text style={style.memberTitle}>会员套餐</Text>
                <ScrollView
                    ref={scrollRef}
                    style={style.scrollWrap}
                    bounces={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    alwaysBounceHorizontal={false}>
                    <View style={style.memberListWrap}>
                        {
                            // tabListRefs={tabListRefs}
                            tabList.map((item, index) => <TabItem key={index} _tabChange={_tabChange} tabIndex={tabIndex} tabItemData={item} index={index}></TabItem>)
                        }
                    </View>
                </ScrollView>
                <Text style={style.memberTitle}>支付方式</Text>
                <View style={style.payWrap}>
                    <Image style={style.alipayIcon} source={require("../../assets/imgs/alipay.png")}></Image>
                    <Text style={style.alipayText}>支付宝</Text>
                    <Image style={style.selected} source={require("../../assets/imgs/selected.png")}></Image>
                </View>
                <View style={style.payButtonWrap}>
                    <TouchableOpacity activeOpacity={1} style={style.payButton} onPress={payConfirm}>
                        <Text style={style.payText}>立即支付</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )

}
const TabItem = memo((props) => {
    const { _tabChange, tabIndex, tabItemData, index, tabListRefs } = props
    const [tabItemInfo,tabItemRef]=useNodeRect()
    return (
        <BoxShadow setting={shadowOpt} >
            <TouchableOpacity onLayout={tabItemRef}  style={style.tabItemWrap} opacity={1} onPress={() => _tabChange(index,tabItemInfo&&tabItemInfo.width)}>
                <View style={[style.tabItemWrap, tabIndex == index ? style.selectItemWrap : {}]}>
                    <Text style={style.itemTitle}>连续包月</Text>
                    <View style={[style.itemContentWrap, tabIndex == index ? { backgroundColor: "#fefae9" } : {}]}>
                        <Text style={style.discount}>立省6元</Text>
                        <View style={style.priceWrap}>
                            <Text style={style.unit}>￥</Text>
                            <Text style={style.price}>19</Text>
                        </View>
                        <Text style={style.originPrice}>原价￥25</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </BoxShadow >

    )
})
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    memberTitle: {
        marginLeft: scaleSize(15),
        fontSize: setSpText2(16),
        fontWeight: "500",
        lineHeight: setSpText2(20)
    },
    tqWrap: {
        paddingHorizontal: scaleSize(15),
        paddingVertical: scaleHeight(10)
    },
    tqItemWrap: {
        marginTop: scaleHeight(5),
        flexDirection: "row",
        alignItems: "center"
    },
    tqTitleWrap: {
        marginRight: scaleSize(10),
        paddingVertical: scaleHeight(5),
        paddingHorizontal: scaleSize(10),
        borderRadius: scaleSize(15),
        backgroundColor: "#fbcc7a"
    },
    tqTitle: {
        fontSize: setSpText2(14),
        color: "#fff"
    },
    tqText: {
        fontSize: setSpText2(14)
    },
    memberContainer: {
        position: "relative",
        flex: 1
    },
    memberListWrap: {
        marginTop: scaleHeight(10),
        flexDirection: "row",
        paddingLeft: scaleSize(15)
    },
    tabItemWrap: {
        backgroundColor: "#fff",
        height: scaleHeight(100),
        width: scaleSize(80),
        borderRadius: scaleSize(5),
    },
    itemTitle: {
        marginTop: scaleHeight(5),
        fontSize: setSpText2(14),
        textAlign: "center",
        width: "100%",
        lineHeight: setSpText2(20),
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5)
    },
    itemContentWrap: {
        paddingTop: scaleHeight(5),
        alignItems: "center",
        marginHorizontal: scaleSize(5),
        marginBottom: scaleHeight(5),
        flex: 1,
        backgroundColor: "#fff"
    },
    discount: {
        paddingHorizontal: scaleSize(5),
        paddingVertical: scaleHeight(2),
        backgroundColor: "#ff594f",
        fontSize: setSpText2(10),
        color: "#fff"
    },
    priceWrap: {
        marginTop: scaleHeight(5),
        flexDirection: "row",
        alignItems: "flex-start"
    },
    unit: {
        fontSize: setSpText2(10),
        fontWeight: "500",
        marginTop: scaleHeight(5)
    },
    price: {
        fontSize: setSpText2(20),
        fontWeight: "500"
    },
    originPrice: {
        marginTop: scaleHeight(5),
        color: "#999",
        fontSize: setSpText2(10)
    },
    selectItemWrap: {
        backgroundColor: "#fbcc7a",
    },
    scrollWrap: {
        flexGrow: 0,
        height: scaleHeight(120),
        marginBottom: scaleHeight(15)
    },
    payWrap: {
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(15)
    },
    alipayIcon: {
        width: scaleSize(35),
        height: scaleSize(35),
        borderRadius: scaleSize(5)
    },
    alipayText: {
        marginRight: "auto",
        marginLeft: scaleSize(10),
        fontSize: setSpText2(14)
    },
    selected: {
        width: scaleSize(20),
        height: scaleSize(20)
    },
    payButtonWrap: {
        flex: 1,
        justifyContent: "flex-end"
    },
    payButton: {
        // marginBottom:scaleHeight(10),
        height: scaleHeight(30),
        width: scaleSize(300),
        borderRadius: scaleSize(10),
        backgroundColor: "#fbcc7a",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center"
    },
    payText: {
        fontSize: setSpText2(14),
        color: "#333"
    }
})
const shadowOpt = {
    height: scaleHeight(100),
    width: scaleSize(80),
    color: "#999",
    border: 1,
    border: scaleSize(5),
    opacity: 0.2,
    x: 2,
    y: 1,
    style: { marginRight: scaleSize(20) }
}
export default Members