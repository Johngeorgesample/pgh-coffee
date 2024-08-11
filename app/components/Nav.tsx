import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Nav() {
  const router = useRouter()
  return (
    <nav className="flex items-center justify-end h-36 max-w-5xl mx-auto px-6 md:px-8">
      <div className="flex items-center">
        <a className="px-2 py-1 text-3xl hover:bg-gray-100">Foo</a>
      </div>
    </nav>
  )
}
