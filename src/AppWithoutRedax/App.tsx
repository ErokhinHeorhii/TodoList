import React from 'react'

import {
  AppBar,
  Button,
  Container,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material'

import '../app/App.css'
import { TaskStatuses } from '../api/todolist-api'
import AddItemForm from '../Components/AddItemForm/AddItemForm'
import TodoList from '../Components/TodolistList/TodoList/TodoList'

import { useTasks } from './hooks/useTasks'
import { useTodolist } from './hooks/useTodolist'

function App() {
  const { tasks, addTask, completlyDeleteTask, addStateForNewTodolist } = useTasks()
  const { todolists, deleteTodoList, changeTodoListTitle, addTodoList, changeTask } = useTodolist(
    tasks,
    completlyDeleteTask,
    addStateForNewTodolist
  )
  // const changeTask = (todolistID: string, value: TaskFilterType) => {
  //   let todolist = todolists.find(item => item.id === todolistID)
  //
  //   if (todolist) {
  //     todolist.filter = value
  //     setTodolists([...todolists])
  //   }
  // }
  // const changeStatus = (todolistID: string, taskId: string, status: TaskStatuses) => {
  //   // setTask(task.map(item=>item.id !== taskId ? item : {...item, isDone}))
  //   setTasks({
  //     ...tasks,
  //     [todolistID]: tasks[todolistID].map(item =>
  //       item.id === taskId ? { ...item, status } : item
  //     ),
  //   })
  // }

  // const changeTaskTitle = (todolistsID: string, taskId: string, title: string) => {
  //   setTasks({
  //     ...tasks,
  //     [todolistsID]: tasks[todolistsID].map(item =>
  //       item.id === taskId ? { ...item, title } : item
  //     ),
  //   })
  // }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu"></IconButton>
          <Typography variant="h6">TodoList</Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container fixed>
        <Grid container style={{ padding: '20px' }}>
          <AddItemForm addItem={addTodoList} />
        </Grid>
        <Grid container>
          <Grid container spacing={3}>
            {todolists.map(item => {
              let taskForFilter = tasks[item.id]

              if (item.filter === 'active') {
                taskForFilter = taskForFilter.filter(item => item.status === TaskStatuses.New)
              }
              if (item.filter === 'completed') {
                taskForFilter = taskForFilter.filter(item => item.status === TaskStatuses.Completed)
              }

              return (
                <Grid key={item.id} item>
                  <Paper style={{ padding: '15px' }}>
                    <TodoList
                      todolist={item}
                      // title={item.title}
                      key={item.id}
                      task={taskForFilter}
                      // removeTask={removeTask}
                      changeTask={changeTask}
                      addTask={addTask}
                      // changeStatus={changeStatus}
                      // filter={item.filter}
                      // todolistID={item.id}
                      deleteTodolist={deleteTodoList}
                      // changeTaskTitle={changeTaskTitle}
                      changeTodolistTitle={changeTodoListTitle}
                    />
                  </Paper>
                </Grid>
              )
            })}
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default App
