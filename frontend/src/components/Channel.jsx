import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  ButtonGroup, Button, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { actions } from '../slices/index.js';

const Channel = ({ channel: { id, name, removable } }) => {
  const activeChannelId = useSelector((state) => state.channels.currentChannelId);
  const variant = id === activeChannelId ? 'secondary' : 'light';

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const activeChannelSwitcher = () => {
    dispatch(actions.setCurrentChannel(id));
  };
  const deleteChannelHandler = () => {
    dispatch(actions.openModal({ type: 'removeChannel', id }));
  };
  const renameChannelHandler = () => {
    dispatch(actions.openModal({ type: 'renameChannel', id }));
  };

  return (
    <ButtonGroup className="d-flex">
      <Button
        onClick={activeChannelSwitcher}
        className="rounded-0 text-start text-truncate"
        type="button"
        variant={variant}
      >
        {'# '}
        {name}
      </Button>
      {removable && (
        <DropdownButton
          as={ButtonGroup}
          drop="down"
          title=""
          variant={variant}
          hidden={!removable}
        >
          <Dropdown.Item onClick={deleteChannelHandler} className="py-0">{t('channel.remove')}</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={renameChannelHandler} className="py-0">{t('channel.rename')}</Dropdown.Item>
        </DropdownButton>
      )}
    </ButtonGroup>
  );
};

export default Channel;
