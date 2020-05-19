import React, { useRef, useState, memo, useCallback } from "react"
import { View, Text, SafeAreaView, StyleSheet, TouchableHighlight, FlatList, Image } from "react-native"
import CustomTab from "../../components/CustomTabBar"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"

function Category({ navigation }) {
    //分类句柄
    const scrollTabRef = useRef()
    //tab索引
    const [tabIndex, setTabIndex] = useState(0)
    //tab数组
    const [tabList,setTabList] = useState(["全部", "球鞋", "女装", "男装", "数码", "家电", "手机"])
    //自定义tab header 句柄
    const customTabRef = useRef()
    //tab切换
    const tabChange = useCallback(({ i, from }) => {
        console.log("i",i,"from",from)
        if (i != from) {
            setTabIndex(i)
            scrollTabRef.current.goToPage(i)
        }
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>分类</Text>
                    <TouchableHighlight underlayColor="#fff" onPress={() => { }}>
                        <Image style={style.search} source={require("../../assets/imgs/search.png")}></Image>
                    </TouchableHighlight>
                </View>
                <ScrollableTabView
                    ref={scrollTabRef}
                    style={style.viewPager}
                    renderTabBar={() => <CustomTab ref={customTabRef} tabIndex={tabIndex} tabList={tabList} tabChange={tabChange}></CustomTab>}
                    onChangeTab={tabChange}
                >
                    {tabList.map((pageItem, pageIndex) => (
                        <View style={{ flex: 1 }} key={pageIndex} tabLabel={"item" + pageIndex}>
                            <FlatList
                                style={style.flatList}
                                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                renderItem={({ item, index }) => (
                                    <OrderItem item={item}></OrderItem>
                                )}
                            />
                        </View>
                    ))}
                </ScrollableTabView>
            </View>
        </SafeAreaView>
    )
}
const OrderItem = memo(() => {
    return (
        <View style={{flex:1}}>
            <Text>test</Text>
        </View>
    )
})
export default Category
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container:{
        flex:1
    },
    headerWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        height: scaleHeight(50),
        paddingHorizontal: scaleSize(15)
    },
    headerTitle: {
        fontSize: setSpText2(16),
        lineHeight: setSpText2(50),
        fontWeight: "500"
    },
    search: {
        width: scaleSize(20),
        height: scaleSize(20)
    },
    viewPager: {
        flex:1
    },
    flatList: {
        flex: 1
    }
})

