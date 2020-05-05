import React, { useCallback } from "react"
import { View, Text, Button, SafeAreaView,StyleSheet } from "react-native"
import { connect } from "react-redux"
import { logout } from "../../store/action"
function Person({ dispatch }) {
    const _logout = useCallback(() => {
        dispatch(logout())
    }, [dispatch])
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View>
                <Text>Person</Text>
                <Button title="logout" onPress={_logout}></Button>
            </View>
        </SafeAreaView>
    )
}
const style=StyleSheet.create({

})

export default connect(state => state, dispatch => ({ dispatch }))(Person)