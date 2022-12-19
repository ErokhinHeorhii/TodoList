import {v1} from "uuid";
import {TasksStateType} from "../App";
import {AddTodolistACType, SetTodolistsActionType, todolistId1, todolistId2} from "./todolists-redusers";
import {TaskPriorities, TaskStatuses, TaskType, todolistAPI, UpdateTaskModelType} from "../api/todolist-api";
import {AppDispatch, AppRootStateType, AppThunk} from "../State/Store";

export type SetTasksActionType = {
    type: 'SET_TASKS'
    payload: {
        tasks:Array<TaskType>,
        todolistId:string
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

type ActionType = RemoveTaskACType
    | AddTaskACType
    | ChangeTaskStatusACType
    | ChangeTaskTitleACType
    | AddTodolistACType
    | RemoveTodolistACType
    | SetTodolistsActionType
    | SetTasksActionType


const initialState: TasksStateType = {
    [todolistId1]: [
        {
            id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId: todolistId1, startDate: "",
            order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
        },
        {
            id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId: todolistId1, startDate: "",
            order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
        },
    ],
    [todolistId2]: [
        {
            id: v1(), title: "Milk", status: TaskStatuses.Completed, todoListId: todolistId2, startDate: "",
            order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
        },
        {
            id: v1(), title: "React Book", status: TaskStatuses.Completed, todoListId: todolistId2, startDate: "",
            order: 0, addedDate: "", deadline: "", description: "", priority: TaskPriorities.Low
        },
    ],
};

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
            // const newTask: TaskType = action.payload.task;
            // return {
            //     ...state,
            //     [newTask.todolistId]: [newTask, ...state[newTask.todolistId]]
            // }
            const stateCopy = {...state}
            const tasks = stateCopy[action.payload.task.todoListId];
            console.log("tasks",action.payload.task.todoListId)
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

export const addTaskAC = (task:TaskType) => {
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

export const setTaskAC = (tasks: Array<TaskType>, todolistId: string):SetTasksActionType => {
    return {
        type: "SET_TASKS",
        payload: {
            tasks,
            todolistId
        }
    } as const
}

export const getTaskTC =(todolistId:string)=>(dispatch:AppDispatch)=>{
  todolistAPI.getTasks(todolistId)
      .then((res)=>{
          dispatch(setTaskAC(res.data.items, todolistId))
      })
}

export const deleteTaskTC =(todolistId:string, taskId:string)=>(dispatch:AppDispatch)=>{
    todolistAPI.deleteTask(todolistId,taskId ).then(res=> {
        dispatch(removeTaskAC(todolistId,taskId))
    })
}

export const addTaskTC = (todoListId: string, title: string) => (dispatch: AppDispatch) => {
    todolistAPI.createTask(todoListId, title)
        .then((res) => {
            console.log("my",res.data.data.item)
            dispatch(addTaskAC(res.data.data.item))
        }).catch((e) => console.log("my err",e.message))
}

export const updateTaskTC = (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType ) =>
    (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find((item) =>
        item.id === taskId)
    if (task) {
        const apiModel: UpdateTaskModelType = {
            ...task,
            ...domainModel
        }
        todolistAPI.updateTask(todolistId, taskId, apiModel)
            .then((res) => {
                dispatch(updateTaskAC(todolistId, taskId, domainModel))
            })
    }
}