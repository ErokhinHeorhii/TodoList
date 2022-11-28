import {v1} from "uuid";
import {TaskFilterType} from "../App";
import {TodolistType} from "../TodoList";

type TsarType =
    | removeTaskACType
    | addTodolistACType
    | changeTodolistTitleACType
    | changeTodolistFilterACType;

type removeTaskACType = ReturnType<typeof removeTodolistAC>;
export type addTodolistACType = ReturnType<typeof addTodolistAC>;
type changeTodolistTitleACType = ReturnType<typeof changeTodolistTitleAC>;
type changeTodolistFilterACType = ReturnType<typeof changeTodolistFilterAC>;

export let todolistId1 = v1();
export let todolistId2 = v1();

const initialState: Array<TodolistType> = [
    { id: todolistId1, title: "What to learn", filter: "all" },
    { id: todolistId2, title: "What to buy", filter: "all" },
];

export const todolistsReducer = (
    state: Array<TodolistType> = initialState,
    action: TsarType
): Array<TodolistType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST":
            return state.filter((item) => item.id !== action.payload.id);
        case "ADD-TODOLIST":
            return [
                ...state,
                {
                    id: action.payload.todolistId,
                    title: action.payload.title,
                    filter: "all",
                },
            ];

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

export const addTodolistAC = (newTodolistTitle: string) => {
    return {
        type: "ADD-TODOLIST",
        payload: {
            title: newTodolistTitle,
            todolistId: v1()
        },
    } as const;
};

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

