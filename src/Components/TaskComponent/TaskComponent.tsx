import React, { ChangeEvent, useCallback } from 'react'

import { Delete } from '@mui/icons-material'
import { Checkbox, IconButton } from '@mui/material'

import { TaskStatuses } from '../../api/todolist-api'
import { useAppDispatch } from '../../State/Store'
import EditableSpan from '../EditableSpan/EditableSpan'

import s from './TaskComponent.module.css'
import { deleteTaskTC, TaskDomainType, updateTaskTC } from './tasks-reducers'

type TaskComponentType = {
  itemTask: TaskDomainType
  todolistID: string
}

export const Task = React.memo((props: TaskComponentType) => {
  const dispatch = useAppDispatch()

  const changeTaskTitle = useCallback(
    (title: string) => {
      const todolistId = props.todolistID
      const taskId = props.itemTask.id

      dispatch(updateTaskTC({ todolistId, taskId, domainModel: { title } }))
    },
    [props.todolistID, props.itemTask.id]
  )

  const changeStatusCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
    const todolistId = props.todolistID
    const taskId = props.itemTask.id
    const status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New

    dispatch(updateTaskTC({ todolistId, taskId, domainModel: { status } }))
  }

  const removeTaskHandler = () => {
    const todolistId = props.todolistID
    const taskId = props.itemTask.id

    dispatch(deleteTaskTC({ todolistId, taskId }))
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
