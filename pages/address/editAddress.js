import React, { useCallback, useState, useEffect } from "react"
import { View, SafeAreaView, StyleSheet, Alert } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import addressData from "../../utils/address"
import AddressComponent from "./addressComponent"
import {edit,update} from "../../api/api"

function EditAddress({ navigation,route }) {
    const [phone,setPhone]=useState("1785582743?????6")
    const [real_name,setRealName]=useState("绿灯")
    const [detail,setAddressDetail]=useState("兰江街道 水东村")
    //选择地址模态框
    const [addressPopupFlag, setAddressPopupFlag] = useState(false)
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
    //updateAddress
    const updateAddress=useCallback((values)=>{
        update({
            address_id:route.params.address_id,
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
    },[])
    useEffect(()=>{
        if(route.params?.address_id){
            edit({address_id:route.params.address_id}).then(({data:{result}})=>{
                setPhone(result.phone)
                setRealName(result.real_name)
                setAddressDetail(result.detail)
                setIsDefault(parseInt(result.is_default)==1?true:false)
                let province=Object.assign({},result.province,{text:JSON.parse(result.province.text)})
                let city=Object.assign({},result.city,{text:JSON.parse(result.city.text)})
                let district=Object.assign({},result.district,{text:JSON.parse(result.district.text)})
                setAddressSelectItem([province,city,district]) 
            })
        }
    },[route.params?.address_id])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} title="编辑收货地址"></Header>
                <AddressComponent
                    createAddress={updateAddress}
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