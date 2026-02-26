import { Popup } from 'react-map-gl'

interface ShopPopupProps {
  longitude: number
  latitude: number
  name: string
  neighborhood: string
  photo: string | null
  onClick: () => void
}

export default function ShopPopup({ longitude, latitude, name, neighborhood, photo, onClick }: ShopPopupProps) {
  return (
    <Popup
      longitude={longitude}
      latitude={latitude}
      anchor="bottom"
      offset={[0, -14] as [number, number]}
      closeButton={false}
      closeOnClick={false}
      className="shop-hover-popup"
    >
      <button
        className="w-48 h-28 relative rounded-lg overflow-hidden cursor-pointer block focus:outline-none"
        onClick={onClick}
        aria-label={`View ${name} in ${neighborhood}`}
      >
        {photo ? (
          <img className="h-full w-full object-cover object-center" src={photo} alt="" />
        ) : (
          <div className="h-full w-full bg-yellow-200" />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.7),transparent_100%)]" />
        <div className="absolute bottom-0 w-full px-2 py-1 text-left">
          <p className="font-medium text-white text-sm leading-tight">{name}</p>
          <p className="text-white/80 text-xs mt-0.5">{neighborhood}</p>
        </div>
      </button>
    </Popup>
  )
}
