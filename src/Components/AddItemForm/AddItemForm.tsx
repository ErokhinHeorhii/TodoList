import React from 'react'

import { Button, TextField } from '@mui/material'

import s from './AddItemForm.module.css'
import { useAddItemForm } from './hooks/useAddItemForm'

type AddItemFormType = {
  addItem: (title: string) => void
  disabled?: boolean
}

const AddItemForm = React.memo(({ disabled = false, ...props }: AddItemFormType) => {
  const { error, title, onChangeHandler, onKeDownHandler, addTask } = useAddItemForm(props.addItem)

  const userMessage = error ? (
    <div style={{ color: 'red' }}>Title is requared! </div>
  ) : (
    <div className={s.title}>Please, create this</div>
  )

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
          style={{ display: 'inline', width: '250px' }}
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
