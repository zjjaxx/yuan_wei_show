import React, { memo, useEffect, useState, useCallback,useRef} from "react"
import { View} from "react-native"
import { scaleHeight} from "../utils/ScreenUtil"
import { categoryHome } from "../api/api"
import ProductItemLarge from "../components/ProductItemLarge"
import { ChineseWithLastDateFooter } from "react-native-spring-scrollview/Customize";
import { WaterfallList } from "react-native-largelist-v3";
import RefreshHeader from "../components/RefreshHeader"
import {scaleSize} from "../utils/ScreenUtil.js"
const ProductList = memo((props) => {
    const { type } = props
    const [productList,setProductList]=useState([])
    //列表ref
    const listRef = useRef()
    //当前页
    const [currentPage, setCurrentPage] = useState(0)
    //最后一页
    const [lastPage, setLastPage] = useState(1)
    //下拉刷新flag
    const [refreshing, setRefreshing] = useState(false)
    //上拉加载
    const [isLoading, setIsLoading] = useState(false)
    //下拉刷新
    const _onRefresh = useCallback(() => {
        if (refreshing) {
            return
        }
        setRefreshing(true)
        setCurrentPage(0)
        setLastPage(1)
    }, [refreshing,currentPage])
    //下拉加载
    const _scrollEnd = useCallback(() => {
        if (currentPage >= lastPage || isLoading) {
            listRef.current.endLoading();
            return
        }
        setIsLoading(true)
        _api()
    }, [currentPage, lastPage, isLoading])
    //api接口
    const _api=useCallback(()=>{
        categoryHome({ page: currentPage+1, type: type }).then(({data:{result}})=>{
            if (result.products.length) {
                setProductList(productList=>[...productList,...result.products])
                setCurrentPage(page => page + 1)
                setLastPage(lastPage => lastPage + 1)
            }
            else {
                setLastPage(currentPage)
            }
        }) .finally(res => {
            listRef.current.endRefresh();
            listRef.current.endLoading();
            setRefreshing(false)
            setIsLoading(false)
        })
    },[currentPage])
    useEffect(() => {
       _api()
    }, [currentPage])
    return (
        <View style={{ flex: 1,paddingHorizontal:scaleSize(5) }}>
               <WaterfallList
                    style={{ flex: 1 }}
                    ref={listRef}
                    data={productList}
                    heightForItem={(item, index) =>scaleHeight(260)}
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
