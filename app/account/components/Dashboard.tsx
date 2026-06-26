import AccountDetails from '../AccountDetails'
import VisitedProgress from './VisitedProgress'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <VisitedProgress />
      <AccountDetails />
    </div>
  )
}
