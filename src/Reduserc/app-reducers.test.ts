
import {appReducer, RequestStatusType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

type InitialStateType = {
    status:  RequestStatusType,
    error:  null | string,
    isInitialized:  boolean
}

let startState: InitialStateType

beforeEach(()=>{
    startState ={
        status: 'idle',
        error: null,
        isInitialized: false
    }
})

test('correct error message should be set', () => {

    const action = setAppErrorAC({error:"some error"})
    const endState = appReducer(startState, action)

    expect(endState.error).toBe("some error")

})

test('correct status should be set', () => {

    const action = setAppStatusAC( {status:"loading"})
    const endState = appReducer(startState, action)

    expect(endState.status).toBe("loading")

})