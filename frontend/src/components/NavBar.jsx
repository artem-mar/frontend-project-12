import React from 'react';
import { Navbar } from 'react-bootstrap';

const Nav = () => (
  <Navbar expand="lg" className="shadow-sm bg-white">
    <div className="container">
      <Navbar.Brand href="/login">Hexlet Chat</Navbar.Brand>
    </div>
  </Navbar>
);

export default Nav;
