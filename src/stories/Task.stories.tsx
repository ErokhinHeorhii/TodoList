import React from 'react'

import { action } from '@storybook/addon-actions'
import { ComponentMeta, ComponentStory } from '@storybook/react'

import { TaskPriorities, TaskStatuses } from '../api/todolist-api'
import { Task } from '../Components/TaskComponent/TaskComponent'
import { todolistId2 } from '../Components/TodolistList/todolists-reducers'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Todolist/Task',
  component: Task,
  args: {
    changeTaskStatus: action('ChangeStatus'),
    changeTaskTitle: action('ChangeTaskTitle'),
    removeTask: action('removeTask'),
    itemTask: {
      id: 'dd',
      todoListId: 'todolistId2',
      startDate: '',
      order: 0,
      addedDate: '',
      deadline: '',
      description: '',
      priority: TaskPriorities.Low,
      title: 'JS',
      status: TaskStatuses.Completed,
      entityStatus: 'idle',
    },
  },
} as ComponentMeta<typeof Task>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = args => <Task {...args} />

export const TaskIsDoneStory = Template.bind({})
TaskIsDoneStory.args = {
  todolistID: 'string',
}

export const TaskIsNotDoneStory = Template.bind({})
TaskIsNotDoneStory.args = {
  itemTask: {
    id: 'fff',
    status: TaskStatuses.New,
    title: 'HTML',
    todoListId: todolistId2,
    startDate: '',
    order: 0,
    addedDate: '',
    deadline: '',
    description: '',
    priority: TaskPriorities.Low,
    entityStatus: 'idle',
  },
  todolistID: 'fdsds',
}
