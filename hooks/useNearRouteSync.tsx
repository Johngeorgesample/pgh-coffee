import { useEffect, ReactNode, isValidElement, ComponentProps } from 'react'
import { useSearchParams } from 'next/navigation'
import usePanelStore from '@/stores/panelStore'
import useShopsStore from '@/stores/coffeeShopsStore'
import NearShops from '@/app/components/NearShops'
import { geocode } from '@/app/utils/geocode'
import { clearOwnPanel } from './clearOwnPanel'

type TNearProps = ComponentProps<typeof NearShops>

const panelNearProps = (content: ReactNode, query: string) =>
  isValidElement<TNearProps>(content) && content.type === NearShops && content.props.query === query
    ? content.props
    : null

function showNear(props: TNearProps) {
  usePanelStore.getState().setPanelContent(<NearShops {...props} />, 'near')
  useShopsStore.getState().setNearPoint(props.point)
}

export const useNearRouteSync = () => {
  const near = useSearchParams().get('near')

  useEffect(() => {
    if (!near) {
      useShopsStore.getState().setNearPoint(null)
      clearOwnPanel('near')
      return
    }

    const { panelMode, panelContent } = usePanelStore.getState()
    const existing = panelMode === 'near' ? panelNearProps(panelContent, near) : null
    if (existing) {
      useShopsStore.getState().setNearPoint(existing.point)
      return
    }

    const controller = new AbortController()
    const show = (props: Omit<TNearProps, 'query'>) => {
      if (!controller.signal.aborted) showNear({ query: near, ...props })
    }
    geocode(near, controller.signal)
      .then(place =>
        show(
          place
            ? { label: place.label, point: place.coordinates }
            : { label: `Couldn't find “${near}” in Allegheny County.`, point: null },
        ),
      )
      .catch(err => {
        if (err.name === 'AbortError') return
        console.error(err)
        show({ label: `Couldn't look up “${near}”.`, point: null })
      })
    return () => controller.abort()
  }, [near])
}
