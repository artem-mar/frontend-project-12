/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
  name: 'modal',
  initialState: { show: false, type: null, id: null },
  reducers: {
    openModal: (state, { payload }) => {
      state.type = payload.type;
      state.id = payload.id;
      state.show = true;
    },
    closeModal: (state) => {
      state.show = false;
      state.type = null;
      state.id = null;
    },
  },
});

export const { actions } = modalSlice;
export default modalSlice.reducer;
