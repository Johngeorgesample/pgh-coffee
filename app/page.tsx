import ShopCard from '@/app/components/ShopCard'
import CoffeeShops from '@/data/coffee_shops.json'
import Footer from '@/app/components/Footer'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col relative flex place-items-center">
        <h1 className="text-4xl pb-6"> pgh.coffee </h1>
        <h3 className="text-center">A guide to every coffee shop in Pittsburgh, PA</h3>
        <hr className="my-4 w-1/2 m-auto" />

        <div className="grid grid-cols-3 gap-4 px-4">
          {CoffeeShops.map((shop) => {
            return <ShopCard key={shop.address} shop={shop} />
          }
          )}
        </div>

          <Footer />
      </div>
    </main>
  )
}
