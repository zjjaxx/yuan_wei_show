import React, { useRef, useState, memo, useCallback, useEffect } from "react"
import { View, Text, SafeAreaView, StyleSheet, TouchableHighlight, Image, ScrollView, FlatList } from "react-native"
import CustomTab from "../../components/CustomTabBar"
import ScrollableTabView from 'react-native-scrollable-tab-view';
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import { sliderWidth, itemWidth } from '../../swiperLib/SliderEntry.style';
import Carousel from 'react-native-snap-carousel';
import ProductItemLarge from "../../components/ProductItemLarge"
import ProductList from "../../components/ProductList";
import { categoryHome } from "../../api/api"
function Category({ navigation }) {
    //轮播图
    const [banners, setBanners] = useState([])
    //首页产品列表
    const [productList, setProductList] = useState([])
    //分类句柄
    const scrollTabRef = useRef()
    //tab索引
    const [tabIndex, setTabIndex] = useState(0)
    //tab数组
    const [tabList, setTabList] = useState([{ cate_name: "全部", id: 0 }])
    //自定义tab header 句柄
    const customTabRef = useRef()
    //tab切换 
    const tabChange = useCallback(({ i, from }) => {
        if (i != from) {
            setTabIndex(i)
            customTabRef.current.scrollMove(i)
        }
    }, [])
    const toProductDetail = useCallback(() => {
        navigation.navigate("productDetail")
    }, [])
    useEffect(()=>{
        categoryHome({type:0,page:1}).then(({data:{result}})=>{
            setBanners(result.banners)
            setTabList([...tabList,...result.cate])
            setProductList(result.products)
        })
    },[])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <View style={style.headerWrap}>
                    <Text style={style.headerTitle}>分类</Text>
                    <TouchableHighlight underlayColor="#fff" onPress={() => { navigation.navigate("search") }}>
                        <Image style={style.search} source={require("../../assets/imgs/search.png")}></Image>
                    </TouchableHighlight>
                </View>
                <ScrollableTabView
                    showsHorizontalScrollIndicator={false}
                    ref={scrollTabRef}
                    style={style.viewPager}
                    renderTabBar={() => <CustomTab ref={customTabRef} tabIndex={tabIndex} scrollTabRef={scrollTabRef} tabList={tabList} tabChange={tabChange}></CustomTab>}
                    onChangeTab={tabChange}
                >
                    {tabList.map((pageItem, pageIndex) => {
                        if (pageIndex == 0) {
                            return <Recommand key={pageIndex} banners={banners} itemData={productList} toProductDetail={toProductDetail} tabLabel={"item" + pageIndex} key={pageIndex}></Recommand>
                        }
                        else {
                            return <ProductList key={pageIndex} type={pageItem.id}></ProductList>
                        }
                    })}
                </ScrollableTabView>
            </View>
        </SafeAreaView>
    )
}
const Recommand = memo((props) => {
    const { toProductDetail, banners, itemData } = props
    return (<ScrollView showsVerticalScrollIndicator={false} style={style.scrollView}>
        <Swiper banners={banners}></Swiper>
        <Text style={style.recommandText}>为你推荐</Text>
        <View style={style.recommandProductWrap}>
            {itemData.map(item => <ProductItemLarge productData={item} productPress={() => toProductDetail()}></ProductItemLarge>)}
        </View>
    </ScrollView>)
})
//轮播图 画廊
const Swiper = React.memo(function (props) {
    const { banners } = props
    const _renderItemWithParallax = function ({ item, index }, parallaxProps) {
        return (
            <Image key={index} style={style.swiperProductImg} source={{ uri: item.image }} />
        );
    }
    return (
        <View style={style.swiperWrapper}>
            <Carousel
                data={banners}
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
  
})

