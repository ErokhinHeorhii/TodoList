import { addTodolistAC, setTodolistsAC, removeTodolistAC } from './todolists-reducers'
import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
  UpdateTaskModelType,
} from '../api/todolist-api'
import { AppDispatch, AppRootStateType } from '../State/Store'
import { RequestStatusType, setAppStatusAC } from './app-reducer'
import { hadleServerAppError, hadleServerNetworkError } from '../utils/error-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const initialState: TasksStateType = {}

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    removeTaskAC(state, action: PayloadAction<{ todolistId: string; taskId: string }>) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks.splice(index, 1)
      }
    },
    addTaskAC(state, action: PayloadAction<{ task: TaskDomainType }>) {
      state[action.payload.task.todoListId].unshift(action.payload.task)
    },
    updateTaskAC(
      state,
      action: PayloadAction<{
        todolistId: string
        taskId: string
        model: UpdateDomainTaskModelType
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.taskId)
      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload.model }
      }
    },
    setTaskAC(state, action: PayloadAction<{ tasks: Array<TaskDomainType>; todolistId: string }>) {
      state[action.payload.todolistId] = action.payload.tasks
    },
    changeTaskEntityStatusAC(
      state,
      action: PayloadAction<{
        todolistId: string
        tasksId: string
        entityStatus: RequestStatusType
      }>
    ) {
      const tasks = state[action.payload.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload.tasksId)
      if (index > -1) {
        tasks[index].entityStatus = action.payload.entityStatus
      }
    },
  },
  extraReducers: builder => {
    builder.addCase(addTodolistAC, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(removeTodolistAC, (state, action) => {
      delete state[action.payload.todolistId]
    })
    builder.addCase(setTodolistsAC, (state, action) => {
      action.payload.todolists.forEach((item: any) => {
        state[item.id] = []
      })
    })
  },
})

export const tasksReducer = slice.reducer

export const { addTaskAC, setTaskAC, removeTaskAC, updateTaskAC, changeTaskEntityStatusAC } =
  slice.actions

export const getTaskTC = (todolistId: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  todolistAPI
    .getTasks(todolistId)
    .then(res => {
      const tasks = res.data.items.map(item => ({
        ...item,
        entityStatus: 'igle' as RequestStatusType,
      }))
      dispatch(setTaskAC({ tasks, todolistId }))
      dispatch(setAppStatusAC({ status: 'succeeded' }))
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
    })
}

export const deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  dispatch(
    changeTaskEntityStatusAC({ todolistId: todolistId, tasksId: taskId, entityStatus: 'loading' })
  )
  todolistAPI
    .deleteTask(todolistId, taskId)
    .then(res => {
      if (res.data.resultCode === ResultStatus.OK) {
        dispatch(removeTaskAC({ todolistId: todolistId, taskId: taskId }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
        dispatch(
          changeTaskEntityStatusAC({
            todolistId: todolistId,
            tasksId: taskId,
            entityStatus: 'succeeded',
          })
        )
      } else {
        hadleServerAppError(res.data, dispatch)
        dispatch(
          changeTaskEntityStatusAC({
            todolistId: todolistId,
            tasksId: taskId,
            entityStatus: 'failed',
          })
        )
      }
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
      dispatch(
        changeTaskEntityStatusAC({
          todolistId: todolistId,
          tasksId: taskId,
          entityStatus: 'failed',
        })
      )
    })
}

export const addTaskTC = (todoListId: string, title: string) => (dispatch: AppDispatch) => {
  dispatch(setAppStatusAC({ status: 'loading' }))
  todolistAPI
    .createTask(todoListId, title)
    .then(res => {
      if (res.data.resultCode === ResultStatus.OK) {
        const task = res.data.data.item
        dispatch(addTaskAC({ task: { ...task, entityStatus: 'idle' } }))
        dispatch(setAppStatusAC({ status: 'succeeded' }))
      } else {
        hadleServerAppError(res.data, dispatch)
      }
    })
    .catch(error => {
      hadleServerNetworkError(error, dispatch)
    })
}

export const updateTaskTC =
  (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
  (dispatch: AppDispatch, getState: () => AppRootStateType) => {
    const task = getState().tasks[todolistId].find(item => item.id === taskId)
    if (task) {
      const apiModel: UpdateTaskModelType = {
        deadline: task.deadline,
        description: task.description,
        priority: task.priority,
        startDate: task.startDate,
        title: task.title,
        status: task.status,
        ...domainModel,
      }

      dispatch(setAppStatusAC({ status: 'loading' }))
      todolistAPI
        .updateTask(todolistId, taskId, apiModel)
        .then(res => {
          if (res.data.resultCode === ResultStatus.OK) {
            dispatch(updateTaskAC({ todolistId: todolistId, taskId: taskId, model: domainModel }))
            dispatch(setAppStatusAC({ status: 'succeeded' }))
          } else {
            hadleServerAppError(res.data, dispatch)
          }
        })
        .catch(error => {
          hadleServerNetworkError(error, dispatch)
        })
    }
  }

export type SetTasksActionType = {
  type: 'SET_TASKS'
  payload: {
    tasks: Array<TaskDomainType>
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
export type TasksStateType = {
  [key: string]: Array<TaskDomainType>
}
export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }

export enum ResultStatus {
  OK = 0,
  Error = 1,
  CAPTCHA = 10,
}
