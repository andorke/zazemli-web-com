/*
 * Show-once гейт entrance-встречи (design D1). Строка инлайнится в <head>
 * и выполняется до первой отрисовки: если флага в sessionStorage нет —
 * ставит класс на <html> и записывает флаг. Скан QR открывает новую вкладку
 * (пустой sessionStorage) → встреча; внутренняя навигация — без повторов.
 * Доступ к хранилищу в try/catch: недоступно — показываем встречу.
 */

export const WELCOME_CLASS = "js-welcome";
export const WELCOME_KEY = "zazemli-welcome";

/*
 * Транзитные страницы гейт не тратят. `/collectio` — редирект печатного QR
 * партии 0: он мгновенно уводит на `/#collectio`, и если бы флаг ставился
 * здесь, встреча на главной уже не показалась бы — скан QR не увидел бы её
 * вовсе. Такая страница пропускается: и класс не вешает, и флаг не пишет.
 */
export const TRANSIT_PATHS = ["/collectio", "/collectio/"];

export const welcomeGateScript =
  `(function(){try{` +
  `if(${JSON.stringify(TRANSIT_PATHS)}.indexOf(location.pathname)>-1)return;` +
  `if(sessionStorage.getItem("${WELCOME_KEY}"))return;` +
  `sessionStorage.setItem("${WELCOME_KEY}","1")}catch(e){}` +
  `document.documentElement.classList.add("${WELCOME_CLASS}")})()`;
