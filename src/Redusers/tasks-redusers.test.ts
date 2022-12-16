import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./tasks-redusers";
import {TasksStateType} from '../App'
import {addTodolistAC, TodolistDomainType, todolistsReducer} from "./todolists-redusers";
import {TaskPriorities, TaskStatuses, TodolistType} from "../api/todolist-api";

let startState: TasksStateType

beforeEach(()=>{
    startState = {
        'todolistId1': [
            {id: '1', title: 'CSS', todoListId:'todolistId1', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New},
            {id: '2', title: 'JS', todoListId:'todolistId1', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.Completed},
            {id: '3', title: 'React', todoListId:'todolistId1', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New},
            {id: '2', title: 'milk', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.Completed},
            {id: '3', title: 'tea', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New}
        ]
    }
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskAC('todolistId2', '2')

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        'todolistId1': [
            {id: '1', title: 'CSS', todoListId:'todolistId1', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New},
            {id: '2', title: 'JS', todoListId:'todolistId1', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.Completed},
            {id: '3', title: 'React', todoListId:'todolistId1', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New}
        ],
        'todolistId2': [
            {id: '1', title: 'bread', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New},
            {id: '3', title: 'tea', todoListId:'todolistId2', startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low, status:TaskStatuses.New}
        ]
    })
})

test('correct task should be added to correct array', () => {

    const action = addTaskAC('todolistId2', 'juce')

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusAC('todolistId2', '2', TaskStatuses.New)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.Completed)
    expect(endState['todolistId2'].length).toBe(3)
})

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC('todolistId1', '1', "TS",)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][0].title).toBe("TS")
    expect(endState['todolistId1'].length).toBe(3)
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC('new todolist')

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

    const action = addTodolistAC('new todolist')

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.payload.todolistId)
    expect(idFromTodolists).toBe(action.payload.todolistId)
})