import React, { useCallback, useState, memo, useMemo } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableHighlight } from "react-native"
import Header from "../../components/Header"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import { SwipeListView } from 'react-native-swipe-list-view';

function AddressList({ navigation }) {
    //批量操作
    const [isBatchOperation, setIsBatchOperation] = useState(false)
    //批量选中的地址数组
    const [batchAddressList, setBatchAddressList] = useState([])
    //移除选中地址
    const removeBatchAddressList = useCallback((id) => {
        setBatchAddressList(batchAddressList.filter(item => item.id != id))
    }, [batchAddressList])
    //添加选中数组
    const addBatchAddressList = useCallback((item) => {
        setBatchAddressList([...batchAddressList, item])
    }, [batchAddressList])
    //返回上一页
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //切换批量操作事件
    const toggleBatchOperation = useCallback(() => {
        setIsBatchOperation(!isBatchOperation)
    }, [isBatchOperation])
    const bottomPress=useCallback(()=>{
        if(isBatchOperation){

        }
        else{
            navigation.navigate("newAddress")
        }
    },[isBatchOperation])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} rightEvent={() => toggleBatchOperation()} title="管理收货地址" right={<Text style={style.batchTitle}>{isBatchOperation ? '退出编辑' : '批量操作'}</Text>}></Header>
                <SwipeListView
                    style={style.scrollView}
                    rightOpenValue={-scaleSize(140)}
                    data={[1, 2, 3, 4, 5]}
                    renderItem={(data, rowMap) => (
                        <AddressItem id={data.index} isBatchOperation={isBatchOperation} removeBatchAddressList={removeBatchAddressList} addBatchAddressList={addBatchAddressList}></AddressItem>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={style.addressOptionMenu}>
                            <View style={style.defaultOption}>
                                <Text style={style.defaultTitle}>设为默认</Text>
                            </View>
                            <View style={style.delOption}>
                                <Text style={style.delTitle}>删除</Text>
                            </View>
                        </View>
                    )}>
                </SwipeListView>
                <TouchableHighlight underlayColor="#fff" onPress={bottomPress}>
                    <View style={style.addAddress}>
                        <Text style={style.addAddressTitle}>{isBatchOperation ? '删除' : '+ 新建收货地址'}</Text>
                    </View>
                </TouchableHighlight>
            </View>
        </SafeAreaView>

    )
}
const AddressItem = memo((props) => {
    const { isBatchOperation, id, removeBatchAddressList, addBatchAddressList } = props
    const [isSelect, setIsSelect] = useState(false)
    //取消选中
    const cancelSelect = useCallback(() => {
        setIsSelect(false)
        removeBatchAddressList(id)
    })
    //添加选中
    const addSelect = useCallback(() => {
        setIsSelect(true)
        addBatchAddressList({ id })
    })

    return (
        <View style={style.addressItemOptionWrap}>
            {isBatchOperation ? isSelect ?
                <TouchableHighlight underlayColor="#fff" onPress={cancelSelect} style={{ marginHorizontal: scaleSize(10) }}>
                    <Image style={style.selected} source={require("../../assets/imgs/selected.png")}></Image>
                </TouchableHighlight>
                :
                <TouchableHighlight underlayColor="#fff" onPress={addSelect} style={{ marginHorizontal: scaleSize(10) }}>
                    <View style={style.unselect}></View>
                </TouchableHighlight>
                : null}
            <View style={style.addressItem}>
                <View style={style.userInfoWrap}>
                    <Text style={style.userName}>路灯</Text>
                    <Text style={style.phone}>17855827436</Text>
                    <View style={style.defaultWrap}>
                        <Text style={style.default}>默认</Text>
                    </View>
                </View>
                <View style={style.addressDetailWrap}>
                    <Text style={style.addressDetail}>浙江省金华市婺城区罗布镇下郑村后后溪路一号</Text>
                    <Image style={style.editIcon} source={require('../../assets/imgs/edit.png')}></Image>
                </View>
            </View>
        </View>
    )
})
export default AddressList
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1
    },
    batchTitle: {
        marginRight: scaleSize(10)
    },
    addressItem: {
        flex: 1,
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(10),
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#eee",
        backgroundColor: "#fff"
    },
    userInfoWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    userName: {
        marginRight: scaleSize(20),
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    phone: {
        marginRight: scaleSize(5),
        fontSize: setSpText2(14),
        fontWeight: "500"
    },
    defaultWrap: {
        paddingHorizontal: scaleSize(4),
        paddingVertical: scaleHeight(2),
        borderRadius: scaleSize(2),
        backgroundColor: "#f2140c"
    },
    default: {
        color: "#fff",
        fontSize: setSpText2(12)
    },
    addressDetailWrap: {
        marginTop: scaleHeight(10),
        flexDirection: "row",
        alignItems: "center"
    },
    addressDetail: {
        flex: 1,
        fontSize: setSpText2(12),
        color: "#999",
        marginRight: scaleSize(20)
    },
    editIcon: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    selected: {
        height: scaleSize(20),
        width: scaleSize(20)
    },
    unselect: {
        height: scaleSize(20),
        width: scaleSize(20),
        borderRadius: scaleSize(10),
        borderWidth: scaleSize(1),
        borderColor: "#333"
    },
    addAddress: {
        marginHorizontal: scaleSize(30),
        height: scaleHeight(28),
        borderRadius: scaleSize(15),
        backgroundColor: "#f2140c",
        justifyContent: "center",
        alignItems: "center"
    },
    addAddressTitle: {
        fontSize: setSpText2(14),
        color: "#fff"
    },
    addressItemOptionWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    addressOptionMenu: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row"
    },
    defaultOption: {
        height: "100%",
        width: scaleSize(70),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
    },
    defaultTitle: {
        color: "#333",
        fontSize: setSpText2(12),
    },
    delOption: {
        height: "100%",
        width: scaleSize(70),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2140c",
    },
    delTitle: {
        color: "#fff",
        fontSize: setSpText2(12)
    }
})