import React, { ChangeEvent, useState } from 'react'

import { Button, TextField } from '@mui/material'

import s from './AddItemForm.module.css'

type AddItemFormType = {
  addItem: (title: string) => void
  disabled?: boolean
}

const AddItemForm = React.memo(({ disabled = false, ...props }: AddItemFormType) => {
  const [title, setTitle] = useState<string>(' ')
  const [error, setError] = useState<boolean>(false)

  const addTask = () => {
    const trimTitle = title.trim()

    if (trimTitle) {
      props.addItem(trimTitle)
    } else {
      setError(true)
    }
    setTitle(' ')
  }

  const userMessage = error ? (
    <div style={{ color: 'red' }}>Title is requared! </div>
  ) : (
    <div className={s.title}>Please, create this</div>
  )

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(!error)
    }
    setTitle(e.currentTarget.value)
  }
  const onKeDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addTask()
    }
  }

  return (
    <div className={s.wrapper}>
      <div className={s.wrapperTextButton}>
        <TextField
          label={error ? 'error' : ''}
          value={title}
          onChange={onChangeHandler}
          onKeyDown={onKeDownHandler}
          size={'small'}
          variant="outlined"
          error={!!error}
          disabled={disabled}
          style={{ display: 'inline' }}
        />
        <Button
          variant="outlined"
          onClick={addTask}
          style={{
            maxWidth: '30px',
            maxHeight: '30px',
            minWidth: '30px',
            minHeight: '30px',
            marginLeft: '15px',
          }}
          disabled={disabled}
        >
          +
        </Button>
      </div>
      {userMessage}
    </div>
  )
})

export default AddItemForm
