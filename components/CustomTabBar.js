import React, { useState, useEffect, useMemo, useRef, useLayoutEffect, useCallback, useImperativeHandle, forwardRef, } from "react"
import { View, StyleSheet, Text, ScrollView, Animated, Button, Dimensions, TouchableHighlight } from "react-native"
import { scaleSize, setSpText2, scaleHeight } from "../utils/ScreenUtil"
import { useNodeRect } from "../customUse/useClientRect"
const { width: viewportWidth } = Dimensions.get('window');
let CustomTabBar = function (props, customTabRef) {
    const { tabList, tabIndex, tabChange, scrollTabRef } = props
    const [tabItemWidthList, setTabItemWidthList] = useState([])
    const scrollRef = useRef()
    useImperativeHandle(customTabRef, () => {
        return {
            scrollMove: (index) => {
                scrollMove(index)
            }
        }
    })
    //tab 切换 
    const scrollMove = useCallback((index) => {
        let tabWidth=tabItemWidthList[index]
        let distance = tabWidth * index - viewportWidth / 2 + tabWidth / 2
        scrollRef.current.scrollTo({ x: distance, animated: true })
    }, [tabItemWidthList])
    const _tabChange = useCallback((index) => {
        scrollTabRef.current.goToPage(index)
        tabChange({ i: index, from: tabIndex })
        scrollMove(index)
    }, [tabIndex])
    const TabItem = React.memo(function (props) {
        const { _tabChange, index, tabIndex, tabItemData, setTabItemWidthList,tabItemWidthList } = props
        const [tabItemInfo, tabItemRef] = useNodeRect()
        useEffect(() => {
            if (tabItemInfo) {
                if(tabItemWidthList[index]){
                    return
                }
                setTabItemWidthList(tabItemWidthList=>tabItemWidthList.map((item, _index) => {
                    if (index == _index) {
                        return tabItemInfo.width
                    }
                    else {
                        return item
                    }
                }))
            }
        }, [tabItemInfo,tabItemWidthList])
        return (
            <TouchableHighlight underlayColor="#fff" onPress={() => _tabChange(index)}>
                <View style={style.tabItemWrap} onLayout={tabItemRef}>
                    <View style={[style.item, tabIndex == index ? style.activeItem : {}]} >
                        <Text style={[style.itemName, tabIndex == index ? style.activeItemName : {}]}>{tabItemData}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    })
    useEffect(() => {
        setTabItemWidthList(new Array(tabList.length).fill(null))
    },[tabList])
    return (<ScrollView
        ref={scrollRef}
        style={style.scrollWrap}
        bounces={false}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        alwaysBounceHorizontal={false}>
        <View style={style.tabWrap}>
            {
                tabList.map((item, index) => <TabItem tabItemWidthList={tabItemWidthList} setTabItemWidthList={setTabItemWidthList} key={index} _tabChange={_tabChange} tabIndex={tabIndex} tabItemData={item.cate_name} index={index}></TabItem>)
            }
        </View>
    </ScrollView>)
}
CustomTabBar = forwardRef(CustomTabBar)
export default CustomTabBar
const style = StyleSheet.create({
    scrollWrap: {
        height: scaleHeight(50),
        flexGrow: 0,
        width: scaleSize(375)
    },
    tabWrap: {
        flexDirection: "row",
        height: scaleHeight(50),
        backgroundColor: "#fff",
        minWidth: scaleSize(375)
    },
    tabItemWrap: {
        width: scaleSize(75),
        justifyContent: "center",
        alignItems: "center",
        height: scaleHeight(50),
    },
    item: {
        width: scaleSize(55),
        height: scaleHeight(30),
        justifyContent: "center",
        alignItems: "center"
    },
    itemName: {
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    activeItemName: {
        color: "#fff"
    },
    activeItem: {
        backgroundColor: "#fca413",
        borderRadius: scaleSize(15)
    },
})