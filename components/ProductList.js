import React, { memo, useEffect, useState, useCallback,useRef} from "react"
import { View} from "react-native"
import { scaleHeight} from "../utils/ScreenUtil"
import { categoryHome } from "../api/api"
import ProductItemLarge from "../components/ProductItemLarge"
import { ChineseWithLastDateFooter } from "react-native-spring-scrollview/Customize";
import { WaterfallList } from "react-native-largelist-v3";
import RefreshHeader from "../components/RefreshHeader"
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
        return scaleHeight(180)
    }, [])
    const _onRefresh = useCallback(() => {
        if (refreshing) {
            return
        }
        setRefreshing(true)
        setPage(0)
        setLastPage(1)
    }, [refreshing])
    const _scrollEnd = useCallback(() => {
        if (currentPage >= lastPage || isLoading) {
            listRef.current.endLoading();
            return
        }
        setIsLoading(true)
        _api(currentPage)
    }, [currentPage, lastPage, isLoading])
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
                    numColumns={2}
                    loadingFooter={ChineseWithLastDateFooter}
                    renderItem={(item, index) => <ProductItemLarge productPress={() => toProductDetail()} productData={item}></ProductItemLarge>}
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
        </View>

    )
})
export default ProductList
