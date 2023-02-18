import { ResponseType } from '../api/todolist-api'
import { setAppErrorAC, setAppStatusAC } from '../app/app-reducer'

export const hadleServerAppError = <T>(data: ResponseType<T>, dispatch: any) => {
  if (data.messages.length) {
    dispatch(setAppErrorAC({ error: data.messages[0] }))
  } else {
    dispatch(setAppErrorAC({ error: 'some error added' }))
  }
  dispatch(setAppStatusAC({ status: 'failed' }))
}

export const hadleServerNetworkError = (error: { message: string }, dispatch: any) => {
  dispatch(setAppErrorAC({ error: error.message ? error.message : 'some error occurred' }))
  dispatch(setAppStatusAC({ status: 'failed' }))
}
