import {
    AddTodolistACType,
    SetTodolistsActionType,
} from "./todolists-reducers";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../api/todolist-api";
import {AppDispatch, AppRootStateType, AppThunk} from "../State/Store";
import {RequestStatusType, setAppErrorAC, setAppStatusAC, SetStatusACType} from "./app-reducer";
import {ThunkDispatch} from "redux-thunk";
import {hadleServerAppError, hadleServerNetworkError} from "../utils/error-utils";

export type SetTasksActionType = {
    type: 'SET_TASKS'
    payload: {
        tasks: Array<TaskDomainType>,
        todolistId: string
    }
}
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
type RemoveTaskACType = ReturnType<typeof removeTaskAC>
type AddTaskACType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusACType = ReturnType<typeof updateTaskAC>
type ChangeTaskTitleACType = ReturnType<typeof changeTaskTitleAC>
type RemoveTodolistACType = ReturnType<typeof removeTaskTodoListAC>
type changeTaskEntityStatusACType = ReturnType<typeof changeTaskEntityStatusAC>

type ActionType = RemoveTaskACType
    | AddTaskACType
    | ChangeTaskStatusACType
    | ChangeTaskTitleACType
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistsActionType
    | SetTasksActionType
    | changeTaskEntityStatusACType

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType
    & { entityStatus: RequestStatusType }

const initialState: TasksStateType = {
    // [todolistId1]: [
    //     {
    //         id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: todolistId1, startDate: "",
    //         order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
    //     },
    //     {
    //         id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: todolistId1, startDate: "",
    //         order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
    //     },
    // ],
    // [todolistId2]: [
    //     {
    //         id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: todolistId2, startDate: "",
    //         order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
    //     },
    //     {
    //         id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: todolistId2, startDate: "",
    //         order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
    //     },
    // ],
};

export enum ResultStatus {
    OK = 0,
    Error = 1,
    CAPTCHA = 10
}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .filter(item => item.id !== action.payload.taskId)
            }
        }
        case "ADD-TASK": {
            const stateCopy = {...state}
            const tasks = stateCopy[action.payload.task.todoListId];
            console.log("tasks", action.payload.task.todoListId)
            const newTasks = [action.payload.task, ...tasks];
            stateCopy[action.payload.task.todoListId] = newTasks;
            return stateCopy;
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(item => item.id === action.payload.taskId
                        ? {...item, ...action.payload.model}
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
                [action.todolist.id]: [],
            };
        }
        case "REMOVE-TODOLIST": {
            let stateCopy = {...state};
            delete stateCopy[action.payload.todolistId];
            return stateCopy;
        }

        case 'SET-TODOLISTS': {
            let copyState = {...state}
            action.todolists.forEach(item => {
                copyState[item.id] = []
            })
            return copyState
        }
        case "SET_TASKS": {
            const stateCopy = {...state}
            stateCopy[action.payload.todolistId] = action.payload.tasks
            return stateCopy
        }
        case "CHANGE-TASK-ENTITY-STATUS": {
            return {
                ...state, [action.payload.todolistId]: state[action.payload.todolistId]
                    .map(item => item.id === action.payload.tasksId ? {
                        ...item,
                        entityStatus: action.payload.entityStatus
                    } : {...item})
            }
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

export const addTaskAC = (task: TaskDomainType) => {
    return {
        type: "ADD-TASK",
        payload: {
            task
        }
    } as const
}

export const updateTaskAC = (todolistId: string, taskId: string, model: UpdateDomainTaskModelType) => {
    return {
        type: "UPDATE-TASK",
        payload: {
            todolistId,
            taskId,
            model
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

export const setTaskAC = (tasks: Array<TaskDomainType>, todolistId: string): SetTasksActionType => {
    return {
        type: "SET_TASKS",
        payload: {
            tasks,
            todolistId
        }
    } as const
}

export const changeTaskEntityStatusAC = (todolistId: string, tasksId: string, entityStatus: RequestStatusType) => {
    return {
        type: "CHANGE-TASK-ENTITY-STATUS",
        payload: {
            todolistId,
            tasksId,
            entityStatus
        }
    } as const
}

export const getTaskTC = (todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items.map(item => ({...item, entityStatus: "igle" as RequestStatusType}))
            dispatch(setTaskAC(tasks, todolistId))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTaskEntityStatusAC(todolistId,taskId, "loading" ))
    todolistAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if (res.data.resultCode === ResultStatus.OK) {
                dispatch(removeTaskAC(todolistId, taskId))
                dispatch(setAppStatusAC("succeeded"))
                dispatch(changeTaskEntityStatusAC(todolistId,taskId, "succeeded"))
            } else {
                hadleServerAppError(res.data, dispatch)
                dispatch(changeTaskEntityStatusAC(todolistId,taskId, "failed"))
            }
        }).catch((error) => {
        hadleServerNetworkError(error, dispatch)
        dispatch(changeTaskEntityStatusAC(todolistId,taskId, "failed"))
    })
}

export const addTaskTC = (todoListId: string, title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusAC("loading"))
    todolistAPI.createTask(todoListId, title)
        .then((res) => {
            if (res.data.resultCode === ResultStatus.OK) {
                const task = res.data.data.item
                dispatch(addTaskAC({...task, entityStatus: "idle"}))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                hadleServerAppError(res.data, dispatch)
            }
        }).catch((error) => {
        hadleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
    (dispatch: AppDispatch, getState: () => AppRootStateType) => {
        const task = getState().tasks[todolistId].find((item) =>
            item.id === taskId)
        if (task) {
            const apiModel: UpdateTaskModelType = {
                deadline: task.deadline,
                description: task.description,
                priority: task.priority,
                startDate: task.startDate,
                title: task.title,
                status: task.status,
                ...domainModel
            }

            dispatch(setAppStatusAC("loading"))
            todolistAPI.updateTask(todolistId, taskId, apiModel)
                .then((res) => {
                    if (res.data.resultCode === ResultStatus.OK) {
                        dispatch(updateTaskAC(todolistId, taskId, domainModel))
                        dispatch(setAppStatusAC("succeeded"))
                    } else {
                        hadleServerAppError(res.data, dispatch)
                    }
                }).catch((error) => {
                hadleServerNetworkError(error, dispatch)
            })
        }
    }