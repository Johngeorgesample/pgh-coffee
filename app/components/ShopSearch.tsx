import useShopsStore from '@/stores/coffeeShopsStore'
import usePanelStore from '@/stores/panelStore'
import ShopList from '@/app/components/ShopList'

interface IProps {
}

export default function ShopSearch(props: IProps) {
  const { allShops } = useShopsStore()
  const { searchValue } = usePanelStore()

  return (
    <div className="flex h-full flex-col overflow-y-auto px-4 sm:px-6">
      <div className="mt-12">
        <ShopList coffeeShops={allShops.features} filter={searchValue} />
      </div>
    </div>
  )
}
