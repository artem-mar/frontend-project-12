// import React, { useEffect, useState, useRef } from "react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, Form, FloatingLabel } from 'react-bootstrap';
import signInImage from '../assets/sign_in.svg';

yup.setLocale({
  string: {
    matches: 'password must contain numbers and letters',
  },
});
const schema = yup.object().shape({
  username: yup.string().required().min(3),
  password: yup.string().required().min(6).matches(/^(?=.*[a-zA-Z])(?=.*[0-9])(?!.*[^\w\s])/),
});

const SignIn = () => {
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: schema,
    onSubmit: (value) => {
      console.log(value);
    },
  });

  return (
    <div className="container-fluid h-100">
      <div className="row align-items-center justify-content-center h-100">
        <div className="col col-12 col-md-8 bg-light">
          <div className="card">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={signInImage} alt="Sign In" style={{ height: '200px' }} />
              </div>
              <div className="col-12 col-md-6">
                <Form noValidate onSubmit={formik.handleSubmit} className="mt-3">
                  <h1 className="text-center mb-4">Войти</h1>
                  <FloatingLabel
                    controlId="username"
                    label="Ваш ник"
                    className="mb-3"
                  >
                    <Form.Control
                      required
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.username}
                      type="text"
                      placeholder="Ваш ник"
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <FloatingLabel
                    controlId="password"
                    label="Пароль"
                    className="mb-4"
                  >
                    <Form.Control
                      required
                      onChange={formik.handleChange}
                      isInvalid={!!formik.errors.password}
                      type="text"
                      placeholder="Пароль"
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </FloatingLabel>

                  <Button variant="outline-primary" type="submit" className="w-100 mb-3">
                    Войти
                  </Button>
                </Form>
              </div>
            </div>
            <div className="card-footer p-4 text-center">
              <span>Нет аккаунта? </span>
              <a href="/signup">Регистрация</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
