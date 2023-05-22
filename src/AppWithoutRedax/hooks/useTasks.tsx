import { useState } from 'react'

import { v1 } from 'uuid'

import { TaskPriorities, TaskStatuses } from '../../api/todolist-api'
import { TaskDomainType, TasksStateType } from '../../Components/TaskComponent/tasks-reducers'
import { todolistID1, todolistID2 } from '../id-utils'

export const useTasks = () => {
  let [tasks, setTasks] = useState<TasksStateType>({
    [todolistID1]: [
      {
        id: v1(),
        title: 'HTML&CSS',
        status: TaskStatuses.Completed,
        todoListId: todolistID1,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: 'JS',
        status: TaskStatuses.Completed,
        todoListId: todolistID1,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
    [todolistID2]: [
      {
        id: v1(),
        title: 'HTML&CSS2',
        status: TaskStatuses.Completed,
        todoListId: todolistID2,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
      {
        id: v1(),
        title: 'JS2',
        status: TaskStatuses.Completed,
        todoListId: todolistID2,
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        entityStatus: 'idle',
      },
    ],
  })

  const removeTask = (todolistId: string, taskId: string) => {
    setTasks({ ...tasks, [todolistId]: tasks[todolistId].filter(item => item.id !== taskId) })
  }

  // UseState работает асинхронно
  const addTask = (todolistID: string, title: string) => {
    const newTask: TaskDomainType = {
      id: v1(),
      title,
      status: TaskStatuses.New,
      todoListId: todolistID,
      startDate: '',
      order: 0,
      addedDate: '',
      deadline: '',
      description: '',
      priority: TaskPriorities.Low,
      entityStatus: 'idle',
    }

    setTasks({ ...tasks, [todolistID]: [newTask, ...tasks[todolistID]] })
  }

  const completlyDeleteTask = (id: string) => {
    delete tasks[id]
  }

  const addStateForNewTodolist = (newTodolistId: string) => {
    setTasks({
      ...tasks,
      [newTodolistId]: [
        {
          id: v1(),
          title: 'Html',
          status: TaskStatuses.New,
          todoListId: newTodolistId,
          startDate: '',
          order: 0,
          addedDate: '',
          deadline: '',
          description: '',
          priority: TaskPriorities.Low,
          entityStatus: 'idle',
        },
        {
          id: v1(),
          title: 'Css',
          status: TaskStatuses.New,
          todoListId: newTodolistId,
          startDate: '',
          order: 0,
          addedDate: '',
          deadline: '',
          description: '',
          priority: TaskPriorities.Low,
          entityStatus: 'idle',
        },
      ],
    })
  }

  return {
    tasks,
    addTask,
    removeTask,
    completlyDeleteTask,
    addStateForNewTodolist,
  }
}
