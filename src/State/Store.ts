import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { AnyAction, combineReducers } from 'redux'
import thunkMiddleware, { ThunkAction, ThunkDispatch } from 'redux-thunk'

import { appReducer } from '../app/app-reducer'
import { tasksReducer } from '../Components/TaskComponent/tasks-reducers'
import { todolistsReducer } from '../Components/TodolistList/todolists-reducers'
import { authReducer } from '../features/Login/auth-reducers'

const rootReducer = combineReducers({
  tasks: tasksReducer,
  todolists: todolistsReducer,
  app: appReducer,
  auth: authReducer,
})

// export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunkMiddleware),
})
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppRootStateType,
  unknown,
  AnyAction
>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export type AppDispatchType = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatchType>()

//@ts-ignore
window.store = store
