import AccountDetails from '../AccountDetails'
import VisitStats from './VisitStats'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <VisitStats />
      <AccountDetails />
    </div>
  )
}
