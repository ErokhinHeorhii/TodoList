import React, { ChangeEvent, useState } from "react";

type EditableSpanType = {
  title: string
  changeTitle: (newTitle: string) => void
}
const EditableSpan = (props: EditableSpanType) => {
  const [EditMode, SetEditMode] = useState<boolean>(false)

  const [title, SetTitle] = useState(props.title)

  const onDoubleClickHandler = () => {
    SetEditMode(!EditMode)
    SetTitle(props.title)
  }
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    SetTitle(e.currentTarget.value)
    props.changeTitle(title)
  }

const onKeyPressHandler = (e:React.KeyboardEvent<HTMLInputElement>)=>{
  if(e.charCode === 13){
    props.changeTitle(title)
    SetTitle(props.title)
    SetEditMode(!EditMode)
  }
}
  return (<>
    {EditMode ?
      <input value={title} onKeyPress={onKeyPressHandler} onChange={onChangeHandler} onBlur={() => SetEditMode(!EditMode)} autoFocus />
      : <span onDoubleClick={onDoubleClickHandler}>{title}</span>}


  </>)
}
export default EditableSpan