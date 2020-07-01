import {useState,useCallback} from "react"
//分页
export function usePage(_api=null,refreshCallBack = null, loadMoreCallBack = null,) {
    //当前页
    const [currentPage, setCurrentPage] = useState(0)
    //是否已加载完
    const [isFinish, setIsFinish] = useState(false)
    //是否在加载
    const [isLoading, setIsLoading] = useState(false)
    //列表
    const [list, setList] = useState([])
    //上拉刷新
    const refresh = useCallback(() => {
        if (isLoading) {
            return
        }
        setIsLoading(true)
        setCurrentPage(0)
        setList([])
        setIsFinish(false)
        refreshCallBack && refreshCallBack()
        _api(0)
    }, [isLoading])
    //上拉加载
    const loadMore = useCallback(() => {
        if (isFinish || isLoading) {
            return
        }
        setIsLoading(true)
        loadMoreCallBack&&loadMoreCallBack()
        _api&&_api(currentPage)
    }, [isFinish, isLoading,currentPage])
    return {currentPage, setCurrentPage, isFinish, setIsFinish, isLoading, setIsLoading, list, setList,refresh,loadMore}
}