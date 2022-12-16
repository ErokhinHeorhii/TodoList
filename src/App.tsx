import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import AddItemForm from './Components/AddItemForm';
import TodoList from './TodoList';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {TaskPriorities, TaskStatuses, TaskType} from "./api/todolist-api";
import {TaskFilterType, TodolistDomainType} from "./Redusers/todolists-redusers";


export type TasksStateType = {
    [key: string]: Array<TaskType>
}

// class components
function App() {

    // BusnessLogic
    // бывает еще интерфейс -терминал 
    // Графический интерфейс у нас в проекте (GUI)
    // GUI-> CRUD(Create, Read, Update, Delete)
    // С + -одна функция
    // r +++
    // U ++!-пропорционально сложности обьекта (сколько свойств столько и функций внесения изменений)
    // D +

    let todolistID1 = v1();
    let todolistID2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistDomainType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all', addedDate:"", order:0},
        {id: todolistID2, title: 'What to buy', filter: 'completed', addedDate:"", order:0},
    ])
    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, todoListId:todolistID1 , startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
            {id: v1(), title: "JS", status: TaskStatuses.Completed, todoListId:todolistID1 , startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
        ],
        [todolistID2]: [
            {id: v1(), title: "HTML&CSS2", status: TaskStatuses.Completed, todoListId:todolistID2 , startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
            {id: v1(), title: "JS2", status: TaskStatuses.Completed, todoListId:todolistID2 , startDate:"",
                order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
        ]
    });
    const deleteTodoList = (todolistID: string) => {
        setTodolists(todolists.filter(item => item.id !== todolistID))
        console.log("before t", tasks)

        delete tasks[todolistID]
        console.log("after t", tasks)

    }

    const removeTask = (todolistId: string, taskId: string) => {

        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(item => item.id !== taskId)})

    }

    const changeTask = (todolistID: string, value: TaskFilterType) => {
        let todolist = todolists.find(item => item.id === todolistID)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists])
        }
    }
    // UseState работает асинхронно
    const addTask = (todolistID: string, title: string) => {
        const newTask = {
            id: v1(), title, status: TaskStatuses.New, todoListId:todolistID , startDate:"",
            order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low
        }
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})
    }

    const addTodoList = (title: string) => {
        const newTodolistId: string = v1()
        setTodolists([...todolists, {id: newTodolistId, title:title, order:0, addedDate:"", filter: "all" }])
        setTasks({
            ...tasks, [newTodolistId]: [
                {id: v1(), title: "Html", status: TaskStatuses.New, todoListId:newTodolistId , startDate:"",
                    order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low},
                {id: v1(), title: "Css", status: TaskStatuses.New, todoListId:newTodolistId , startDate:"",
                    order:0, addedDate:"", deadline:"", description:"", priority: TaskPriorities.Low}]
        })
    }

    const changeStatus = (todolistID: string, taskId: string, status: TaskStatuses) => {
        // setTask(task.map(item=>item.id !== taskId ? item : {...item, isDone}))
        setTasks({
            ...tasks, [todolistID]: tasks[todolistID].map(item => item.id === taskId ?
                {...item, status} : item)
        })
    }

    const changeTaskTitle = (todolistsID: string, taskId: string, title: string) => {
        setTasks({
            ...tasks, [todolistsID]: tasks[todolistsID].map(item => item.id === taskId ?
                {...item, title} : item)
        })
    }

    const changeTodoListTitle = (todolistID: string, title: string) => {
        setTodolists(todolists.map(item => item.id === todolistID ? {...item, title} : item))
    }

    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                    >
                    </IconButton>
                    <Typography variant="h6">
                        TodoList
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style ={{padding:"20px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container>
                    <Grid container spacing={3}>
                        {todolists.map(item => {
                            let taskForFilter = tasks[item.id];
                            if (item.filter === "active") {
                                taskForFilter = taskForFilter.filter(item => item.status === TaskStatuses.New)
                            }
                            if (item.filter === "completed") {
                                taskForFilter = taskForFilter.filter(item => item.status === TaskStatuses.Completed)
                            }
                            return (<Grid item>
                                <Paper style={{padding: "15px"}}>
                                    <TodoList title={item.title}
                                              key={item.id}
                                              task={taskForFilter}
                                              removeTask={removeTask}
                                              changeTask={changeTask}
                                              addTask={addTask}
                                              changeStatus={changeStatus}
                                              filter={item.filter}
                                              todolistID={item.id}
                                              deleteTodolist={deleteTodoList}
                                              changeTaskTitle={changeTaskTitle}
                                              changeTodolistTitle={changeTodoListTitle}
                                    />
                                </Paper>
                            </Grid>)
                        })}
                    </Grid>
                </Grid>
            </Container>
        </div>
    );

}

export default App;
