import React, {ChangeEvent, useState} from "react";
import {TextField} from "@mui/material";
import {RequestStatusType} from "../Reduserc/app-reducer";

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
        if (e.key === "Enter") {
            props.changeTitle(title)
            setEditMode(false)
        }
    }

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.value)
    }

    const activateViewMode = () => {
        props.changeTitle(title);
        setEditMode(false);
    }

    return (<>
        {editMode
            ? props.entityStatus !== "loading"
                ? <TextField value={title}
                             onKeyPress={onKeyPressHandler}
                             variant="outlined"
                             onChange={onChangeHandler}
                             onBlur={activateViewMode}
                             size={"small"}
                             autoFocus/>
                : <span onDoubleClick={activateEditMode}>{props.value}</span>
        : <span onDoubleClick={activateEditMode}>{props.value}</span>}
    </>)
})
export default EditableSpan