import React, { useState, useMemo } from 'react';
import {
  Routes, Route, BrowserRouter, Navigate, useLocation,
} from 'react-router-dom';
import NavBar from './NavBar.jsx';
import SignIn from './SignIn.jsx';
import SignUp from './SignUp.jsx';
import ChatPage from './ChatPage.jsx';
import PageNotFound from './PageNotFound.jsx';
import AuthContext from '../contexts/authContext.jsx';
import useAuth from '../hooks/useAuth.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);

  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
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
  // const hasToken = Object.hasOwn(localStorage, 'userId');
  return ( // hasToken вместо auth.loggedIn
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const App = () => {
  console.log('fetching data...');
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
    </AuthProvider>
  );
};

export default App;
