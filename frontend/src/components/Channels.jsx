import React from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../slices/channelsSlice.js';

const Channels = () => {
  const channels = useSelector(selectors.selectAll);
  return (
    <>
      <div className="d-flex justify-content-between px-2">
        <span>Каналы</span>
        <button type="button" className="btn p-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-plus-square-fill" viewBox="0 0 16 16">
            <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0z" />
          </svg>
        </button>
      </div>
      <ul className="list-group list-group-flush">
        {channels.map((ch) => (
          <li key={ch.id}>
            {'# '}
            {ch.name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Channels;
