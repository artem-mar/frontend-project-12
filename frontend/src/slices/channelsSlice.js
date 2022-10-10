/* eslint-disable no-param-reassign */
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes.js';

export const payloadCreator = ({ typeName, api, ...args }) => new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(Error('networkError'));
  }, 2000);

  api.emit(typeName, { ...args }, (r) => {
    if (r.status === 'ok') {
      resolve(r.data);
    }
    reject(Error('unknownError'));
  });
});

export const addChannelThunk = createAsyncThunk('addChannelThunk', payloadCreator);
export const removeChannelThunk = createAsyncThunk('removeChannelThunk', payloadCreator);
export const renameChannelThunk = createAsyncThunk('renameChannelThunk', payloadCreator);
export const fetchData = createAsyncThunk(
  'fetchData',
  async () => {
    const { token } = JSON.parse(localStorage.getItem('user'));
    const headers = { Authorization: `Bearer ${token}` };
    const { data } = await axios.get(routes.dataPath(), { headers });
    return data;
  },
);

const defaultChannelId = 1;
const channelsAdapter = createEntityAdapter();

const channelsSlice = createSlice({
  name: 'channels',
  initialState: channelsAdapter.getInitialState({ currentChannelId: defaultChannelId }),
  reducers: {
    addChannels: channelsAdapter.addMany,
    addChannel: channelsAdapter.addOne,
    updateChannel: channelsAdapter.updateOne,
    removeChannel: channelsAdapter.removeOne,
    setCurrentChannel: (state, { payload }) => { state.currentChannelId = payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addChannelThunk.fulfilled, (state, { payload }) => {
        channelsAdapter.addOne(state, payload);
        state.currentChannelId = payload.id;
      })
      .addCase(removeChannelThunk.fulfilled, (state) => {
        state.currentChannelId = defaultChannelId;
      })
      .addCase(fetchData.fulfilled, (state, { payload }) => {
        channelsAdapter.addMany(state, payload.channels);
      });
  },
});

export const { actions } = channelsSlice;
export const selectors = channelsAdapter.getSelectors((state) => state.channels);
export default channelsSlice.reducer;
