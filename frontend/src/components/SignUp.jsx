import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import filter from 'leo-profanity';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../hooks/index.js';
import signUpImage from '../assets/sign_up.svg';
import routes from '../routes.js';

const schema = yup.object().shape({
  username: yup
    .string()
    .test({ test: (v) => !filter.check(v), message: 'signUp.profanity' })
    .required('signUp.required')
    .min(3, 'signUp.usernameSize')
    .max(20, 'signUp.usernameSize')
    .trim(),
  password: yup
    .string()
    .required('signUp.required')
    .min(6, 'signUp.passwordSize')
    .trim(),
  passwordComfirmation: yup
    .string()
    .equals([yup.ref('password')], 'signUp.passwordMatches'),
});

const SignUp = () => {
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const [regFailed, setRegFailed] = useState(false);
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
      passwordComfirmation: '',
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setRegFailed(false);
      try {
        const { data } = await axios.post(routes.apiSignupPath(), values);
        localStorage.setItem('user', JSON.stringify(data));
        auth.logIn();
        navigate('/');
      } catch (e) {
        if (e.request.status === 409) {
          setRegFailed(true);
          inputRef.current.select();
        } else {
          toast.error(t('toasts.networkError'));
          rollbar.error('SignUp/submit', e);
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
                <img src={signUpImage} alt={t('signUp.header')} style={{ height: '250px' }} />
              </div>
              <div className="col-12 col-md-6">
                <Form onSubmit={formik.handleSubmit} className="mt-3">
                  <h1 className="text-center mb-4">{t('signUp.header')}</h1>
                  <FloatingLabel
                    controlId="username"
                    label={t('signUp.username')}
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputRef}
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={(formik.errors.username && formik.touched.username) || regFailed}
                      type="text"
                      placeholder={t('signUp.username')}
                    />
                    {formik.errors.username && (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.username)}
                    </Form.Control.Feedback>
                    )}
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="password"
                    label={t('signUp.password')}
                    className="mb-3"
                  >
                    <Form.Control
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={(formik.errors.password && formik.touched.password) || regFailed}
                      type="password"
                      placeholder={t('signUp.password')}
                    />
                    {formik.errors.password && (
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.password)}
                    </Form.Control.Feedback>
                    )}
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="passwordComfirmation"
                    label={t('signUp.passwordConfirmation')}
                    className="mb-4"
                  >
                    <Form.Control
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={formik.errors.passwordComfirmation || regFailed}
                      type="password"
                      placeholder={t('signUp.passwordConfirmation')}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {t(formik.errors.passwordComfirmation) || t('signUp.regFailed')}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <Button disabled={formik.isSubmitting} variant="outline-primary" type="submit" className="w-100 mb-3">
                    {t('signUp.submit')}
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
