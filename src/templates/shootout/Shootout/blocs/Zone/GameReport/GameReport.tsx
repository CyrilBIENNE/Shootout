import { secondesToMinutes } from '@/utils/secondesToMinutes'
import styles from './GameReport.module.scss'
import { ShootoutGamePlayer } from 'templates/shootout/Shootout/providers/Shootout.type'

type Props = {
  player: ShootoutGamePlayer
}
export default function GameReport({ player }: Props) {
  return (
    <div className={styles.report}>
      <div>Temps de jeu : {secondesToMinutes(player.totalTime, true)}</div>
      <div>Nombre de tours : {player.turns}</div>
      <div>Nombre de shots : {player.shots}</div>
      <div>Temps moyen / Shot : {Math.round((player.shots * 100) / player.totalTime) / 100}s</div>
    </div>
  )
}
