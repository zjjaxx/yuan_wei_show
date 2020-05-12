import React, { useMemo, memo, useState } from "react"
import { View, Text, StyleSheet, Image, TouchableHighlight } from "react-native"
//渐变
import LinearGradient from 'react-native-linear-gradient';
import { scaleHeight, scaleSize, setSpText2 } from "../utils/ScreenUtil";
function AddressPopup(props) {
    const { setAddressPopupFlag } = props
    //地址数组索引
    const [addressIndex, setAddressIndex] = useState([-1, -1, -1])
    return (
        <TouchableHighlight style={{ flex: 1 }} underlayColor="#fff" onPress={() => setAddressPopupFlag(false)}>
            <View style={style.mask}>
                <TouchableHighlight style={style.addressPopupWrap} underlayColor="#fff" onPress={() => { }}>
                    <View style={style.addressPopupWrap}>
                        <View style={style.addressTopWrap}>
                            <Text style={style.addressTip}>请选择所在区域</Text>
                            <TouchableHighlight underlayColor="#fff" onPress={() => setAddressPopupFlag(false)}>
                                <Image style={style.closeIcon} source={require("../assets/imgs/close.png")}></Image>
                            </TouchableHighlight>
                        </View>
                        <Tab addressIndex={addressIndex}></Tab>
                    </View>
                </TouchableHighlight>
            </View>
        </TouchableHighlight>
    )
}
const Tab = memo((props) => {
    const { addressIndex } = props
    const TabItem = memo((props) => {
        const { itemData } = props
        return (
            <View style={style.tabItem}>
                <Text style={style.tabTitle}>{itemData == -1 ? '请选择' : itemData.title}</Text>
            </View>
        )
    })
    return (
        <View style={style.tabWrap}>
            {addressIndex.map((item, index) => {
                if (index !== 0 && item == -1) {
                    return null
                }
                return (
                    <TabItem itemData={item} key={index}></TabItem>
                )
            })}
            <LinearGradient colors={["#f2140c", "#fff"]} style={style.line}></LinearGradient>
        </View>
    )
})
export default AddressPopup

const style = StyleSheet.create({
    mask: {
        position: "relative",
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    addressPopupWrap: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: scaleHeight(400),
        backgroundColor: "#fff",
        zIndex: 100,
        borderTopLeftRadius: scaleSize(10),
        paddingVertical: scaleHeight(10),
        borderTopRightRadius: scaleSize(10),
    },
    addressContent: {
        width: "100%",
        height: "100%",
        paddingRight: scaleSize(10),
        borderTopLeftRadius: scaleSize(10),
        borderTopRightRadius: scaleSize(10),
    },
    addressTopWrap: {
        marginBottom: scaleHeight(20),
        paddingHorizontal: scaleSize(10),
        flexDirection: "row",
        alignItems: "center"
    },
    addressTip: {
        marginRight: scaleSize(30),
        fontSize: setSpText2(16),
        fontWeight: "500",
        flex: 1
    },
    closeIcon: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    tabWrap: {
        position: "relative",
        height: scaleHeight(30),
        flexDirection: "row",
    },
    tabItem: {
        paddingHorizontal: scaleSize(10),
        fontSize: setSpText2(14),
        height: scaleHeight(30),
    },
    line: {
        position: "absolute",
        bottom: 0,
        width: scaleSize(20),
        height: scaleHeight(4),
        borderRadius: scaleSize(2.5)
    }
})