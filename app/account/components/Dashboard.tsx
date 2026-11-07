import VisitStats from './VisitStats'
import ShareProfileCard from './ShareProfileCard'
import ShopListPreview from './ShopListPreview'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Your coffee at a glance.</p>
      </div>
      <ShareProfileCard />
      <VisitStats />
      <ShopListPreview
        title="Passport"
        endpoint="/api/visits"
        viewAllHref="/account/visited"
        emptyText="No visits yet. Mark shops you've been to and watch your passport fill up."
      />
      <ShopListPreview
        title="Favorites"
        endpoint="/api/favorites"
        viewAllHref="/account/favorites"
        emptyText="No favorites yet. Save shops you love to see them here."
      />
    </div>
  )
}
