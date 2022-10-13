import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../hooks/index.js';
import signInImage from '../assets/sign_in.svg';
import routes from '../routes.js';

const schema = yup.object().shape({
  username: yup.string().trim(),
  password: yup.string().trim(),
});

const SignIn = () => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const [authFailed, setAuthFailed] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(routes.loginPath(), values);
        localStorage.setItem('user', JSON.stringify(data));
        setAuthFailed(false);
        auth.logIn();
        navigate('/');
      } catch (e) {
        rollbar.error('SignIn/submit', e);
        if (e.request.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('toasts.networkError'));
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row align-items-center justify-content-center h-100">
        <div className="col col-12 col-md-8">
          <div className="card">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={signInImage} alt="Sign In" style={{ height: '250px' }} />
              </div>
              <div className="col-12 col-md-6">
                <Form noValidate onSubmit={formik.handleSubmit} className="mt-3">
                  <h1 className="text-center mb-4">{t('signIn.header')}</h1>
                  <FloatingLabel
                    controlId="username"
                    label={t('signIn.username')}
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputRef}
                      required
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.username || authFailed}
                      type="text"
                      placeholder={t('signIn.username')}
                    />
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="password"
                    label={t('signIn.password')}
                    className="mb-4"
                  >
                    <Form.Control
                      required
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.password || authFailed}
                      type="password"
                      placeholder={t('signIn.password')}
                    />
                    {authFailed && (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t('signIn.authFailed')}
                    </Form.Control.Feedback>
                    )}
                  </FloatingLabel>

                  <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                    {t('signIn.submit')}
                  </Button>
                </Form>
              </div>
            </div>
            <div className="card-footer p-4 text-center">
              <span>
                {t('signIn.noAccount')}
                {' '}
              </span>
              <Link to="/signup">{t('signIn.signUp')}</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
