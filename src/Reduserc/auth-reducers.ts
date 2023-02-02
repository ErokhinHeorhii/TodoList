import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { Dispatch } from 'redux'

import { authApi, FieldErrorType, LoginParamsType } from '../api/todolist-api'
import { hadleServerAppError, hadleServerNetworkError } from '../utils/error-utils'

import { setAppStatusAC } from './app-reducer'

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
//     (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'login/SET-IS-LOGGED-IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }

// export const setIsLoggedInAC = (value: boolean) =>
//     ({type: 'login/SET-IS-LOGGED-IN', value} as const)

// export const _loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   authApi
//     .login(data)
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC({ value: true }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       } else {
//         hadleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// export const _logoutTC = () => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   authApi
//     .logout()
//     .then(res => {
//       if (res.data.resultCode === 0) {
//         dispatch(setIsLoggedInAC({ value: false }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       } else {
//         hadleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// type InitialStateType = typeof initialState

// export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
//
// type ActionsType =
//     SetIsLoggedInACType
//     | SetStatusACType
//     | SetErrorACType
