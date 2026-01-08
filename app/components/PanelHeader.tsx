'use client'
import { useState } from 'react'
import { usePlausible } from 'next-plausible'
import { TShop } from '@/types/shop-types'
import PhotoDialog from './PhotoDialog'
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline'
import usePanelStore from '@/stores/panelStore'
import { Company } from '@/app/components/Company'

interface IProps {
  shop: TShop
}

export default function PanelHeader(props: IProps) {
  const { name, neighborhood, photo, company } = props.shop.properties
  const plausible = usePlausible()
  const { setPanelContent } = usePanelStore()
  const [photoDialogIsOpen, setPhotoDialogIsOpen] = useState(false)

  const handleHeaderClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      setPhotoDialogIsOpen(true)
      plausible('PanelHeaderClick', {
        props: {
          shopName: name,
          neighborhood: neighborhood,
        },
      })
    }
  }

  const hasPhoto = !!photo

  return (
    <>
      <div id="header" data-testid="header">
        <div
          className="group h-56 sm:h-64 relative bg-stone-300 bg-cover bg-center"
          style={hasPhoto ? { backgroundImage: `url('${photo}')` } : undefined}
          onClick={hasPhoto ? handleHeaderClick : undefined}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
            {/* Company badge */}
            {company?.slug && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  plausible('ViewAllLocationsClick', {
                    props: { company: company.slug },
                  })
                  setPanelContent(<Company slug={company.slug} />, 'company')
                }}
                className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm
                           hover:bg-white/25 transition-colors px-3 py-1.5 rounded-full 
                           text-xs text-white/90 mb-3 cursor-pointer border-none"
              >
                <BuildingStorefrontIcon className="w-3.5 h-3.5" />
                <span className="opacity-80">Part of</span>
                <span className="font-semibold">{company.name || 'Company'}</span>
              </button>
            )}

            {/* Shop name and neighborhood */}
            <h1 className="text-2xl sm:text-3xl font-serif font-normal tracking-tight leading-tight">{name}</h1>
            <p className="text-base text-white/80 mt-0.5">{neighborhood}</p>
          </div>
        </div>
        <PhotoDialog shop={props.shop} isOpen={photoDialogIsOpen} handleClose={() => setPhotoDialogIsOpen(false)} />
      </div>
    </>
  )
}
