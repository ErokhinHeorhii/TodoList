import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { taskFilterType } from "./App";

type TodoListPropsType = {
  title: string;
  task: Array<TaskType>;
  removeTask: (todoListId: string, taskId: string) => void;
  changeTask: (todoListID: string, buttonName: taskFilterType) => void;
  addTask: (todoListID: string, title: string) => void;
  changeStatus: (todolistID: string, taskId: string, isDone: boolean) => void
  filter: taskFilterType
  todoListID: string
  deleteTodoList: (todoListID: string) => void
}

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
}

export type TodoListType = {
  id: string;
  title: string;
  filter: taskFilterType;
}
const TodoList = (props: TodoListPropsType) => {
  const tasksItems = props.task.length ?
    props.task.map(item => {
      return (
        <li key={item.id} className={item.isDone ? 'isDone' : ""}>
          <input
            type="checkbox" onChange={
              e => props.changeStatus(props.todoListID, item.id, e.currentTarget.checked)
            } checked={item.isDone} />

          <span>{item.title}</span>
          <button onClick={() => { props.removeTask(props.todoListID, item.id) }}>x</button>
        </li>
      )
    }) :
    <div>"No task there"</div>


  const [title, setTitle] = useState<string>(' ')
  const [error, setError] = useState<boolean>(false)

  const addTask = () => {
    const trimTitle = title.trim()
    if (trimTitle) {
      props.addTask(props.todoListID, trimTitle)
    } else {
      setError(true)
    }
    setTitle(' ')
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(!error)
    }
    setTitle(e.currentTarget.value)
  }

  const onKeDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  const changeTaskHandler = (title: taskFilterType) => {
    return () => { props.changeTask(props.todoListID, title) }
  }

  const userMessage = error
    ? <div style={{ color: "red" }}>Title is requared! </div>
    : <div> Please, create this</div>

  const onClickHandlerForTodoList = () => {
    props.deleteTodoList(props.todoListID)
  }

  return (
    <div>
      <h3>{props.title}
        <button onClick={onClickHandlerForTodoList}>Del</button>
      </h3>
      <div>
        <input
          className={error ? "error" : ""}
          value={title}
          onChange={onChangeHandler}
          onKeyDown={onKeDownHandler}
        />
        <button onClick={addTask}>+</button>
        {userMessage}
      </div>
      <ul>
        {tasksItems}
      </ul>
      <div>
        <button className={props.filter === "all" ? "btn-active" : ""} onClick={changeTaskHandler('all')}>All</button>
        <button className={props.filter === "active" ? "btn-active" : ""} onClick={changeTaskHandler('active')}>Active</button>
        <button className={props.filter === "completed" ? "btn-active" : ""} onClick={changeTaskHandler('completed')}>Completed</button>
      </div>
    </div>

  );
}

export default TodoList;