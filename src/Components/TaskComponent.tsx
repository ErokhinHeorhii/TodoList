import React, {ChangeEvent, useCallback} from "react"
import {Checkbox, IconButton} from "@mui/material";
import EditableSpan from "./EditableSpan";
import {Delete} from "@mui/icons-material";
import {TaskStatuses, TaskType} from "../api/todolist-api";

type TaskComponentType={
    itemTask:TaskType
     todolistID:string
     removeTask:(taskId: string, todolistId: string) => void
     changeTaskStatus: ( todolistId: string, id: string, status: TaskStatuses) => void
     changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
 }

export const Task= React.memo((props:TaskComponentType)=>{

    const changeTaskTitle = useCallback((title: string) => {
        props.changeTaskTitle(props.todolistID, props.itemTask.id, title)
    },[props.changeTaskTitle,props.todolistID,props.itemTask.id])

    const changeStatusCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
        props.changeTaskStatus(props.todolistID, props.itemTask.id, e.currentTarget.checked ? TaskStatuses.Completed: TaskStatuses.New)
    }

    const removeTaskHandler =()=>{
        props.removeTask(props.todolistID, props.itemTask.id)
    }

    return (
        <li key={props.itemTask.id} className={props.itemTask.status === TaskStatuses.Completed ? 'isDone' : ""}>
            <Checkbox color='primary' onChange={changeStatusCheckbox} checked={props.itemTask.status === TaskStatuses.Completed}/>
            <EditableSpan title={props.itemTask.title} changeTitle={changeTaskTitle}/>
            <IconButton aria-label="delete" size="small"
                        onClick={removeTaskHandler}>
                <Delete fontSize="small"/>
            </IconButton>
        </li>
    )
})