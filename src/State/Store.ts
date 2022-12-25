import {AnyAction, applyMiddleware, combineReducers} from 'redux'
import {tasksReducer} from "../Reduserc/tasks-reducers";
import {todolistsReducer} from "../Reduserc/todolists-reducers";
import { legacy_createStore} from 'redux'
import thunkMiddleware, {ThunkAction, ThunkDispatch} from "redux-thunk";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {appReducer} from "../Reduserc/app-reducer";
import {authReducer} from "../Reduserc/auth-reducers";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer,
    app:appReducer,
    auth: authReducer
})


export const store = legacy_createStore(rootReducer, applyMiddleware(thunkMiddleware))
export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatch = ThunkDispatch<AppRootStateType, unknown, AnyAction>
export type AppThunk<ReturnType= void>= ThunkAction<ReturnType, AppRootStateType, unknown, AnyAction>

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
export const useAppDispatch =()=>useDispatch<AppDispatch>()

//@ts-ignore
window.store = store