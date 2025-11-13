import { usePlausible } from 'next-plausible'

interface TrackEventProps {
  eventName: string
  source: 'search' | 'map' | 'nearby' | 'featured'
  shopName: string
  neighborhood?: string
  
}

export const useTrackEvent = () => {
  const plausible = usePlausible()

  return ({ eventName, ...props }: TrackEventProps) => {
    plausible(eventName, {
      props: {
        ...props,
      },
    })
  }
}
