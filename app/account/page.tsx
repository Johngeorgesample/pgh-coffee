import AccountDetails from './AccountDetails'

export default function Account() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Account</h1>
        <AccountDetails />
      </div>
    </div>
  )
}
