# site-shell — delta (privacy-page)

## ADDED Requirements

### Requirement: Роут /privacy и доступность политики
Система SHALL отдавать индексируемый статический роут `/privacy` (собирается `next build` в `output: 'export'`, входит в `sitemap.xml`, canonical на `https://zazemli.com/privacy`, `robots` разрешает индексацию). Ссылка на политику конфиденциальности SHALL присутствовать в двух глобальных местах: (1) legal-строка футера каждой страницы — пункт «Политика конфиденциальности» → `/privacy`; (2) текст cookie-баннера — ссылка на `/privacy`.

#### Scenario: Роут собирается и индексируется
- **WHEN** выполняется `npm run build`
- **THEN** в `out/` присутствует HTML `/privacy`, URL входит в `sitemap.xml`, мета-robots страницы не содержит `noindex`

#### Scenario: Ссылка на политику в футере
- **WHEN** отрендерена любая страница
- **THEN** в legal-строке футера есть ссылка «Политика конфиденциальности» на `/privacy`

#### Scenario: Ссылка на политику в cookie-баннере
- **WHEN** отрендерен cookie-баннер
- **THEN** его текст содержит ссылку на `/privacy`
