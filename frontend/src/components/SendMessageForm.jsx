import React, { useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { thunks } from '../slices/index.js';
import { useApi, useAuth } from '../hooks/index.js';

const sendImg = (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" className="bi bi-send-fill" viewBox="0 0 16 16">
    <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
  </svg>
);

const SendMessageForm = ({ channelId }) => {
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
      const typeName = 'newMessage';

      const ss = await dispatch(thunks.sendMessage({
        body, username, channelId, api, typeName,
      }));
      if (ss.meta.requestStatus === 'fulfilled') formik.resetForm();
    },
    validateOnBlur: false,
  });

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          id="body"
          placeholder="Введите сообщение..."
          aria-label="chat input"
          ref={chatInput}
          onChange={formik.handleChange}
          value={formik.values.body}
          disabled={formik.isSubmitting}
        />
        <Button disabled={!formik.isValid || formik.isSubmitting} type="submit" variant="outline-secondary">
          {sendImg}
        </Button>
      </InputGroup>
    </Form>
  );
};

export default SendMessageForm;
