import React from "react";
import { taskFilterType } from "./App";
import AddItemForm from "./Components/AddItemForm";
import EditableSpan from "./Components/EditableSpan";

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
  changeTaskTitle: (todoListsID: string, taskId: string, title: string) => void
  changeTodoListTitle: (todoListsID: string, title: string) => void
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

      const changeTaskTitle = (title: string) => {
        props.changeTaskTitle(props.todoListID, item.id, title)
      }

      return (
        <li key={item.id} className={item.isDone ? 'isDone' : ""}>
          <input  type="checkbox" onChange={
              e => props.changeStatus(props.todoListID, item.id, e.currentTarget.checked)
            } checked={item.isDone} />

          {/* <span>{item.title}</span> */}
          <EditableSpan title={item.title} changeTitle={changeTaskTitle} />
          <button onClick={() => { props.removeTask(props.todoListID, item.id) }}>x</button>
        </li>
      )
    })
    : <div>"No task there"</div>

  const addTask = (title: string) => {
    props.addTask(props.todoListID, title)
  }

  const changeTaskHandler = (title: taskFilterType) => {
    return () => { props.changeTask(props.todoListID, title) }
  }

  const onClickHandlerForTodoList = () => {
    props.deleteTodoList(props.todoListID)
  }
  const changeTitleCallback =(newTitle:string)=>{
    props.changeTodoListTitle( props.todoListID, newTitle)
  }

  return (
    <div>
      <h3>
        {/* {props.title} */}
        <EditableSpan title={props.title} changeTitle={changeTitleCallback} />
        <button onClick={onClickHandlerForTodoList}>Del</button>
      </h3>
      <div>
        <AddItemForm addItem={addTask} />
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

