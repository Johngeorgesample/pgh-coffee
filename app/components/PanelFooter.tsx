'use client'

import { TShop } from '@/types/shop-types'

interface IProps {
  shop: TShop
}

export default function PanelFooter(props: IProps) {
  return (
    <>
      <hr className="my-4 w-1/2 m-auto" />
      <div className="text-sm mb-2 text-center">
        <p className="text-gray-500">Is this information incorrect?</p>
        <p className="text-gray-500">
          <a className="italic underline" href="https://github.com/Johngeorgesample/pgh-coffee/issues/new">
            File an issue
          </a>{' '}
          or{' '}
          <a
            className="italic underline"
            href={`mailto:johngeorgesample@gmail.com?subject=Issue with ${props.shop.name}`}
          >
            email me
          </a>
        </p>
      </div>
    </>
  )
}
