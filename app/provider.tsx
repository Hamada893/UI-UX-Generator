'use client'

import { UserDetailContext } from "@/context/USerDetailContext";
import axios from "axios";
import { useEffect, useState } from "react"

function provider({children}: {children: any}) {

  const [userDetail, setUserDetail] = useState<any>(null)
  useEffect(() => {
    createNewUser()
  }, [])

  const createNewUser = async() => {
    const result = await axios.post('/api/user')

    console.log(result.data)
    setUserDetail(result.data)
  }
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      {children}
    </UserDetailContext.Provider>
  )
}

export default provider
