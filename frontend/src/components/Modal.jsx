import React, { useRef, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { actions, thunks } from '../slices/index.js';
import { selectors } from '../slices/channelsSlice.js';
import { useApi } from '../hooks/index.js';

const getSchema = (channelsNames) => yup.object().shape({
  name: yup.string().required().trim().min(3)
    .max(10)
    .notOneOf(channelsNames),
});

const AddChannelModal = ({ handleClose }) => {
  const api = useApi();
  const dispatch = useDispatch();
  const channelsNames = useSelector(selectors.selectAll).map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getSchema(channelsNames),
    onSubmit: ({ name }) => {
      dispatch(thunks.addChannel({ name, api }));
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="" noValidate onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              isInvalid={!!formik.errors.name}
              type="text"
              placeholder=""
              onChange={formik.handleChange}
              autoFocus
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Добавить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

const RemoveChannelModal = ({ handleClose }) => {
  const api = useApi();
  const dispatch = useDispatch();
  const id = useSelector((state) => state.modal.id);
  const handleRemove = () => {
    dispatch(thunks.removeChannel({ id, api }));
    handleClose();
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handleClose}>
            Отмена
          </Button>
          <Button variant="danger" onClick={handleRemove}>
            Удалить
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const RenameChannelModal = ({ handleClose }) => {
  const api = useApi();
  const dispatch = useDispatch();
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);
  const id = useSelector((state) => state.modal.id);
  const channelName = useSelector((state) => selectors.selectById(state, id)).name;
  const channelsNames = useSelector(selectors.selectAll).map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      name: channelName,
    },
    validationSchema: getSchema(channelsNames),
    onSubmit: ({ name }) => {
      dispatch(thunks.renameChannel({ id, name, api }));
      handleClose();
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Переименовать канал</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form className="" noValidate onSubmit={formik.handleSubmit}>
          <Form.Group className="mb-3" controlId="name">
            <Form.Control
              ref={inputRef}
              value={formik.values.name}
              isInvalid={!!formik.errors.name}
              type="text"
              placeholder=""
              onChange={formik.handleChange}
            />
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              Отмена
            </Button>
            <Button variant="primary" type="submit">
              Отправить
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

const modals = {
  addChannel: AddChannelModal,
  removeChannel: RemoveChannelModal,
  renameChannel: RenameChannelModal,
};

const ModalComponent = () => {
  const dispatch = useDispatch();
  const handleClose = () => dispatch(actions.closeModal());
  const show = useSelector((state) => state.modal.show);
  const modalType = useSelector((state) => state.modal.type);

  const Component = modals[modalType];

  return (
    <Modal show={show} onHide={handleClose}>
      {Component && <Component handleClose={handleClose} />}
    </Modal>
  );
};

export default ModalComponent;
