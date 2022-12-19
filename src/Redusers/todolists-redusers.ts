import {v1} from "uuid";
import {todolistAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppDispatch, AppThunk} from "../State/Store";

type ActionType =
    | RemoveTaskACType
    | AddTodolistACType
    | ChangeTodolistTitleACType
    | ChangeTodolistFilterACType
    | SetTodolistsActionType;

type RemoveTaskACType = ReturnType<typeof removeTodolistAC>;
export type AddTodolistACType = ReturnType<typeof addTodolistAC>;
type ChangeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>;
type ChangeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>;
export type SetTodolistsActionType = {
    type: 'SET-TODOLISTS'
    todolists: Array<TodolistType>
}

export type TaskFilterType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
    filter: TaskFilterType
}


export let todolistId1 = v1();
export let todolistId2 = v1();

const initialState: Array<TodolistDomainType> = [
    {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0},
    {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order: 1},
];

export const todolistsReducer = (
    state: Array<TodolistDomainType> = initialState,
    action: ActionType
): Array<TodolistDomainType> => {
    switch (action.type) {

        case "REMOVE-TODOLIST":
            return state.filter((item) => item.id !== action.payload.id);

        case 'ADD-TODOLIST': {
            const newTodoList: TodolistDomainType = {...action.todolist, filter: "all"}
            return [newTodoList, ...state]
        }

        case "CHANGE-TODOLIST-TITLE":
            return state.map((item) =>
                item.id === action.payload.id
                    ? {...item, title: action.payload.title}
                    : item
            );

        case "CHANGE-TODOLIST-FILTER":
            return state.map((item) =>
                item.id === action.payload.id
                    ? {...item, filter: action.payload.filter}
                    : item
            );

        case 'SET-TODOLISTS':
            return action.todolists.map(item => ({...item, filter: "all"}))

        default:
            return state;
    }
};

export const removeTodolistAC = (todolistId: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {id: todolistId},
    } as const;
};

export const addTodolistAC = (todolist: TodolistType) => {
    return {
        type: 'ADD-TODOLIST', todolist
    } as const
}

export const changeTodolistTitleAC = (
    todolistId2: string,
    newTodolistTitle: string
) => {
    return {
        type: "CHANGE-TODOLIST-TITLE",
        payload: {id: todolistId2, title: newTodolistTitle},
    } as const;
};

export const changeTodolistFilterAC = (
    todolistId2: string,
    newFilter: TaskFilterType
) => {
    return {
        type: "CHANGE-TODOLIST-FILTER",
        payload: {
            id: todolistId2,
            filter: newFilter,
        },
    } as const;
};

export const setTodolistsAC = (
    todolists: Array<TodolistType>): SetTodolistsActionType => {
    return {
        type: 'SET-TODOLISTS',
        todolists
    } as const
}

export const getTodolistTC = (): AppThunk => (dispatch) => {
    const promise = todolistAPI.getTodolist()
    promise.then((res) => {
        dispatch(setTodolistsAC(res.data))
    })
}

export const deleteTodolistTC = (todolistId: string) => (dispatch: Dispatch) => {
    const promise = todolistAPI.deleteTodolist(todolistId)
    promise.then((res) => {
        dispatch(removeTodolistAC(todolistId))
    })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
    const promise = todolistAPI.createTodolist(title)
    promise.then((res) => {
        dispatch(addTodolistAC(res.data.data.item))
    })
}

export const changeTodolistTitleTC = (id: string, title: string) => (dispatch: AppDispatch) => {
    const promise = todolistAPI.updateTodolist(id, title)
    promise.then((res) => {
        console.log(title)
        dispatch(changeTodolistTitleAC(id, title))
    })

}