import { v1 } from 'uuid'

import { TaskPriorities, TaskStatuses } from '../api/todolist-api'

import {
  addTaskTC,
  changeTaskEntityStatusAC,
  deleteTaskTC,
  getTaskTC,
  tasksReducer,
  TasksStateType,
  updateTaskTC,
} from './tasks-reducers'
import {
  addTodolistTC,
  getTodolistTC,
  TodolistDomainType,
  todolistsReducer,
} from './todolists-reducers'

let startState: TasksStateType

beforeEach(() => {
  startState = {
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
})

test('correct task should be deleted from correct array', () => {
  const action = deleteTaskTC.fulfilled({ todolistId: 'todolistId2', taskId: '2' }, ' ', {
    todolistId: 'todolistId2',
    taskId: '2',
  })

  const endState = tasksReducer(startState, action)

  expect(endState).toEqual({
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
  })
})

test('correct task should be added to correct array', () => {
  const task = {
    todoListId: 'todolistId2',
    title: 'juce',
    addedDate: '',
    order: 0,
    deadline: '',
    priority: 0,
    id: '123',
    startDate: '',
    description: '',
    status: TaskStatuses.New,
    entityStatus: 'idle',
  }
  const action = addTaskTC.fulfilled({ task }, ' ', task)

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'].length).toBe(3)
  expect(endState['todolistId2'].length).toBe(4)
  expect(endState['todolistId2'][0].id).toBeDefined()
  expect(endState['todolistId2'][0].title).toBe('juce')
  expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {
  const updateModel = {
    todolistId: 'todolistId2',
    taskId: '2',
    domainModel: { status: TaskStatuses.New },
  }
  const action = updateTaskTC.fulfilled(updateModel, 'requestId ', updateModel)

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
  expect(endState['todolistId2'].length).toBe(3)
})

test('title of specified task should be changed', () => {
  const updateModel = {
    todolistId: 'todolistId1',
    taskId: '1',
    domainModel: { title: 'TS' },
  }
  const action = updateTaskTC.fulfilled(updateModel, ' ', updateModel)

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][0].title).toBe('TS')
  expect(endState['todolistId1'].length).toBe(3)
})

test('new array should be added when new todolist is added', () => {
  const action = addTodolistTC.fulfilled(
    {
      todolist: {
        id: v1(),
        addedDate: '',
        order: 0,
        title: 'newTodolistTitle',
      },
    },
    ' ',
    'newTodolistTitle'
  )

  const endState = tasksReducer(startState, action)

  const keys = Object.keys(endState)
  const newKey = keys.find(k => k != 'todolistId1' && k != 'todolistId2')

  if (!newKey) {
    throw Error('new key should be added')
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test('ids should be equals', () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: Array<TodolistDomainType> = []

  const action = addTodolistTC.fulfilled(
    {
      todolist: {
        id: v1(),
        addedDate: '',
        order: 0,
        title: 'newTodolistTitle',
      },
    },
    ' ',
    'newTodolistTitle'
  )

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})

test('empty arrays should be added when we set todolist', () => {
  const data = {
    todolists: [
      { id: 'todolistId1', title: 'What to learn', addedDate: '', order: 0 },
      { id: 'todolistId2', title: 'What to buy', addedDate: '', order: 0 },
    ],
  }
  const action = getTodolistTC.fulfilled(data, ' ')

  const endState = tasksReducer({}, action)

  const keys = Object.keys(endState)

  expect(keys.length).toBe(2)
  expect(endState['todolistId1']).toStrictEqual([])
  expect(endState['todolistId2']).toStrictEqual([])
})

test('tasks should be added for todolist', () => {
  const action = getTaskTC.fulfilled(
    {
      tasks: startState['todolistId1'],
      todolistId: 'todolistId1',
    },
    ' ',
    'todolistId1'
  )

  const endState = tasksReducer(
    {
      todolistId2: [],
      todolistId1: [],
    },
    action
  )

  expect(endState['todolistId1'].length).toBe(3)
})

test('entityStatus of  task should be changed', () => {
  const action = changeTaskEntityStatusAC({
    todolistId: 'todolistId1',
    tasksId: '1',
    entityStatus: 'loading',
  })

  const endState = tasksReducer(startState, action)

  expect(endState['todolistId1'][0].entityStatus).toBe('loading')
  expect(endState['todolistId1'][1].entityStatus).toBe('idle')
})
