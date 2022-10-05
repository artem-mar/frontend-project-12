import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Channels from './Channels.jsx';
import Chat from './Chat.jsx';
import { thunks } from '../slices/index.js';
import Modal from './Modal.jsx';

const ChatPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(thunks.fetchData());
  }, [dispatch]);

  return (
    <>
      <div className="container h-100 my-3 overflow-hidden shadow rounded p-0">
        <div className="d-flex flex-row h-100">
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
