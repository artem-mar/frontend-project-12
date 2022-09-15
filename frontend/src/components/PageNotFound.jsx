import fail from '../assets/epic_fail.svg';

const PageNotFound = () => (
  <div className="h-100 text-center">
    <img alt="Page Not Found" className="img-fluid w-25" src={fail} />
    <h1 className="h4 text-muted">
      Страница не найдена
    </h1>
    <p className="text-muted">
      <span>Перейти </span>
      <a href="/login">на главную страницу</a>
    </p>

  </div>
);

export default PageNotFound;
