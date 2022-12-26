import {Dispatch} from "redux";
import {hadleServerAppError, hadleServerNetworkError} from "../utils/error-utils";
import {authApi} from "../api/todolist-api";
import {setIsLoggedInAC, SetIsLoggedInACType} from "./auth-reducers";

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

export const initialState = {
    status: 'idle' as RequestStatusType,
    error: null as null | string,
    isInitialized: false as boolean
}

export type InitialStateType = typeof initialState
export type SetErrorACType = ReturnType<typeof setAppErrorAC>
export type SetStatusACType = ReturnType<typeof setAppStatusAC>
export type setIsInitializedACType = ReturnType<typeof setIsInitializedAC>
type ActionsType = SetStatusACType | SetErrorACType | setIsInitializedACType | SetIsLoggedInACType

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/SET-INITIAL':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error: null | string) =>
    ({type: 'APP/SET-ERROR', error} as const)

export const setIsInitializedAC = (value: boolean) =>
    ({type: 'APP/SET-INITIAL', value} as const)

export const initializeTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC("loading"))
    authApi.me()
        .then((res) => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                hadleServerAppError(res.data, dispatch);
            }
        }).catch((error) => {
        hadleServerNetworkError(error, dispatch);
    }).finally(() => {
        dispatch(setIsInitializedAC(true))
    })
}