import React, { useState } from 'react';
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

    let [task, deleteTask] = useState<Array<TaskType>>(
        [
            { id: 1, title: "HTML&CSS", isDone: false },
            { id: 2, title: "React", isDone: true },
            { id: 3, title: "JS&TS", isDone: false },
            { id: 4, title: "Git", isDone: true },
        ]
    )

    const removeTask = (taskId: number) => {
        task = task.filter(item => item.id !== taskId)
        deleteTask(task)
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


    return (
        <div className="App">
            <TodoList title={TodoListTitle}
                task={setFiltertask()}
                removeTask={removeTask}
                changeTask={changeTask} />
        </div>
    );
}

export default App;
