'use client'

import ShareListAction from './ShareListAction'
import EditListAction from './EditListAction'
import DeleteListAction from './DeleteListAction'

interface ListActionsProps {
  listId: string
  listName: string
  onNameUpdate: (newName: string) => void
}

export default function ListActions({ listId, listName, onNameUpdate }: ListActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ShareListAction />
      <EditListAction listId={listId} currentName={listName} onUpdate={onNameUpdate} />
      <DeleteListAction listId={listId} listName={listName} />
    </div>
  )
}
