import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import { useAuth } from '../hooks/index.js';
import signUpImage from '../assets/sign_up.svg';
import routes from '../routes.js';

yup.setLocale({
  string: {
    matches: 'password must contain numbers and letters',
  },
});
const schema = yup.object().shape({
  username: yup.string().required().min(3).max(20)
    .trim(),
  password: yup.string().required().min(6).trim(),
  passwordComfirmation: yup.string().equals([yup.ref('password')], 'Пароли должны совпадать'),
});

const SignIn = () => {
  const [regError, setRegError] = useState(false);
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
      setRegError(null);
      try {
        const { data } = await axios.post(routes.signUpPath(), values);
        localStorage.setItem('user', JSON.stringify(data));
        auth.logIn();
        navigate('/');
      } catch (e) {
        if (e.response.status === 409) {
          setRegError('такой юзер уже есть');
          inputRef.current.select();
        }
      }
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row align-items-center justify-content-center h-100">
        <div className="col col-12 col-md-8 bg-light">
          <div className="card">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={signUpImage} alt="Sign In" style={{ height: '200px' }} />
              </div>
              <div className="col-12 col-md-6">
                <Form onSubmit={formik.handleSubmit} className="mt-3">
                  <h1 className="text-center mb-4">Регистрация</h1>
                  <FloatingLabel
                    controlId="username"
                    label="Имя пользователя"
                    className="mb-3"
                  >
                    <Form.Control
                      ref={inputRef}
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={(formik.errors.username && formik.touched.username) || regError}
                      type="text"
                      placeholder="Имя пользователя"
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="password"
                    label="Пароль"
                    className="mb-3"
                  >
                    <Form.Control
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={(formik.errors.password && formik.touched.password) || regError}
                      type="password"
                      placeholder="Пароль"
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="passwordComfirmation"
                    label="Подтвердите пароль"
                    className="mb-4"
                  >
                    <Form.Control
                      required
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      isInvalid={formik.errors.passwordComfirmation || regError}
                      type="password"
                      placeholder="Подтвердите пароль"
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.passwordComfirmation || regError}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <Button disabled={formik.isSubmitting} variant="outline-primary" type="submit" className="w-100 mb-3">
                    Зарегистрироваться
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

export default SignIn;
