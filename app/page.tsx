import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col relative flex place-items-center">
        <h1 className="text-4xl pb-6"> pgh.coffee </h1>
        <h3 className="">A guide to every coffee shop in and around Pittsburgh, PA</h3>
      </div>
    </main>
  )
}
