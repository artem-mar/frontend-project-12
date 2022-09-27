import React from 'react';
import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/index.js';

const Nav = () => {
  const { loggedIn, logOut } = useAuth();

  return (
    <Navbar expand="lg" className="shadow-sm bg-white">
      <div className="container">
        <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
        {loggedIn && <Button onClick={logOut}>Log out</Button>}
      </div>
    </Navbar>
  );
};

export default Nav;
