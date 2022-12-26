import {v1} from "uuid";
import {
    addTodolistAC, changeTodolistEntityStatusAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC,
    removeTodolistAC, setTodolistsAC, TaskFilterType, TodolistDomainType,
    todolistsReducer,
} from "./todolists-reducers";
import {removeTaskTodoListAC, tasksReducer, TasksStateType} from "./tasks-reducers";
import {TaskPriorities, TaskStatuses} from "../api/todolist-api";
import {RequestStatusType} from "./app-reducer";

let todolistId1: string
let todolistId2: string
let startState: Array<TodolistDomainType>

beforeEach(() => {

    todolistId1 = v1();
    todolistId2 = v1();

    startState = [
        {id: todolistId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
        {id: todolistId2, title: "What to buy", filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
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

        const endState = todolistsReducer(startState, addTodolistAC({
            id: v1(),
            addedDate: "",
            order: 0,
            title:  newTodolistTitle
        }))

        expect(endState.length).toBe(3)
        expect(endState[0].title).toBe(newTodolistTitle)
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

test("correct filter of todolist should be changed", () => {

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
            {
                id: '1',
                title: 'CSS',
                todoListId: 'todolistId1',
                startDate: "",
                order: 0,
                addedDate: "",
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                status: TaskStatuses.New,
                entityStatus:"idle"
            },
            {
                id: '2',
                title: 'JS',
                todoListId: 'todolistId1',
                startDate: "",
                order: 0,
                addedDate: "",
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                status: TaskStatuses.Completed,
                entityStatus:"idle"
            },
            {
                id: '3',
                title: 'React',
                todoListId: 'todolistId1',
                startDate: "",
                order: 0,
                addedDate: "",
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                status: TaskStatuses.New,
                entityStatus:"idle"
            }
        ],
        'todolistId2': [
            {
                id: '1',
                title: 'bread',
                todoListId: 'todolistId2',
                startDate: "",
                order: 0,
                addedDate: "",
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                status: TaskStatuses.New,
                entityStatus:"idle"
            },
            {
                id: '2',
                title: 'milk',
                todoListId: 'todolistId2',
                startDate: "",
                order: 0,
                addedDate: "",
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                status: TaskStatuses.Completed,
                entityStatus:"idle"
            },
            {
                id: '3',
                title: 'tea',
                todoListId: 'todolistId2',
                startDate: "",
                order: 0,
                addedDate: "",
                deadline: "",
                description: "",
                priority: TaskPriorities.Low,
                status: TaskStatuses.New,
                entityStatus:"idle"
            }
        ]
    }

    const action = removeTaskTodoListAC('todolistId2')

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState)

    expect(keys.length).toBe(1)
    expect(endState['todolistId2']).not.toBeDefined()
})

test("todolist should be set", () => {

    const action = setTodolistsAC(startState)
    const endState = todolistsReducer([], action)

    expect(endState.length).toBe(2);
});

test("correct entityStatus should be changed", () => {

    let newStatus: RequestStatusType = "loading";
    let action = changeTodolistEntityStatusAC(todolistId2, newStatus)
    const endState = todolistsReducer(startState, action);

    expect(endState[0].entityStatus).toBe("idle");
    expect(endState[1].entityStatus).toBe(newStatus);
});