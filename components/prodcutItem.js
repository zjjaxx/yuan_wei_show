import React from "react"
import { View, Text, Image, StyleSheet } from "react-native"
import { scaleSize, scaleHeight, setSpText2 } from "../utils/ScreenUtil"

function ProductItem() {
    return (
        <View style={style.productInfoWrap}>
            <View style={style.headerWrap}>
                <Image style={style.avatar} source={require("../assets/imgs/avatar.jpeg")}></Image>
                <Text numberOfLines={1} ellipsizeMode="tail" style={style.name}>小可爱分为甲方将无法就忘记发文件佛教围殴附近降温哦飞机围殴我金佛我我即佛我家附近</Text>
            </View>
            <View style={style.productInfo}>
                <Image source={require("../assets/imgs/pic3.jpg")} style={style.productImg}></Image>
                <View style={style.productMsg}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={style.productName}>为甲方将无法就忘记发文件佛教围殴附近降温哦飞机围殴我金佛我我即佛我家附</Text>
                    <View style={style.priceWrap}>
                        <Text style={style.price}>￥9</Text>
                        <Text style={style.priceTail}>.90</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}
const style = StyleSheet.create({
    productInfoWrap: {
        paddingHorizontal: scaleSize(10),
        marginTop: scaleHeight(10),
        paddingBottom: scaleSize(10),
        paddingVertical: scaleHeight(15),
        backgroundColor: "#fff",
        borderRadius: scaleSize(15)
    },
    headerWrap: {
        flexDirection: "row",
        alignItems: "center"
    },
    avatar: {
        marginRight: scaleSize(5),
        width: scaleSize(20),
        height: scaleSize(20),
        borderRadius: scaleSize(10)
    },
    name: {
        flex: 1,
        fontSize: setSpText2(14),
        marginRight: scaleSize(50)
    },
    productInfo: {
        marginTop: scaleHeight(10),
        flexDirection: "row"
    },
    productName: {
        fontSize: setSpText2(14),
    },
    priceWrap: {
        marginTop: scaleHeight(6),
        flexDirection: "row",
        alignItems: "flex-end"
    },
    price: {
        fontSize: setSpText2(16),
        color: "#f2140c",
    },
    priceTail: {
        fontSize: setSpText2(10),
        color: "#f2140c",
    },
    productImg: {
        marginRight: scaleSize(10),
        width: scaleSize(80),
        height: scaleSize(80),
        borderRadius: scaleSize(5)
    },
    productMsg:{
        flex:1
    },
})
export default ProductItem