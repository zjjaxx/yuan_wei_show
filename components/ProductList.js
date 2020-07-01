import React, { memo, useEffect, useState, useCallback,useRef} from "react"
import { View} from "react-native"
import { scaleHeight} from "../utils/ScreenUtil"
import { categoryHome } from "../api/api"
import ProductItemLarge from "../components/ProductItemLarge"
import { ChineseWithLastDateFooter } from "react-native-spring-scrollview/Customize";
import { WaterfallList } from "react-native-largelist-v3";
import RefreshHeader from "../components/RefreshHeader"
import {scaleSize} from "../utils/ScreenUtil.js"
import {usePage} from "../customUse/usePage.js"
const ProductList = memo((props) => {
    const { type,toProductDetail } = props
    //列表ref
    const listRef = useRef()
    //api接口
    const _api=useCallback((page)=>{
        categoryHome({ page: page+1, type: type }).then(({data:{result}})=>{
            if (result.products.length) {
                setList(productList=>[...productList,...result.products])
                setCurrentPage(page => page + 1)
            }
            else {
                setIsFinish(true)
            }
        }) .finally(res => {
           setIsLoading(false)
        })
    },[])
    const {list,setList,setIsFinish,setIsLoading,setCurrentPage,refresh,loadMore} =usePage(_api)
    useEffect(() => {
       _api(0)
    }, [])
    return (
        <View style={{ flex: 1,paddingHorizontal:scaleSize(5),paddingVertical:scaleHeight(10) }}>
               <WaterfallList
                    showsVerticalScrollIndicator={false}
                    style={{ flex: 1 }}
                    ref={listRef}
                    data={list}
                    heightForItem={(item, index) =>scaleHeight(260)}
                    numColumns={2}
                    loadingFooter={ChineseWithLastDateFooter}
                    renderItem={(item, index) => <ProductItemLarge toProductDetail={toProductDetail} productData={item}></ProductItemLarge>}
                    refreshHeader={RefreshHeader}
                    onRefresh={() =>
                        setTimeout(() => {
                            listRef.current.endRefresh();
                            refresh()
                        }, 1000)
                    }
                    onLoading={() => {
                        setTimeout(() => {
                            listRef.current.endLoading();
                            loadMore()
                        }, 1000)
                    }}
                />
        </View>

    )
})
export default ProductList
