import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { NewsDetails } from '@/app/components/NewsDetails'

export const useURLNewsSync = () => {
  const { setPanelContent } = usePanelStore()

  const fetchNewsFromURL = async () => {
    const params = new URLSearchParams(window.location.search)
    const newsId = params.get('news')
    if (!newsId) return

    setPanelContent(<NewsDetails id={newsId} />, 'news')
  }

  useEffect(() => {
    fetchNewsFromURL()
    window.addEventListener('popstate', fetchNewsFromURL)
    return () => window.removeEventListener('popstate', fetchNewsFromURL)
    // only run on mount
    // eslint-disable-next-line
  }, [])
}
