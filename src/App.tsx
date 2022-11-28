import React, {useState} from 'react';
import {v1} from 'uuid';
import './App.css';
import AddItemForm from './Components/AddItemForm';
import TodoList, {TaskType, TodolistType} from './TodoList';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";

export type TaskFilterType = "all" | "active" | "completed";

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

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {id: todolistID1, title: 'What to learn', filter: 'all'},
        {id: todolistID2, title: 'What to buy', filter: 'completed'},
    ])
    let [tasks, setTasks] = useState<TasksStateType>({
        [todolistID1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "ReactJS", isDone: false},
            {id: v1(), title: "Rest API", isDone: false},
            {id: v1(), title: "GraphQL", isDone: false},
        ],
        [todolistID2]: [
            {id: v1(), title: "HTML&CSS2", isDone: true},
            {id: v1(), title: "JS2", isDone: true},
            {id: v1(), title: "ReactJS2", isDone: false},
            {id: v1(), title: "Rest API2", isDone: false},
            {id: v1(), title: "GraphQL2", isDone: false},
        ]
    });
    const deleteTodoList = (todolistID: string) => {
        setTodolists(todolists.filter(item => item.id !== todolistID))
        console.log("before t", tasks)

        delete tasks[todolistID]
        console.log("after t", tasks)

    }

    const removeTask = (todolistId: string, taskId: string) => {
        // task = task.filter(item => item.id !== taskId)
        // setTask(task)
        //  setTask работает асинхронно
        setTasks({...tasks, [todolistId]: tasks[todolistId].filter(item => item.id !== taskId)})

    }
    // ///////////////////////////////////
    const changeTask = (todolistID: string, buttonName: TaskFilterType) => {
        // filterTask(buttonName)
        let todolist = todolists.find(item => item.id === todolistID)
        if (todolist) {
            todolist.filter = buttonName
            setTodolists([...todolists])
        }
    }

    // UseState работает асинхронно
    const addTask = (todolistID: string, title: string) => {
        const newTask = {
            id: v1(), title, isDone: false
        }
        // let newTaskArray = [newTask, ...task]
        // setTask(newTaskArray)
        setTasks({...tasks, [todolistID]: [newTask, ...tasks[todolistID]]})

    }

    const addTodoList = (title: string) => {
        const newTodolistId: string = v1()
        setTodolists([...todolists, {id: newTodolistId, title, filter: "all"}])
        setTasks({
            ...tasks, [newTodolistId]: [
                {id: v1(), title: "ReactJS2", isDone: false},
                {id: v1(), title: "Rest API2", isDone: false},
                {id: v1(), title: "GraphQL2", isDone: false},]
        })
    }

    const changeStatus = (todolistID: string, taskId: string, isDone: boolean) => {
        // setTask(task.map(item=>item.id !== taskId ? item : {...item, isDone}))
        setTasks({
            ...tasks, [todolistID]: tasks[todolistID].map(item => item.id === taskId ?
                {...item, isDone} : item)
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
                                taskForFilter = taskForFilter.filter(item => !item.isDone)
                            }
                            if (item.filter === "completed") {
                                taskForFilter = taskForFilter.filter(item => item.isDone)
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
