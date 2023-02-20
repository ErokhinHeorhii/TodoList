import React, { ChangeEvent, useState } from 'react'

import { TextField } from '@mui/material'

import { RequestStatusType } from '../../app/app-reducer'

import s from './EditableSpan.module.css'

type EditableSpanType = {
  value: string
  changeTitle: (newTitle: string) => void
  entityStatus?: RequestStatusType
}

const EditableSpan = React.memo((props: EditableSpanType) => {
  const [editMode, setEditMode] = useState<boolean>(false)
  const [title, setTitle] = useState<string>(props.value)

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }

  const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.changeTitle(title)
      setEditMode(false)
    }
  }

  const activateEditMode = () => {
    setEditMode(true)
    setTitle(props.value)
  }

  const activateViewMode = () => {
    props.changeTitle(title)
    setEditMode(false)
  }

  return (
    <div style={{ width: '250px' }}>
      {/* eslint-disable-next-line no-nested-ternary */}
      {editMode ? (
        props.entityStatus !== 'loading' ? (
          <TextField
            value={title}
            onKeyPress={onKeyPressHandler}
            variant="outlined"
            onChange={onChangeHandler}
            onBlur={activateViewMode}
            size={'small'}
            autoFocus
          />
        ) : (
          <span onDoubleClick={activateEditMode} className={s.span}>
            {props.value}
          </span>
        )
      ) : (
        <span onDoubleClick={activateEditMode} className={s.span}>
          {props.value}
        </span>
      )}
    </div>
  )
})

export default EditableSpan
