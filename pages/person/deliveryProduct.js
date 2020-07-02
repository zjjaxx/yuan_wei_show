import React, { useEffect, useCallback, useState, createContext, memo } from "react"
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableHighlight, Image, TextInput } from "react-native"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil.js"
import Header from "../../components/Header.js"

function DeliveryProduct({ navigation }) {
    const [deliveryNumber, setDeliveryNumber] = useState()
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //发布
    const submit = useCallback(() => {

    }, [])
    const changeText = useCallback((text) => {
        setDeliveryNumber(text)
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <Header leftEvent={leftEvent} title="我要发货"></Header>
            <View style={style.formWrap}>
                <View style={style.formItemWrap}>
                    <View style={style.deliveryInfo}>
                        <Text style={style.deliveryTip}>快递单号</Text>
                        <TextInput value={deliveryNumber} placeholder="请输入快递单号" onChangeText={changeText} style={style.deliveryInput}></TextInput>
                    </View>
                    <Image style={style.scan} source={require("../../assets/imgs/scan.png")}></Image>
                </View>
                <View style={[style.formItemWrap, { borderBottomWidth: 0 }]}>
                    <View style={style.deliveryInfo}>
                        <Text style={style.deliveryTip}>快递公司</Text>
                        <Text style={style.deliverCompanyName}>请选择快递公司</Text>
                    </View>
                    <Image style={style.arrow} source={require("../../assets/imgs/arrow-right-gray.png")}></Image>
                </View>
            </View>
            <TouchableHighlight style={style.saveWrap} underlayColor="#fca413" onPress={() => submit()}>
                <Text style={style.saveTitle}>保存</Text>
            </TouchableHighlight>
        </SafeAreaView>
    )
}
const style = StyleSheet.create({
    safeAreaView: {
        position: "relative",
        paddingVertical: scaleHeight(10),
        flex: 1,
        backgroundColor: "#fafafa"
    },
    formWrap: {
        marginHorizontal: scaleSize(10),
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(10),
        backgroundColor: "#fff",
        borderRadius: scaleSize(5)
    },
    formItemWrap: {
        paddingVertical: scaleHeight(10),
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#eee"
    },
    deliveryInfo: {
        marginRight: scaleSize(20),
        flex: 1,
    },
    deliveryTip: {
        fontSize: setSpText2(14)
    },
    deliveryInput: {
        marginTop: scaleHeight(10),
        fontSize: setSpText2(14),
        color: "#333"
    },
    deliverCompanyName: {
        marginTop: scaleHeight(10),
        fontSize: setSpText2(12),
        color: "#999"
    },
    scan: {
        width: scaleSize(20),
        height: scaleSize(20)
    },
    arrow: {
        width: scaleSize(10),
        height: scaleSize(10)
    },
    saveWrap: {
        position: "absolute",
        bottom: scaleHeight(20),
        left: scaleSize(17.5),
        width: scaleSize(340),
        backgroundColor: "#fca413",
        height: scaleHeight(30),
        borderRadius: scaleSize(15),
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    saveTitle: {
        fontSize: setSpText2(14),
        color: "#fff"
    }
})
export default DeliveryProduct