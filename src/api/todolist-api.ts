import axios, { AxiosResponse } from 'axios'

const instance = axios.create({
  withCredentials: true,
  baseURL: 'https://social-network.samuraijs.com/api/1.1/',
  headers: {
    'API-KEY': '17057e05-a25d-4428-a5d1-0d4f4ddbdf73',
  },
})

export const todolistAPI = {
  updateTodolist(todolistId: string, title: string) {
    return instance.put<ResponseType>(`todo-lists/${todolistId}`, { title: title })
  },

  deleteTodolist(todolistId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
  },

  createTodolist(title: string) {
    return instance.post<ResponseType<{ item: TodolistType }>>(`todo-lists/`, { title: title })
  },

  getTodolist() {
    return instance.get<Array<TodolistType>>(`todo-lists`)
  },

  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`)
  },

  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<ResponseType>(`todo-lists/${todolistId}/tasks/${taskId}`)
  },
  createTask(todolistId: string, title: string) {
    return instance.post<{ title: string }, AxiosResponse<ResponseType<{ item: TaskType }>>>(
      `todo-lists/${todolistId}/tasks`,
      { title }
    )
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<UpdateTaskModelType, AxiosResponse<ResponseType<{ item: TaskType }>>>(
      `todo-lists/${todolistId}/tasks/${taskId}`,
      model
    )
  },
}

export const authApi = {
  login(data: LoginParamsType) {
    return instance.post<LoginParamsType, AxiosResponse<ResponseType<{ userId?: number }>>>(
      `/auth/login`,
      data
    )
  },

  me() {
    return instance.get<ResponseType<UserType>>(`/auth/me`)
  },

  logout() {
    return instance.delete<ResponseType>(`/auth/login`)
  },
}

export type TodolistType = {
  id: string
  title: string
  addedDate: string
  order: number
}

export type ResponseType<T = {}> = {
  data: T
  messages: string[]
  fieldsErrors: string[]
  resultCode: number
}

export enum TaskStatuses {
  New = 0,
  InProgress = 1,
  Completed = 2,
  Draft = 3,
}

export enum TaskPriorities {
  Low = 0,
  Middle = 1,
  Hi = 2,
  Urgently = 3,
  Later = 4,
}

export type TaskType = {
  description: string
  title: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
  id: string
  todoListId: string
  order: number
  addedDate: string
}
export type UpdateTaskModelType = {
  title: string
  description: string
  status: TaskStatuses
  priority: TaskPriorities
  startDate: string
  deadline: string
}
type GetTasksResponse = {
  error: string | null
  totalCount: number
  items: TaskType[]
}

export type LoginParamsType = {
  email: string
  password: string
  rememberMe?: boolean
  captcha?: string
}

export type UserType = {
  id: string
  email: string
  login: string
}
