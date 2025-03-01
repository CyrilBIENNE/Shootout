'use client'

import { useEffect, useState } from 'react'
import styles from './Shootout.module.scss'
import Pause from '@/icons/pause'
import Play from '@/icons/play'
import TimeBloc from './blocs/TimeBlock/TimeBlock'
import { secondesToMinutes } from '@/utils/secondesToMinutes'
//import useShootout from './providers/useShootout'
import { ShootoutConfig, ShootoutGamePlayer } from './providers/Shootout.type'
import { shootoutConfig } from '../default.config'
import Zone from './blocs/Zone/Zone'
import ZoneClient from './blocs/Zone/Zone.client'
import GameReport from './blocs/Zone/GameReport/GameReport'

type Props = {
  config?: ShootoutConfig
  namePlayer1?: string
  namePlayer2?: string
}

export default function Shootout({ config, namePlayer1, namePlayer2 }: Props) {
  if (!config) config = shootoutConfig // TODO mettre ca en amont
  //const { shootout } = useShootout()

  const [player1, setPlayer1] = useState<ShootoutGamePlayer>({
    number: 1,
    name: namePlayer1 ?? 'Joueur 1',
    shots: 0,
    turns: 0,
    totalTime: 0,
  })
  const [player2, setPlayer2] = useState<ShootoutGamePlayer>({
    number: 2,
    name: namePlayer2 ?? 'Joueur 2',
    shots: 0,
    turns: 0,
    totalTime: 0,
  })

  const [matchEnded, setMatchEnded] = useState(false)
  const [totalTime, setTotalTime] = useState(config.S_TotalTime)
  const [localTime, setLocalTime] = useState(config.S_LocalTime1)
  const [isLocalPause, setIsLocalPause] = useState(true)
  const [isTotalPause, setIsTotalPause] = useState(true)
  const [maxLocalTime, setMaxLocalTime] = useState(config.S_LocalTime1)
  const [currentShotTime, setCurrentShotTime] = useState(config.S_LocalTime1)
  const [currentPlayer, setCurrentPlayer] = useState<ShootoutGamePlayer | undefined>(undefined)
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined)

  function manageTimestamp() {
    if (currentPlayer && timestamp) {
      console.log('On encaisse ')
      const newTotalTime =
        currentPlayer.totalTime + Math.min(currentShotTime, Math.round(Math.floor((Date.now() - timestamp) / 10)) / 100)
      currentPlayer.totalTime = Math.round(newTotalTime * 100) / 100
      if (currentPlayer.number == 2) {
        setPlayer2({ ...currentPlayer })
      } else {
        setPlayer1({ ...currentPlayer })
      }
      setTimestamp(undefined)
    }

    return
  }

  function onChangePlayer(player: ShootoutGamePlayer) {
    console.log('On Change de  Player pour ' + player.name)
    onNewShot()
    setCurrentPlayer(player)
  }

  const onNewShot = () => {
    if (currentPlayer) currentPlayer.shots++
    manageTimestamp()
    setTimestamp(Date.now())
    setCurrentShotTime(maxLocalTime)
    setLocalTime(maxLocalTime)
    if (isLocalPause) setIsLocalPause(false)
    setIsTotalPause(false)
  }

  function onTotalPause(bool: boolean) {
    if (bool && !isLocalPause) setIsLocalPause(true)
    setIsTotalPause(bool ? true : false)
  }

  useEffect(() => {
    if (!currentPlayer) return
    currentPlayer.turns++
  }, [currentPlayer])

  useEffect(() => {
    if (!isLocalPause) setTimestamp(Date.now())
    if (!isLocalPause && isTotalPause) setIsTotalPause(false)
    if (isLocalPause || localTime <= 0) return manageTimestamp()

    const timer = setInterval(() => {
      setLocalTime((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocalPause])

  useEffect(() => {
    if (totalTime <= 0 || isTotalPause) return
    const timerTotal = setInterval(() => {
      setTotalTime((prevTime) => prevTime - 1)
    }, 1000)
    if (totalTime <= config.S_TotalTimeChangeLocal) setMaxLocalTime(config.S_LocalTime2)

    return () => clearInterval(timerTotal)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTime, isTotalPause])

  useEffect(() => {
    if (localTime <= 0) setIsLocalPause(true)
  }, [localTime])

  useEffect(() => {
    if (totalTime <= 590) {
      onTotalPause(true)
      setCurrentPlayer(undefined)
      setMatchEnded(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalTime])

  return (
    <div className={styles.shootout}>
      <div className={styles.zones}>
        <Zone color="blue" isActive={currentPlayer?.number == player1.number} player={player1}>
          {!matchEnded ? (
            <ZoneClient
              player={player1}
              currentPlayer={currentPlayer}
              localTime={localTime}
              isLocalPause={isLocalPause}
              setIsLocalPause={setIsLocalPause}
              onChangePlayer={onChangePlayer}
              onNewShot={onNewShot}
            />
          ) : (
            <GameReport player={player1} />
          )}
        </Zone>
        <Zone color="red" isActive={currentPlayer?.number == player2.number} player={player2}>
          {!matchEnded ? (
            <ZoneClient
              player={player2}
              currentPlayer={currentPlayer}
              localTime={localTime}
              isLocalPause={isLocalPause}
              setIsLocalPause={setIsLocalPause}
              onChangePlayer={onChangePlayer}
              onNewShot={onNewShot}
            />
          ) : (
            <GameReport player={player2} />
          )}
        </Zone>
      </div>

      <div className={styles.middle}>
        {!matchEnded ? (
          <>
            <div className={styles.time}>
              <TimeBloc isAlert={totalTime <= config.S_AlertTotalTime}>Total : {secondesToMinutes(totalTime)}</TimeBloc>
            </div>
            {currentPlayer && (
              <div className={styles.totalPause} onClick={() => onTotalPause(!isTotalPause)} style={{ marginLeft: -4 }}>
                {!isTotalPause ? <Pause size="2em" /> : <Play size="2em" />}
              </div>
            )}
            <div className={styles.time} style={{ marginLeft: -4 }}>
              <TimeBloc isAlert={maxLocalTime == config.S_LocalTime2}>Coup : {maxLocalTime}s</TimeBloc>
            </div>
          </>
        ) : (
          <TimeBloc isAlert={true}>Match terminé</TimeBloc>
        )}
      </div>
    </div>
  )
}
