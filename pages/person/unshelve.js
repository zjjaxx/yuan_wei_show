import React, { useCallback } from "react"
import {View,Text,SafeAreaView,ScrollView,StyleSheet,TouchableHighlight} from "react-native"
import Header from "../../components/Header"
import ProductItemRow from "../../components/productItemRow"
import {scaleSize,scaleHeight,setSpText2} from "../../utils/ScreenUtil"
import { SwipeListView } from 'react-native-swipe-list-view';
function Unshelve({navigation}){
    const leftEvent=useCallback(()=>{
        navigation.goBack()
    },[])
    const toProductDetail=useCallback(()=>{
    },[])
    //下架商品
      const productDown = useCallback((rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }, [])
    return (
        <SafeAreaView style={style.safeAreaView}>
            <View style={style.container}>
                <Header leftEvent={leftEvent} title="下架商品"></Header>
                <SwipeListView
                        style={style.scrollView}
                        rightOpenValue={-scaleSize(70)}
                        data={[{ key: 1 }, { key: 2 }, { key: 3 }, { key: 4 }, { key: 5 }]}
                        renderItem={(data, rowMap) => (
                            <ProductItemRow toProductDetail={toProductDetail}></ProductItemRow>
                        )}
                        renderHiddenItem={(data, rowMap) => (
                            <View style={style.addressOptionMenu}>
                                <TouchableHighlight style={style.delOption} underlayColor="#fff" onPress={() => productDown(rowMap, data.item.key)}>
                                    <Text style={style.delTitle}>上架</Text>
                                </TouchableHighlight>
                            </View>
                        )}>
                    </SwipeListView>
            </View>
        </SafeAreaView>
    )
}
const style=StyleSheet.create({
    safeAreaView:{
        flex:1,
        backgroundColor:"#fff"
    },
    container:{
        flex:1
    },
    scrollView: {
        flex: 1,
    },
    addressOptionMenu: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        flexDirection: "row"
    },
    defaultOption: {
        height: "100%",
        width: scaleSize(70),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#eee",
    },
    defaultTitle: {
        color: "#333",
        fontSize: setSpText2(12),
    },
    delOption: {
        height: "100%",
        width: scaleSize(70),
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f2140c",
    },
    delTitle: {
        color: "#fff",
        fontSize: setSpText2(12)
    }
})
export default Unshelve