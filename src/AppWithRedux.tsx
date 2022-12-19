import React, {useCallback, useEffect} from 'react';
import './App.css';
import AddItemForm from './Components/AddItemForm';
import TodoList from './TodoList';
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@mui/material";
import {addTaskTC, deleteTaskTC, updateTaskTC} from "./Redusers/tasks-redusers";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    deleteTodolistTC,
    getTodolistTC,
    TaskFilterType,
    TodolistDomainType,
} from "./Redusers/todolists-redusers";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "./State/Store";
import {TaskStatuses, TaskType} from "./api/todolist-api";


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

    const todolists = useSelector<AppRootStateType, Array<TodolistDomainType>>((state) => state.todolists)
    const tasks = useSelector<AppRootStateType, TasksStateType>((state) => state.tasks)
    const dispatch = useAppDispatch()

    const deleteTodoList = useCallback((todolistID: string) => {
        dispatch(deleteTodolistTC(todolistID))
    }, [dispatch])

    const removeTask = useCallback((todolistId: string, taskId: string) => {
        dispatch(deleteTaskTC(todolistId, taskId))
    }, [dispatch])

    const changeTask = useCallback((todolistID: string, buttonName: TaskFilterType) => {
        dispatch(changeTodolistFilterAC(todolistID, buttonName))
    }, [dispatch])

    // UseState работает асинхронно
    const addTask = useCallback((todolistID: string, title: string) => {
        dispatch(addTaskTC(todolistID, title))
    }, [dispatch])

    const addTodoList = useCallback((title: string) => {
        let action = addTodolistTC(title)
        dispatch(action)
    }, [dispatch])

    const changeStatus = useCallback((todolistID: string, taskId: string, status: TaskStatuses) => {
        dispatch(updateTaskTC(todolistID, taskId, {status}))
    }, [dispatch])

    const changeTaskTitle = useCallback((todolistsID: string, taskId: string, title: string) => {
        dispatch(updateTaskTC(todolistsID, taskId, {title}))
    }, [dispatch])

    const changeTodoListTitle = useCallback((todolistID: string, title: string) => {
        dispatch(changeTodolistTitleTC(todolistID, title))
    }, [dispatch])

    useEffect(() => {
        dispatch(getTodolistTC())
    }, [])

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
                <Grid container style={{padding: "20px"}}>
                    <AddItemForm addItem={addTodoList}/>
                </Grid>
                <Grid container>
                    <Grid container spacing={3}>
                        {todolists.map(item => {
                            let taskForFilter = tasks[item.id];
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
