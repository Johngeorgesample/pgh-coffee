import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { NewsDetails } from '@/app/components/NewsDetails'
import { News } from '@/app/components/News'

export const useURLNewsSync = () => {
  const { setPanelContent } = usePanelStore()

  useEffect(() => {
    const fetchNewsFromURL = () => {
      const params = new URLSearchParams(window.location.search)
      if (!params.has('news')) return

      const newsId = params.get('news')
      if (newsId) {
        setPanelContent(<NewsDetails id={newsId} />, 'news')
      } else {
        setPanelContent(<News />, 'news')
      }
    }

    fetchNewsFromURL()
    window.addEventListener('popstate', fetchNewsFromURL)
    return () => window.removeEventListener('popstate', fetchNewsFromURL)
  }, [setPanelContent])
}
