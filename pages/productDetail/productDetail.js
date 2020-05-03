import React, { useCallback, useState } from "react"
import { Text, View, StyleSheet, Image, ScrollView, TouchableHighlight, SafeAreaView } from "react-native"
import Header from "../../components/Header"
import { scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from '../../swiperLib/SliderEntry.style';

const mockData = [0, 1, 2]
function ProductDetail({ navigation }) {
    //是否收藏
    const [isSave, setSave] = useState(false)
    //返回事件
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    //收藏事件
    const toggleSave = useCallback(() => {
        setSave(!isSave)
    }, [isSave])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={style.container}>
                <Header title="产品详情" leftEvent={leftEvent} right={<Image style={style.share} source={require("../../assets/imgs/share.png")}></Image>}>
                </Header>
                <ScrollView style={style.scrollView}>
                    <Swiper></Swiper>
                    <Text style={style.productName}>AIR JODOY DANCE</Text>
                    <Text style={style.price}>￥ 278.00</Text>
                </ScrollView>
                <View style={style.buttomWrap}>
                    <TouchableHighlight underlayColor="#fff" onPress={toggleSave}>
                        <View style={style.saveWrap}>
                            <Image style={style.saveIcon} source={isSave ? require("../../assets/imgs/saved.png") : require("../../assets/imgs/unsave.png")}></Image>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        </SafeAreaView>

    )
}
//轮播图 画廊
const Swiper = React.memo(function (props) {
    // const { banners } = props
    // const [slider, setSlider] = useState(0)
    const _renderItemWithParallax = function ({ item, index }, parallaxProps) {
        console.log("index", index)
        return (
            <Image key={index} style={style.productImg} source={index % 2 ? require("../../assets/imgs/pic2.jpg") : require("../../assets/imgs/pic1.jpg")} />
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
const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    scrollView: {
        flex: 1
    },
    share: {
        height: scaleSize(20),
        width: scaleSize(20)
    },
    swiperWrapper: {
        marginTop: scaleSize(10),
    },
    slider: {
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: scaleSize(8)
    },
    productImg: {
        borderRadius: scaleSize(5),
        height: scaleSize(220),
        width: scaleSize(330)
    },
    productName: {
        marginLeft: scaleSize(20),
        marginTop: scaleSize(30),
        fontSize: setSpText2(16),
        fontWeight: "500"
    },
    price: {
        marginLeft: scaleSize(20),
        marginTop: scaleSize(10),
        fontWeight: "500",
        fontSize: setSpText2(16),
        color: "#fca413"
    },
    buttomWrap: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: scaleSize(10),
        height: scaleSize(50),
        alignItems: "center"
    },
    saveWrap: {
        width: scaleSize(70),
        height: scaleSize(40),
        backgroundColor: "#f6f6f6",
        borderRadius: scaleSize(5),
        justifyContent: "center",
        alignItems: "center"
    },
    saveIcon: {
        height: scaleSize(20),
        width: scaleSize(20)
    }
})
export default ProductDetail
