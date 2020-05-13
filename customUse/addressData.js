import React, { useEffect, useState } from "react"
import { getLocalStorage,setLocalStorage } from "../utils/common"
import { area } from "../api/api"

function useAddressData() {
    const [addressData, setAddressData] = useState([])
    useEffect(() => {
        getLocalStorage("area").then(data => {
            if (data) {
                setAddressData(JSON.parse(data))
            }
            else {
                return area()
            }
        })
            .then(({ data: { result } }) => {
                setAddressData(result)
                setLocalStorage("area",JSON.stringify(result))
            })
    }, [])
    return addressData
}
export default useAddressData