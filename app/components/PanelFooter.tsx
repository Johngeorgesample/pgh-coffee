'use client'

import { useState } from 'react'
import { TShop } from '@/types/shop-types'
import IssueModal from './IssueModal'

interface IProps {
  shop: TShop
}

export default function PanelFooter(props: IProps) {
  const [showIssueModal, setShowIssueModal] = useState(false)

  return (
    <>
      <section className="flex flex-col items-center pb-6">
        <hr className="my-4 w-1/2 m-auto" />
        <div className="text-sm mb-2 flex flex-col flex-1 items-center">
          <button onClick={() => setShowIssueModal(true)} className="text-gray-500">
            Is this information incorrect?
          </button>
        </div>
      </section>
      <IssueModal shop={props.shop} isOpen={showIssueModal} onClose={() => setShowIssueModal(false)} />
    </>
  )
}
