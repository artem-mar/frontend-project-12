import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
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
import { useAuth, useApi } from '../hooks/index.js';
import { actions } from '../slices/index.js';

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

const App = () => {
  const dispatch = useDispatch();
  const socket = useApi();

  socket.on('newMessage', (m) => {
    dispatch(actions.addMessage(m));
  });
  socket.on('removeChannel', ({ id }) => {
    dispatch(actions.removeChannel(id));
  });
  socket.on('renameChannel', (ch) => {
    dispatch(actions.updateChannel({ id: ch.id, changes: { name: ch.name } }));
  });

  return (
    <AuthProvider>
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
      <ToastContainer />
    </AuthProvider>
  );
};

export default App;
