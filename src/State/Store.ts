import { combineReducers} from 'redux'
import {tasksReducer} from "../Redusers/tasks-redusers";
import {todolistsReducer} from "../Redusers/todolists-redusers";
import { legacy_createStore} from 'redux'

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})
export const store = legacy_createStore(rootReducer)
export type AppRootStateType = ReturnType<typeof rootReducer>

//@ts-ignore
window.store = store