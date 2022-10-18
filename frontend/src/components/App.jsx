import React, { useState, useMemo } from 'react';
import {
  Routes, Route, BrowserRouter, Navigate, useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import NavBar from './NavBar.jsx';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import ChatPage from './ChatPage.jsx';
import PageNotFound from './PageNotFound.jsx';
import { AuthContext } from '../contexts/index.js';
import { useAuth } from '../hooks/index.js';
import routes from '../routes.js';

const AuthProvider = ({ children }) => {
  const hasToken = Object.hasOwn(localStorage, 'user');
  const [loggedIn, setLoggedIn] = useState(hasToken);

  const user = JSON.parse(localStorage.getItem('user'));
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={useMemo(() => ({
      loggedIn, logIn, logOut, user,
    }), [loggedIn, user])}
    >
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => (
  <AuthProvider>
    <div className="vh-100 d-flex flex-column">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path={routes.mainPath()} element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path={routes.signinPath()} element={<SignIn />} />
          <Route path={routes.signupPath()} element={<SignUp />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
    <ToastContainer />
  </AuthProvider>
);

export default App;
