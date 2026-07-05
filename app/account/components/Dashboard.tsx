import AccountDetails from '../AccountDetails'
import VisitStats from './VisitStats'
import ShareProfileCard from './ShareProfileCard'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <VisitStats />
      <ShareProfileCard />
      <AccountDetails />
    </div>
  )
}
