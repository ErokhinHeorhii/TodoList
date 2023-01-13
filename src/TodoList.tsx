import React, { useCallback, useEffect } from 'react'

import { Delete } from '@mui/icons-material'
import { Button } from '@mui/material'

import { TaskStatuses, TaskType } from './api/todolist-api'
import AddItemForm from './Components/AddItemForm'
import EditableSpan from './Components/EditableSpan'
import { Task } from './Components/TaskComponent'
import { getTaskTC, TaskDomainType } from './Reduserc/tasks-reducers'
import { TaskFilterType, TodolistDomainType } from './Reduserc/todolists-reducers'
import { useAppDispatch } from './State/Store'

type TodolistPropsType = {
  todolist: TodolistDomainType
  // title: string;
  task: Array<TaskDomainType>
  removeTask: (todolistId: string, taskId: string) => void
  changeTask: (todolistID: string, buttonName: TaskFilterType) => void
  addTask: (todolistID: string, title: string) => void
  changeStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
  // filter: TaskFilterType
  // todolistID: string
  deleteTodolist: (todolistID: string) => void
  changeTaskTitle: (todolistID: string, taskId: string, title: string) => void
  changeTodolistTitle: (todolistID: string, title: string) => void
  demo?: boolean
}

const Todolist = React.memo(({ demo = false, ...props }: TodolistPropsType) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (demo) {
      return
    }
    dispatch(getTaskTC(props.todolist.id))
  }, [])

  let taskForFilter = props.task

  if (props.todolist.filter === 'active') {
    taskForFilter = props.task.filter(item => item.status === TaskStatuses.New)
  }
  if (props.todolist.filter === 'completed') {
    taskForFilter = props.task.filter(item => item.status === TaskStatuses.Completed)
  }

  const tasksItems = props.task.length ? (
    taskForFilter.map(item => {
      return (
        <Task
          changeTaskTitle={props.changeTaskTitle}
          itemTask={item}
          removeTask={props.removeTask}
          changeTaskStatus={props.changeStatus}
          todolistID={props.todolist.id}
        />
      )
    })
  ) : (
    <div>"No task there"</div>
  )

  const addTask = useCallback(
    (title: string) => {
      props.addTask(props.todolist.id, title)
    },
    [props.todolist.id, props.addTask]
  )

  const changeTaskHandler = useCallback(
    (title: TaskFilterType) => {
      return () => {
        props.changeTask(props.todolist.id, title)
      }
    },
    [props.changeTask, props.todolist.id]
  )

  const onClickHandlerForTodoList = () => {
    props.deleteTodolist(props.todolist.id)
  }
  const changeTodoListTitle = useCallback(
    (newTitle: string) => {
      props.changeTodolistTitle(props.todolist.id, newTitle)
    },
    [props.changeTodolistTitle, props.todolist.id]
  )

  return (
    <div>
      <h3>
        <EditableSpan value={props.todolist.title} changeTitle={changeTodoListTitle} />
        <Button
          onClick={onClickHandlerForTodoList}
          variant="outlined"
          startIcon={<Delete />}
          style={{ maxWidth: '60px', maxHeight: '30px', minWidth: '06px', minHeight: '30px' }}
          disabled={props.todolist.entityStatus === 'loading'}
        >
          Del
        </Button>
      </h3>
      <div>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'} />
      </div>
      <ul>{tasksItems}</ul>
      <div style={{ paddingTop: '10px' }}>
        <Button
          onClick={changeTaskHandler('all')}
          variant={props.todolist.filter === 'all' ? 'contained' : 'outlined'}
          size={'small'}
          color={'primary'}
        >
          All
        </Button>
        <Button
          onClick={changeTaskHandler('active')}
          variant={props.todolist.filter === 'active' ? 'contained' : 'outlined'}
          size={'small'}
          color={'primary'}
        >
          Active
        </Button>
        <Button
          onClick={changeTaskHandler('completed')}
          variant={props.todolist.filter === 'completed' ? 'contained' : 'outlined'}
          size={'small'}
          color={'primary'}
        >
          Completed
        </Button>
      </div>
    </div>
  )
})

export default Todolist
