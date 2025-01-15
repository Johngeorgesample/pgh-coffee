'use client'

import { TShop } from '@/types/shop-types'

interface IProps {
  shop: TShop
}

export default function PanelFooter(props: IProps) {
  const githubURL = `https://github.com/Johngeorgesample/pgh-coffee/issues/new?labels=data-issue&title=Problem+with+${props.shop.properties.name}`
  const email = 'johngeorgesample@gmail.com'
  return (
    <section className="flex flex-col items-center">
      <hr className="my-4 w-1/2 m-auto" />
      <div className="text-sm mb-2 flex flex-col flex-1 items-center">
        <p className="text-gray-500">Is this information incorrect?</p>
        <p className="text-gray-500">
          <a aria-label="File an issue on GitHub" className="italic underline" href={githubURL}>
            File an issue
          </a>{' '}
          or{' '}
          <a className="italic underline" href={`mailto:${email}?subject=Issue with ${props.shop.properties.name}`}>
            email me
          </a>
        </p>
      </div>
    </section>
  )
}
