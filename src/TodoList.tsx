import React, {useCallback, useEffect} from "react";
import AddItemForm from "./Components/AddItemForm";
import EditableSpan from "./Components/EditableSpan";
import {Button} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {Task} from "./Components/TaskComponent";
import {TaskStatuses, TaskType} from "./api/todolist-api";
import {TaskFilterType} from "./Redusers/todolists-redusers";
import {useAppDispatch} from "./State/Store";
import {getTaskTC} from "./Redusers/tasks-redusers";

type TodolistPropsType = {
    title: string;
    task: Array<TaskType>;
    removeTask: (todolistId: string, taskId: string) => void;
    changeTask: (todolistID: string, buttonName: TaskFilterType) => void;
    addTask: (todolistID: string, title: string) => void;
    changeStatus: (todolistID: string, taskId: string, status: TaskStatuses) => void
    filter: TaskFilterType
    todolistID: string
    deleteTodolist: (todolistID: string) => void
    changeTaskTitle: (todolistID: string, taskId: string, title: string) => void
    changeTodolistTitle: (todolistID: string, title: string) => void
}

const Todolist = React.memo((props: TodolistPropsType) => {

const dispatch = useAppDispatch()
    useEffect(()=>{
        dispatch(getTaskTC(props.todolistID))
    },[])

    let taskForFilter = props.task

    if (props.filter === "active") {
        taskForFilter = props.task.filter(item => item.status === TaskStatuses.New)
    }
    if (props.filter === "completed") {
        taskForFilter = props.task.filter(item => item.status === TaskStatuses.Completed)
    }

    const tasksItems = props.task.length ?
        taskForFilter.map(item => {
          return  <Task
                changeTaskTitle={props.changeTaskTitle}
                itemTask={item}
                removeTask={props.removeTask}
                changeTaskStatus={props.changeStatus}
                todolistID={props.todolistID}
            />
        })
        : <div>"No task there"</div>

    const addTask = useCallback((title: string) => {
        props.addTask(props.todolistID, title)
    }, [props.todolistID, props.addTask])

    const changeTaskHandler = useCallback((title: TaskFilterType) => {
        return () => {
            props.changeTask(props.todolistID, title)
        }
    }, [props.changeTask, props.todolistID])

    const onClickHandlerForTodoList = () => {
        props.deleteTodolist(props.todolistID)
    }
    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodolistTitle(props.todolistID, newTitle)
    }, [props.changeTodolistTitle, props.todolistID])

    return (
        <div>
            <h3>
                <EditableSpan title={props.title} changeTitle={changeTodoListTitle}/>
                <Button onClick={onClickHandlerForTodoList} variant="outlined" startIcon={<Delete/>}
                        style={{maxWidth: '60px', maxHeight: '30px', minWidth: '06px', minHeight: '30px'}}>
                    Del
                </Button>
            </h3>
            <div>
                <AddItemForm addItem={addTask}/>
            </div>
            <ul>
                {tasksItems}
            </ul>
            <div style={{paddingTop: "10px"}}>
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
})

export default Todolist;

