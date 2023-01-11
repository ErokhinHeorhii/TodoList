import {Dispatch} from "redux";
import {setAppStatusAC} from "./app-reducer";
import {hadleServerAppError, hadleServerNetworkError} from "../utils/error-utils";
import {authApi, LoginParamsType} from "../api/todolist-api";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}
const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{value:boolean}>) {
            state.isLoggedIn = action.payload.value
            // {...state, isLoggedIn: action.value}
        }
    }
})

export const {setIsLoggedInAC} = slice.actions
export const authReducer = slice.reducer;
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

export const loginTC = (data: LoginParamsType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:"loading"}))
    authApi.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:true}))
                dispatch(setAppStatusAC({status:"succeeded"}))
            } else {
                hadleServerAppError(res.data, dispatch);
            }
        })
        .catch((error) => {
            hadleServerNetworkError(error, dispatch);
        })
}

export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status:"loading"}))
    authApi.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value:false}))
                dispatch(setAppStatusAC({status:"succeeded"}))
            } else {
                hadleServerAppError(res.data, dispatch)
            }
        })
        .catch((error) => {
            hadleServerNetworkError(error, dispatch)
        })
}

// type InitialStateType = typeof initialState

// export type SetIsLoggedInACType = ReturnType<typeof setIsLoggedInAC>
//
// type ActionsType =
//     SetIsLoggedInACType
//     | SetStatusACType
//     | SetErrorACType
