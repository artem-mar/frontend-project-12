import React from 'react';
import { Navbar, Button, Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/index.js';

const Nav = () => {
  const { loggedIn, logOut } = useAuth();
  const { t, i18n } = useTranslation();

  const switchLocale = (l) => {
    i18n.changeLanguage(l);
  };

  return (
    <Navbar expand="lg" className="shadow-sm bg-white">
      <div className="container d-flex justify-content-between">
        <Navbar.Brand as={Link} to="/">{t('mainHeader')}</Navbar.Brand>
        <div className="d-flex align-items-center">
          <Dropdown className="me-2">
            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
              {i18n.language}
            </Dropdown.Toggle>

            <Dropdown.Menu className="p-1" variant="sm">
              {i18n.languages
                .filter((l) => l !== i18n.language)
                .map((l) => (
                  <Dropdown.Item key={l} onClick={() => switchLocale(l)}>{l}</Dropdown.Item>
                ))}
            </Dropdown.Menu>
          </Dropdown>
          {loggedIn && <Button onClick={logOut}>{t('logOut')}</Button>}
        </div>
      </div>
    </Navbar>
  );
};

export default Nav;
