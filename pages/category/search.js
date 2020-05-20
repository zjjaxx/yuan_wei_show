import React, { useState, useCallback } from "react"
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TextInput, Image, TouchableHighlight,FlatList} from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import ProductItemRow from "../../components/productItemRow"

function Search({ navigation }) {
    //搜索值
    const [searchValue, setSearchValue] = useState("")
    //提交搜索事件
    const onSubmitEditing = useCallback(() => {

    }, [])
    //加载更多事件
    const _scrollEnd=useCallback(()=>{

    },[])
    //跳转产品详情页
    const toProductDetail=useCallback(()=>{
        navigation.navigate("productDetail")
    },[])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <View style={style.searchHeader}>
                    <View style={style.searchWrap}>
                        <Image style={style.searchIcon} source={require("../../assets/imgs/search.png")}></Image>
                        <TextInput
                            returnKeyType="search"
                            returnKeyLabel="搜索"
                            onChangeText={value => setSearchValue(value)}
                            value={searchValue}
                            placeholder="请输入关键词"
                            onSubmitEditing={onSubmitEditing}
                            style={style.searchInput} >
                        </TextInput>
                    </View>
                    <TouchableHighlight underlayColor="#fff" onPress={() => navigation.goBack()}>
                        <Text style={style.cancelText}>取消</Text>
                    </TouchableHighlight>
                </View>
                <FlatList
                    style={style.flatList}
                    onEndReached={_scrollEnd}
                    onEndReachedThreshold={0.1}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    renderItem={({ item, index }) => <ProductItemRow toProductDetail={toProductDetail} index={index} key={index}></ProductItemRow>}
                />
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1
    },
    searchHeader: {
        paddingVertical: scaleHeight(10),
        paddingLeft: scaleSize(10),
        flexDirection: "row",
        alignItems: "center"
    },
    searchWrap: {
        borderRadius: scaleSize(15),
        backgroundColor: "#f6f6f6",
        flex: 1,
        flexDirection: "row",
        paddingHorizontal: scaleSize(5),
        alignItems: "center"
    },
    searchIcon: {
        marginRight: scaleSize(5),
        width: scaleSize(20),
        height: scaleSize(20),
    },
    searchInput: {
        flex: 1,
        paddingVertical: scaleHeight(5),
        fontSize: setSpText2(14),
        color:"#333"
    },
    cancelText: {
        paddingHorizontal: scaleSize(10),
        color: "#999",
        fontSize: setSpText2(14)
    },
    flatList:{
        flex:1
    },
  
});
export default Search
