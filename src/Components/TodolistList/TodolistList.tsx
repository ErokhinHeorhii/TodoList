import React, { useCallback, useEffect } from 'react'

import '../../app/App.css'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'

import { selectIsLoggedIn } from '../../features/Login'
import { useAppDispatch, useAppSelector } from '../../State/Store'
import AddItemForm from '../AddItemForm/AddItemForm'
import { addTaskTC } from '../TaskComponent/tasks-reducers'

import TodoList from './TodoList/TodoList'
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  getTodolistTC,
  TaskFilterType,
} from './todolists-reducers'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useAppSelector(state => state.todolists)
  const tasks = useAppSelector(state => state.tasks)
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

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
      let action = addTodolistTC(title)

      dispatch(action)
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
                <Paper style={{ padding: '15px' }} elevation={3}>
                  <TodoList
                    todolist={item}
                    key={item.id}
                    task={taskForFilter}
                    changeTask={changeTask}
                    addTask={addTask}
                    deleteTodolist={deleteTodoList}
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
