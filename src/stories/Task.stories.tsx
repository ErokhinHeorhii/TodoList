import React from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {action} from "@storybook/addon-actions"
import {Task} from "../Components/TaskComponent";


// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/Task',
    component: Task,
    args:{
        changeTaskStatus: action("ChangeStatus"),
        changeTaskTitle: action("ChangeTaskTitle"),
        removeTask: action("removeTask"),
        itemTask: {id: "dd", isDone: true, title: "JS"},
    }
} as ComponentMeta<typeof Task>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const TaskIsDoneStory = Template.bind({})
TaskIsDoneStory.args = {
    todolistID: "string"
}

export const TaskIsNotDoneStory = Template.bind({})
TaskIsNotDoneStory.args = {
    itemTask: {id: "fff", isDone: false, title: "HTML"},
    todolistID: "fdsds"
}
