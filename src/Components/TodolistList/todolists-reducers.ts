import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios/index'
import { v1 } from 'uuid'

import { todolistAPI, TodolistType } from '../../api/todolist-api'
import { RequestStatusType, setAppStatusAC } from '../../app/app-reducer'
import { hadleServerAppError, hadleServerNetworkError } from '../../utils/error-utils'

export let todolistId1 = v1()
export let todolistId2 = v1()

const initialState: Array<TodolistDomainType> = []

export const getTodolistTC = createAsyncThunk('todolist/getTodolist', async (data, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  try {
    const res = await todolistAPI.getTodolist()

    thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

    return { todolists: res.data }
  } catch (error) {
    const err = error as Error | AxiosError<{ error: string }>

    hadleServerNetworkError(err, thunkAPI.dispatch)

    return thunkAPI.rejectWithValue(null)
  }
})

export const deleteTodolistTC = createAsyncThunk(
  'todolist/deleteTodolist',
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))

    try {
      const res = await todolistAPI.deleteTodolist(todolistId)

      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
        thunkAPI.dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'succeeded' }))

        return { todolistId: todolistId }
      } else {
        hadleServerAppError(res.data, thunkAPI.dispatch)

        return thunkAPI.rejectWithValue(null)
      }
    } catch (error) {
      const err = error as Error | AxiosError<{ error: string }>

      hadleServerNetworkError(err, thunkAPI.dispatch)
      thunkAPI.dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'failed' }))

      return thunkAPI.rejectWithValue(null)
    }
  }
)

export const addTodolistTC = createAsyncThunk(
  'todolist/addTodolist',
  async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))

    try {
      const res = await todolistAPI.createTodolist(title)

      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

        return { todolist: res.data.data.item }
      } else {
        hadleServerAppError(res.data, thunkAPI.dispatch)

        return thunkAPI.rejectWithValue(null)
      }
    } catch (error) {
      const err = error as Error | AxiosError<{ error: string }>

      hadleServerNetworkError(err, thunkAPI.dispatch)

      return thunkAPI.rejectWithValue(null)
    }
  }
)

export const changeTodolistTitleTC = createAsyncThunk(
  'todolist/changeTodolistTitle',
  async ({ id, title }: { id: string; title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))

    try {
      const res = await todolistAPI.updateTodolist(id, title)

      if (res.data.resultCode === 0) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

        return { todolistId2: id, newTodolistTitle: title }
      } else {
        hadleServerAppError(res.data, thunkAPI.dispatch)

        return thunkAPI.rejectWithValue(null)
      }
    } catch (error) {
      const err = error as Error | AxiosError<{ error: string }>

      hadleServerNetworkError(err, thunkAPI.dispatch)

      return thunkAPI.rejectWithValue(null)
    }
  }
)

const slice = createSlice({
  name: 'todolists',
  initialState: initialState,
  reducers: {
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
  },
  extraReducers: bulder => {
    bulder.addCase(getTodolistTC.fulfilled, (state, action) => {
      return action.payload.todolists.map(item => ({
        ...item,
        filter: 'all',
        entityStatus: 'idle',
      }))
    })
    bulder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
      const index = state.findIndex(item => item.id === action.payload.todolistId)

      if (index > -1) {
        state.splice(index, 1)
      }
    })
    bulder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
    })
    bulder.addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
      const index = state.findIndex(item => item.id === action.payload.todolistId2)

      state[index].title = action.payload.newTodolistTitle
    })
  },
})

export const { changeTodolistFilterAC, changeTodolistEntityStatusAC } = slice.actions

export const todolistsReducer = slice.reducer

export type TaskFilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: TaskFilterType
  entityStatus: RequestStatusType
}
