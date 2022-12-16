import React from "react"
import { Provider } from "react-redux"
import { combineReducers, legacy_createStore } from "redux"
import { v1 } from "uuid"
import {AppRootStateType} from "../../State/Store";
import {tasksReducer} from "../../Redusers/tasks-redusers";
import {TodolistDomainType, todolistId2, todolistsReducer} from "../../Redusers/todolists-redusers";
import {TaskPriorities, TaskStatuses, TodolistType} from "../../api/todolist-api";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todolists: todolistsReducer
})

const initialGlobalState : AppRootStateType= {
    todolists: [
        { id: 'todolistId1', title: 'What to learn', filter: 'all', addedDate: "", order:0 },
        { id: 'todolistId2', title: 'What to buy', filter: 'all', addedDate: "", order:0 }
    ],
    tasks: {
        ['todolistId1']: [
            { id: v1(), title: 'HTML&CSS', todoListId:'todolistId1', startDate:"", status:TaskStatuses.New,
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low },
            { id: v1(), title: 'JS', status: TaskStatuses.Completed, todoListId:'todolistId1' , startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low}
        ],
        ['todolistId2']: [
            { id: v1(), title: 'Milk', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New, },
            { id: v1(), title: 'React Book', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New,}
        ]
    }
}

export const storeBookStore = legacy_createStore(rootReducer, initialGlobalState)

export const ReduxStoreProviderDecorator = (storyFn: () => JSX.Element) => {
    return <Provider store={storeBookStore}>{storyFn()}</Provider>
}
