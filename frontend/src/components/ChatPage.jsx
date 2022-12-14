import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';
import axios from 'axios';
import routes from '../routes.js';
import { actions } from '../slices/index.js';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import { useAuth } from '../hooks/index.js';
import Modal from './Modal.jsx';

const ChatPage = () => {
  const rollbar = useRollbar();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetch = async () => {
      const { token } = JSON.parse(localStorage.getItem('user'));
      const headers = { Authorization: `Bearer ${token}` };
      try {
        const { data: { channels, messages } } = await axios.get(routes.apiDataPath(), { headers });
        dispatch(actions.addChannels(channels));
        dispatch(actions.addMessages(messages));
      } catch (error) {
        rollbar.error('ChatPage/fetchData', error);
      }
    };
    fetch();
  }, [dispatch, rollbar]);

  const auth = useAuth();
  const location = useLocation();

  return (
    <>
      {!auth.loggedIn && <Navigate to="/login" state={{ from: location }} />}
      <div className="container h-100 my-3 overflow-hidden shadow rounded-3 p-0">
        <div className="d-flex flex-row h-100 bg-light">
          <div className="col-4 col-md-3 col-lg-2 p-2 pt-5 border-end">
            <Channels />
          </div>
          <div className="col h-100 p-0">
            <Chat />
          </div>
        </div>
      </div>
      <Modal />
    </>
  );
};

export default ChatPage;
