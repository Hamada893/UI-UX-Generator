'use client'

import { UserDetail, UserDetailContext } from "@/context/USerDetailContext";
import axios from "axios";
import { type ReactNode, useEffect, useState } from "react"

function Provider({children}: {children: ReactNode}) {

  const [userDetail, setUserDetail] = useState<UserDetail>(null)
  useEffect(() => {
    createNewUser()
  }, [])

  const createNewUser = async() => {
    try {
      const result = await axios.post('/api/user')
      setUserDetail(result.data)
    } catch (error) {
      console.error('Error creating new user', error)
      setUserDetail(null)
    }
  }
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      {children}
    </UserDetailContext.Provider>
  )
}

export default Provider
