import React, { useReducer } from 'react'

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
import { v1 } from 'uuid'

import './App.css'
import { TaskPriorities, TaskStatuses, TaskType } from './api/todolist-api'
import AddItemForm from './Components/AddItemForm'
import { addTaskTC, deleteTaskTC, tasksReducer, updateTaskTC } from './Reduserc/tasks-reducers'
import {
  addTodolistTC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  todolistsReducer,
} from './Reduserc/todolists-reducers'
import TodoList from './TodoList'

export type TaskFilterType = 'all' | 'active' | 'completed'

export type TasksStateType = {
  [key: string]: Array<TaskType>
}

// class components
function App() {
  let todolistID1 = v1()
  let todolistID2 = v1()

  let [todolists, dispatchTodolists] = useReducer(todolistsReducer, [
    {
      id: todolistID1,
      title: 'What to learn',
      filter: 'all',
      order: 0,
      addedDate: '',
      entityStatus: 'idle',
    },
    {
      id: todolistID2,
      title: 'What to buy',
      filter: 'completed',
      order: 0,
      addedDate: '',
      entityStatus: 'idle',
    },
  ])

  let [tasks, dispatchTasks] = useReducer(tasksReducer, {
    [todolistID1]: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.New,
        todoListId: todolistID1,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.New,
        todoListId: todolistID1,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
    [todolistID2]: [
      {
        id: v1(),
        title: 'HTML&CSS2',
        status: TaskStatuses.New,
        todoListId: todolistID2,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: 'JS2',
        status: TaskStatuses.New,
        todoListId: todolistID2,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
  })
  const deleteTodoList = (todolistID: string) => {
    dispatchTodolists(deleteTodolistTC.fulfilled({ todolistId: todolistID }, ' ', todolistID))
  }

  const removeTask = (todolistId: string, taskId: string) => {
    dispatchTasks(deleteTaskTC.fulfilled({ todolistId, taskId }, ' ', { todolistId, taskId }))
  }
  const changeTask = (todolistID: string, buttonName: TaskFilterType) => {
    dispatchTodolists(changeTodolistFilterAC({ todolistId2: todolistID, newFilter: buttonName }))
  }
  // UseState работает асинхронно
  const addTask = (todolistID: string, title: string) => {
    const task = {
      description: 'string',
      title: 'string',
      status: TaskStatuses.New,
      priority: TaskPriorities.Low,
      startDate: 'string',
      deadline: 'string',
      id: 'string',
      todoListId: 'string',
      order: 0,
      addedDate: 'string',
      entityStatus: 'idle',
    }

    dispatchTasks(addTaskTC.fulfilled({ task }, ' ', task))
  }

  const addTodoList = (title: string) => {
    let action = addTodolistTC.fulfilled(
      {
        //@ts-ignore
        id: v1(),
        addedDate: '',
        order: 0,
        title: title,
      },
      ' ',
      title
    )

    dispatchTodolists(action)
    dispatchTasks(action)
  }

  const changeStatus = (todolistID: string, taskId: string, status: TaskStatuses) => {
    const model = { todolistId: todolistID, taskId: taskId, domainModel: { status } }

    dispatchTasks(updateTaskTC.fulfilled(model, ' ', model))
  }

  const changeTaskTitle = (todolistsID: string, taskId: string, title: string) => {
    const model = { todolistId: todolistsID, taskId: taskId, domainModel: { title } }

    dispatchTasks(updateTaskTC.fulfilled(model, ' ', model))
  }

  const changeTodoListTitle = (id: string, title: string) => {
    dispatchTodolists(
      changeTodolistTitleTC.fulfilled({ todolistId2: id, newTodolistTitle: title }, ' ', {
        id,
        title,
      })
    )
  }

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
                      key={item.id}
                      task={taskForFilter}
                      removeTask={removeTask}
                      changeTask={changeTask}
                      addTask={addTask}
                      changeStatus={changeStatus}
                      deleteTodolist={deleteTodoList}
                      changeTaskTitle={changeTaskTitle}
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
