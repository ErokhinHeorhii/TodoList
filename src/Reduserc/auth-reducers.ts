import {Dispatch} from "redux";
import {setAppStatusAC, SetErrorACType, SetStatusACType} from "./app-reducer";
import {hadleServerAppError, hadleServerNetworkError} from "../utils/error-utils";
import {authApi, LoginParamsType} from "../api/todolist-api";

const initialState = {
    isLoggedIn: false
}
type InitialStateType = typeof initialState

 export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>

type ActionsType =
    SetIsLoggedInACType
    | SetStatusACType
    | SetErrorACType

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authApi.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                hadleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            hadleServerNetworkError(error, dispatch);
        })
}

export const logoutTC = () => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(false))
                dispatch(setAppStatusAC('succeeded'))
            } else {
                hadleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            hadleServerNetworkError(error, dispatch)
        })
}
