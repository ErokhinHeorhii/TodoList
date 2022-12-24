import React from 'react';
import './App.css';
import {AppBar, Button, Container,  IconButton, LinearProgress, Paper, Toolbar, Typography} from "@mui/material";
import { useAppSelector} from "./State/Store";
import {ErrorSnackbar} from "./Components/ErrorSnackbar/ErrorSnackbar";
import {TodolistsList} from "./Components/TodolistList/TodolistList";

type PropsType ={
    demo?: boolean
}
// class components
function App({demo=false}:PropsType) {

    // BusnessLogic
    // бывает еще интерфейс -терминал 
    // Графический интерфейс у нас в проекте (GUI)
    // GUI-> CRUD(Create, Read, Update, Delete)
    // С + -одна функция
    // r +++
    // U ++!-пропорционально сложности обьекта (сколько свойств столько и функций внесения изменений)
    // D +

    const status = useAppSelector((state) => state.app.status)
    const error = useAppSelector((state) => state.app.error)

    return (
        <div className="App">
            {error && <ErrorSnackbar/>}
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
                { status === "loading" && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <TodolistsList demo = {demo}/>
            </Container>
        </div>
    );
}

export default App;
