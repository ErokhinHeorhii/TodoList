import { useCallback, useEffect } from 'react'

import { selectIsLoggedIn } from '../../../features/Login'
import { useAppDispatch, useAppSelector } from '../../../State/Store'
import { addTaskTC } from '../../TaskComponent/tasks-reducers'
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  getTodolistTC,
  TaskFilterType,
} from '../todolists-reducers'

export const useTodolist = (demo: boolean) => {
  const todolists = useAppSelector(state => state.todolists)
  const tasks = useAppSelector(state => state.tasks)
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    if (todolists.length === 0) {
      dispatch(getTodolistTC())
    }
  }, [])

  const deleteTodoList = useCallback(
    (todolistID: string) => {
      dispatch(deleteTodolistTC(todolistID))
    },
    [dispatch]
  )

  const changeTask = useCallback(
    (todolistID: string, buttonName: TaskFilterType) => {
      dispatch(changeTodolistFilterAC({ todolistId2: todolistID, newFilter: buttonName }))
    },
    [dispatch]
  )

  const addTask = useCallback(
    (todoListId: string, title: string) => {
      dispatch(addTaskTC({ todoListId, title }))
    },
    [dispatch]
  )

  const addTodoList = useCallback(
    (title: string) => {
      dispatch(addTodolistTC(title))
    },
    [dispatch]
  )

  const changeTodoListTitle = useCallback(
    (id: string, title: string) => {
      dispatch(changeTodolistTitleTC({ id, title }))
    },
    [dispatch]
  )

  return {
    todolists,
    tasks,
    addTodoList,
    changeTask,
    addTask,
    deleteTodoList,
    changeTodoListTitle,
    isLoggedIn,
  }
}
