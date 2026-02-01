'use client'

import ShareListAction from './ShareListAction'
import EditListAction from './EditListAction'
import DeleteListAction from './DeleteListAction'

interface ListActionsProps {
  listId: string
  listName: string
  isPublic: boolean
  onNameUpdate: (newName: string) => void
  onPublicChange: (isPublic: boolean) => void
}

export default function ListActions({ listId, listName, isPublic, onNameUpdate, onPublicChange }: ListActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <ShareListAction listId={listId} isPublic={isPublic} onPublicChange={onPublicChange} />
      <EditListAction listId={listId} currentName={listName} onUpdate={onNameUpdate} />
      <DeleteListAction listId={listId} listName={listName} />
    </div>
  )
}
