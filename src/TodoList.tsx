import React, {ChangeEvent} from "react";
import {TaskFilterType} from "./App";
import AddItemForm from "./Components/AddItemForm";
import EditableSpan from "./Components/EditableSpan";
import {Button, Checkbox, IconButton} from "@mui/material";
import {Delete} from "@mui/icons-material";

type TodolistPropsType = {
    title: string;
    task: Array<TaskType>;
    removeTask: (todolistId: string, taskId: string) => void;
    changeTask: (todolistID: string, buttonName: TaskFilterType) => void;
    addTask: (todolistID: string, title: string) => void;
    changeStatus: (todolistID: string, taskId: string, isDone: boolean) => void
    filter: TaskFilterType
    todolistID: string
    deleteTodolist: (todolistID: string) => void
    changeTaskTitle: (todolistID: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistID: string, title: string) => void
}

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
}
export type TodolistType = {
    id: string;
    title: string;
    filter: TaskFilterType;
}
const TodoList = (props: TodolistPropsType) => {

    const tasksItems = props.task.length ?
        props.task.map(item => {
            const changeTaskTitle = (title: string) => {
                props.changeTaskTitle(props.todolistID, item.id, title)
            }
            const changeStatusCheckbox = (e: ChangeEvent<HTMLInputElement>) => {
                props.changeStatus(props.todolistID, item.id, e.currentTarget.checked)
            }
            return (
                <li key={item.id} className={item.isDone ? 'isDone' : ""}>
                    <Checkbox color='primary' onChange={changeStatusCheckbox} checked={item.isDone}/>
                    <EditableSpan title={item.title} changeTitle={changeTaskTitle}/>
                    <IconButton aria-label="delete" size="small"
                                onClick={() => {
                                    props.removeTask(props.todolistID, item.id)
                                }}
                    >
                        <Delete fontSize="small"/>
                    </IconButton>
                </li>
            )
        })
        : <div>"No task there"</div>

    const addTask = (title: string) => {
        props.addTask(props.todolistID, title)
    }

    const changeTaskHandler = (title: TaskFilterType) => {
        return () => {
            props.changeTask(props.todolistID, title)
        }
    }

    const onClickHandlerForTodoList = () => {
        props.deleteTodolist(props.todolistID)
    }
    const changeTodoListTitle = (newTitle: string) => {
        props.changeTodolistTitle(props.todolistID, newTitle)
    }

    return (
        <div>
            <h3>
                {/* {props.title} */}
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <Button onClick={onClickHandlerForTodoList} variant="outlined" startIcon={<Delete/>}
                        style={{maxWidth: '60px', maxHeight: '30px', minWidth: '06px', minHeight: '30px'}}>
                    Del
                </Button>
                {/*<button onClick={onClickHandlerForTodoList}>Del</button>*/}

            </h3>
            <div>
                <AddItemForm addItem={addTask}/>
            </div>
            <ul>
                {tasksItems}
            </ul>
            <div>
                <Button
                    onClick={changeTaskHandler('all')}
                    variant={props.filter === "all" ? "contained" : "outlined"}
                    size={"small"}
                    color={"primary"}>All</Button>
                <Button
                    onClick={changeTaskHandler('active')}
                    variant={props.filter === "active" ? "contained" : "outlined"}
                    size={"small"}
                    color={"primary"}>Active</Button>
                <Button
                    onClick={changeTaskHandler('completed')}
                    variant={props.filter === "completed" ? "contained" : "outlined"}
                    size={"small"}
                    color={"primary"}>Completed</Button>
            </div>
        </div>

    );
}

export default TodoList;

