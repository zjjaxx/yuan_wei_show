import React from "react"
import {connect} from "react-redux"
import {View,Text,StyleSheet} from "react-native"
function Register(){
    return (
        <View>
            <Text>Register</Text>
        </View>
    )
}
const style=StyleSheet.create({

})
export default connect(state=>state,dispatch=>({dispatch}))(Register)