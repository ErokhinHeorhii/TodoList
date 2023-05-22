import { ChangeEvent, useCallback } from 'react'

import { TaskStatuses } from '../../../api/todolist-api'
import { useAppDispatch } from '../../../State/Store'
import { TaskComponentType } from '../TaskComponent'
import { deleteTaskTC, updateTaskTC } from '../tasks-reducers'

export const useTask = (props: TaskComponentType) => {
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

  return {
    changeStatusCheckbox,
    changeTaskTitle,
    removeTaskHandler,
  }
}
