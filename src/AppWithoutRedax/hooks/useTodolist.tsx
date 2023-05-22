import { useState } from 'react'

import { v1 } from 'uuid'

import {
  TaskFilterType,
  TodolistDomainType,
} from '../../Components/TodolistList/todolists-reducers'
import { todolistID1, todolistID2 } from '../id-utils'

export const useTodolist = (
  tasks: any,
  onDeleteTask: (id: string) => void,
  onTodoListAdded: (id: string) => void
) => {
  let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
    {
      id: todolistID1,
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: todolistID2,
      title: 'What to buy',
      filter: 'completed',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
  ])

  const deleteTodoList = (todolistID: string) => {
    setTodolists(todolists.filter(item => item.id !== todolistID))

    onDeleteTask(todolistID)
  }

  const changeTodoListTitle = (todolistID: string, title: string) => {
    setTodolists(todolists.map(item => (item.id === todolistID ? { ...item, title } : item)))
  }
  const addTodoList = (title: string) => {
    const newTodolistId: string = v1()

    setTodolists([
      ...todolists,
      {
        id: newTodolistId,
        title: title,
        order: 0,
        addedDate: '',
        filter: 'all',
        entityStatus: 'idle',
      },
    ])
    onTodoListAdded(newTodolistId)
  }
  const changeTask = (todolistID: string, value: TaskFilterType) => {
    let todolist = todolists.find(item => item.id === todolistID)

    if (todolist) {
      todolist.filter = value
      setTodolists([...todolists])
    }
  }

  return {
    todolists,
    setTodolists,
    deleteTodoList,
    changeTodoListTitle,
    addTodoList,
    changeTask,
  }
}
