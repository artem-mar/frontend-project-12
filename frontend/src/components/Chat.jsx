import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { selectors as channelsSelectors } from '../slices/channelsSlice.js';
import SendMessageForm from './SendMessageForm.jsx';

const Chat = () => {
  const { t } = useTranslation();
  const messagesList = useRef(null);

  useEffect(() => {
    messagesList.current.lastChild?.scrollIntoView();
  });

  const currentChannelId = useSelector((state) => state.channels.currentChannelId);
  const currentChannelName = useSelector(channelsSelectors.selectAll)
    .find(({ id }) => id === currentChannelId)
    ?.name;

  const messages = useSelector(messagesSelectors.selectAll)
    .filter(({ channelId }) => channelId === currentChannelId);

  return (
    <div className="d-flex flex-column bg-white h-100">
      <div className="bg-light p-3 small shadow-sm mb-3">
        <p className="mb-0">
          <b>{`# ${currentChannelName}`}</b>
        </p>
        <span className="text-muted">
          {t('chat.message', { count: messages.length })}
        </span>
      </div>
      <div className="px-5 overflow-auto">
        <ul ref={messagesList} className="p-0">
          {messages.map((m) => (
            <li className="list-group-item text-break" key={m.id}>
              <b>{m.username}</b>
              {': '}
              {m.body}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-auto px-5 py-3">
        <SendMessageForm channelId={currentChannelId} />
      </div>
    </div>
  );
};

export default Chat;
