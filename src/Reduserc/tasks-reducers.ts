import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'

import {
  TaskPriorities,
  TaskStatuses,
  TaskType,
  todolistAPI,
  UpdateTaskModelType,
} from '../api/todolist-api'
import { AppRootStateType } from '../State/Store'
import { hadleServerAppError, hadleServerNetworkError } from '../utils/error-utils'

import { RequestStatusType, setAppStatusAC } from './app-reducer'
import { addTodolistTC, deleteTodolistTC, getTodolistTC } from './todolists-reducers'

const initialState: TasksStateType = {}

export const getTaskTC = createAsyncThunk(
  'tasks/getTaskTC',
  async (todolistId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
    try {
      const res = await todolistAPI.getTasks(todolistId)
      const tasks = res.data.items.map(item => ({
        ...item,
        entityStatus: 'igle' as RequestStatusType,
      }))

      thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

      return { tasks, todolistId }
    } catch (error) {
      const err = error as Error | AxiosError<{ error: string }>

      hadleServerNetworkError(err, thunkAPI.dispatch)
    }
  }
)

export const addTaskTC = createAsyncThunk(
  'tasks/addTaskTC',
  async ({ todoListId, title }: { todoListId: string; title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
    try {
      const res = await todolistAPI.createTask(todoListId, title)

      if (res.data.resultCode === ResultStatus.OK) {
        const task = res.data.data.item

        // thunkAPI.dispatch(addTaskAC({ task: { ...task, entityStatus: 'idle' } }))
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

        return { task: { ...task, entityStatus: 'idle' } }
      } else {
        hadleServerAppError(res.data, thunkAPI.dispatch)

        return thunkAPI.rejectWithValue(res.data.messages)
      }
    } catch (error) {
      const err = error as Error | AxiosError<{ error: string }>

      hadleServerNetworkError(err, thunkAPI.dispatch)

      return thunkAPI.rejectWithValue(err)
    }
  }
)

export const updateTaskTC = createAsyncThunk(
  'tasks/updateTaskTC',
  async (
    {
      todolistId,
      taskId,
      domainModel,
    }: { todolistId: string; taskId: string; domainModel: UpdateDomainTaskModelType },
    thunkAPI
  ) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
    const state = thunkAPI.getState() as AppRootStateType
    const task = state.tasks[todolistId].find(item => item.id === taskId)

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

      try {
        const res = await todolistAPI.updateTask(todolistId, taskId, apiModel)

        if (res.data.resultCode === ResultStatus.OK) {
          thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))

          return { todolistId: todolistId, taskId: taskId, domainModel: domainModel }
        } else {
          hadleServerAppError(res.data, thunkAPI.dispatch)

          return thunkAPI.rejectWithValue(null)
        }
      } catch (error) {
        const err = error as Error | AxiosError<{ error: string }>

        hadleServerNetworkError(err, thunkAPI.dispatch)

        return thunkAPI.rejectWithValue(null)
      }
    }
  }
)

export const deleteTaskTC = createAsyncThunk(
  'tasks/deleteTaskTC',
  async ({ todolistId, taskId }: { todolistId: string; taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({ status: 'loading' }))
    thunkAPI.dispatch(
      changeTaskEntityStatusAC({ todolistId: todolistId, tasksId: taskId, entityStatus: 'loading' })
    )
    try {
      const res = await todolistAPI.deleteTask(todolistId, taskId)

      if (res.data.resultCode === ResultStatus.OK) {
        thunkAPI.dispatch(setAppStatusAC({ status: 'succeeded' }))
        thunkAPI.dispatch(
          changeTaskEntityStatusAC({
            todolistId: todolistId,
            tasksId: taskId,
            entityStatus: 'succeeded',
          })
        )

        return { todolistId: todolistId, taskId: taskId }
      } else {
        hadleServerAppError(res.data, thunkAPI.dispatch)
        thunkAPI.dispatch(
          changeTaskEntityStatusAC({
            todolistId: todolistId,
            tasksId: taskId,
            entityStatus: 'failed',
          })
        )
      }
    } catch (error) {
      const err = error as Error | AxiosError<{ error: string }>

      hadleServerNetworkError(err, thunkAPI.dispatch)
      thunkAPI.dispatch(
        changeTaskEntityStatusAC({
          todolistId: todolistId,
          tasksId: taskId,
          entityStatus: 'failed',
        })
      )
    }
  }
)

