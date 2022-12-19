import {AnyAction, applyMiddleware, combineReducers} from 'redux'
import {tasksReducer} from "../Redusers/tasks-redusers";
import {todolistsReducer} from "../Redusers/todolists-redusers";
import { legacy_createStore} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {useDispatch} from "react-redux";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))
export type AppRootStateType = ReturnType<typeof rootReducer>
export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export type AppThunk<ReturnType= void>= ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>
export type  ThunkAppDispatchThunk = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch =()=>useDispatch<ThunkAppDispatchThunk>()
//@ts-ignore
window.store = store