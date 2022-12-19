import {
    addTaskAC,
    changeTaskTitleAC,
    removeTaskAC,
    setTaskAC,
    tasksReducer, updateTaskAC
} from "./tasks-redusers";
import {TasksStateType} from '../App'
import {addTodolistAC, setTodolistsAC, TodolistDomainType, todolistsReducer} from "./todolists-redusers";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {v1} from "uuid";

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

    const action = addTaskAC({
        todoListId:'todolistId2',
        title:'juce',
        addedDate:"",
        order:0,
        deadline:"",
        priority:0,
        id:"123",
        startDate:"",
        description:"",
        status:TaskStatuses.New
    } )

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'].length).toBe(3)
    expect(endState['todolistId2'].length).toBe(4)
    expect(endState['todolistId2'][0].id).toBeDefined()
    expect(endState['todolistId2'][0].title).toBe('juce')
    expect(endState['todolistId2'][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {

    const action = updateTaskAC('todolistId2', '2', {status:TaskStatuses.New})

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId2'][1].status).toBe(TaskStatuses.New)
    expect(endState['todolistId2'].length).toBe(3)
})

test('title of specified task should be changed', () => {

    const action = changeTaskTitleAC('todolistId1', '1', "TS",)

    const endState = tasksReducer(startState, action)

    expect(endState['todolistId1'][0].title).toBe("TS")
    expect(endState['todolistId1'].length).toBe(3)
})

test('new array should be added when new todolist is added', () => {

    const action = addTodolistAC({
        id: v1(),
        addedDate: "",
        order: 0,
        title:  "newTodolistTitle"
    })

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

    const action = addTodolistAC({
        id: v1(),
        addedDate: "",
        order: 0,
        title:  "newTodolistTitle"
    })

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistsReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState)
    const idFromTasks = keys[0]
    const idFromTodolists = endTodolistsState[0].id

    expect(idFromTasks).toBe(action.todolist.id)
    expect(idFromTodolists).toBe(action.todolist.id)
})

test('empty arrays should be added when we set todolist', ()=>{
    const action= setTodolistsAC([
        {id:"todolistId1", title: "What to learn",  addedDate: "", order: 0},
        {id: "todolistId2", title: "What to buy",  addedDate: "", order: 0},
    ])

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState)
    expect(keys.length).toBe(2);
    expect(endState["todolistId1"]).toStrictEqual([]);
    expect(endState["todolistId2"]).toStrictEqual([]);
})

test('tasks should be added for todolist', ()=>{
    const action= setTaskAC(startState["todolistId1"], "todolistId1")

    const endState = tasksReducer({
        "todolistId2":[],
        "todolistId1":[],
    },action)
    expect(endState["todolistId1"].length).toBe(3);
})