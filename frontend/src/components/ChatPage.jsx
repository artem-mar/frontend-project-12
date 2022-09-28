import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import routes from '../routes.js';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import { actions } from '../slices/index.js';

const ChatPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const { token } = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${token}` };
      const { data: { messages, channels } } = await axios.get(routes.dataPath(), { headers });
      dispatch(actions.addChannels(channels));
      dispatch(actions.addMessages(messages));
    };
    fetchData();
  }, [dispatch]);

  return (
    <div className="container h-100 my-3 overflow-hidden shadow rounded p-0">
      <div className="d-flex flex-row h-100">
        <div className="col-4 col-md-2 p-2 pt-5 border-end">
          <Channels />
        </div>
        <div className="col h-100 p-0">
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
