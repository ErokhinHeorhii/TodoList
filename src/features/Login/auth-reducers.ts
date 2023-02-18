import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import { authApi, FieldErrorType, LoginParamsType } from '../../api/todolist-api'
import { setAppStatusAC } from '../../app/app-reducer'
import { hadleServerAppError, hadleServerNetworkError } from '../../utils/error-utils'

export const loginTC = createAsyncThunk<
  { value: boolean },
  LoginParamsType,
  {
    rejectValue: {
      errors: Array<string>
      fieldsErrors?: Array<FieldErrorType>
    }
  }
>('auth/login', async (data, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))

  try {
    const res = await authApi.login(data)

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

      return { value: true }
    } else {
      hadleServerAppError(res.data, thunkAPI.dispatch)

      return thunkAPI.rejectWithValue({
        errors: res.data.messages,
        fieldsErrors: res.data.fieldsErrors,
      })
    }
  } catch (error) {
    const err = error as Error | AxiosError<{ error: string }>

    hadleServerNetworkError(err, thunkAPI.dispatch)

    return thunkAPI.rejectWithValue({
      errors: [err.message],
      fieldsErrors: undefined,
    })
  }
})

export const logoutTC = createAsyncThunk('auth/logout', async (data, thunkAPI) => {
  thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
  try {
    const res = await authApi.logout()

    if (res.data.resultCode === 0) {
      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

      return { value: false }
    } else {
      hadleServerAppError(res.data, thunkAPI.dispatch)
    }
  } catch (error) {
    const err = error as Error | AxiosError<{ error: string }>

    hadleServerNetworkError(err, thunkAPI.dispatch)
  }
})

const slice = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
  },
  reducers: {
    setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
      state.isLoggedIn = action.payload.value
    },
  },
  extraReducers: builder => {
    builder.addCase(loginTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.value
    })
    builder.addCase(logoutTC.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload!.value
    })
  },
})

export const { setIsLoggedInAC } = slice.actions
export const authReducer = slice.reducer
