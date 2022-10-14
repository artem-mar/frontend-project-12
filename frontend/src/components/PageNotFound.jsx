import React from 'react';
import { useTranslation } from 'react-i18next';
import fail from '../assets/epic_fail.svg';

const PageNotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="h-100 text-center">
      <img alt="Page Not Found" className="img-fluid w-25" src={fail} />
      <h1 className="h4 text-muted">
        {t('pageNotFound.notFound')}
      </h1>
      <p className="text-muted">
        <span>{t('pageNotFound.go')}</span>
        {' '}
        <a href="/login">{t('pageNotFound.toHomePage')}</a>
      </p>
    </div>
  );
};

export default PageNotFound;
