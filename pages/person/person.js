import React, { useCallback } from "react"
import { View, Text, Button } from "react-native"
import { connect } from "react-redux"
import { logout } from "../../store/action"
function Person({ dispatch }) {
    const _logout = useCallback(() => {
        dispatch(logout())
    }, [dispatch])
    return (
        <View>
            <Text>Person</Text>
            <Button title="logout" onPress={_logout}></Button>
        </View>
    )
}

export default connect(state => state, dispatch => ({ dispatch }))(Person)