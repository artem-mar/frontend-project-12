import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import { PlusSquareFill } from 'react-bootstrap-icons';
import { selectors } from '../slices/channelsSlice.js';
import Channel from './Channel.jsx';
import { actions } from '../slices/index.js';

const Channels = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const channels = useSelector(selectors.selectAll);
  const handleOpen = () => {
    dispatch(actions.openModal({ type: 'addChannel' }));
  };

  return (
    <>
      <div className="d-flex justify-content-between ps-2">
        <span>{t('channels')}</span>
        <Button onClick={handleOpen} variant="group-vertical" type="button" className="p-0">
          <PlusSquareFill size={20} />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ul className="list-group list-group-flush mt-2">
        {channels.map((ch) => (
          <li key={ch.id}>
            <Channel channel={ch} />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Channels;
