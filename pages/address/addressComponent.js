import React, { memo, useCallback } from "react"
import { View, Text, Image, StyleSheet, ScrollView, Switch, TouchableHighlight, Modal } from "react-native"
import { TextInput } from "react-native-gesture-handler"
import { Formik } from 'formik';
import * as yup from "yup"
import { scaleSize, setSpText2, scaleHeight } from "../../utils/ScreenUtil"
import AddressPopup from "../../components/AddressPopup"

const phoneRegExp = /^1[3456789]\d{9}$/

const AddressComponent = memo((props) => {
    const {
        createAddress,
        addressPopupFlag,
        setAddressPopupFlag,
        isDefault,
        setIsDefault,
        addressSelectItem,
        setAddressSelectItem,
        addressData,
        addressText,
        _handleSubmit,
        phone = "",
        real_name = "",
        detail = ""
    } = props
    const initValue = useCallback(() => {
        return { phone: props.phone, real_name: props.real_name, detail: props.detail }
    }, [props])
    return (
        <View style={{ flex: 1 }}>
              <Formik
                    enableReinitialize
                    key={initValue()}
                    style={{ flex: 1 }}
                    initialValues={initValue()}
                    onSubmit={values => createAddress(values)}
                    validationSchema={
                        yup.object().shape({
                            phone: yup
                                .string()
                                .matches(phoneRegExp, '手机格式有误')
                                .required("请输入手机号"),
                            real_name: yup
                                .string()
                                .required("请输入姓名"),
                            detail: yup
                                .string()
                                .required("请输入详细地址")
                        })}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <ScrollView style={style.scrollView}>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>收货人</Text>
                                <TextInput value={values.real_name} placeholder="请填写收货人姓名" onChangeText={handleChange('real_name')} style={style.nameInput}></TextInput>
                            </View>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>手机号码</Text>
                                <TextInput value={values.phone} placeholder="请填写收货人手机号" onChangeText={handleChange('phone')} style={style.phoneInput}></TextInput>
                            </View>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>所在地区</Text>
                                <TouchableHighlight style={{ flex: 1 }} underlayColor="#fff" onPress={() => setAddressPopupFlag(true)}>
                                    <Text style={style.areTitle}>{addressText()}</Text>
                                </TouchableHighlight>
                                {/* <Image style={style.locationIcon} source={require("../../assets/imgs/location.png")}></Image>
                             <Text style={style.locationTitle}>定位</Text> */}
                            </View>
                            <View style={style.formItemWrap}>
                                <Text style={style.label}>详细地址</Text>
                                <TextInput value={values.detail} placeholder="街道、楼牌号等" onChangeText={handleChange('detail')} style={style.addressDetailInput}></TextInput>
                            </View>
                            <View style={style.formItemWrap}>
                                <View style={style.defaultLabelWrap}>
                                    <Text style={style.defaultLabel}>设置默认地址</Text>
                                    <Text style={style.tip}>提醒：每次下单会默认推荐使用该地址</Text>
                                </View>
                                <Switch thumbColor="#fff" value={isDefault} ios_backgroundColor="#eee" onValueChange={() => setIsDefault(isDefault => !isDefault)} trackColor={{ false: '#eee', true: '#fca413' }}></Switch>
                            </View>
                            <TouchableHighlight style={style.saveWrap} underlayColor="#fca413" onPress={() => _handleSubmit(values, errors, handleSubmit)}>
                                <Text style={style.saveTitle}>保存</Text>
                            </TouchableHighlight>
                        </ScrollView>
                    )}
                </Formik>
            <Modal visible={addressPopupFlag} animationType="fade" transparent={true}>
                <AddressPopup
                    addressData={addressData}
                    addressSelectItem={addressSelectItem}
                    setAddressSelectItem={setAddressSelectItem}
                    setAddressPopupFlag={setAddressPopupFlag}>
                </AddressPopup>
            </Modal>
        </View>
    )
})
export default AddressComponent
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
        flex: 1,
        color: "#333"
    },
    phoneInput: {
        marginRight: scaleSize(20),
        paddingVertical: 0,
        flex: 1,
        color: "#333"
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
        flex: 1,
        color: "#333"
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
        marginTop: scaleHeight(250),
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