import axios from 'axios'

const instance = axios.create({
    withCredentials: true,
    baseURL:'https://social-network.samuraijs.com/api/1.1/',
    headers: {
        'API-KEY': '17057e05-a25d-4428-a5d1-0d4f4ddbdf73',
    },
})

export const todolistAPI = {

    updateTodolist(todolistId: string, title: string) {
        return  instance.put<ResponseType>(
            `todo-lists/${todolistId}`,
            { title: title },
        )
    },

    deleteTodolist(todolistId: string){
        return instance.delete<ResponseType>(`todo-lists/${todolistId}`)
    },

    createTodolist( title: string) {
        return  instance.post<ResponseType<{item:TodolistType}>>(
            `todo-lists/`,
            { title: title },
        )
    },

    getTodolist(){
        return instance.get<Array<TodolistType>>(`todo-lists`)
    }
}

export type TodolistType =
    {
        "id": string,
        "title": string,
        "addedDate": string,
        "order": number
    }

type ResponseType<T={}>={
    data: T,
    messages: string[],
    fieldsErrors: string[],
    resultCode: number
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    Hi = 2,
    Urgently = 3,
    Later = 4
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