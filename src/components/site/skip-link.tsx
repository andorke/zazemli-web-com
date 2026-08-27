/*
 * Skip-link по эталону прототипов (`<a class="skip" href="#main">`): уводит
 * клавиатурного посетителя за шапку с первого Tab. FIX-25.
 *
 * Скрываем выносом за экран, а не `display:none` и не `visibility:hidden`:
 * те убирают элемент из порядка фокуса, и ссылка перестаёт работать по
 * назначению — её вообще нельзя было бы поймать табом.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="bg-bone text-charcoal border-charcoal font-ui text-small absolute -left-[9999px] top-0 z-100 border px-6 py-3.5 focus:left-4 focus:top-4"
    >
      К основному содержанию
    </a>
  );
}
