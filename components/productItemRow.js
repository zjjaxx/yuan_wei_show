import React from "react"
import { Image, Text, View, StyleSheet, TouchableHighlight } from "react-native"
import { setSpText2, scaleHeight, scaleSize } from "../utils/ScreenUtil"

function ProductItemRow(props) {
    const { toProductDetail } = props
    return (
        <TouchableHighlight underlayColor="#fff" onPress={() => toProductDetail()}>
            <View style={style.productWrap}>
                <Image style={style.productImg} source={require("../assets/imgs/pic2.jpg")}></Image>
                <View style={style.productInfo}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={style.productName}>废物及附件为福建忘记放我家附近我if骄傲就俯卧我寄我家服务加附件为我佛教为我拒绝访问甲方为奇偶我无法拒绝为经济危机覅偶王炯</Text>
                    <View style={style.labelList}>
                        {[1, 2, 3].map((item, index) =>
                            <Text key={index} style={style.label}>潮流</Text>
                        )}
                    </View>
                    <View style={style.priceWrap}>
                        <Text style={style.price}>￥98</Text>
                        <Text style={style.priceTail}>.00</Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    )
}
export default ProductItemRow
const style = StyleSheet.create({
    productWrap: {
        backgroundColor:"#fff",
        flexDirection: "row",
        paddingHorizontal: scaleSize(10),
        paddingVertical: scaleHeight(10),
        borderBottomColor: "#f6f6f6",
        borderBottomWidth: scaleSize(0.5)
    },
    productImg: {
        marginRight: scaleSize(10),
        width: scaleSize(100),
        height: scaleSize(100),
        borderRadius: scaleSize(5)
    },
    productInfo: {
        flex: 1,
        justifyContent: "space-between"
    },
    productName: {
        fontSize: setSpText2(14)
    },
    priceWrap: {
        marginBottom: scaleHeight(10),
        flexDirection: "row",
        alignItems: "flex-end"
    },
    price: {
        fontSize: setSpText2(16),
        color: "#fca413"
    },
    priceTail: {
        fontSize: setSpText2(10),
        color: "#fca413"
    },
    labelList: {
        marginTop: scaleHeight(10),
        marginBottom: "auto",
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