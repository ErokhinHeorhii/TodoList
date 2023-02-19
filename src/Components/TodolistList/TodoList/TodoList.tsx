import React, { useCallback, useEffect } from 'react'

import { Delete } from '@mui/icons-material'
import { Button } from '@mui/material'

import { TaskStatuses } from '../../../api/todolist-api'
import { useAppDispatch } from '../../../State/Store'
import AddItemForm from '../../AddItemForm/AddItemForm'
import EditableSpan from '../../EditableSpan/EditableSpan'
import { Task } from '../../TaskComponent/TaskComponent'
import { getTaskTC, TaskDomainType } from '../../TaskComponent/tasks-reducers'
import { TaskFilterType, TodolistDomainType } from '../todolists-reducers'

import { FilterButton } from './FilterButton/FilterButton'

type TodolistPropsType = {
  todolist: TodolistDomainType
  task: Array<TaskDomainType>
  removeTask: (todolistId: string, taskId: string) => void
  changeTask: (todolistID: string, buttonName: TaskFilterType) => void
  addTask: (todolistID: string, title: string) => void
  changeStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
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
          key={item.id}
          changeTaskTitle={props.changeTaskTitle}
          itemTask={item}
          removeTask={props.removeTask}
          changeTaskStatus={props.changeStatus}
          todolistID={props.todolist.id}
        />
      )
    })
  ) : (
    <div>No task there</div>
  )

  const addTask = useCallback(
    (title: string) => {
      props.addTask(props.todolist.id, title)
    },
    [props.todolist.id, props.addTask]
  )

  const changeTaskHandler = useCallback(
    (title: TaskFilterType) => {
      props.changeTask(props.todolist.id, title)
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
      <h3 style={{ display: 'flex' }}>
        <EditableSpan value={props.todolist.title} changeTitle={changeTodoListTitle} />
        <Button
          onClick={onClickHandlerForTodoList}
          variant="outlined"
          startIcon={<Delete />}
          style={{
            maxWidth: '60px',
            maxHeight: '30px',
            minWidth: '06px',
            minHeight: '30px',
            marginLeft: '15px',
          }}
          disabled={props.todolist.entityStatus === 'loading'}
        >
          Del
        </Button>
      </h3>
      <div>
        <AddItemForm addItem={addTask} disabled={props.todolist.entityStatus === 'loading'} />
      </div>
      <ul style={{ paddingLeft: '5px' }}>{tasksItems}</ul>
      <div style={{ paddingTop: '10px' }}>
        <FilterButton
          onClick={() => changeTaskHandler('all')}
          buttonFilter={'all'}
          selectedFilter={props.todolist.filter}
        >
          All
        </FilterButton>
        <FilterButton
          onClick={() => changeTaskHandler('active')}
          buttonFilter={'active'}
          selectedFilter={props.todolist.filter}
        >
          Active
        </FilterButton>
        <FilterButton
          onClick={() => changeTaskHandler('completed')}
          buttonFilter={'completed'}
          selectedFilter={props.todolist.filter}
        >
          Completed
        </FilterButton>
      </div>
    </div>
  )
})

export default Todolist
