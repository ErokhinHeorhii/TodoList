import React from 'react'

import { Button } from '@mui/material'

import { TaskFilterType } from '../../todolists-reducers'

type FilterButtonType = {
  onClick: () => void
  selectedFilter: TaskFilterType
  buttonFilter: TaskFilterType
  children: React.ReactNode
}

export const FilterButton: React.FC<FilterButtonType> = ({
  onClick,
  selectedFilter,
  buttonFilter,
  children,
}) => {
  return (
    <Button
      onClick={onClick}
      variant={buttonFilter === selectedFilter ? 'contained' : 'outlined'}
      size={'small'}
      color={'primary'}
      style={{ marginRight: '10px' }}
    >
      {children}
    </Button>
  )
}
