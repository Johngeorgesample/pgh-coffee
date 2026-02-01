'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

export default function CreateListButton({onAdd}) {
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [listName, setListName] = useState('')

  const isValid = listName.trim().length > 0

  const createList = () => {
    console.log(listName)
    // POST request to create new record in user_lists table
    onAdd()
  }

  return (
    <>
      {isEditing ? (
        <div className="flex items-center gap-2 p-2 w-full text-left h-16 border border-solid">
          <input
            className="flex-1 border-none focus:outline-none focus:ring-0 focus:ring-offset-0"
            onChange={e => setListName(e.target.value)}
            placeholder="List name"
            value={listName}
          />
          <button
            onClick={createList}
            disabled={!isValid}
            className={`px-3 py-1 rounded-lg ${isValid ? 'bg-yellow-300' : 'bg-gray-300 text-gray-500'}`}
          >
            Add
          </button>
        </div>
      ) : (
        <button
          className="flex items-center gap-2 border border-dashed p-2 w-full text-left h-16"
          onClick={() => setIsEditing(true)}
        >
          <div className="bg-slate-200 p-2 rounded-lg">
            <Plus />
          </div>
          <p>Create new list</p>
        </button>
      )}
    </>
  )
}
