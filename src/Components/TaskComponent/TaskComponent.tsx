import React, { ChangeEvent, useCallback } from 'react'

import { Delete } from '@mui/icons-material'
import { Checkbox, IconButton } from '@mui/material'

import { TaskStatuses } from '../../api/todolist-api'
import EditableSpan from '../EditableSpan/EditableSpan'

import s from './TaskComponent.module.css'
import { TaskDomainType } from './tasks-reducers'

type TaskComponentType = {
  itemTask: TaskDomainType
  todolistID: string
  removeTask: (taskId: string, todolistId: string) => void
  changeTaskStatus: (todolistId: string, id: string, status: TaskStatuses) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
}

export const Task = React.memo((props: TaskComponentType) => {
  const changeTaskTitle = useCallback(
    (title: string) => {
      props.changeTaskTitle(props.todolistID, props.itemTask.id, title)
    },
    [props.changeTaskTitle, props.todolistID, props.itemTask.id]
  )

  const changeStatusCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    props.changeTaskStatus(
      props.todolistID,
      props.itemTask.id,
      e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
    )
  }

  const removeTaskHandler = () => {
    props.removeTask(props.todolistID, props.itemTask.id)
  }

  return (
    <li
      style={{ listStyle: 'none' }}
      key={props.itemTask.id}
      className={props.itemTask.status === TaskStatuses.Completed ? `${s.isDone} ${s.li}` : s.li}
    >
      <Checkbox
        color="primary"
        onChange={changeStatusCheckbox}
        checked={props.itemTask.status === TaskStatuses.Completed}
        disabled={props.itemTask.entityStatus === 'loading'}
      />
      <EditableSpan
        value={props.itemTask.title}
        changeTitle={changeTaskTitle}
        entityStatus={props.itemTask.entityStatus}
      />
      <IconButton
        aria-label="delete"
        size="small"
        onClick={removeTaskHandler}
        disabled={props.itemTask.entityStatus === 'loading'}
      >
        <Delete fontSize="small" />
      </IconButton>
    </li>
  )
})
