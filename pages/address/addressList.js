import React, { useCallback, useState, memo, useMemo, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableHighlight, TouchableOpacity } from "react-native"
import Header from "../../components/Header"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import { SwipeListView } from 'react-native-swipe-list-view';
import {address,destroy} from "../../api/api"

function AddressList({ navigation }) {
    const [addressList,setAddressList]=useState([])
    const c_addressList=useMemo(()=>{
        return addressList.map(item=>{
            return {key:item.id,...item}
        })
    },[addressList])
    //批量操作
    const [isBatchOperation, setIsBatchOperation] = useState(false)
    //批量选中的地址数组
    const [batchAddressList, setBatchAddressList] = useState([])
    //移除选中地址
    const removeBatchAddressList = useCallback((item) => {
        setBatchAddressList(batchAddressList=>batchAddressList.filter(_item => _item.id != item.id))
    }, [])
    //添加选中数组
    const addBatchAddressList = useCallback((item) => {
        setBatchAddressList(batchAddressList=>[...batchAddressList,item])
    }, [])
    //返回上一页
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //切换批量操作事件
    const toggleBatchOperation = useCallback(() => {
        setIsBatchOperation(!isBatchOperation)
    }, [isBatchOperation])
    const bottomPress = useCallback(() => {
        if (isBatchOperation) {
            let address_id=JSON.stringify(batchAddressList.map(item=>item.id))
            destroy({address_id}).then(res=>{
                _api()
            })
        }
        else {
            navigation.navigate("newAddress")
        }
    }, [isBatchOperation,batchAddressList])
    const toEditAddress = useCallback(() => {
        navigation.navigate("editAddress")
    }, [])
    //设为默认
    const setDefault=useCallback((rowMap, rowKey)=>{
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    },[])
    //删除地址
    const delAddress=useCallback((rowMap, rowKey,dataItem)=>{
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
        let address_id=JSON.stringify([dataItem.id])
        destroy({address_id}).then(res=>{
            _api()
        })
    },[])
    //地址列表
    useEffect(()=>{
        _api()
    },[])
    const _api=useCallback(()=>{
        address().then(({data:{result}})=>{
            setAddressList(result)
        })
    },[])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} rightEvent={() => toggleBatchOperation()} title="管理收货地址" right={<Text style={style.batchTitle}>{isBatchOperation ? '退出编辑' : '批量操作'}</Text>}></Header>
                <SwipeListView
                    style={style.scrollView}
                    rightOpenValue={-scaleSize(140)}
                    data={c_addressList}
                    renderItem={(data, rowMap) => (
                        <AddressItem addressItemData={data.item} id={data.index} toEditAddress={toEditAddress} isBatchOperation={isBatchOperation} removeBatchAddressList={removeBatchAddressList} addBatchAddressList={addBatchAddressList}></AddressItem>
                    )}
                    renderHiddenItem={(data, rowMap) => (
                        <View style={style.addressOptionMenu}>
                            <TouchableHighlight style={style.defaultOption} underlayColor="#fff" onPress={() => setDefault(rowMap, data.item.key)}>
                                <Text style={style.defaultTitle}>设为默认</Text>
                            </TouchableHighlight>
                            <TouchableHighlight style={style.delOption} underlayColor="#fff" onPress={()=>delAddress(rowMap, data.item.key,data.item)}>
                                <Text style={style.delTitle}>删除</Text>
                            </TouchableHighlight>
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
    const { isBatchOperation, id, removeBatchAddressList, addBatchAddressList, toEditAddress,addressItemData={} } = props
    const [isSelect, setIsSelect] = useState(false)
    //取消选中
    const cancelSelect = useCallback(() => {
        setIsSelect(false)
        removeBatchAddressList(addressItemData)
    },[])
    //添加选中
    const addSelect = useCallback(() => {
        setIsSelect(true)
        addBatchAddressList(addressItemData)
    },[])

    return (
        <TouchableHighlight underlayColor="#fff" onPress={()=>{}}>
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
                        <Text style={style.userName}>{addressItemData.real_name}</Text>
                        <Text style={style.phone}>{addressItemData.phone}</Text>
                       {addressItemData.is_default?<View style={style.defaultWrap}>
                            <Text style={style.default}>默认</Text>
                        </View>:null}
                    </View>
                    <View style={style.addressDetailWrap}>
                        <Text style={style.addressDetail}>{addressItemData.full_address}</Text>
                        <TouchableHighlight underlayColor="#fff" onPress={toEditAddress}>
                            <Image style={style.editIcon} source={require('../../assets/imgs/edit.png')}></Image>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
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
    scrollView:{
        flex:1,
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
        backgroundColor: "#fca413"
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
        marginBottom:scaleHeight(20),
        marginHorizontal: scaleSize(30),
        height: scaleHeight(28),
        borderRadius: scaleSize(15),
        backgroundColor: "#fca413",
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
