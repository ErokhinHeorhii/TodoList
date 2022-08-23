import React, { useState } from 'react';
import './App.css';
import TodoList, { TaskType } from './TodoList';


export type FilterValuesType = "all" | "active" | "completed"


// class components
function App() {

    // BusnessLogic
    // бывает еще интерфейс -терминал 
    // Графический интерфейс у нас в проекте (GUI)
    // GUI-> CRUD(Create, Read, Update, Delete)

    const TodoListTitle = "What to learn now? "

    const [task, setTask] = useState<Array<TaskType>>(
        [
            { id: 1, title: "HTML&CSS", isDone: true },
            { id: 2, title: "React", isDone: true },
            { id: 3, title: "JS&TS", isDone: false },
            { id: 4, title: "Git", isDone: true },
        ]
    )

    const removeTask = (taskId: number) => {
        let taskfilter = task.filter(item => item.id !== taskId)
        setTask(taskfilter)
        console.log(task)
        //  setTask работает асинхронно
    }
// ////////////////////////////////////////////////////////////////
    
    const [filter, setFilter] = useState<FilterValuesType>("all")
    // UseState работает асинхронно

    function changeFilter(filter: FilterValuesType) {
        setFilter(filter)
    }
    //
    const getTasksforRender = () => {
        switch (filter) {
            case "active":
                return task.filter(item => !item.isDone)
            case "completed":
                return task.filter(item => item.isDone)
            default:
                return task
        }

    }

    return (
        <div className="App">
            <TodoList title={TodoListTitle} task={getTasksforRender()}
                removeTask={removeTask} changeFilter={changeFilter} />
        </div>
    );
}

export default App;
