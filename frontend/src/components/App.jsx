import React, { useState, useMemo } from 'react';
import {
  Routes, Route, BrowserRouter, Navigate, useLocation,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import NavBar from './NavBar.jsx';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import ChatPage from './ChatPage.jsx';
import PageNotFound from './PageNotFound.jsx';
import { AuthContext, ApiContext } from '../contexts/index.js';
import { useAuth } from '../hooks/index.js';
import { actions } from '../slices/index.js';

const AuthProvider = ({ children }) => {
  const hasToken = Object.hasOwn(localStorage, 'user');
  const [loggedIn, setLoggedIn] = useState(hasToken);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('user');
    setLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn])}>
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

const App = () => {
  const dispatch = useDispatch();
  const socket = io();

  socket.on('newMessage', (m) => {
    dispatch(actions.addMessage(m));
  });

  const api = useMemo(() => ({
    newMessage: (message) => socket.emit('newMessage', message),
  }), [socket]);

  return (
    <AuthProvider>
      <ApiContext.Provider value={api}>
        <div className="vh-100 d-flex flex-column">
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path="/" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </ApiContext.Provider>
    </AuthProvider>
  );
};

export default App;
