import { Suspense } from 'react'
import { Heart, Share2, Stamp } from 'lucide-react'
import SignInForm from './SignInForm'

const BENEFITS = [
  { icon: Stamp, title: 'A passport for the city', body: 'Check off every shop you visit and watch your neighborhoods fill in.' },
  { icon: Heart, title: 'Favorites on every device', body: 'Save the spots you love and pull them up on your phone or laptop.' },
  { icon: Share2, title: 'A profile worth sharing', body: 'Your public passport page, with a map of everywhere you’ve been.' },
]

function Benefits() {
  return (
    <ul className="mt-8 space-y-6">
      {BENEFITS.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex gap-4">
          <div className="size-10 shrink-0 rounded-full bg-yellow-100 flex items-center justify-center">
            <Icon className="size-5 text-yellow-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{title}</p>
            <p className="text-sm text-gray-600">{body}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default async function SignIn({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const signingUp = (await searchParams).mode === 'signup'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {signingUp ? 'Keep track of every cup in Pittsburgh.' : 'Welcome back.'}
          </h1>
          <Benefits />
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl shadow-lg p-8 animate-pulse h-96" />}>
          <SignInForm />
        </Suspense>
      </div>
    </div>
  )
}
