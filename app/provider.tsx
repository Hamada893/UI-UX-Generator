'use client'

import { SettingsContext } from "@/context/SettingsContext";
import { UserDetail, UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { type ReactNode, useEffect, useState } from "react"

function Provider({children}: {children: ReactNode}) {

  const [settingsDetails, setSettingsDetails] = useState<any>(null)

  const [userDetail, setUserDetail] = useState<UserDetail>(null)
  useEffect(() => {
    createNewUser()
  }, [])

  const createNewUser = async() => {
    try {
      const result = await axios.post<UserDetail>('/api/user')
      setUserDetail(result.data)
    } catch (error) {
      console.error('Error creating new user', error)
      setUserDetail(null)
    }
  }
  return (
    <UserDetailContext.Provider value={{userDetail, setUserDetail}}>
      <SettingsContext.Provider value={{settingsDetails, setSettingsDetails}}>
        {children}
      </SettingsContext.Provider>
    </UserDetailContext.Provider>
  )
}

export default Provider
