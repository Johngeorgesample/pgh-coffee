'use client'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import Map from 'react-map-gl'


export default function Mappy() {
  return (
    <>
      <main className="flex min-h-[calc(100vh-72px)] flex-col items-center">
        <div className="flex justify-center items-center flex-col absolute top-0 h-56">
          <h1>map</h1>
        </div>
        <Map
          mapboxAccessToken={process.env.MAPBOX_ACCESS_TOKEN}
          initialViewState={{
            longitude: -79.99585,
            latitude: 40.440742,
            zoom: 12,
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
        />
      </main>
      <Footer />
    </>
  )
}
