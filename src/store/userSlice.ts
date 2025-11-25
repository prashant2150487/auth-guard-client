import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type UserProfile = {
  id?: string
  name?: string
  email?: string
  role?: string
  avatarUrl?: string
}

export type UserState = {
  profile: UserProfile | null
  token: string | null
  status: 'idle' | 'authenticated'
  error: string | null
}

const initialState: UserState = {
  profile: null,
  token: null,
  status: 'idle',
  error: null,
}

type CredentialsPayload = {
  token: string | null
  profile?: UserProfile | null
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.token = action.payload.token ?? null
      state.profile = action.payload.profile ?? null
      state.status = state.token ? 'authenticated' : 'idle'
      state.error = null
    },
    updateProfile: (state, action: PayloadAction<Partial<UserProfile>>) => {
      if (!state.profile) {
        state.profile = action.payload as UserProfile
        return
      }
      state.profile = { ...state.profile, ...action.payload }
    },
    clearSession: (state) => {
      state.profile = null
      state.token = null
      state.status = 'idle'
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setCredentials, updateProfile, clearSession, setUserError } = userSlice.actions
export default userSlice.reducer

