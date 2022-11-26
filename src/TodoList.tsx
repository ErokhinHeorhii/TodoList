import React, { ChangeEvent,  KeyboardEvent, useState } from "react";
import { taskFilterType } from "./App";

type TodoListPropsType = {
  title: string;
  task: Array<TaskType>;
  removeTask: (taskId: string) => void;
  changeTask: (buttonName: taskFilterType) => void;
  addTask: (title: string) => void;
  changeStatus: (taskId: string, isDone: boolean) => void
  filter: taskFilterType
}

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
}

const TodoList = (props: TodoListPropsType) => {

  const onChangeForCheckbox =(e:ChangeEvent<HTMLInputElement>, id:string)=>{
    let eventForCheckbox=e.currentTarget
    props.changeStatus(id, eventForCheckbox.checked)
  }

  const tasksItems = props.task.length ?
    
  props.task.map(item => {
      return (
        <li key={item.id} className={item.isDone ? 'isDone' : ""}>
          <input
            type="checkbox" onChange={(e)=>onChangeForCheckbox(e,item.id)} checked={item.isDone} />
          <span>{item.title}</span>
          <button onClick={() => {props.removeTask(item.id)}}>x</button>
        </li>
      )
    }) :
    <div>"No task there"</div>

  const [title, setTitle] = useState<string>(' ')
  const [error, setError] = useState<boolean>(false)

  const addTask = () => {
    const trimTitle = title.trim()
    if (trimTitle) {
      props.addTask(trimTitle)
    } else {
      setError(true)
    }

    setTitle(' ')
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false)
    }
    setTitle(e.currentTarget.value)
  }

  const onKeDownHandler = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTask()
    }
  }

  const changeTaskHandler = (title: taskFilterType) => {
    return () => { props.changeTask(title) }
  }

  const userMessage = error 
  ?  <div style ={{color:"red"}}>Title is requared! </div>
  : <div> Please, create this</div>

  return (
    <div>
      <h3>{props.title}</h3>
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