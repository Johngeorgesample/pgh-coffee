import Image from 'next/image'
import PittsburghBackground from '@/public/pittsburgh-background.webp'

export default function NotFound() {
    return (
        <div>
            <Image
                src={PittsburghBackground}
                alt="Picture of Pittsburgh"
                priority={true}
                layout="fill" // Use layout="fill" to cover the parent
                objectFit="cover" // Maintain aspect ratio while covering
                className='absolute -z-10 brightness-50'
            />
            <div className="z-10 text-yellow-300 text-center p-10">
                <h1 className="text-7xl md:text-6xl font-extrabold">404</h1>
                <p className="mt-4 text-2xl font-bold">Oops! Page not found.</p>
                <a
                    href="/"
                    className="mt-6 inline-block px-4 py-2 text-lg bg-yellow-300 text-black rounded hover:bg-black hover:text-yellow-300"
                >
                    Go back Home
                </a>
            </div>
        </div>
    )
}