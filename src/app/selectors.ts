import { AppRootStateType } from '../State/Store'

export const selectStatus = (state: AppRootStateType) => state.app.status
export const selectIsInitialized = (state: AppRootStateType) => state.app.isInitialized
export const selectErrorApp = (state: AppRootStateType) => state.app.error
