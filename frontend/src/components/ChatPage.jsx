import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import routes from '../routes.js';
// import React from 'react';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const Chat = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      const { token } = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${token}` };
      const { data: { messages, channels } } = await axios.get(routes.dataPath(), { headers });
      dispatch(channelsActions.addChannels(channels));
      // dispatch(channelsActions.removeChannel(1)); // id
      console.log(messages, channels);
    };
    fetchData();
  });

  return (
    <div>
      <h1>Chat!</h1>
    </div>
  );
};

export default Chat;
