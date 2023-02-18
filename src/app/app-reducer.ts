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
//     (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {...state, status: action.status}
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/SET-INITIAL':
//             return {...state, isInitialized: action.value}
//         default:
//             return state
//     }
// }

// export const setAppStatusAC = (status: RequestStatusType) =>
//     ({type: 'APP/SET-STATUS', status} as const)
//
// export const setAppErrorAC = (error: null | string) =>
//     ({type: 'APP/SET-ERROR', error} as const)
//
// export const setIsInitializedAC = (value: boolean) =>
//     ({type: 'APP/SET-INITIAL', value} as const)

// export const _initializeTC = () => (dispatch: Dispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   authApi
//     .me()
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
//     .finally(() => {
//       dispatch(setIsInitializedAC({ isInitialized: true }))
//     })
// }

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
//
// export type InitialStateType = typeof initialState
// export type SetErrorACType = ReturnType<typeof setAppErrorAC>
// export type SetStatusACType = ReturnType<typeof setAppStatusAC>
// export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>
// type ActionsType = SetStatusACType | SetErrorACType | setIsInitializedACType | SetIsLoggedInACType
