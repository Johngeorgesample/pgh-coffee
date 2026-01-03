import { useEffect } from 'react'
import usePanelStore from '@/stores/panelStore'
import { Company } from '@/app/components/Company'

export const useURLCompanySync = () => {
  const { setPanelContent } = usePanelStore()

  const fetchCompanyFromURL = async () => {
    const params = new URLSearchParams(window.location.search)
    const companySlug = params.get('company')

    if (!companySlug) {
      return
    }

    try {
      const res = await fetch(`/api/companies/${companySlug}`)
      if (!res.ok) throw new Error('Company not found')
      await res.json()
      setPanelContent(<Company slug={companySlug} />, 'company')
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCompanyFromURL()
    window.addEventListener('popstate', fetchCompanyFromURL)
    return () => window.removeEventListener('popstate', fetchCompanyFromURL)
    // only run on mount
    // eslint-disable-next-line
  }, [])
}
