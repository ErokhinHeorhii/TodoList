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
        return  instance.post<ResponseType<{item:TodoListType}>>(
            `todo-lists/`,
            { title: title },
        )
    },

    getTodolist(){
        return instance.get<Array<TodoListType>>(`todo-lists`)
    }
}

export type TodoListType =
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