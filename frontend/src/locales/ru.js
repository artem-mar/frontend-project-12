export default {
  translation: {
    mainHeader: 'Hexlet Chat',
    logOut: 'Выйти',
    channels: 'Каналы',
    signIn: {
      header: 'Войти',
      username: 'Ваш ник',
      password: 'Пароль',
      submit: 'Войти',
      signUp: 'Регистрация',
      noAccount: 'Нет аккаунта?',
      authFailed: 'Неверные имя пользователя или пароль',
    },
    signUp: {
      header: 'Регистрация',
      username: 'Имя пользователя',
      password: 'Пароль',
      passwordConfirmation: 'Подтвердите пароль',
      submit: 'Зарегистрироваться',
      required: 'Обязательное поле',
      usernameSize: 'От 3 до 20 символов',
      passwordSize: 'Не менее 6 символов',
      passwordMatches: 'Пароли должны совпадать',
      regFailed: 'Такой пользователь уже существует',
      profanity: 'Использование ненормативной лексики запрещено',
    },
    chat: {
      message_one: '{{count}} сообщение',
      message_few: '{{count}} сообщения',
      message_many: '{{count}} сообщений',
      message_zero: '{{count}} сообщений',
      enterMessage: 'Введите сообщение...',
      newMessage: 'Новое сообщение',
    },
    channel: {
      remove: 'Удалить',
      rename: 'Переименовать',
    },
    modals: {
      required: 'Обязательное поле',
      size: 'От 3 до 20 символов',
      unique: 'Должно быть уникальным',
      addChannel: 'Добавить канал',
      removeChannel: 'Удалить канал?',
      renameChannel: 'Переименовать канал',
      cancel: 'Отменить',
      submit: 'Отправить',
      remove: 'Удалить',
      channelName: 'Имя канала',
    },
    toasts: {
      added: 'Канал создан',
      removed: 'Канал удалён',
      renamed: 'Канал переименован',
      networkError: 'Ошибка соединения',
      unknownError: 'Неизвестная ошибка',
    },
  },
};
