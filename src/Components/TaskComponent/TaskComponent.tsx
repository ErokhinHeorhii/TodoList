import React from 'react'

import { Delete } from '@mui/icons-material'
import { Checkbox, IconButton } from '@mui/material'

import { TaskStatuses } from '../../api/todolist-api'
import EditableSpan from '../EditableSpan/EditableSpan'

import { useTask } from './hooks/useTask'
import s from './TaskComponent.module.css'
import { TaskDomainType } from './tasks-reducers'

export type TaskComponentType = {
  itemTask: TaskDomainType
  todolistID: string
}

export const Task = React.memo((props: TaskComponentType) => {
  const { changeStatusCheckbox, changeTaskTitle, removeTaskHandler } = useTask(props)

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
