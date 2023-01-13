import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Dispatch } from 'redux'
import { v1 } from 'uuid'

import { todolistAPI, TodolistType } from '../api/todolist-api'
import { AppDispatch, AppThunk } from '../State/Store'
import { hadleServerAppError, hadleServerNetworkError } from '../utils/error-utils'

import { RequestStatusType, setAppStatusAC } from './app-reducer'

export let todolistId1 = v1()
export let todolistId2 = v1()

const initialState: Array<TodolistDomainType> = []

const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
    removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
      const index = state.findIndex(item => item.id === action.payload.todolistId)

      if (index > -1) {
        state.splice(index, 1)
      }
    },
    addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
      state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
    },
    changeTodolistTitleAC(
      state,
      action: PayloadAction<{
        todolistId2: string
        newTodolistTitle: string
      }>
    ) {
      const index = state.findIndex(item => item.id === action.payload.todolistId2)

      state[index].title = action.payload.newTodolistTitle
    },
    changeTodolistFilterAC(
      state,
      action: PayloadAction<{
        todolistId2: string
        newFilter: TaskFilterType
      }>
    ) {
      const index = state.findIndex(item => item.id === action.payload.todolistId2)

      state[index].filter = action.payload.newFilter
    },
    changeTodolistEntityStatusAC(
      state,
      action: PayloadAction<{
        id: string
        status: RequestStatusType
      }>
    ) {
      const index = state.findIndex(item => item.id === action.payload.id)

      if (index > -1) {
        state[index].entityStatus = action.payload.status
      }
    },
    setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
      return action.payload.todolists.map(item => ({
        ...item,
        filter: 'all',
        entityStatus: 'idle',
      }))
    },
  },
})

export const {
  removeTodolistAC,
  setTodolistsAC,
  addTodolistAC,
  changeTodolistFilterAC,
  changeTodolistTitleAC,
  changeTodolistEntityStatusAC,
} = slice.actions

export const todolistsReducer = slice.reducer

export const getTodolistTC = (): AppThunk => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  const promise = todolistAPI.getTodolist()

  promise
    .then(res => {
      dispatch(setTodolistsAC({ todolists: res.data }))
      dispatch(setAppStatusAC({ status: 'succeeded' }))
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
    })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'loading' }))
  const promise = todolistAPI.deleteTodolist(todolistId)

  promise
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(removeTodolistAC({ todolistId: todolistId }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'succeeded' }))
      } else {
        hadleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
      dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'failed' }))
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  const promise = todolistAPI.createTodolist(title)

  promise
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(addTodolistAC({ todolist: res.data.data.item }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      } else {
        hadleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
    })
}

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  const promise = todolistAPI.updateTodolist(id, title)

  promise
    .then(res => {
      if (res.data.resultCode === 0) {
        dispatch(changeTodolistTitleAC({ todolistId2: id, newTodolistTitle: title }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      } else {
        hadleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
    })
}

export type AddTodolistACType = ReturnType<typeof addTodolistAC>

export type SetTodolistsActionType = {
  type: 'SET-TODOLISTS'
  todolists: Array<TodolistType>
}

export type TaskFilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: TaskFilterType
  entityStatus: RequestStatusType
}
