import React, {useEffect, useState} from 'react'
import axios from "axios"
import {todolistAPI} from "../api/todolist-api";

export default {
    title: 'API'
}

const settings = {
    withCredentials: true,
    headers: {
        'API-KEY': '17057e05-a25d-4428-a5d1-0d4f4ddbdf73',
    },
}

export const GetTodolists = () => {
    const [state, setState] = useState<any>("")
    useEffect(() => {
        todolistAPI.getTodolist()
            .then(res => setState(res.data))
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const CreateTodolist = () => {
    const [state, setState] = useState<any>(null)
   useEffect(() => {
       todolistAPI.createTodolist("Good evening")
            .then(res => {
                setState(res.data)})
    }, [])
    return <div>{JSON.stringify(state)}</div>
}
export const DeleteTodolist = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        let todolistId:string='c4fec6f2-cabd-42a1-b1a1-be361514bc27';
        todolistAPI.deleteTodolist(todolistId)
            .then(res=> setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
export const UpdateTodolistTitle = () => {
    const [state, setState] = useState<any>(null)

    useEffect(() => {
        let todolistId:string='3a82a99c-250c-4a5c-8762-9ca368858193';
        todolistAPI.updateTodolist(todolistId, "Hello from Brest")
            .then(res=> setState(res.data))
    }, [])

    return <div>{JSON.stringify(state)}</div>
}
