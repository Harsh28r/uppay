import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "../firebase"
import type { AuthState, User } from "../types"

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    return {
      id: user.uid,
      email: user.email!,
      name: user.displayName || user.email!.split("@")[0],
      createdAt: new Date().toISOString(),
    }
  },
)

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    return {
      id: user.uid,
      email: user.email!,
      name: name,
      createdAt: new Date().toISOString(),
    }
  },
)

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await signOut(auth)
})

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: true,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.isAuthenticated = !!action.payload
      state.loading = false
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.isAuthenticated = true
        state.loading = false
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
      })
  },
})

export const { setUser, setLoading } = authSlice.actions
export default authSlice.reducer
