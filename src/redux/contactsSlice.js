import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosInstance';

// Async thunks using your custom API with JWT token
export const fetchContacts = createAsyncThunk(
    'contacts/fetchContacts',
    async (_, { rejectWithValue }) => {
      try {
        // JWT token automatically added by axiosInstance interceptor
        const response = await axiosInstance.get('/contacts/');
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts');
      }
    }
);

export const addContact = createAsyncThunk(
    'contacts/addContact',
    async (contact, { rejectWithValue }) => {
      try {
        // JWT token automatically added by axiosInstance interceptor
        const response = await axiosInstance.post('/contacts/', contact);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add contact');
      }
    }
);

export const deleteContact = createAsyncThunk(
    'contacts/deleteContact',
    async (id, { rejectWithValue }) => {
      try {
        // JWT token automatically added by axiosInstance interceptor
        await axiosInstance.delete(`/contacts/${id}`);
        return id;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete contact');
      }
    }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState: {
    contacts: {
      items: [],
      isLoading: false,
      error: null,
    },
    filter: '',
  },
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
        // Fetch contacts
        .addCase(fetchContacts.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(fetchContacts.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items = action.payload;
        })
        .addCase(fetchContacts.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })
        // Add contact
        .addCase(addContact.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(addContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items.push(action.payload);
        })
        .addCase(addContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        })
        // Delete contact
        .addCase(deleteContact.pending, (state) => {
          state.contacts.isLoading = true;
          state.contacts.error = null;
        })
        .addCase(deleteContact.fulfilled, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.items = state.contacts.items.filter(
              contact => contact.id !== action.payload
          );
        })
        .addCase(deleteContact.rejected, (state, action) => {
          state.contacts.isLoading = false;
          state.contacts.error = action.payload;
        });
  },
});

export const { setFilter } = contactsSlice.actions;
export default contactsSlice.reducer;