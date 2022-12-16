import {v1} from "uuid";
import { TasksStateType} from "../App";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC, TaskFilterType, TodolistDomainType,
    todolistsReducer,
} from "./todolists-redusers";
import {removeTaskTodoListAC, tasksReducer} from "./tasks-redusers";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {

    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order:0 },
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order:0 },
    ];
})

test("correct todolist should be removed", () => {

    const endState = todolistsReducer(startState, removeTodolistAC(todolistId1));

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test("correct todolist should be added",
    () => {

        let newTodolistTitle = 'New Todolist'

        const endState = todolistsReducer(startState, addTodolistAC(newTodolistTitle))

        expect(endState.length).toBe(3)
        expect(endState[2].title).toBe(newTodolistTitle)
        expect(endState[2].filter).toBe("all")
    })

test("correct todolist should change its name", () => {

    let newTodolistTitle = "New Todolist";

    const endState = todolistsReducer(
        startState,
        changeTodolistTitleAC(todolistId2, newTodolistTitle)
    );

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test("correct filter of todolist should be changed",() => {

        let newFilter: TaskFilterType = "completed";

        const endState = todolistsReducer(
            startState,
            changeTodolistFilterAC(todolistId2, newFilter)
        );

        expect(endState[0].filter).toBe("all");
        expect(endState[1].filter).toBe(newFilter);
    });

test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
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

    const action = removeTaskTodoListAC('todolistId2')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})