import {v1} from "uuid";
import {TasksStateType} from "../App";
import {addTodolistACType, todolistId1, todolistId2} from "./todolists-redusers";
import {TaskPriorities, TaskStatuses, TaskType} from "../api/todolist-api";

type removeTaskACType = ReturnType<typeof removeTaskAC>
type addTaskACType = ReturnType<typeof addTaskAC>
type changeTaskStatusACType = ReturnType<typeof changeTaskStatusAC>
type changeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
type removeTodolistACType = ReturnType<typeof removeTaskTodoListAC>

type ActionType = removeTaskACType
    | addTaskACType
    | changeTaskStatusACType
    | changeTaskTitleACType
    | addTodolistACType
    | removeTodolistACType

const initialState: TasksStateType = {
    [todolistId1]: [
        { id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId:todolistId1 , startDate:"",
            order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
        { id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId:todolistId1 , startDate:"",
            order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
    ],
    [todolistId2]: [
        { id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId:todolistId2, startDate:"",
            order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
        { id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId:todolistId2, startDate:"",
            order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low },
    ],
};

export const tasksReducer = (state: TasksStateType= initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .filter(item => item.id !== action.payload.taskId)
            }
        }
        case "ADD-TASK": {
            const newTask: TaskType= {
                id: v1(),
                title: action.payload.title,
                todoListId:action.payload.todolistId,
                startDate:"",
                order:0,
                addedDate:"",
                deadline:"",
                description:"",
                priority: TaskPriorities.Low,
                status: TaskStatuses.New
            };
            return {
                ...state,
                [action.payload.todolistId]: [newTask, ...state[action.payload.todolistId]]
            }
        }
        case "CHANGE-TASK-STATUS": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(item => item.id === action.payload.taskId
                        ? {...item, status: action.payload.status}
                        : item)
            }
        }
        case "CHANGE-TASK-TITLE": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(item => item.id === action.payload.taskId
                        ? {...item, title: action.payload.title}
                        : item)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                // eslint-disable-next-line no-useless-computed-key
                [action.payload.todolistId]: [],
            };
        }
        case "REMOVE-TODOLIST": {
            let stateCopy = {...state};
            delete stateCopy[action.payload.todolistId];
            return stateCopy;
        }

        default:
            return state;
    }
}


export const removeTaskAC = (todolistId: string, taskId: string) => {
    return {
        type: "REMOVE-TASK",
        payload: {
            todolistId,
            taskId
        }
    } as const
}

export const addTaskAC = (todolistId: string, title: string) => {
    return {
        type: "ADD-TASK",
        payload: {
            todolistId,
            title
        }
    } as const
}

export const changeTaskStatusAC = (todolistId: string, taskId: string, status: TaskStatuses) => {
    return {
        type: "CHANGE-TASK-STATUS",
        payload: {
            todolistId,
            taskId,
            status
        }
    } as const
}

export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => {
    return {
        type: "CHANGE-TASK-TITLE",
        payload: {
            todolistId,
            taskId,
            title
        }
    } as const
}

export const removeTaskTodoListAC = (todolistId: string) => {
    return {
        type: "REMOVE-TODOLIST",
        payload: {
            todolistId,
        }
    } as const
}

