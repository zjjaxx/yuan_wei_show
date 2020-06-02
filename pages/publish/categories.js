import React, { useEffect, memo, useState, useCallback } from "react"
import { Text, View, ScrollView, SafeAreaView, StyleSheet, TouchableHighlight } from "react-native"
import Header from "../../components/Header"
import { scaleSize, scaleHeight, setSpText2 } from "../../utils/ScreenUtil"
import {category,tags} from "../../api/api"

function Categories({ navigation }) {
    //分类列表
    const [categoriesList, setCategoriesList] = useState([])
    //返回事件
    const _goBack = useCallback(() => {
        navigation.goBack()
    }, [])
    //返回发布页面
    const toPublish=useCallback(()=>{
        // navigation.navigate("publish",{categories:"超短群"})
    },[])
    //获取标签
    const getTags=useCallback((selectItem)=>{
        tags({cat_id:selectItem.id}).then(({data:{result}})=>{
            navigation.navigate("publish",{categories:selectItem,tags:result})
        })
    },[])
    //获取分类数据
    useEffect(()=>{
        category().then(({data:{result}})=>{
            setCategoriesList(result)
        })
    },[])

    return (
        <SafeAreaView style={style.safeView}>
            <View style={style.container}>
                <Header
                    leftEvent={_goBack}
                    title="分类"
                ></Header>
                <ScrollView style={style.scrollView}>
                    {categoriesList.map((item, index) => <CategoriesItem categoriesItemData={item} getTags={getTags} key={index}></CategoriesItem>)}
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}
const CategoriesItem = memo((props) => {
    const {getTags,categoriesItemData={child:[]}}=props
    const [isExpend, setIsExpend] = useState(false)
    const toggleIsExpend = useCallback(() => {
        if(categoriesItemData.child&&!categoriesItemData.child.length){
            getTags(categoriesItemData)
        }
        setIsExpend(!isExpend)
    }, [isExpend])
    return (
        <TouchableHighlight underlayColor="#fff" onPress={toggleIsExpend}>
            <View style={style.categoriesItemWrap}>
                <Text style={[style.title,isExpend?style.selectColor:{}]}>{categoriesItemData.cate_name}</Text>
                {isExpend ? <View style={style.expendWrap}>
                    {categoriesItemData.child&&categoriesItemData.child.map((item, index) =>
                      <TouchableHighlight underlayColor="#fff" key={index} onPress={()=>getTags(item)}>
                        <Text style={style.categoriesDetailItem}>{item.cate_name}</Text>
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
        fontSize: setSpText2(14),
        flexShrink:0
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