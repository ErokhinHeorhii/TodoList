import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios/index'
import { v1 } from 'uuid'

import { todolistAPI, TodolistType } from '../api/todolist-api'
import { hadleServerAppError, hadleServerNetworkError } from '../utils/error-utils'

import { RequestStatusType, setAppStatusAC } from './app-reducer'

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
    // removeTodolistAC(state, action: PayloadAction<{ todolistId: string }>) {
    //   const index = state.findIndex(item => item.id === action.payload.todolistId)
    //
    //   if (index > -1) {
    //     state.splice(index, 1)
    //   }
    // },
    // addTodolistAC(state, action: PayloadAction<{ todolist: TodolistType }>) {
    //   state.unshift({ ...action.payload.todolist, filter: 'all', entityStatus: 'idle' })
    // },
    // changeTodolistTitleAC(
    //   state,
    //   action: PayloadAction<{
    //     todolistId2: string
    //     newTodolistTitle: string
    //   }>
    // ) {
    //   const index = state.findIndex(item => item.id === action.payload.todolistId2)
    //
    //   state[index].title = action.payload.newTodolistTitle
    // },
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
    // setTodolistsAC(state, action: PayloadAction<{ todolists: Array<TodolistType> }>) {
    //   return action.payload.todolists.map(item => ({
    //     ...item,
    //     filter: 'all',
    //     entityStatus: 'idle',
    //   }))
    // },
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

// export const _getTodolistTC = (): AppThunk => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   const promise = todolistAPI.getTodolist()
//
//   promise
//     .then(res => {
//       dispatch(setTodolistsAC({ todolists: res.data }))
//       dispatch(setAppStatusAC({ status: 'succeeded' }))
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// export const _deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'loading' }))
//   const promise = todolistAPI.deleteTodolist(todolistId)
//
//   promise
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(removeTodolistAC({ todolistId: todolistId }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'succeeded' }))
//       } else {
//         hadleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//       dispatch(changeTodolistEntityStatusAC({ id: todolistId, status: 'failed' }))
//     })
// }

// export const _addTodolistTC = (title: string) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   const promise = todolistAPI.createTodolist(title)
//
//   promise
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(addTodolistAC({ todolist: res.data.data.item }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       } else {
//         hadleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// export const _changeTodolistTitleTC = (id: string, title: string) => (dispatch: AppDispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   const promise = todolistAPI.updateTodolist(id, title)
//
//   promise
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(changeTodolistTitleAC({ todolistId2: id, newTodolistTitle: title }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       } else {
//         hadleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// export type AddTodolistACType = ReturnType<typeof addTodolistAC>
//
// export type SetTodolistsActionType = {
//   type: 'SET-TODOLISTS'
//   todolists: Array<TodolistType>
// }

export type TaskFilterType = 'all' | 'active' | 'completed'
export type TodolistDomainType = TodolistType & {
  filter: TaskFilterType
  entityStatus: RequestStatusType
}
