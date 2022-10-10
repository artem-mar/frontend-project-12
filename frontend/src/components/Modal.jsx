import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { actions, thunks } from '../slices/index.js';
import { selectors } from '../slices/channelsSlice.js';
import { useApi } from '../hooks/index.js';

const getSchema = (channelsNames) => yup.object().shape({
  name: yup.string().trim()
    .required('modals.required')
    .min(3, 'modals.size')
    .max(20, 'modals.size')
    .notOneOf(channelsNames, 'modals.unique'),
});

const AddChannelModal = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useApi();
  const dispatch = useDispatch();
  const channelsNames = useSelector(selectors.selectAll).map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getSchema(channelsNames),
    onSubmit: async ({ name }) => {
      const typeName = 'newChannel';
      const { meta, error } = await dispatch(thunks.addChannel({ typeName, name, api }));
      if (meta.requestStatus === 'fulfilled') {
        handleClose();
        toast.success(t('toasts.added'));
      }
      if (error) {
        toast.error(t(`toasts.${error.message}`));
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
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
              disabled={formik.isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              {t('modals.cancel')}
            </Button>
            <Button disabled={formik.isSubmitting} variant="primary" type="submit">
              {t('modals.submit')}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
};

const RemoveChannelModal = ({ handleClose }) => {
  const { t } = useTranslation();
  const api = useApi();
  const dispatch = useDispatch();
  const id = useSelector((state) => state.modal.id);
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = async () => {
    setSubmitting(true);
    const typeName = 'removeChannel';
    const { meta, error } = await dispatch(thunks.removeChannel({ typeName, id, api }));
    if (meta.requestStatus === 'fulfilled') {
      handleClose();
      toast.success(t('toasts.removed'));
    }
    if (error) {
      toast.error(t(`toasts.${error.message}`));
    }
  };

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-end">
          <Button className="me-2" variant="secondary" onClick={handleClose}>
            {t('modals.cancel')}
          </Button>
          <Button disabled={submitting} variant="danger" onClick={handleRemove}>
            {t('modals.remove')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const RenameChannelModal = ({ handleClose }) => {
  const { t } = useTranslation();
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
    onSubmit: async ({ name }) => {
      const typeName = 'renameChannel';
      const { meta, error } = await dispatch(thunks.renameChannel({
        typeName, id, name, api,
      }));
      if (meta.requestStatus === 'fulfilled') {
        handleClose();
        toast.success(t('toasts.renamed'));
      }
      if (error) {
        toast.error(t(`toasts.${error.message}`));
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
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
              disabled={formik.isSubmitting}
            />
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              {t('modals.cancel')}
            </Button>
            <Button disabled={formik.isSubmitting} variant="primary" type="submit">
              {t('modals.submit')}
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
