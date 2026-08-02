/*
 * Show-once гейт entrance-встречи (design D1). Строка инлайнится в <head>
 * и выполняется до первой отрисовки: если флага в sessionStorage нет —
 * ставит класс на <html> и записывает флаг. Скан QR открывает новую вкладку
 * (пустой sessionStorage) → встреча; внутренняя навигация — без повторов.
 * Доступ к хранилищу в try/catch: недоступно — показываем встречу.
 */

export const WELCOME_CLASS = "js-welcome";
export const WELCOME_KEY = "zazemli-welcome";

export const welcomeGateScript =
  `(function(){try{if(sessionStorage.getItem("${WELCOME_KEY}"))return;` +
  `sessionStorage.setItem("${WELCOME_KEY}","1")}catch(e){}` +
  `document.documentElement.classList.add("${WELCOME_CLASS}")})()`;
