import React, { useRef, useState } from "react"
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../../utils/ScreenUtil"
import Header from "../../components/Header"
//阴影
import { BoxShadow } from 'react-native-shadow'
import { TouchableOpacity } from "react-native-gesture-handler"
import { useNodeListRect } from "../customUse/useClientRect"
const { width: viewportWidth } = Dimensions.get('window');
function Members({ navigation }) {
    const [tabList,setTabList]=useState([])
    const scrollRef = useRef()
    //refs
    const [tabInfo, tabListRefs] = useNodeListRect(tabList.length)
    console.log("tabInfo",tabInfo)
     //tab 切换 
     const scrollMove = useCallback((index) => {
        let distance = tabInfo.width * index - viewportWidth / 2 + tabInfo.width / 2
        scrollRef.current.scrollTo({ x: distance, animated: true })
    }, [tabInfo])
    useEffect(()=>{
        setTabList([1,2,3,4,5,6,7,8,9])
    },[])
    useEffect(()=>{
        if(tabInfo){
            scrollMove(tabIndex)
        }
    },[tabIndex,tabInfo])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.memberContainer}>
                <Header leftEvent={() => { navigation.goBack() }} title="会员中心"></Header>
                <Text style={style.memberTitle}>会员套餐</Text>
                <ScrollView
                    ref={scrollRef}
                    style={style.scrollWrap}
                    bounces={false}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    alwaysBounceHorizontal={false}>
                    <View style={style.memberListWrap}>
                        {
                            tabList.map((item, index) => <TabItem tabListRefs={tabListRefs}  key={index} _tabChange={_tabChange} tabIndex={tabIndex} tabItemData={item} index={index}></TabItem>)
                        }
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )

}
const TabItem = memo((props) => {
    const {_tabChange,tabIndex,tabItemData,index,tabListRefs} =props
    return (
        <TouchableOpacity opacity={1} onPress={()=>_tabChange(index)}>
        <BoxShadow setting={shadowOpt} onLayout={tabListRefs[index]}>
            <View style={[style.tabItemWrap,tabIndex==index?style.selectItemWrap:{}]}>
                <Text style={style.itemTitle}>连续包月</Text>
                <View style={style.itemContentWrap}>
                    <Text style={style.discount}>立省6元</Text>
                    <View style={style.priceWrap}>
                        <Text style={style.unit}>￥</Text>
                        <Text style={style.price}>19</Text>
                    </View>
                    <Text style={style.originPrice}>原价￥25</Text>
                </View>
            </View>
        </BoxShadow>
        </TouchableOpacity>
    )
})
const style = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: "#fff"
    },
    memberContainer: {
        flex: 1
    },
    memberListWrap: {
        flexDirection: "row",
        paddingLeft: scaleSize(15)
    },
    shadowOpt: {
        width: scaleSize(100),
        height: scaleHeight(200),
        color: "#000",
        border: 2,
        radius: scaleSize(5),
        opacity: 0.2,
        x: 0,
        y: 3,
        style: { marginVertical: 5 }
    },
    tabItemWrap: {
        backgroundColor: "#fff",
        height: scaleHeight(200),
        width: scaleSize(100),
        borderRadius:scaleSize(5),
    },
    itemTitle:{
        fontSize:setSpText2(16),
        textAlign:"center",
        width:"100%",
        lineHeight:setSpText2(20),
        borderBottomColor:"#eee",
        borderBottomWidth:scaleSize(0.5)
    },
    itemContentWrap:{
        paddingTop:scaleHeight(5),
        alignItems:"center",
        marginHorizontal:scaleSize(5),
        marginBottom:scaleHeight(5),
        flex:1,
    },
    discount:{
        paddingHorizontal:scaleSize(5),
        paddingVertical:scaleHeight(2),
        backgroundColor:"#f00000",
        fontSize:setSpText2(10),
        color:"#fff"
    },
    priceWrap:{
        marginTop:scaleHeight(5),
        flexDirection:"row",
        alignItems:"flex-start"
    },
    unit:{
        fontSize:setSpText2(10),
        fontWeight:"500",
        marginTop:scaleHeight(5)
    },
    price:{
        fontSize:setSpText2(20),
        fontWeight:"500"
    },
    originPrice:{
        marginTop:scaleHeight(5),
        color:"#999",
        fontSize:setSpText2(10)
    },
    selectItemWrap:{
        backgroundColor: "#fca413",
    }
})
export default Members