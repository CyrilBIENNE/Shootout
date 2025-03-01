/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { createContext, useEffect, useState } from 'react'
import { ShootoutStructure } from './Shootout.type'
import { shootoutConfig } from 'templates/shootout/default.config'

type Props = {
  initParams?: { [key: string]: any }
  children: any
}

export interface ShootoutContextData {
  shootout?: ShootoutStructure
  isLoading?: boolean
  setShootout: (shootout: ShootoutStructure) => void
}

export interface ShootoutFrontData {
  shootout: ShootoutStructure
  isLoading: boolean
  fnFront: ShootoutContextData
}

export const initShootout = () => {
  const shootout: ShootoutStructure = {
    config: shootoutConfig,
    customConfigs: [],
    games: [],
  }
  return shootout
}

export const ShootoutContext = createContext<ShootoutContextData>({
  setShootout: () => {},
  isLoading: true,
})

const ShootoutProvider = ({ children }: Props) => {
  const shootoutName = `shootout`
  const [shootout, setShootout] = useState<ShootoutStructure>(initShootout())

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isLoading) return

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])

  useEffect(() => {
    const tmpStorage = localStorage.getItem(shootoutName)
    const storageShootout = tmpStorage ? JSON.parse(tmpStorage) : undefined
    if (storageShootout?.S_TotalTime) {
      setShootout(storageShootout)
    } else {
      localStorage.setItem(shootoutName, JSON.stringify(shootout))
    }

    return setIsLoading(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shootoutName])

  useEffect(() => {
    if (isLoading) return
    if (!shootout) return
    localStorage.setItem(shootoutName, JSON.stringify(shootout))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, shootout])

  return (
    <ShootoutContext.Provider
      value={{
        shootout,
        isLoading,
        setShootout,
      }}
    >
      {children}
    </ShootoutContext.Provider>
  )
}

export default ShootoutProvider
