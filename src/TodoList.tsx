import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { taskFilterType } from "./App";

type TodoListPropsType = {
  title: string;
  task: Array<TaskType>;
  removeTask: (taskId: string) => void;
  changeTask: (buttonName: taskFilterType) => void;
  addTask: (title: string) => void
}

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
}

const TodoList = (props: TodoListPropsType) => {

  const [title, setTitle] = useState<string>(' ')

  // проверка на ноль-
  const tasksItems = props.task.length
    ? props.task.map(item => {
      return (
        <li key={item.id}>
          <input type="checkbox" checked={item.isDone} />
          <span>{item.title}</span>
          <button onClick={() => { props.removeTask(item.id) }}>x </button>
        </li>
      )
    })
    : <span> Task list is empty</span>

  const onChangeAddTask = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value)
  }
  const onKeyDownAddTask = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTaskTodoList()
    }
  }

  const addTaskTodoList = () => {
    props.addTask(title)
    setTitle(' ')
  }

  const handlerCreater = (filter: taskFilterType) => {
    return () => props.changeTask(filter)
  }

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input value={title}
          onChange={onChangeAddTask}
          onKeyDown={onKeyDownAddTask} />
        <button onClick={addTaskTodoList}>Add</button>
      </div>
      <ul>
        {tasksItems}
      </ul>
      <div>
        <button onClick={handlerCreater("all")}>All</button>
        <button onClick={handlerCreater("active")}>Active</button>
        <button onClick={handlerCreater("completed")}>Completed</button>
      </div>
    </div>

  );
}

export default TodoList;