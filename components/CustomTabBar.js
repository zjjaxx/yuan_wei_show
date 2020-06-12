import React, { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback, useImperativeHandle, forwardRef, } from "react"
import { View, StyleSheet, Text, ScrollView, Animated, Button, Dimensions, TouchableHighlight } from "react-native"
import { scaleSize, setSpText2, scaleHeight } from "../utils/ScreenUtil"
import { useNodeListRect } from "../customUse/useClientRect"
const { width: viewportWidth } = Dimensions.get('window');
let CustomTabBar = function (props, customTabRef) {
    const { tabList, tabIndex, tabChange,scrollTabRef} = props
    //refs
    const [tabInfo, tabListRefs] = useNodeListRect(tabList.length)
    const scrollRef = useRef()
    useImperativeHandle(customTabRef, () => {
        return {
            scrollMove: (index) => {
                scrollMove(index)
            }
        }
    })
    useEffect(()=>{
        if(tabInfo){
            scrollMove(tabIndex)
        }
    },[tabIndex,tabInfo])
    //tab 切换 
    const scrollMove = useCallback((index) => {
        let distance = tabInfo.width * index - viewportWidth / 2 + tabInfo.width / 2
        scrollRef.current.scrollTo({ x: distance, animated: true })
    }, [tabInfo])
    const _tabChange = useCallback((index) => {
        scrollTabRef.current.goToPage(index)
        tabChange({i:index, from:tabIndex})
    }, [tabIndex])
    const TabItem = React.memo(function (props) {
        const { _tabChange, index, tabIndex, tabItemData, tabListRefs } = props
        return (
            <TouchableHighlight underlayColor="#fff" onPress={() => _tabChange(index)}>
                <View onLayout={tabListRefs[index]} style={style.tabItemWrap}>
                    <View  style={[style.item, tabIndex == index ? style.activeItem : {}]} >
                        <Text style={[style.itemName,tabIndex == index ? style.activeItemName : {}]}>{tabItemData}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    })
    return (<ScrollView
        ref={scrollRef}
        style={style.scrollWrap}
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}>
        <View style={style.tabWrap}>
            {
                tabList.map((item, index) => <TabItem tabListRefs={tabListRefs} key={index} _tabChange={_tabChange} tabIndex={tabIndex} tabItemData={item} index={index}></TabItem>)
            }
        </View>
    </ScrollView>)
}
CustomTabBar = forwardRef(CustomTabBar)
export default CustomTabBar
const style = StyleSheet.create({
    scrollWrap: {
        height:scaleHeight(50),
        flexGrow:0,
        width:scaleSize(375)
    },
    tabWrap: {
        flexDirection: "row",
        height: scaleHeight(50),
        backgroundColor: "#fff",
        minWidth:scaleSize(375)
    },
    tabItemWrap:{
        width: scaleSize(75),
        justifyContent:"center",
        alignItems:"center",
        height: scaleHeight(50),
    },
    item: {
        width: scaleSize(55),
        height:scaleHeight(30),
        justifyContent:"center",
        alignItems:"center"
    },
    itemName: {
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    activeItemName:{
        color:"#fff"
    },
    activeItem: {
        backgroundColor: "#fca413",
        borderRadius: scaleSize(15)
    },
})