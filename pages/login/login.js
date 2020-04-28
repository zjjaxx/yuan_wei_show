import React, { useCallback, useContext } from "react"
import {View,Button} from "react-native"
import {setLocalStorage} from "../../utils/common"
import {AppContext} from "../../context/context"
export default function Login({navigation}){
    const {$login}=useContext(AppContext)
    const setLogin=useCallback(async ()=>{
        await setLocalStorage("token","i have token")
        $login("i have token")
    },[])
   
    return (
        <View>
            <Button onPress={setLogin} title="login in"></Button>
        </View>
    )
}