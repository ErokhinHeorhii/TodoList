import React, { useCallback, useEffect } from 'react'

import './App.css'
import AssignmentIcon from '@mui/icons-material/Assignment'
import {
  AppBar,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Toolbar,
  Typography,
} from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'

import img from '../assets/img/img.jpg'
import ErrorSnackbar from '../Components/ErrorSnackbar'
import { TodolistsList } from '../Components/TodolistList'
import { Login } from '../features/Login'
import { logoutTC } from '../features/Login/auth-reducers'
import { selectIsLoggedIn } from '../features/Login/selectors'
import { useAppDispatch, useAppSelector } from '../State/Store'

import { initializeTC } from './app-reducer'

import { appSelectors } from './index'

type PropsType = {
  demo?: boolean
}

function App({ demo = false }: PropsType) {
  const initialized = useAppSelector(appSelectors.selectIsInitialized)
  const status = useAppSelector(appSelectors.selectStatus)
  const error = useAppSelector(appSelectors.selectErrorApp)
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(initializeTC())
  }, [])

  const onClickHandlerLogOut = useCallback(() => {
    dispatch(logoutTC())
  }, [])

  if (!initialized) {
    return (
      <div style={{ position: 'fixed', top: '30%', textAlign: 'center', width: '100%' }}>
        <CircularProgress />
      </div>
    )
  }

  return (
    <div
      className="App"
      style={{
        backgroundImage: `url(${img})`,
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100%',
      }}
    >
      {error && <ErrorSnackbar />}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <AssignmentIcon />
          </IconButton>
          <Typography variant="h6">TodoList</Typography>
          {isLoggedIn && (
            <Button
              color="inherit"
              onClick={onClickHandlerLogOut}
              style={{ display: 'inline-block', marginLeft: 'auto' }}
            >
              Log out
            </Button>
          )}
        </Toolbar>
        {status === 'loading' && <LinearProgress />}
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<TodolistsList demo={demo} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/404" element={<h1>404: PAGE NOT FOUND</h1>} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </Container>
    </div>
  )
}

export default App
