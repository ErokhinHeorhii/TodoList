import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@mui/material";
import {useAppDispatch, useAppSelector} from "./State/Store";
import {ErrorSnackbar} from "./Components/ErrorSnackbar/ErrorSnackbar";
import {TodolistsList} from "./Components/TodolistList/TodolistList";
import {Navigate, Route, Routes} from "react-router-dom";
import {Login} from "./features/Login";
import {initializeTC} from "./Reduserc/app-reducer";
import {logoutTC} from "./Reduserc/auth-reducers";

type PropsType = {
    demo?: boolean
}

// class components
function App({demo = false}: PropsType) {
    // BusnessLogic
    // бывает еще интерфейс -терминал 
    // Графический интерфейс у нас в проекте (GUI)
    // GUI-> CRUD(Create, Read, Update, Delete)
    // С + -одна функция
    // r +++
    // U ++!-пропорционально сложности обьекта (сколько свойств столько и функций внесения изменений)
    // D +
    const initialized = useAppSelector((state) => state.app.isInitialized)
    const status = useAppSelector((state) => state.app.status)
    const error = useAppSelector((state) => state.app.error)
    const isLoggedIn = useAppSelector<boolean>(state=>state.auth.isLoggedIn)
    const dispatch = useAppDispatch()

    useEffect(()=>{
        dispatch(initializeTC())
    },[])

    if(!initialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

 const onClickHandlerLogOut =()=>{
     dispatch(logoutTC())
 }
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
                    {isLoggedIn && <Button color="inherit" onClick={onClickHandlerLogOut}>Log out</Button>}
                </Toolbar>
                {status === "loading" && <LinearProgress/>}
            </AppBar>
            <Container fixed>
                <Routes>
                    <Route path='/'  element={<TodolistsList demo={demo}/>}/>
                    <Route path='/login' element={<Login/>}/>
                    <Route path='/404' element={<h1>404: PAGE NOT FOUND</h1>} />
                    <Route path='*' element={<Navigate to='/404'/>} />
                </Routes>
            </Container>
        </div>
    );
}

export default App;
