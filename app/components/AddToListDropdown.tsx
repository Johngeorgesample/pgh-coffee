import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ArrowTopRightOnSquareIcon, BookmarkIcon, PlusIcon } from '@heroicons/react/24/outline'

export default function AddToListDropdown() {

  return (
      <Menu>
        <MenuButton>
          <div
            className="w-fit p-2 rounded-full border-2 border-yellow-400 hover:bg-yellow-100 hover:cursor-pointer"
          >
            <PlusIcon className="h-6 w-6" />
          </div>
        </MenuButton>

        <MenuItems
          transition
          anchor="bottom end"
          className="bg-slate-600 w-52 origin-top-right rounded-xl border border-white/5 bg-white/5 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
        >
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={() => console.log('make request')}>
              Favorites
            </button>
          </MenuItem>
          <MenuItem>
            <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/10" onClick={() => console.log('make request')}>
              Want to go
            </button>
          </MenuItem>
        </MenuItems>
      </Menu>
  )
}
