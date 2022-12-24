
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

 export const initialState = {
    status: 'idle'  as RequestStatusType,
    error: null as null | string
}

 export type InitialStateType = typeof initialState
export type SetErrorACType=ReturnType<typeof setAppErrorAC>
export type SetStatusACType=ReturnType<typeof setAppStatusAC>

type ActionsType = SetStatusACType|SetErrorACType

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {...state, status: action.status}
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        default:
            return state
    }
}


export const setAppStatusAC = (status:RequestStatusType) =>
    ({type: 'APP/SET-STATUS', status} as const)

export const setAppErrorAC = (error:null | string) =>
    ({type: 'APP/SET-ERROR', error} as const)

