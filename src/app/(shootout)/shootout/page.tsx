import { defaultMetadata } from '../../../templates/meta/default'
import Shootout from '../../../templates/shootout/Shootout/Shootout'

export const dynamic = 'force-static'

export async function generateMetadata() {
  return defaultMetadata
}

export default async function Page() {
  return <Shootout />
}
