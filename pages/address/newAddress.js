import React, { useCallback, useState } from "react"
import { View, SafeAreaView, StyleSheet, Alert } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import useAddressData from "../../customUse/addressData";
import AddressComponent from "./addressComponent"
import addressData from "../../utils/address"
import {store} from "../../api/api"
function NewAddress({ navigation }) {
    //选择地址模态框
    const [addressPopupFlag, setAddressPopupFlag] = useState(false)
    //地址数据
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    const [isDefault, setIsDefault] = useState(false)
    //地址ID数组
    const [addressSelectItem, setAddressSelectItem] = useState([])
    const addressText = () => {
        return addressSelectItem.map(item => item.text).join(" ") || "省市区县、乡镇等"
    }
    //新建地址
    const createAddress=useCallback((values)=>{
        store({
            phone:values.phone,
            real_name:values.real_name,
            detail:values.detail,
            pcd:JSON.stringify(addressSelectItem),
            is_default:isDefault?1:0
        }).then(({data:{result}})=>{
            Alert.alert(
                '提示',
                result,
                [
                    { text: 'OK', onPress: () => {navigation.goBack() } },
                ],
            )
        })
    },[addressSelectItem,isDefault])
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
                <Header leftEvent={leftEvent} title="新建收货地址"></Header>
                <AddressComponent
                    createAddress={createAddress}
                    addressPopupFlag={addressPopupFlag}
                    setAddressPopupFlag={setAddressPopupFlag}
                    isDefault={isDefault}
                    setIsDefault={setIsDefault}
                    addressSelectItem={addressSelectItem}
                    setAddressSelectItem={setAddressSelectItem}
                    addressData={addressData}
                    addressText={addressText}
                    _handleSubmit={_handleSubmit}
                ></AddressComponent>
            </View>
        </SafeAreaView>
    )
}
export default NewAddress
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