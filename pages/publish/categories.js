import React, { useEffect, memo, useState, useCallback } from "react"
import { Text, View, ScrollView, SafeAreaView, StyleSheet, TouchableHighlight } from "react-native"
import Header from "../../components/Header"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"

function Categories({ navigation }) {
    //分类列表
    const [categoriesList, setCategoriesList] = useState([])
    //返回事件
    const _goBack = useCallback(() => {
        navigation.goBack()
    }, [])
    //返回发布页面
    const toPublish=useCallback(()=>{
        navigation.navigate("publish",{categories:"超短群"})
    },[])
    return (
        <SafeAreaView style={style.safeView}>
            <View style={style.container}>
                <Header
                    leftEvent={_goBack}
                    title="分类"
                ></Header>
                <ScrollView style={style.scrollView}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => <CategoriesItem toPublish={toPublish} key={index}></CategoriesItem>)}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
const CategoriesItem = memo((props) => {
    const {toPublish}=props
    const [isExpend, setIsExpend] = useState(false)
    const toggleIsExpend = useCallback(() => {
        setIsExpend(!isExpend)
    }, [isExpend])
    return (
        <TouchableHighlight underlayColor="#fff" onPress={toggleIsExpend}>
            <View style={style.categoriesItemWrap}>
                <Text style={[style.title,isExpend?style.selectColor:{}]}>鞋服</Text>
                {isExpend ? <View style={style.expendWrap}>
                    {[1, 2, 3, 4, 5, 6].map((item, index) =>
                      <TouchableHighlight underlayColor="#fff" key={index} onPress={toPublish}>
                        <Text style={style.categoriesDetailItem}>超短裙</Text>
                        </TouchableHighlight>
                    )}
                </View> : null}
            </View>
        </TouchableHighlight>
    )
})

const style = StyleSheet.create({
    safeView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    container: {
        flex: 1,
    },
    scrollView: {
        paddingHorizontal: scaleSize(20),
        flex: 1
    },
    categoriesItemWrap: {
        marginBottom:scaleHeight(10),
        minHeight: scaleHeight(40),
        borderBottomWidth: scaleSize(0.5),
        borderBottomColor: "#eee",
        justifyContent: "center"
    },
    title: {
        fontSize: setSpText2(14)
    },
    expendWrap: {
        marginTop: scaleHeight(10),
        flexDirection: "row",
        flexWrap: "wrap"
    },
    categoriesDetailItem: {
        marginRight: scaleSize(10),
        marginBottom:scaleHeight(10),
         paddingHorizontal:scaleSize(20),
        textAlign:"center",
        lineHeight:scaleHeight(30),
        borderRadius: scaleSize(4),
        backgroundColor: "#eee",
        fontSize: setSpText2(14)
    },
    selectColor:{
        color:"#fca413"
    }
})
export default Categories