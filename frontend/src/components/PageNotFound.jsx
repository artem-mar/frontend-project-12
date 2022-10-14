import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import fail from '../assets/epic_fail.svg';

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100 text-center">
      <img alt={t('pageNotFound.notFound')} className="img-fluid w-25" src={fail} />
      <h1 className="h4 text-muted">
        {t('pageNotFound.notFound')}
      </h1>
      <p className="text-muted">
        <span>{t('pageNotFound.go')}</span>
        {' '}
        <Link to="/">{t('pageNotFound.toHomePage')}</Link>
      </p>
    </div>
  );
};

export default PageNotFound;
