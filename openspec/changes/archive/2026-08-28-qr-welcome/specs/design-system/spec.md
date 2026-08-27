# design-system (delta)

## ADDED Requirements

### Requirement: Motion-токены и границы анимации
Система SHALL транслировать duration-токены из `tokens.json.motion` в CSS-переменные `globals.css` рядом с существующими easing-токенами: `--duration-fast: 150ms`, `--duration-base: 200ms`, `--duration-medium: 300ms`, `--duration-slow: 400ms`, `--duration-page: 600ms`. Компоненты SHALL использовать токены длительности/easing вместо магических чисел.

Анимируемые свойства ограничены списком: `opacity`, `transform`, `background-color`, `border-color`. Layout-свойства (`width`, `height`, `margin`, `padding`, `font-size`, `top`, `left`) MUST NOT анимироваться.

Точечные расширения принципа «MVP без анимации» (решение владельца, интервью 2026-08-01):
- Sequential reveal (каскад с лесенкой задержек) SHALL допускаться только для entrance-хореографии capability `welcome-choreography`; для hover-эффектов и произвольного скролл-декора он остаётся запрещённым.
- Расширенные амплитуды SHALL допускаться только внутри entrance: `translateY` до высоты строки (~110%) исключительно внутри маски `overflow: hidden`; `scaleX`/`scaleY` в диапазоне 0↔1 исключительно для прорисовки линий и полосок. Вне entrance действуют базовые токены (`translateY` 5–10px, `scale` ≤ 1.02).
- Vanilla rAF-цикл SHALL допускаться только в слое capability `cursor-companion`.

JS-библиотеки анимации (GSAP, Motion/Framer Motion, Lenis, AOS, anime.js и аналоги) MUST NOT добавляться в зависимости. `prefers-reduced-motion: reduce` SHALL полностью отключать все перечисленные анимации. Запреты DS (тени, радиусы, hex-литералы в компонентах) распространяются на motion-слой без исключений.

#### Scenario: Duration-токены определены
- **WHEN** собрана тема (`globals.css`)
- **THEN** определены переменные `--duration-fast/base/medium/slow/page` со значениями 150/200/300/400/600ms и существующие `--ease-standard`/`--ease-emphasized`

#### Scenario: Анимационные библиотеки отсутствуют
- **WHEN** выполняется поиск `gsap|framer-motion|motion|lenis|aos|animejs` по `package.json`
- **THEN** совпадений в зависимостях нет

#### Scenario: Каскад не применяется вне entrance
- **WHEN** проводится ревью секций вне entrance-хореографии (hover-состояния, скролл-декор)
- **THEN** лесенки задержек (sequential reveal) в них отсутствуют

#### Scenario: ds-lint остаётся зелёным
- **WHEN** выполняется `npm run ds-lint` после внедрения motion-слоя
- **THEN** проверка проходит без ошибок (нет теней, недопустимых радиусов, hex-литералов в `.tsx`)

#### Scenario: Reduced motion отключает всё
- **WHEN** включён `prefers-reduced-motion: reduce`
- **THEN** entrance-хореография, прорисовки линий/полосок и cursor-companion полностью отключены
