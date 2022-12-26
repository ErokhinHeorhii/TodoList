import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {ComponentStory, ComponentMeta} from '@storybook/react';
import {Button} from './Button';
import TextField from "@mui/material/TextField/TextField";
import {IconButton} from "@mui/material";
import {AddBox} from "@mui/icons-material";
import {action} from "@storybook/addon-actions";
import AddItemForm from '../Components/AddItemForm';


type AddItemForm = {
    addItem: (title: string) => void
    disabled?: boolean
}
// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Todolist/AddItemForm',
    component: AddItemForm,
    argTypes: {
        addItem: {
            discription: "Button clicked incide form"
        }
    },
} as ComponentMeta<typeof AddItemForm>;

const Template: ComponentStory<typeof AddItemForm> = (args) => <AddItemForm {...args} />;

const TemplateError: ComponentStory<typeof AddItemForm> = (args) => {
    let [title, setTitle] = useState("")
    let [error, setError] = useState<string | null>("Title is required")

    const addItem = () => {
        if (title.trim() !== "") {
            args.addItem(title);
            setTitle("");
        } else {
            setError("Title is required");
        }
    }

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null);
        }
        if (e.charCode === 13) {
            addItem();
        }
    }

    return <div>
        <TextField variant="outlined"
                   error={!!error}
                   value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   label="Title"
                   helperText={error}
        />
        <IconButton color="primary" onClick={addItem}>
            <AddBox/>
        </IconButton>
    </div>
}


export const TemplateWithError = TemplateError.bind({});

export const AddItemFormStory = Template.bind({});
AddItemFormStory.args = {
    addItem: action("Button clicked incide form")
}

export const AddItemFormDisabled = Template.bind({});
AddItemFormDisabled.args = {
    addItem: action("Button clicked incide form"),
    disabled:true
}