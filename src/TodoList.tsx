import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { taskFilterType } from "./App";

type TodoListPropsType = {
  title: string;
  task: Array<TaskType>;
  removeTask: (taskId: string) => void;
  changeTask: (buttonName: taskFilterType) => void;
  addTask: (title: string) => void;
}

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
}

const TodoList = (props: TodoListPropsType) => {
  const tasksItems = props.task.length ?
    props.task.map(item => {
      return (
        <li key={item.id}>
          <input type="checkbox" checked={item.isDone} />
          <span>{item.title}</span>
          <button onClick={() => { props.removeTask(item.id) }}>x </button>
        </li>
      )
    }) :
    <div>"No task there"</div>


  const [title, setTitle] = useState(' ')

  const addTask = () => {
    props.addTask(title)
    setTitle(' ')
  }

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={title}
          onChange={onChangeHandler}
          onKeyDown={onKeDownHandler}
        />
        <button onClick={addTask}>+</button>
      </div>
      <ul>
        {tasksItems}
      </ul>
      <div>
        <button onClick={changeTaskHandler('all')}>All</button>
        <button onClick={changeTaskHandler('active')}>Active</button>
        <button onClick={changeTaskHandler('completed')}>Completed</button>
      </div>
    </div>

  );
}

export default TodoList;