const slice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // removeTaskAC(state, action: PayloadAction<{ todolistId: string; taskId: string }>) {
    //   const tasks = state[action.payload.todolistId]
    //   const index = tasks.findIndex(t => t.id === action.payload.taskId)
    //
    //   if (index > -1) {
    //     tasks.splice(index, 1)
    //   }
    // },
    // addTaskAC(state, action: PayloadAction<{ task: TaskDomainType }>) {
    //   state[action.payload.task.todoListId].unshift(action.payload.task)
    // },
    // updateTaskAC(
    //   state,
    //   action: PayloadAction<{
    //     todolistId: string
    //     taskId: string
    //     model: UpdateDomainTaskModelType
    //   }>
    // ) {
    //   const tasks = state[action.payload.todolistId]
    //   const index = tasks.findIndex(t => t.id === action.payload.taskId)
    //
    //   if (index > -1) {
    //     tasks[index] = { ...tasks[index], ...action.payload.model }
    //   }
    // },
    // setTaskAC(state, action: PayloadAction<{ tasks: Array<TaskDomainType>; todolistId: string }>) {
    //   state[action.payload.todolistId] = action.payload.tasks
    // },
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
    builder.addCase(addTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
    builder.addCase(deleteTodolistTC.fulfilled, (state, action) => {
      delete state[action.payload!.todolistId]
    })
    builder.addCase(getTodolistTC.fulfilled, (state, action) => {
      action.payload.todolists.forEach((item: any) => {
        state[item.id] = []
      })
    })
    builder.addCase(getTaskTC.fulfilled, (state, action) => {
      state[action.payload!.todolistId] = action.payload!.tasks
    })
    builder.addCase(deleteTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload!.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload!.taskId)

      if (index > -1) {
        tasks.splice(index, 1)
      }
    })
    builder.addCase(addTaskTC.fulfilled, (state, action) => {
      // @ts-ignore
      state[action.payload.task.todoListId].unshift(action.payload.task)
    })
    builder.addCase(updateTaskTC.fulfilled, (state, action) => {
      const tasks = state[action.payload!.todolistId]
      const index = tasks.findIndex(t => t.id === action.payload!.taskId)

      if (index > -1) {
        tasks[index] = { ...tasks[index], ...action.payload!.domainModel }
      }
    })
  },
})

export const tasksReducer = slice.reducer

export const { changeTaskEntityStatusAC } = slice.actions

// export const _getTaskTC = (todolistId: string) => (dispatch: AppDispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   todolistAPI
//     .getTasks(todolistId)
//     .then(res => {
//       const tasks = res.data.items.map(item => ({
//         ...item,
//         entityStatus: 'igle' as RequestStatusType,
//       }))
//
//       dispatch(setTaskAC({ tasks, todolistId }))
//       dispatch(setAppStatusAC({ status: 'succeeded' }))
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// export const _deleteTaskTC = (todolistId: string, taskId: string) => (dispatch: AppDispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   dispatch(
//     changeTaskEntityStatusAC({ todolistId: todolistId, tasksId: taskId, entityStatus: 'loading' })
//   )
//   todolistAPI
//     .deleteTask(todolistId, taskId)
//     .then(res => {
//       if (res.data.resultCode === ResultStatus.OK) {
//         dispatch(removeTaskAC({ todolistId: todolistId, taskId: taskId }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//         dispatch(
//           changeTaskEntityStatusAC({
//             todolistId: todolistId,
//             tasksId: taskId,
//             entityStatus: 'succeeded',
//           })
//         )
//       } else {
//         hadleServerAppError(res.data, dispatch)
//         dispatch(
//           changeTaskEntityStatusAC({
//             todolistId: todolistId,
//             tasksId: taskId,
//             entityStatus: 'failed',
//           })
//         )
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//       dispatch(
//         changeTaskEntityStatusAC({
//           todolistId: todolistId,
//           tasksId: taskId,
//           entityStatus: 'failed',
//         })
//       )
//     })
// }

// export const _addTaskTC = (todoListId: string, title: string) => (dispatch: AppDispatch) => {
//   dispatch(setAppStatusAC({ status: 'loading' }))
//   todolistAPI
//     .createTask(todoListId, title)
//     .then(res => {
//       if (res.data.resultCode === ResultStatus.OK) {
//         const task = res.data.data.item
//
//         dispatch(addTaskAC({ task: { ...task, entityStatus: 'idle' } }))
//         dispatch(setAppStatusAC({ status: 'succeeded' }))
//       } else {
//         hadleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch(error => {
//       hadleServerNetworkError(error, dispatch)
//     })
// }

// export const _updateTaskTC =
//   (todolistId: string, taskId: string, domainModel: UpdateDomainTaskModelType) =>
//   (dispatch: AppDispatch, getState: () => AppRootStateType) => {
//     const task = getState().tasks[todolistId].find(item => item.id === taskId)
//
//     if (task) {
//       const apiModel: UpdateTaskModelType = {
//         deadline: task.deadline,
//         description: task.description,
//         priority: task.priority,
//         startDate: task.startDate,
//         title: task.title,
//         status: task.status,
//         ...domainModel,
//       }
//
//       dispatch(setAppStatusAC({ status: 'loading' }))
//       todolistAPI
//         .updateTask(todolistId, taskId, apiModel)
//         .then(res => {
//           if (res.data.resultCode === ResultStatus.OK) {
//             dispatch(updateTaskAC({ todolistId: todolistId, taskId: taskId, model: domainModel }))
//             dispatch(setAppStatusAC({ status: 'succeeded' }))
//           } else {
//             hadleServerAppError(res.data, dispatch)
//           }
//         })
//         .catch(error => {
//           hadleServerNetworkError(error, dispatch)
//         })
//     }
//   }

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
