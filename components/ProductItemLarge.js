import React, { memo } from "react"
import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../utils/ScreenUtil"
import toDate from "../utils/toDate"
import FastImage from 'react-native-fast-image'
const ProductItemLarge = memo((props) => {
    const { toProductDetail, productData = { _price: {}, user: {} } } = props
    return (
        <TouchableHighlight underlayColor="#fff" onPress={() => toProductDetail(productData)}>
            <View style={style.orderItemWrap}>
                <FastImage style={style.productImg} source={{ uri: productData.image }}></FastImage>
                <Text numberOfLines={2} ellipsizeMode="tail" style={style.productName}>{productData.store_name} </Text>
                {/* <View style={style.labelList}>
                    {[1, 2].map((item,index) => 
                        <Text key={index} style={style.label}>潮流</Text>
                    )}
                </View> */}
                <View style={style.productPriceWrap}>
                    <Text style={style.price}>￥{productData._price.i}</Text>
                    <Text style={style.priceTail}>.{productData._price.d}</Text>
                </View>
                {productData.user && <View style={style.sellerInfoWrap}>
                    <FastImage style={style.sellerIcon} source={{ uri: productData.user.avatar }}></FastImage>
                    <View style={style.sellerInfo}>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={style.sellerName}>{productData.user.nickname}</Text>
                        <Text style={style.time}>{toDate(productData.user.last_time)}</Text>
                    </View>
                </View>}
            </View>
        </TouchableHighlight>
    )
})
export default ProductItemLarge
const style = StyleSheet.create({
    orderItemWrap: {
        marginBottom: scaleHeight(20),
        paddingBottom: scaleHeight(10),
        width: scaleSize(170),
        borderRadius: scaleSize(5),
        backgroundColor: "#fff"
    },
    productImg: {
        width: "100%",
        height: scaleSize(170),
        borderTopLeftRadius: scaleSize(5),
        borderTopRightRadius: scaleSize(5)
    },
    productName: {
        marginHorizontal: scaleSize(5),
        marginTop: scaleHeight(10),
        fontSize: setSpText2(14),
        height: scaleHeight(28)
    },
    productPriceWrap: {
        marginHorizontal: scaleSize(5),
        marginTop: scaleHeight(10),
        flexDirection: "row",
        alignItems: "flex-end"
    },
    sellerInfoWrap: {
        marginTop: scaleHeight(10),
        marginHorizontal: scaleSize(5),
        flexDirection: "row",
        alignItems: "center"
    },
    sellerIcon: {
        marginRight: scaleSize(5),
        borderRadius: scaleSize(15),
        width: scaleSize(30),
        height: scaleSize(30)
    },
    sellerInfo: {
        marginRight: scaleSize(5),
        flex: 1
    },
    sellerName: {

        fontSize: setSpText2(12)
    },
    time: {
        marginTop: scaleHeight(5),
        fontSize: setSpText2(10),
        color: "#999"
    },
    price: {
        fontSize: setSpText2(16),
        fontWeight: "500",
        color: "#fca413"
    },
    priceTail: {
        fontSize: setSpText2(12),
        color: "#fca413"
    },
    labelList: {
        marginTop: scaleHeight(10),
        flexDirection: "row",
        flexWrap: "wrap"
    },
    label: {
        marginBottom: scaleHeight(5),
        marginHorizontal: scaleSize(5),
        paddingHorizontal: scaleSize(8),
        paddingVertical: scaleSize(5),
        fontSize: setSpText2(12),
        color: "#999",
        backgroundColor: "#f6f6f6",
        borderRadius: scaleSize(10),
    }
})