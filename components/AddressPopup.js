import React, {  memo, useState, useCallback, useRef, useEffect, createContext, useContext } from "react"
import { View, Text, StyleSheet, Image, TouchableHighlight, FlatList } from "react-native"
//渐变
import LinearGradient from 'react-native-linear-gradient';
import { scaleHeight, scaleSize, setSpText2 } from "../utils/ScreenUtil";
import ScrollableTabView from 'react-native-scrollable-tab-view';


const Context = createContext()
function AddressPopup(props) {
    const [tabIndex, setTabIndex] = useState(0)
    //地址弹窗flag
    const { setAddressPopupFlag, addressData, addressSelectItem, setAddressSelectItem } = props
    const _addressSelectItem = () => {
        if (addressSelectItem.length < 3) {
            return [...addressSelectItem, { value: -1, text: null }]
        }
        else {
            return addressSelectItem
        }
    }
    //地址句柄
    const scrollTabRef = useRef()
    useEffect(() => {
        if (!scrollTabRef.current) {
            return
        }
        viewPageSwitch(index)
        setTabIndex(index)
    }, [])
    const flatListData = useCallback((index) => {
        const { areaList, cityList, provinceList } = addressData
        switch (index) {
            case 0:
                return provinceList;
            case 1:
                return cityList[addressSelectItem[0].value];
            case 2:
                return areaList[addressSelectItem[1].value];
            default:
                return []
        }
    }, [addressSelectItem])
    //tab切换
    const tabChange = useCallback(({ i, from }) => {
        setTabIndex(i)
    }, [])
    const viewPageSwitch = useCallback((i) => {
        scrollTabRef.current.goToPage(i)
    }, [])
    return (
        <>
            <TouchableHighlight style={{ flex: 1 }} underlayColor="#fff" onPress={() => setAddressPopupFlag(false)}>
                <View style={style.mask}>
                </View>
            </TouchableHighlight>
            <View style={style.addressPopupWrap}>
                <View style={style.addressTopWrap}>
                    <Text style={style.addressTip}>请选择所在区域</Text>
                    <TouchableHighlight underlayColor="#fff" onPress={() => setAddressPopupFlag(false)}>
                        <Image style={style.closeIcon} source={require("../assets/imgs/close.png")}></Image>
                    </TouchableHighlight>
                </View>
                <Context.Provider value={{
                    scrollTabRef,
                    setTabIndex,
                    tabIndex,
                    setAddressSelectItem,
                    _addressSelectItem,
                    viewPageSwitch,
                    flatListData,
                    tabChange,
                    setAddressPopupFlag
                }}>
                    <AddressViewPager></AddressViewPager>
                </Context.Provider>
            </View>
        </>
    )
}
const AddressViewPager = memo((props) => {
    const { _addressSelectItem, flatListData, setAddressSelectItem, scrollTabRef, setTabIndex, tabChange, setAddressPopupFlag, viewPageSwitch } = useContext(Context)

    const setAddressItem = useCallback((pageIndex, index, item) => {
        switch (pageIndex) {
            case 0:
                setAddressSelectItem([item])
                setTimeout(() => {
                    viewPageSwitch(1)
                    setTabIndex(1)
                })
                break
            case 1:
                setAddressSelectItem((addressSelectItem) => [addressSelectItem[0], item])
                setTimeout(() => {
                    viewPageSwitch(2)
                    setTabIndex(2)
                })
                break
            case 2:
                setAddressSelectItem((addressSelectItem) => [addressSelectItem[0], addressSelectItem[1], item])
                setAddressPopupFlag(false)
                break
            default:
                break
        }
    }, [_addressSelectItem])

    const AddressItem = (props) => {
        const { item, isSelected } = props
        return (
            <View style={style.addressItemWrap}>
                {isSelected ? <Image style={style.addressSelectIcon} source={require("../assets/imgs/ok-l.png")}></Image> : null}
                <Text style={style.addressTitle}>{item.text}</Text>
            </View>
        )
    }
    return (
        <ScrollableTabView
            ref={scrollTabRef}
            style={style.viewPager}
            renderTabBar={() => <Tab></Tab>}
            onChangeTab={tabChange}
        >
            {_addressSelectItem().map((pageItem, pageIndex) => (
                <View style={{ flex: 1 }} key={pageIndex} tabLabel={"item" + pageIndex}>
                    <FlatList
                        style={style.flatList}
                        data={flatListData(pageIndex)}
                        renderItem={({ item, index }) => (
                            <TouchableHighlight key={index} underlayColor="#fff" onPress={() => setAddressItem(pageIndex, index, item)}>
                                <AddressItem isSelected={item.value == pageItem.value} item={item}></AddressItem>
                            </TouchableHighlight>)}
                    />
                </View>
            ))}
        </ScrollableTabView>
    )
})
const Tab = memo((props) => {
    const {  viewPageSwitch,  _addressSelectItem, setTabIndex } = useContext(Context)
    const TabItem = memo((props) => {
        const { tabListRefs,tabIndex } = useContext(Context)
        const { item, index } = props
        return (
            <View style={style.tabItem} onLayout={params => tabListRefs[index](params, index)}>
                <Text style={style.tabTitle}>{item.value == -1 ? '请选择' : item.text}</Text>
                {index==tabIndex?<LinearGradient useAngle={true} angle={90} colors={["#f2140c", "#fff"]} style={style.line}></LinearGradient>:null}
            </View>
        )
    })
    const tabPress = useCallback((index) => {
        viewPageSwitch(index)
        setTabIndex(index)
    }, [])
    return (
        <View style={style.tabWrap}>
            {_addressSelectItem().map((item, index) => {
                return (
                    <TouchableHighlight key={index} underlayColor="#fff" onPress={() => tabPress(index)}>
                        <TabItem index={index} item={item}></TabItem>
                    </TouchableHighlight>
                )
            })}
        </View>
    )
})

