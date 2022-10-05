import React, { ChangeEvent, useState } from "react";

type AddItemFormType = {
  addItem: (title: string) => void
}

const AddItemForm = (props: AddItemFormType) => {
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

  const userMessage = error
    ? <div style={{ color: "red" }}>Title is requared! </div>
    : <div> Please, create this</div>

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(!error)
    }
    setTitle(e.currentTarget.value)
  }
  const onKeDownHandler = (e: any) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  return (<>
    <input
      className={error ? "error" : ""}
      value={title}
      onChange={onChangeHandler}
      onKeyDown={onKeDownHandler}
    />
    <button onClick={addTask}>+</button>
    {userMessage}
  </>)
}
export default AddItemForm