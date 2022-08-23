import React from "react";
import { FilterValuesType } from "./App";

type TodoListPropsType = {
  title: string;
  task: Array<TaskType>;
  removeTask: (taskId: number) => void;
  changeFilter: (filter: FilterValuesType) => void
}

export type TaskType = {
  id: number;
  title: string;
  isDone: boolean;
}

const TodoList = (props: TodoListPropsType) => {
  const tasksItems = props.task.map(item => {
    return (
      <li key={item.id}>
        <input type="checkbox" checked={item.isDone} />
        <span>{item.title}</span>
        <button onClick={() => props.removeTask(item.id)}>x </button>
      </li>
    )
  })

  return (
    <div>
      <h3>{props.title}</h3>
      <div>
        <input />
        <button>+</button>
      </div>
      <ul>
        {tasksItems}
      </ul>
      <div>
        <button onClick={() => props.changeFilter("all")}>All</button>
        <button onClick={() => props.changeFilter("active")}>Active</button>
        <button onClick={() => props.changeFilter("completed")}>Completed</button>
      </div>
    </div>

  );
}

export default TodoList;