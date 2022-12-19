import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";

type EditableSpanType = {
    title: string
    changeTitle: (newTitle: string) => void
}
const EditableSpan = (props: EditableSpanType) => {
    const [editMode, setEditMode] = useState<boolean>(false)

    const [title, setTitle] = useState<string>(props.title)

    const onDoubleClickHandler = () => {
        setEditMode(true)
        setTitle(props.title)
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            props.changeTitle(title)
            setEditMode(false)
        }
    }

    const activateViewMode = () => {
        props.changeTitle(title);
        setEditMode(false);
    }

    return (<>
        {editMode ?
            <TextField value={title}
                       onKeyPress={onKeyPressHandler}
                       variant="outlined"
                       onChange={onChangeHandler}
                       onBlur={activateViewMode}
                       size={"small"}
                       autoFocus/>
            : <span onDoubleClick={onDoubleClickHandler}>{title}</span>}
    </>)
}
export default EditableSpan