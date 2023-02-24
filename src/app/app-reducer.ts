import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios/index'

import { authApi } from '../api/todolist-api'
import { setIsLoggedInAC } from '../features/Login/auth-reducers'
import { hadleServerAppError, hadleServerNetworkError } from '../utils/error-utils'

export const initialState = {
  status: 'idle' as RequestStatusType,
  error: null as null | string,
  isInitialized: false as boolean,
}
export const initializeTC = createAsyncThunk('app/initializeApp', async (data, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  try {
    const res = await authApi.me()

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setIsLoggedInAC({ value: true }))
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
    } else {
      hadleServerAppError(res.data, thunkAPI.dispatch)
    }
  } catch (error) {
    const err = error as Error | AxiosError<{ error: string }>

    hadleServerNetworkError(err, thunkAPI.dispatch)
  }
})

const slice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppStatusAC(state, action: PayloadAction<{ status: RequestStatusType }>) {
      state.status = action.payload.status
    },
    setAppErrorAC(state, action: PayloadAction<{ error: null | string }>) {
      state.error = action.payload.error
    },
  },
  extraReducers: bulder => {
    bulder.addCase(initializeTC.fulfilled, state => {
      state.isInitialized = true
    })
  },
})

export const { setAppErrorAC, setAppStatusAC } = slice.actions

export const appReducer = slice.reducer

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
