import { combineReducers } from 'redux'

import { appReducer } from '../app/app-reducer'
import { tasksReducer } from '../Components/TaskComponent'
import { todolistsReducer } from '../Components/TodolistList/todolists-reducers'
import { authReducer } from '../features/Login'

export const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})