export default AddressPopup

const style = StyleSheet.create({
    mask: {
        position: "relative",
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)"
    },
    addressPopupWrap: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: scaleHeight(400),
        backgroundColor: "#fff",
        zIndex: 100,
        borderTopLeftRadius: scaleSize(10),
        paddingVertical: scaleHeight(10),
        borderTopRightRadius: scaleSize(10),
    },
    addressContent: {
        width: "100%",
        height: "100%",
        paddingRight: scaleSize(10),
        borderTopLeftRadius: scaleSize(10),
        borderTopRightRadius: scaleSize(10),
    },
    addressTopWrap: {
        marginBottom: scaleHeight(20),
        paddingHorizontal: scaleSize(10),
        flexDirection: "row",
        alignItems: "center"
    },
    addressTip: {
        marginRight: scaleSize(30),
        fontSize: setSpText2(16),
        fontWeight: "500",
        flex: 1
    },
    closeIcon: {
        width: scaleSize(15),
        height: scaleSize(15)
    },
    tabWrap: {
        position: "relative",
        height: scaleHeight(20),
        flexDirection: "row",
    },
    tabItem: {
        position:"relative",
        paddingHorizontal: scaleSize(10),
        fontSize: setSpText2(14),
        height: scaleHeight(20),
    },
    lineWrap: {
        position: "absolute",
        bottom: 0,
    },
    line: {
        position:"absolute",
        bottom:0,
        left:"50%",
        // transform:[{translateX:-scaleSize(12.5)}],
        width: scaleSize(25),
        height: scaleHeight(3),
        borderRadius: scaleSize(2.5)
    },
    viewPager: {
        flex: 1
    },
    flatList: {
        flex: 1
    },
    addressItemWrap: {
        paddingVertical: scaleHeight(10),
        paddingHorizontal: scaleSize(10),
        flexDirection: "row",
        alignItems: "center"
    },
    addressTitle: {
        fontSize: setSpText2(14)
    },
    addressSelectIcon: {
        width: scaleSize(20),
        height: scaleSize(20)
    }
})