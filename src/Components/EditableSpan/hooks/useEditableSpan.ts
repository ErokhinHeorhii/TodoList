import { useState } from 'react'

import { EditableSpanType } from '../EditableSpan'

export const useEditableSpan = (props: EditableSpanType) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.value)

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(props.value)
  }

  const activateViewMode = () => {
    props.changeTitle(title)
    setEditMode(false)
  }

  return {
    editMode,
    setEditMode,
    title,
    setTitle,
    activateViewMode,
    activateEditMode,
  }
}
