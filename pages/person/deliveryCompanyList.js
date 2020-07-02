import React, { memo, useState, useCallback } from "react"
import { Text, View, SafeAreaView, StyleSheet, ScrollView } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
import { TouchableHighlight } from "react-native-gesture-handler"
function deliveryCompanyList({ navigation }) {
    const [categoryList, setCategroyList] = useState([{ category: "A", list: [1, 2, 3, 4, 5, 6, 7, 8] }, { category: "B", list: [1, 2, 3, 4, 5, 6, 7, 8] }])
    const leftEvent = useCallback(() => {
        navigation.goBack()
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <Header title="我要发货" leftEvent={leftEvent}></Header>
            <ScrollView style={style.scrollView}>
                {categoryList.map(item => {
                    return (
                        <>
                            <Text style={style.category}>{item.category}</Text>
                            {
                                item.list.map(item => (
                                    <TouchableHighlight underlayColor="#fff" onPress={()=>navigation.navigate("deliveryProduct")} style={style.itemWrap}>
                                        <View style={style.borderBottom}>
                                            <Text style={style.item}>顺丰快递</Text>
                                        </View>
                                    </TouchableHighlight>
                                ))
                            }
                        </>
                    )
                })
                }
            </ScrollView>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fafafa"
    },
    scrollView: {
        flex: 1
    },
    category: {
        paddingVertical: scaleHeight(5),
        paddingHorizontal: scaleSize(10),
        fontSize: setSpText2(14),
        color: "#999"
    },
    itemWrap: {
        paddingLeft: scaleSize(10)
    },
    borderBottom: {
        paddingVertical: scaleHeight(10),
        borderBottomColor: "#eee",
        backgroundColor: "#fff",
        borderBottomWidth: scaleHeight(0.5)
    },
    item: {
        fontSize: setSpText2(12),

    }

})
export default deliveryCompanyList