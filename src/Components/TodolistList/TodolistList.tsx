import React, {useCallback, useEffect} from "react"
import '../../App.css';
import AddItemForm from '../../Components/AddItemForm';
import TodoList from '../../TodoList';
import {AppBar, Button, Container, Grid, IconButton, LinearProgress, Paper, Toolbar, Typography} from "@mui/material";
import {addTaskTC, deleteTaskTC, TasksStateType, updateTaskTC} from "../../Reduserc/tasks-reducers";
import {
    addTodolistTC,
    changeTodolistFilterAC,
    changeTodolistTitleTC,
    deleteTodolistTC,
    getTodolistTC,
    TaskFilterType,
    TodolistDomainType,
} from "../../Reduserc/todolists-reducers";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch, useAppSelector} from "../../State/Store";
import {TaskStatuses, TaskType} from "../../api/todolist-api";


type PropsType = {
    demo?: boolean
}

export const TodolistsList: React.FC<PropsType> = ({demo = false}) => {
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
        if (demo) {
            return
        }
        dispatch(getTodolistTC())
    }, [])

    return (
        <div>
            <Grid container style={{padding: "20px"}}>
                <AddItemForm addItem={addTodoList}/>
            </Grid>
            <Grid container>
                <Grid container spacing={3}>
                    {todolists.map(item => {
                        let taskForFilter = tasks[item.id];
                        return (<Grid item>
                            <Paper style={{padding: "15px"}}>
                                <TodoList todolist={item}
                                          key={item.id}
                                          task={taskForFilter}
                                          removeTask={removeTask}
                                          changeTask={changeTask}
                                          addTask={addTask}
                                          changeStatus={changeStatus}
                                          deleteTodolist={deleteTodoList}
                                          changeTaskTitle={changeTaskTitle}
                                          changeTodolistTitle={changeTodoListTitle}
                                          demo={demo}
                                />
                            </Paper>
                        </Grid>)
                    })}
                </Grid>
            </Grid>
        </div>
    )
}