/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const addChannelThunk = createAsyncThunk(
  'addChannelThunk',
  async ({ name, api }) => {
    await api.addChannel(name);
  },
);
export const removeChannelThunk = createAsyncThunk(
  'removeChannelThunk',
  async ({ id, api }) => {
    await api.removeChannel(id);
  },
);
export const renameChannelThunk = createAsyncThunk(
  'renameChannelThunk',
  async ({ id, name, api }) => {
    await api.renameChannel({ id, name });
  },
);
export const fetchData = createAsyncThunk(
  'fetchData',
  async () => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(routes.dataPath(), { headers });
    return data;
  },
);

const channelsAdapter = createEntityAdapter();
const initialState = channelsAdapter.getInitialState();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: { ...initialState, currentChannelId: 1 },
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
    setCurrentChannel: (state, { payload }) => { state.currentChannelId = payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        channelsAdapter.addMany(state, payload.channels);
      });
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
