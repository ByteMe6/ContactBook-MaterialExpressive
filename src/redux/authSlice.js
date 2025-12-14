// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { login as loginApi } from '../api/login.js';
// import { register as registerApi } from '../api/register.js';
//
// // Async thunks
// export const loginUser = createAsyncThunk(
//     'auth/loginUser',
//     async ({ login, password }, { rejectWithValue }) => {
//       try {
//         const response = await loginApi(login, password);
//         // Assuming response.data contains { token, user } or similar
//         const { token, user } = response.data;
//
//         // Store token in localStorage
//         if (token) {
//           localStorage.setItem('token', token);
//         }
//
//         return response.data;
//       } catch (error) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//       }
//     }
// );
//
// export const registerUser = createAsyncThunk(
//     'auth/registerUser',
//     async ({ login, password }, { rejectWithValue }) => {
//       try {
//         const response = await registerApi(login, password);
//         // Assuming response.data contains { token, user } or similar
//         const { token, user } = response.data;
//
//         // Store token in localStorage
//         if (token) {
//           localStorage.setItem('token', token);
//         }
//
//         return response.data;
//       } catch (error) {
//         return rejectWithValue(error.response?.data?.message || error.message);
//       }
//     }
// );
//
// // Slice
// const authSlice = createSlice({
//   name: 'auth',
//   initialState: {
//     user: null,
//     token: localStorage.getItem('token') || null,
//     isLoading: false,
//     error: null,
//     isAuthenticated: !!localStorage.getItem('token')
//   },
//   reducers: {
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       state.error = null;
//       localStorage.removeItem('token');
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//     setCredentials: (state, action) => {
//       const { user, token } = action.payload;
//       state.user = user;
//       state.token = token;
//       state.isAuthenticated = true;
//       if (token) {
//         localStorage.setItem('token', token);
//       }
//     }
//   },
//   extraReducers: (builder) => {
//     builder
//         // Login
//         .addCase(loginUser.pending, (state) => {
//           state.isLoading = true;
//           state.error = null;
//         })
//         .addCase(loginUser.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.user = action.payload.user;
//           state.token = action.payload.token;
//           state.isAuthenticated = true;
//         })
//         .addCase(loginUser.rejected, (state, action) => {
//           state.isLoading = false;
//           state.error = action.payload;
//           state.isAuthenticated = false;
//         })
//         // Register
//         .addCase(registerUser.pending, (state) => {
//           state.isLoading = true;
//           state.error = null;
//         })
//         .addCase(registerUser.fulfilled, (state, action) => {
//           state.isLoading = false;
//           state.user = action.payload.user;
//           state.token = action.payload.token;
//           state.isAuthenticated = true;
//         })
//         .addCase(registerUser.rejected, (state, action) => {
//           state.isLoading = false;
//           state.error = action.payload;
//           state.isAuthenticated = false;
//         });
//   }
// });
//
// export const { logout, clearError, setCredentials } = authSlice.actions;
// export default authSlice.reducer;