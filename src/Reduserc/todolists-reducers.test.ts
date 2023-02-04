import { v1 } from 'uuid'

import { TaskPriorities, TaskStatuses } from '../api/todolist-api'

import { RequestStatusType } from './app-reducer'
import { tasksReducer, TasksStateType } from './tasks-reducers'
import {
  addTodolistTC,
  changeTodolistEntityStatusAC,
  changeTodolistFilterAC,
  changeTodolistTitleTC,
  deleteTodolistTC,
  getTodolistTC,
  TaskFilterType,
  TodolistDomainType,
  todolistsReducer,
} from './todolists-reducers'

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {
  todolistId1 = v1()
  todolistId2 = v1()

  startState = [
    {
      id: todolistId1,
      title: 'What to learn',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
    {
      id: todolistId2,
      title: 'What to buy',
      filter: 'all',
      addedDate: '',
      order: 0,
      entityStatus: 'idle',
    },
  ]
})

test('correct todolist should be removed', () => {
  const endState = todolistsReducer(
    startState,
    deleteTodolistTC.fulfilled({ todolistId: todolistId1 }, ' ', todolistId1)
  )

  expect(endState.length).toBe(1)
  expect(endState[0].id).toBe(todolistId2)
})

test('correct todolist should be added', () => {
  let newTodolistTitle = 'New Todolist'

  const endState = todolistsReducer(
    startState,
    addTodolistTC.fulfilled(
      {
        todolist: {
          id: v1(),
          addedDate: '',
          order: 0,
          title: newTodolistTitle,
        },
      },
      ' ',
      newTodolistTitle
    )
  )

  expect(endState.length).toBe(3)
  expect(endState[0].title).toBe(newTodolistTitle)
  expect(endState[2].filter).toBe('all')
})

test('correct todolist should change its name', () => {
  let newTodolistTitle = 'New Todolist'

  const endState = todolistsReducer(
    startState,
    changeTodolistTitleTC.fulfilled(
      { todolistId2: todolistId2, newTodolistTitle: newTodolistTitle },
      ' ',
      { id: todolistId2, title: newTodolistTitle }
    )
  )

  expect(endState[0].title).toBe('What to learn')
  expect(endState[1].title).toBe(newTodolistTitle)
})

test('correct filter of todolist should be changed', () => {
  let newFilter: TaskFilterType = 'completed'

  const endState = todolistsReducer(
    startState,
    changeTodolistFilterAC({ todolistId2: todolistId2, newFilter: newFilter })
  )

  expect(endState[0].filter).toBe('all')
  expect(endState[1].filter).toBe(newFilter)
})

test('property with todolistId should be deleted', () => {
  const startState: TasksStateType = {
    todolistId1: [
      {
        id: '1',
        title: 'CSS',
        todoListId: 'todolistId1',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.New,
        entityStatus: 'idle',
      },
      {
        id: '2',
        title: 'JS',
        todoListId: 'todolistId1',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.Completed,
        entityStatus: 'idle',
      },
      {
        id: '3',
        title: 'React',
        todoListId: 'todolistId1',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.New,
        entityStatus: 'idle',
      },
    ],
    todolistId2: [
      {
        id: '1',
        title: 'bread',
        todoListId: 'todolistId2',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.New,
        entityStatus: 'idle',
      },
      {
        id: '2',
        title: 'milk',
        todoListId: 'todolistId2',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.Completed,
        entityStatus: 'idle',
      },
      {
        id: '3',
        title: 'tea',
        todoListId: 'todolistId2',
        startDate: '',
        order: 0,
        addedDate: '',
        deadline: '',
        description: '',
        priority: TaskPriorities.Low,
        status: TaskStatuses.New,
        entityStatus: 'idle',
      },
    ],
  }

  const action = deleteTodolistTC.fulfilled({ todolistId: 'todolistId2' }, ' ', todolistId2)

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState['todolistId2']).not.toBeDefined()
})

test('todolist should be set', () => {
  const action = getTodolistTC.fulfilled({ todolists: startState }, ' ')
  const endState = todolistsReducer([], action)

  expect(endState.length).toBe(2)
})

test('correct entityStatus should be changed', () => {
  let newStatus: RequestStatusType = 'loading'
  let action = changeTodolistEntityStatusAC({ id: todolistId2, status: newStatus })
  const endState = todolistsReducer(startState, action)

  expect(endState[0].entityStatus).toBe('idle')
  expect(endState[1].entityStatus).toBe(newStatus)
})
