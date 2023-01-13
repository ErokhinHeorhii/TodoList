import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'

import AppWithRedux from '../AppWithRedux'

import { ReduxStoreProviderDecorator } from './Decorator/ReduxStoreProviderDecorator'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Todolist/AppWithRedux',
  component: AppWithRedux,
  decorators: [ReduxStoreProviderDecorator],
} as ComponentMeta<typeof AppWithRedux>

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof AppWithRedux> = args => <AppWithRedux demo={true} />

export const AppWithReduxStories = Template.bind({})
