import React from 'react'

import { Provider } from 'react-redux'
import { applyMiddleware, combineReducers, legacy_createStore } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { v1 } from 'uuid'

import { TaskPriorities, TaskStatuses } from '../../api/todolist-api'
import { appReducer } from '../../app/app-reducer'
import { tasksReducer } from '../../Components/TaskComponent/tasks-reducers'
import { todolistId2, todolistsReducer } from '../../Components/TodolistList/todolists-reducers'
import { AppRootStateType } from '../../State/Store'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
})

const initialGlobalState: AppRootStateType = {
  todolists: [
    {
      id: 'todolistId1',
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: 'todolistId2',
      title: 'What to buy',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'loading',
    },
  ],
  tasks: {
    ['todolistId1']: [
      {
        id: v1(),
        title: 'HTML&CSS',
        todoListId: 'todolistId1',
        startDate: '',
        status: TaskStatuses.New,
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
        status: TaskStatuses.Completed,
        todoListId: 'todolistId1',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
    ['todolistId2']: [
      {
        id: v1(),
        title: 'Milk',
        todoListId: 'todolistId2',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.New,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: 'React Book',
        todoListId: 'todolistId2',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.New,
        entityStatus: 'idle',
      },
    ],
  },
  app: {
    error: null,
    status: 'idle',
    isInitialized: false,
  },
  auth: {
    isLoggedIn: false,
  },
}

export const storeBookStore = legacy_createStore(
  rootReducer,
  initialGlobalState,
  applyMiddleware(thunkMiddleware)
)

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
  return <Provider store={storeBookStore}>{storyFn()}</Provider>
}
