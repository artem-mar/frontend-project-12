import React from 'react';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Nav = () => (
  <Navbar expand="lg" className="shadow-sm bg-white">
    <div className="container">
      <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
    </div>
  </Navbar>
);

export default Nav;
