import React from 'react'

import '../../app/App.css'
import { Grid, Paper } from '@mui/material'
import { Navigate } from 'react-router-dom'

import AddItemForm from '../AddItemForm/AddItemForm'

import { useTodolist } from './hooks/useTodolist'
import TodoList from './TodoList/TodoList'

type PropsType = {
  demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const {
    todolists,
    tasks,
    addTodoList,
    changeTask,
    addTask,
    deleteTodoList,
    changeTodoListTitle,
    isLoggedIn,
  } = useTodolist(false)

  if (!isLoggedIn) {
    return <Navigate to="/login" />
  }

  return (
    <div>
      <Paper style={{ padding: '15px', width: '17rem', margin: '2rem auto' }}>
        <AddItemForm addItem={addTodoList} />
      </Paper>
      <Grid container spacing={3} style={{ margin: '0 auto', width: '100%' }}>
        {todolists.map(item => {
          let taskForFilter = tasks[item.id]

          return (
            <Grid item key={item.id}>
              <Paper style={{ padding: '15px', width: '280px', marginLeft: '30px' }} elevation={3}>
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
    </div>
  )
}
