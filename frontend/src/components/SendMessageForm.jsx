import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { SendFill, SendXFill } from 'react-bootstrap-icons';
import { useRollbar } from '@rollbar/react';
import filter from 'leo-profanity';
import * as yup from 'yup';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { thunks } from '../slices/index.js';
import { useApi, useAuth } from '../hooks/index.js';

const SendMessageForm = ({ channelId }) => {
  const rollbar = useRollbar();
  const { t } = useTranslation();
  const chatInput = useRef(null);
  const dispatch = useDispatch();
  const api = useApi();
  const { user: { username } } = useAuth();

  useEffect(() => {
    chatInput.current.focus();
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: yup.object().shape({
      body: yup.string().required().trim(),
    }),
    onSubmit: async ({ body }) => {
      const clean = filter.clean(body);
      const typeName = 'newMessage';

      const { meta, error } = await dispatch(thunks.sendMessage({
        body: clean, username, channelId, api, typeName,
      }));
      if (meta.requestStatus === 'fulfilled') {
        formik.resetForm();
      }
      if (error) {
        rollbar('SendMessageForm/submit', error);
      }
    },
    validateOnBlur: false,
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          id="body"
          placeholder={t('chat.enterMessage')}
          aria-label={t('chat.newMessage')}
          ref={chatInput}
          onChange={formik.handleChange}
          value={formik.values.body}
          disabled={formik.isSubmitting}
        />
        <Button disabled={!formik.isValid || formik.isSubmitting} type="submit" variant="outline-secondary">
          {formik.isValid
            ? <SendFill size={20} />
            : <SendXFill size={20} />}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SendMessageForm;
