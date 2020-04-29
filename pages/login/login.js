import React, { useCallback } from "react"
import {View,Button} from "react-native"
import {connect} from "react-redux"
import {login} from "../../store/action"
 function Login({dispatch}){
    const setLogin=useCallback(()=>{
        dispatch(login("token"+Math.random()))
    },[dispatch])
    return (
        <View>
            <Button onPress={setLogin} title="login in"></Button>
        </View>
    )
}
export default connect(state=>state,dispatch=>({dispatch}))(Login)