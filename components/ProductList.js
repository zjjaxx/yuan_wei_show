import React, { memo, useEffect, useState, useCallback } from "react"
import { View, Text, Image, StyleSheet, TouchableHighlight } from "react-native"
import { scaleHeight, scaleSize, setSpText2 } from "../utils/ScreenUtil"
import toDate from "../utils/toDate"
import { categoryHome } from "../api/api"
import ProductItemLarge from "../components/ProductItemLarge"
import { ChineseWithLastDateFooter } from "react-native-spring-scrollview/Customize";
import { WaterfallList } from "react-native-largelist-v3";
import RefreshHeader from "../../components/RefreshHeader"
const ProductList = memo((props) => {
    const listRef = useRef()
    const [currentPage, setCurrentPage] = useState(0)
    const [lastPage, setLastPage] = useState(1)
    //下拉刷新flag
    const [refreshing, setRefreshing] = useState(false)
    //上拉加载
    const [isLoading, setIsLoading] = useState(false)
    const { type } = props
    const calcItemHeight = useCallback((item, index) => {
        let height1 = scaleHeight(50) + setSpText2(36) + scaleHeight(140) + scaleHeight(8) + scaleHeight(30)
        let height2 = scaleHeight(50) + setSpText2(36) + scaleHeight(180) + scaleHeight(8) + scaleHeight(30)
        return item.images_info.images_total == 2 ? height1 : height2
    }, [])
    const _onRefresh = useCallback(() => {
        if (refreshing) {
            return
        }
        setRefreshing(true)
        setPage(0)
        setLastPage(1)
        _api(0)
    }, [refreshing])
    const _scrollEnd = useCallback(() => {
        if (page >= lastPage || isLoading) {
            listRef.current.endLoading();
            return
        }
        setIsLoading(true)
        _api(page)
    }, [page, lastPage, isLoading])
    useEffect(() => {
        categoryHome({ page: currentPage+1, type: type }).then(({data:{result}})=>{

        })
    }, [currentPage, type])
    return (
        <View style={{ flex: 1 }}>
               <WaterfallList
                    style={{ flex: 1 }}
                    ref={listRef}
                    data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                    heightForItem={(item, index) => calcItemHeight(item, index)}
                    numColumns={1}
                    loadingFooter={ChineseWithLastDateFooter}
                    renderItem={(item, index) => <ProductItem productPress={() => toProductDetail()} item={item}></ProductItem>}
                    refreshHeader={RefreshHeader}
                    onRefresh={() =>
                        setTimeout(() => {
                            _onRefresh()
                        }, 1000)
                    }
                    onLoading={() => {
                        setTimeout(() => {
                            _scrollEnd()
                        }, 1000)
                    }}
                />
            <FlatList
                showsVerticalScrollIndicator={false}
                style={style.flatList}
                data={}
                numColumns={2}
                columnWrapperStyle={style.flatListWrapperStyle}
                renderItem={({ item, index }) => (
                    <ProductItem productPress={() => toProductDetail()} item={item}></ProductItem>
                )}
            />
        </View>

    )
})
export default ProductList
const style = StyleSheet.create({
    flatList: {
        flex: 1
    },
    flatListWrapperStyle: {
        paddingHorizontal: scaleSize(10),
        justifyContent: "space-between"
    },
})