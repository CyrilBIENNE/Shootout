'use client'

import styles from './Header.module.scss'
import Cog from '@/icons/cog'
import Add from '@/icons/add'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const router = useRouter()

  function parameters() {
    if (confirm('Vous abandonner la partie en cours ?')) {
      router.push('/shootout/parameters')
    }
  }

  return (
    <header className={styles.header}>
      <div>SHOOTOUT</div>
      <div className={styles.icons}>
        <Link title="Nouvelle partie" href="/shootout">
          <Add size="2em" stroke={2} />
        </Link>
        <span onClick={parameters} title="Réglages">
          <Cog size="2em" />
        </span>
      </div>
    </header>
  )
}
