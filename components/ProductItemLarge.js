import React, { memo } from "react"
import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../utils/ScreenUtil"

const ProductItemLarge = memo((props) => {
    const { productPress } = props
    return (
        <TouchableHighlight underlayColor="#fff" onPress={() => productPress()}>
            <View style={style.orderItemWrap}>
                <Image style={style.productImg} source={require("../assets/imgs/pic2.jpg")}></Image>
                <Text numberOfLines={2} ellipsizeMode="tail" style={style.productName}>经费为奇偶发文件违反Joe忘记佛物文件分为福建欧文金佛if鸡尾酒佛物文件覅危机诶偶极矩覅为我而激发简欧风纪委IE积分范围缴费金额为物金佛文件覅偶忘记 </Text>
                <View style={style.labelList}>
                    {[1, 2].map((item,index) => 
                        <Text key={index} style={style.label}>潮流</Text>
                    )}
                </View>
                <View style={style.productPriceWrap}>
                    <Text style={style.price}>￥78</Text>
                    <Text style={style.priceTail}>.00</Text>
                </View>
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
        fontSize: setSpText2(14)
    },
    productPriceWrap: {
        marginHorizontal: scaleSize(5),
        marginTop: scaleHeight(10),
        flexDirection: "row",
        alignItems: "flex-end"
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
    labelList:{
        marginTop:scaleHeight(10),
        flexDirection:"row",
        flexWrap:"wrap"
    },
    label:{
        marginBottom:scaleHeight(5),
        marginHorizontal:scaleSize(5),
        paddingHorizontal:scaleSize(8),
        paddingVertical:scaleSize(5),
        fontSize:setSpText2(12),
        color:"#999",
        backgroundColor:"#f6f6f6",
        borderRadius:scaleSize(10),
    }
})