import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import NavBar from './NavBar.jsx';
import SignIn from './SignIn.jsx';
import PageNotFound from './PageNotFound.jsx';

const App = () => {
  console.log('fetching data...');
  return (
    <div className="vh-100 d-flex flex-column">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="login" element={<SignIn />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
