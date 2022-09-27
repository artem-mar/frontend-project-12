import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { selectors } from '../slices/messagesSlice.js';
import { useApi } from '../hooks/index.js';

const Chat = () => {
  const chatInput = useRef(null);
  const messagesList = useRef(null);

  useEffect(() => {
    messagesList.current.lastChild?.scrollIntoView();
    chatInput.current.focus();
  });
  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const socket = useApi();
  const submitMessage = async (e) => {
    e.preventDefault();
    const body = chatInput.current.value;
    const { username } = JSON.parse(localStorage.user);
    const message = {
      body, username, channelId: currentChannelId,
    };

    socket.newMessage(message);
    chatInput.current.value = '';
    chatInput.current.focus();
  };

  const messages = useSelector(selectors.selectAll);
  return (
    <div className="d-flex flex-column bg-white h-100">
      <div className="bg-light p-3 small shadow-sm mb-3">
        <p className="mb-0">
          <b># general</b>
        </p>
        <span className="text-muted">
          {`${messages.length} сообщений`}
        </span>
      </div>
      <div className="px-5 overflow-auto">
        <ul ref={messagesList} className="p-0">
          {messages.map((m) => (
            <li className="list-group-item" key={m.id}>
              <b>{m.username}</b>
              {': '}
              {m.body}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto px-5 py-3">
        <Form onSubmit={submitMessage}>
          <InputGroup>
            <Form.Control
              noValidate
              placeholder="Введите сообщение..."
              aria-label="chat input"
              ref={chatInput}
            />
            <Button type="submit" variant="outline-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
                <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
              </svg>
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};

export default Chat;

/*
  <ul>
    {messages.map((m) => (
      <li key={m.id}>
        {m.username}
        {': '}
        {m.body}
      </li>
    ))}
  </ul>
*/
