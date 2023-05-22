import React, { ChangeEvent, useState } from 'react'

export const useAddItemForm = (onItemAdded: (str: string) => void) => {
  const [title, setTitle] = useState<string>(' ')
  const [error, setError] = useState<boolean>(false)

  const addTask = () => {
    const trimTitle = title.trim()

    if (trimTitle) {
      onItemAdded(trimTitle)
    } else {
      setError(true)
    }
    setTitle(' ')
  }

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

  return {
    error,
    title,
    addTask,
    onChangeHandler,
    onKeDownHandler,
  }
}
