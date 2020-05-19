import React, { useRef, useState, memo, useCallback } from "react"
import { View, Text, SafeAreaView, StyleSheet, TouchableHighlight, Image, ScrollView, FlatList } from "react-native"
import CustomTab from "../../components/CustomTabBar"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import { sliderWidth, itemWidth } from '../../swiperLib/SliderEntry.style';
import Carousel from 'react-native-snap-carousel';
import ProductItemLarge from "../../components/ProductItemLarge"
const mockData = [0, 1, 2]
function Category({ navigation }) {
    //分类句柄
    const scrollTabRef = useRef()
    //tab索引
    const [tabIndex, setTabIndex] = useState(0)
    //tab数组
    const [tabList, setTabList] = useState(["全部", "球鞋", "女装", "男装", "数码", "家电", "手机"])
    //自定义tab header 句柄
    const customTabRef = useRef()
    //tab切换
    const tabChange = useCallback(({ i, from }) => {
        if (i != from) {
            setTabIndex(i)
        }
    }, [])
    const toProductDetail=useCallback(()=>{
        navigation.navigate("productDetail")
    },[])
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
                    renderTabBar={() => <CustomTab ref={customTabRef} tabIndex={tabIndex} scrollTabRef={scrollTabRef} tabList={tabList} tabChange={tabChange}></CustomTab>}
                    onChangeTab={tabChange}
                >
                    {tabList.map((pageItem, pageIndex) => {
                        if (pageIndex == 0) {
                            return <Recommand toProductDetail={toProductDetail} tabLabel={"item" + pageIndex}></Recommand>
                        }
                        else {
                            return (
                                <View style={{ flex: 1 }} key={pageIndex} tabLabel={"item" + pageIndex}>
                                    <FlatList
                                        style={style.flatList}
                                        data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                                        numColumns={2}
                                        columnWrapperStyle={style.flatListWrapperStyle}
                                        renderItem={({ item, index }) => (
                                            <ProductItemLarge productPress={()=>toProductDetail()} item={item}></ProductItemLarge>
                                        )}
                                    />
                                </View>
                            )
                        }
                    })}
                </ScrollableTabView>
            </View>
        </SafeAreaView>
    )
}
const Recommand = memo((props) => {
    const {toProductDetail} =props
    return (<ScrollView style={style.scrollView}>
        <Swiper></Swiper>
        <Text style={style.recommandText}>为你推荐</Text>
        <View style={style.recommandProductWrap}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(item => <ProductItemLarge productPress={()=>toProductDetail()}></ProductItemLarge>)}
        </View>
    </ScrollView>)
})
//轮播图 画廊
const Swiper = React.memo(function (props) {
    // const { banners } = props
    // const [slider, setSlider] = useState(0)
    const _renderItemWithParallax = function ({ item, index }, parallaxProps) {
        return (
            <Image key={index} style={style.swiperProductImg} source={require("../../assets/imgs/pic1.jpg")} />
        );
    }
    return (
        <View style={style.swiperWrapper}>
            <Carousel
                data={mockData}
                renderItem={_renderItemWithParallax}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                containerCustomStyle={style.slider}
                contentContainerCustomStyle={style.sliderContentContainer}
                layout={"tinder"}
                loop={true}
            />
        </View>
    );
})
export default Category
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
        backgroundColor: "#f6f6f6"
    },
    headerWrap: {
        backgroundColor: "#fff",
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
        flex: 1
    },
    scrollView: {
        flex: 1,
    },
    recommandText: {
        paddingHorizontal: scaleSize(20),
        paddingVertical: scaleHeight(20),
        fontWeight: "500",
        fontSize: setSpText2(16)
    },
    recommandProductWrap: {
        flexDirection: "row",
        paddingHorizontal: scaleSize(10),
        justifyContent: "space-between",
        flexWrap: "wrap"
    },
    swiperWrapper: {
        marginTop: scaleSize(10),
    },
    swiperProductImg: {
        borderRadius: scaleSize(5),
        height: scaleSize(220),
        width: "100%"
    },
    slider: {
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: scaleSize(8)
    },
    flatList: {
        flex: 1
    },
    flatListWrapperStyle: {
        paddingHorizontal: scaleSize(10),
        justifyContent: "space-between"
    },
})

