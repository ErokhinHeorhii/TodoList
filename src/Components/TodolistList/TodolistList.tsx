import React, { useCallback, useEffect } from 'react'

import '../../App.css'
import { Grid, Paper } from '@mui/material'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { TaskStatuses } from '../../api/todolist-api'
import AddItemForm from '../../Components/AddItemForm'
import {
  addTaskTC,
  deleteTaskTC,
  TasksStateType,
  updateTaskTC,
} from '../../Reduserc/tasks-reducers'
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  getTodolistTC,
  TaskFilterType,
  TodolistDomainType,
} from '../../Reduserc/todolists-reducers'
import { AppRootStateType, useAppDispatch, useAppSelector } from '../../State/Store'
import TodoList from '../../TodoList'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>(
    state => state.todolists
  )
  const tasks = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector<boolean>(state => state.auth.isLoggedIn)

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return
    }
    dispatch(getTodolistTC())
  }, [])
  const deleteTodoList = useCallback(
    (todolistID: string) => {
      dispatch(deleteTodolistTC(todolistID))
    },
    [dispatch]
  )

  const removeTask = useCallback(
    (todolistId: string, taskId: string) => {
      dispatch(deleteTaskTC({ todolistId, taskId }))
    },
    [dispatch]
  )

  const changeTask = useCallback(
    (todolistID: string, buttonName: TaskFilterType) => {
      dispatch(changeTodolistFilterAC({ todolistId2: todolistID, newFilter: buttonName }))
    },
    [dispatch]
  )

  // UseState работает асинхронно
  const addTask = useCallback(
    (todoListId: string, title: string) => {
      dispatch(addTaskTC({ todoListId, title }))
    },
    [dispatch]
  )

  const addTodoList = useCallback(
    (title: string) => {
      let action = addTodolistTC(title)

      dispatch(action)
    },
    [dispatch]
  )

  const changeStatus = useCallback(
    (todolistId: string, taskId: string, status: TaskStatuses) => {
      dispatch(updateTaskTC({ todolistId, taskId, domainModel: { status } }))
    },
    [dispatch]
  )

  const changeTaskTitle = useCallback(
    (todolistId: string, taskId: string, title: string) => {
      dispatch(updateTaskTC({ todolistId, taskId, domainModel: { title } }))
    },
    [dispatch]
  )

  const changeTodoListTitle = useCallback(
    (id: string, title: string) => {
      dispatch(changeTodolistTitleTC({ id, title }))
    },
    [dispatch]
  )

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <Grid container style={{ padding: '20px' }}>
        <AddItemForm addItem={addTodoList} />
      </Grid>
      <Grid container>
        <Grid container spacing={3}>
          {todolists.map(item => {
            let taskForFilter = tasks[item.id]

            return (
              <Grid item key={item.id}>
                <Paper style={{ padding: '15px' }}>
                  <TodoList
                    todolist={item}
                    key={item.id}
                    task={taskForFilter}
                    removeTask={removeTask}
                    changeTask={changeTask}
                    addTask={addTask}
                    changeStatus={changeStatus}
                    deleteTodolist={deleteTodoList}
                    changeTaskTitle={changeTaskTitle}
                    changeTodolistTitle={changeTodoListTitle}
                    demo={demo}
                  />
                </Paper>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
    </div>
  )
}
