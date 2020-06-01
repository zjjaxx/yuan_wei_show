import React, { useCallback, useState } from "react"
import { View, SafeAreaView, StyleSheet, Alert } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import useAddressData from "../../customUse/addressData";
import AddressComponent from "./addressComponent"

function EditAddress({ navigation }) {
    const [phone,setPhone]=useState("17855827436")
    const [real_name]=useState("绿灯")
    const [detail,setAddressDetail]=useState("兰江街道 水东村")
    //选择地址模态框
    const [addressPopupFlag, setAddressPopupFlag] = useState(false)
    //地址数据
    const addressData = useAddressData()
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    const [isDefault, setIsDefault] = useState(true)
    //地址ID数组
    const [addressSelectItem, setAddressSelectItem] = useState([{ value: 1, text: "北京市" }, { value: 1, text: "北京市" }, { value: 390, text: "丰台区" }])
    const addressText = () => {
        return addressSelectItem.map(item => item.text).join(" ") || "省市区县、乡镇等"
    }
    //提交
    const _handleSubmit = useCallback((values, errors, handleSubmit) => {
        for (let [key, value] of Object.entries(errors)) {
            if (value) {
                Alert.alert(
                    '提示',
                    value,
                    [
                        { text: 'OK', onPress: () => { } },
                    ],
                )
                return
            }
        }
        handleSubmit()
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} title="编辑收货地址"></Header>
                <AddressComponent
                    addressPopupFlag={addressPopupFlag}
                    setAddressPopupFlag={setAddressPopupFlag}
                    isDefault={isDefault}
                    setIsDefault={setIsDefault}
                    addressSelectItem={addressSelectItem}
                    setAddressSelectItem={setAddressSelectItem}
                    addressData={addressData}
                    addressText={addressText}
                    _handleSubmit={_handleSubmit}
                    phone={phone}
                    real_name={real_name}
                    detail={detail}
                ></AddressComponent>
            </View>
        </SafeAreaView>
    )
}
export default EditAddress
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1
    },
    scrollView: {
        position: "relative",
        flex: 1,
    },
    formItemWrap: {
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(15),
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "#eee",
        borderBottomWidth: scaleSize(0.5)
    },
    label: {
        width: scaleSize(80),
        fontSize: setSpText2(14)
    },
    nameInput: {
        marginRight: scaleSize(20),
        paddingVertical: 0,
        flex: 1
    },
    phoneInput: {
        marginRight: scaleSize(20),
        paddingVertical: 0,
        flex: 1
    },
    areTitle: {
        flex: 1,
        fontSize: setSpText2(14),
        color: "#999"
    },
    locationIcon: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    locationTitle: {
        fontSize: setSpText2(14)
    },
    addressDetailInput: {
        marginRight: scaleSize(20),
        paddingVertical: 0,
        flex: 1
    },
    defaultLabelWrap: {
        marginRight: scaleSize(30),
        flex: 1
    },
    defaultLabel: {
        fontSize: scaleSize(14)
    },
    tip: {
        marginTop: scaleHeight(4),
        fontSize: scaleSize(12)
    },
    saveWrap: {
        marginTop: scaleHeight(270),
        width: scaleSize(340),
        backgroundColor: "#f2140c",
        height: scaleHeight(25),
        borderRadius: scaleSize(15),
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center"
    },
    saveTitle: {
        fontSize: setSpText2(12),
        color: "#fff"
    }
})