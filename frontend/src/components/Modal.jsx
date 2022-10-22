import React, { useRef, useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { actions } from '../slices/index.js';
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
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const api = useApi();
  const channelsNames = useSelector(selectors.selectAll).map((ch) => ch.name);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: getSchema(channelsNames),
    onSubmit: async ({ name }) => {
      try {
        await api.createChannel({ name: filter.clean(name) });
        handleClose();
        toast.success(t('toasts.added'));
      } catch (error) {
        toast.error(t(`toasts.${error.message}`));
        rollbar.error('AddChannelModal/submit', error);
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
            <Form.Label className="visually-hidden">
              {t('modals.channelName')}
            </Form.Label>
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
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const api = useApi();
  const id = useSelector((state) => state.modal.id);
  const [submitting, setSubmitting] = useState(false);

  const handleRemove = async () => {
    setSubmitting(true);
    try {
      await api.removeChannel({ id });
      handleClose();
      toast.success(t('toasts.removed'));
    } catch (error) {
      setSubmitting(false);
      toast.error(t(`toasts.${error.message}`));
      rollbar.error('RemoveChannelModal/submit', error);
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
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const api = useApi();
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
      try {
        await api.renameChannel({ name: filter.clean(name), id });
        handleClose();
        toast.success(t('toasts.renamed'));
      } catch (error) {
        toast.error(t(`toasts.${error.message}`));
        rollbar.error('RenameChannelModal/submit', error);
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
            <Form.Label className="visually-hidden">
              {t('modals.channelName')}
            </Form.Label>
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
