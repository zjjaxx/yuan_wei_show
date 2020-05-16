import { Platform, NativeModules } from 'react-native';
import { useEffect, useState } from 'react';
const { StatusBarManager } = NativeModules;

export default function useStatusBarHeight(){
    const [statusBarHeight,setStatusBarHeight]=useState()
    useEffect(()=>{
        if(Platform.OS === 'ios'){
            StatusBarManager.getHeight((statusBarHeight)=>{
               setStatusBarHeight(statusBarHeight.height)
            })
        }
        else{
            setStatusBarHeight(StatusBarManager.HEIGHT)
        }
        
    },[])
    return [statusBarHeight]
}