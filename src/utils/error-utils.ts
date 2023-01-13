import { ResponseType } from '../api/todolist-api'
import { setAppErrorAC, setAppStatusAC } from '../Reduserc/app-reducer'
import { AppDispatch } from '../State/Store'

export const hadleServerAppError = <T>(data: ResponseType<T>, dispatch: AppDispatch) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setAppErrorAC({ error: 'some error added' }))
  }
  dispatch(setAppStatusAC({ status: 'failed' }))
}

export const hadleServerNetworkError = (error: { message: string }, dispatch: AppDispatch) => {
  dispatch(setAppErrorAC({ error: error.message ? error.message : 'some error occurred' }))
  dispatch(setAppStatusAC({ status: 'failed' }))
}
