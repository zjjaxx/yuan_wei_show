import React, { useState, useCallback } from "react"
import { getNodeInfo } from "../utils/common"

export function useNodeRect() {
    const [rect, setRect] = useState(null);
    const ref = useCallback(({ nativeEvent: { layout: { x, y, width, height } } }) => {
        if(rect){
            return
        }
        setRect({ x, y, width, height });
    }, [rect]);
    return [rect, ref];
}
export function useNodeListRect(length) {
    const [rect, setRect] = useState();
    const ref = new Array(length).fill(null).map((item, index) => useCallback(({ nativeEvent: { layout: { x, y, width, height } } }) => {
        if(rect){
            return
        }
        setRect({ x, y, width, height });
    }, [rect]))
    return [rect, ref];
}
export function useNodeDiffListRect(length) {
    const [rect, setRect] = useState(new Array(length).fill(null));
    const ref = new Array(length).fill(null).map((item, index) => useCallback(({ nativeEvent: { layout: { x, y, width, height } } },_index) => {
        if(rect[_index]&&rect[_index].width==width){
            return
        }
        setRect(rect=>rect.map((item,index)=>{
            if(index==_index){ 
                return { x, y, width, height }
            }
            else{
                return item
            }
        }));
    }, [rect]))
    return [rect, ref];
}