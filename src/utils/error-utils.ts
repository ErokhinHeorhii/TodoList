import {setAppErrorAC, setAppStatusAC} from "../Reduserc/app-reducer";
import {ResponseType} from "../api/todolist-api"
import {ThunkDispatch} from "redux-thunk";
import {Dispatch} from "redux";
import {AppDispatch} from "../State/Store";


export const hadleServerAppError=<T>(data:ResponseType<T>, dispatch:AppDispatch)=>{
    if (data.messages.length) {
        dispatch(setAppErrorAC(data.messages[0]))
    } else {
        dispatch(setAppErrorAC("some error added"))
    }
    dispatch(setAppStatusAC("failed"))
  }

  export const hadleServerNetworkError=(error: { message:string}, dispatch:AppDispatch)=>{
      dispatch(setAppErrorAC(error.message ? error.message : "some error occurred"))
      dispatch(setAppStatusAC("failed"))
  }