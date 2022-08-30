import React, { useState } from 'react';
import { v1 } from 'uuid';
import './App.css';
import TodoList, { TaskType } from './TodoList';

export type taskFilterType = "all" | "active" | "completed";


// class components
function App() {

    // BusnessLogic
    // бывает еще интерфейс -терминал 
    // Графический интерфейс у нас в проекте (GUI)
    // GUI-> CRUD(Create, Read, Update, Delete)

    const TodoListTitle = "What to learn now? "

    let [task, setTask] = useState<Array<TaskType>>(
        [
            { id: v1(), title: "HTML&CSS", isDone: false },
            { id: v1(), title: "React", isDone: true },
            { id: v1(), title: "JS&TS", isDone: false },
            { id: v1(), title: "Git", isDone: true },
        ]
    )
    // console.log("V1", task[0].id)

    const removeTask = (taskId: string) => {
        task = task.filter(item => item.id !== taskId)
        setTask(task)
        //  setTask работает асинхронно
    }
    // ///////////////////////////////////
    const [filter, filterTask] = useState<taskFilterType>("all")

    function setFiltertask() {
        let taskForFilter = task;
        if (filter === "active") {
          return  taskForFilter = task.filter(item => item.isDone === false)
        }
        if (filter === "completed") {
          return  taskForFilter = task.filter(item => item.isDone === true)
        }
        return taskForFilter
    }

    const changeTask = (buttonName: taskFilterType) => {
        filterTask(buttonName)
    }
    // UseState работает асинхронно

    //
const addTask=(title:string)=>{
    const newTask={
        id: v1(), title: title, isDone: false 
    }
   
    let newTaskArray=[ newTask, ...task]
    setTask(newTaskArray)
}

    return (
        <div className="App">
            <TodoList title={TodoListTitle}
                task={setFiltertask()}
                removeTask={removeTask}
                changeTask={changeTask} 
                addTask={addTask}/>
        </div>
    );
}

export default App;
