import { AppRootStateType } from '../../State/Store'

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn
