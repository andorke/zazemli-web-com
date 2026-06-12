# PREPRESS GUIDE · Заземли · автоматический workflow

**Назначение:** этот файл описывает полный процесс генерации pre-press PDF для типографии — от исходного дизайна до verify. Применяется автоматически.

---

## Триггер-фразы (что запускает этот workflow)

Когда Настя пишет любую из фраз ниже — Claude **обязан** прочитать этот файл и следовать ему пошагово:

- «сделай препресс» / «сделай pre-press»
- «сделай макеты» / «сделай макет»
- «подготовь для типографии» / «подготовь к печати»
- «сгенерируй PDF для печати»
- «обнови партию [N]»
- «print-ready» / «к печати»

**Триггеры в смежных задачах:**
- «проверь макеты» → запустить **§5 Verify** (без regen)
- «обнови мокапы» → запустить **§3 Build sketches** (sketches.html only)

---

## §1 · Архитектура pipeline

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ build_sketches  │ ──→ │  sketches.html   │     │   Mockup для     │
│      .py        │     │  (sketches v5+)  │ ──→ │     Насти        │
└─────────────────┘     └──────────────────┘     └──────────────────┘
        │
        │  imports
        ↓
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ build_prepress  │ ──→ │ print-v6-prepress│ ──→ │ brand-kit/maketi │
│      .py        │     │   (33 PDF)       │     │    /partia-0/    │
└─────────────────┘     └──────────────────┘     └──────────────────┘
```

**Source of truth:**
- `C:\Users\Настя\Documents\zazemli-brand\maketi\_sketches-v5\build_sketches.py` — артефакт-функции
- `C:\Users\Настя\Documents\zazemli-brand\maketi\_sketches-v5\build_prepress.py` — pre-press wrapper

**Output:**
- `C:\Users\Настя\Desktop\zazemli-brand-kit\maketi\partia-0\` — финальные 33 PDF + MANIFEST.txt

---

## §2 · Стек инструментов (строго эти)

| Инструмент | Назначение |
|---|---|
| **cairosvg** (2.9+) | SVG → vector PDF (без растеризации) |
| **ghostscript** 9.55+ | RGB → CMYK FOGRA39L conversion |
| **qpdf** | uncompress / re-compress + content stream patching |
| **pypdf** 3.x | TrimBox / BleedBox в metadata |
| **fontTools** | проверка глифов в TTF |
| **FOGRA39L_coated.icc** | `/usr/share/texlive/texmf-dist/tex/generic/colorprofiles/FOGRA39L_coated.icc` |

**Шрифты (должны быть в `~/.fonts/`):**
- Unbounded-Regular / Bold / Black / Light
- Spectral-Regular / Italic / SemiBold(Italic)
- Caveat-Regular
- DejaVu Sans (системный, для fleuron ❦)

Если не установлены — копировать из `C:\Users\Настя\Documents\zazemli-brand\fonts\` + `fc-cache -f ~/.fonts/`.

---

## §3 · Workflow · build sketches

```bash
cd /sessions/.../zazemli-brand/maketi/_sketches-v5/
python3 build_sketches.py
# Output: sketches.html (мокап для Насти)
```

Перед запуском **очистить null bytes** (linter/edits могут вставить):
```python
data = open('build_sketches.py','rb').read()
n = data.count(b'\x00')
if n: open('build_sketches.py','wb').write(data.replace(b'\x00',b''))
```

---

## §4 · Workflow · build prepress (главное)

```bash
cd /sessions/.../zazemli-brand/maketi/_sketches-v5/
rm -rf print-v6-prepress
timeout 200 python3 -u build_prepress.py
# Output: print-v6-prepress/ — 33 PDF + _svg/ дебаг
```

**Что делает `build_prepress.py` для каждого артефакта:**

1. Берёт SVG-функцию из `build_sketches.py`
2. Применяет **k100_text()** — заменяет `#1C1C1C` на `#000000` ТОЛЬКО внутри `<text>` (для pure K=100)
3. Оборачивает в `wrap_with_prepress()`:
   - Outer SVG `<svg viewBox="0 0 Vw Vh">` где Vw = trim + 6мм bleed + 14мм margin
   - Сабсвг с art_inner на offset (margin)
   - **Crop marks** (8 штук, длина 5мм, gap 2мм от trim, K=100)
   - **Registration marks** (4 угла, ⌀4мм + крест, K=100)
   - **DIECUT layer** на trim-edge (#FF00FF, stroke 0.75, layer name "CutContour")
   - Info-text «Заземли · {name} · Trim ... Bleed 3mm CMYK FOGRA39L»
4. cairosvg → RGB PDF (vector, embedded fonts)
5. **Ghostscript ICC conversion** (FOGRA39L_coated):
   ```
   gs -dNOPAUSE -dBATCH -dSAFER -sDEVICE=pdfwrite
      -sProcessColorModel=DeviceCMYK
      -sColorConversionStrategy=CMYK
      -sColorConversionStrategyForImages=CMYK
      -dOverrideICC=true
      -sOutputICCProfile=FOGRA39L_coated.icc
      -dEmbedAllFonts=true
      -dSubsetFonts=true
      -dCompatibilityLevel=1.4
      -sOutputFile=out.pdf in.pdf
   ```
6. **Post-process content stream** (qpdf uncompress + regex):
   - Pattern `(0.72 < c < 0.73 and 0.67 < mm < 0.68 and 0.67 < y < 0.68 and 0.87 < k < 0.89)` → `0 0 0 1` (pure K=100 для текста — было #000000)
   - Pattern `(0.22 < c < 0.30 and 0.78 < mm < 0.85 and y < 0.05 and k < 0.05)` → `0 1 0 0` (pure M=100 для DIECUT — было #FF00FF)
7. qpdf re-compress
8. **pypdf set boxes**:
   - TrimBox = trim-зона
   - BleedBox = TrimBox + 3мм со всех сторон
   - MediaBox = BleedBox + 7мм margin (для marks)

**Размеры артефактов (партия 0):**

| Артефакт | Trim | Bleed | Media | Кол-во |
|---|---|---|---|---|
| Медальон ⌀80 | 80×80 мм | 86×86 | 100×100 | 7 SKU |
| Медальон ⌀100 | 100×100 | 106×106 | 120×120 | 7 SKU |
| Медальон ⌀120 | 120×120 | 126×126 | 140×140 | 7 SKU |
| Мини ⌀40 | 40×40 | 46×46 | 60×60 | 3 (01/02/03) |
| Band | 70×50 | 76×56 | 90×70 | 1 |
| Листовка front | 140×140 | 146×146 | 160×160 | 1 |
| Листовка back | 140×140 | 146×146 | 160×160 | 7 SKU |
| **ИТОГО** | | | | **33** |

---

## §5 · Verify checklist (после каждого regen)

**Запускать обязательно** перед финальной отправкой PDF в brand-kit. Тулы — `pdfinfo`, `pdffonts`, `qpdf`, `gs -sDEVICE=inkcov`.

### 5.1 · Boxes (для каждого PDF)
```python
from pypdf import PdfReader
MM = 2.8346456693
r = PdfReader('file.pdf')
p = r.pages[0]
for box in ['/MediaBox', '/TrimBox', '/BleedBox']:
    v = [float(x) for x in p.get(box)]
    print(f'{box} {(v[2]-v[0])/MM:.1f}x{(v[3]-v[1])/MM:.1f} мм')
```
Ожидать: TrimBox = заявленный размер, BleedBox − TrimBox = 6 мм (по 3 мм на каждую сторону).

### 5.2 · CMYK content stream
```bash
qpdf --qdf --stream-data=uncompress file.pdf /tmp/x.pdf
grep -oEa "[0-9]+\.?[0-9]* [0-9]+\.?[0-9]* [0-9]+\.?[0-9]* [0-9]+\.?[0-9]* [kK]" /tmp/x.pdf | sort -u
```
Ожидать минимум:
- `0 0 0 1 K` и `0 0 0 1 k` — pure K100 для текста ✓
- `0 1 0 0 K` — pure M=100 для DIECUT ✓
- НЕ должно быть rg/RG операторов (RGB)

### 5.3 · Шрифты embedded + Cyrillic
```bash
pdffonts file.pdf
```
Ожидать:
- Все строки `emb=yes sub=yes uni=yes`
- Минимум: Unbounded-Regular, Unbounded-Bold (опц), Spectral-Italic (где латынь), DejaVuSans (для fleuron ❦), Caveat-Regular (band+leaflet)

### 5.4 · Fleuron ❦ (P0 проверка!)
```python
# Проверить что DejaVuSans embedded
import subprocess
out = subprocess.run(['pdffonts', 'file.pdf'], capture_output=True, text=True).stdout
assert 'DejaVuSans' in out, 'fleuron ❦ render fail!'
```
**Spectral НЕ содержит U+2766 ❦.** Все ❦-text-теги должны иметь `font-family="DejaVu Sans, Spectral"`.

### 5.5 · TAC (total area coverage) — лимиты
```bash
gs -dNOPAUSE -dBATCH -sDEVICE=inkcov -o - file.pdf 2>/dev/null | grep CMYK
```
- Bone fill: TAC ~8% — норма
- Moss signature: ~192% — норма
- **Rich black plashka: 277.7%** (= C70 M67 Y66 K77) — на грани лимита 280% uncoated, проверить пробником
- Если page-avg > 280% → откатить на C60 M55 Y55 K70 = 240%

### 5.6 · Финальный one-liner verify all 33 PDF
```python
from pypdf import PdfReader
import os, subprocess
MM = 2.8346456693
ok_count = 0
for pdf in sorted(os.listdir('partia-0')):
    if not pdf.endswith('.pdf'): continue
    p = PdfReader(f'partia-0/{pdf}').pages[0]
    has_trim = bool(p.trimbox)
    has_bleed = bool(p.bleedbox)
    bleed_offset = (p.bleedbox[2] - p.trimbox[2]) / MM
    fonts = subprocess.run(['pdffonts', f'partia-0/{pdf}'], capture_output=True, text=True).stdout
    has_dejavu = 'DejaVuSans' in fonts
    cyrillic_ok = fonts.count('uni=yes') == fonts.count('emb=yes')
    if has_trim and has_bleed and abs(bleed_offset - 3.0) < 0.01 and has_dejavu and cyrillic_ok:
        ok_count += 1
        print(f'  ✓ {pdf}')
    else:
        print(f'  ✗ {pdf} — bleed={bleed_offset}, dejavu={has_dejavu}')
print(f'\n{ok_count}/33 PDF passed full verify')
```

---

## §6 · Push в brand-kit

После успешного verify скопировать в финальное место:

```bash
DST=/sessions/.../zazemli-brand-kit/maketi/partia-0
SRC=/sessions/.../zazemli-brand/maketi/_sketches-v5/print-v6-prepress

mkdir -p $DST
rm $DST/*.pdf 2>/dev/null
cp $SRC/*.pdf $DST/
echo "Copied: $(ls $DST/*.pdf | wc -l) PDF"
```

**Обновить MANIFEST.txt:**
- Версия → текущая (v5.4 / v5.5 / etc)
- Date → today
- Список 33 файлов
- Tech specs

Использовать template из `brand-kit/maketi/partia-0/MANIFEST.txt` (текущий).

---

## §7 · Что НЕ делать (anti-patterns)

| Антипаттерн | Почему плохо |
|---|---|
| Использовать Spectral для ❦ | Глиф U+2766 отсутствует — пустой бокс в PDF |
| DIECUT на bleed-edge | Стандарт = trim. Если на bleed → типография режет на 6мм больше |
| Скруглённые углы DIECUT | Только на artefactах со скруглёнными краями (band — без скруглений!) |
| Bone-fill на листовке | Листовка печатается на льне — бумага сама даёт цвет |
| Bone-fill только до trim для round | Тогда bleed-зона прозрачная → белая полоса при сдвиге резки |
| #1C1C1C для текста | rich black 277% TAC + misregistration на льне. **Только #000000 → K100** |
| Stroke < 0.25мм | Может пропасть при печати |
| Без TrimBox в metadata | Типография не знает где границы изделия |
| RGB цвета в PDF | Enjoyprint отклонит на preflight |
| Шрифты без `uni=yes` | Кириллица сломается, особенно «Ё» |

---

## §8 · Изменения от партии-0 к партии-1+

Если партия меняется:
1. Создать новую папку `brand-kit/maketi/partia-N/`
2. Если изменились SKU → обновить `LEAF_SKUS` в `build_sketches.py`
3. Если изменились handscript-фразы → vectorize новые в `_sketches-v5/handscript/`
4. Запустить полный pipeline §3 → §4 → §5 → §6
5. Обновить N° в `medallion_v4` (партия-N → префикс N00 / N01 / etc)

---

## §9 · Критичные файлы — НЕ ТРОГАТЬ без согласования

`brand-kit` помечен как защищённая папка (см. `CLAUDE.md`). Любые правки:
- `brandbook/brand-v3.html` — только после явного запроса
- `print-brief/*.md` — то же
- `mockups/stickers-v5.html` — то же
- `assets/handscript/*.svg` — то же

**Можно автоматически обновлять без согласования:**
- `maketi/partia-N/*.pdf` — это output генератора, не source
- `maketi/partia-N/MANIFEST.txt` — то же

---

## §10 · Чек-лист для типографии (когда отправляем)

```
[ ] 33 PDF загружены в Enjoyprint
[ ] Указан материал каждой группы (см. MANIFEST.txt §1-4)
[ ] Заказан пробный образец 1000₽ для:
      - leaflet-001-monstera-back (uncoated лён 300г)
      - medallion-100mm-001-monstera (soft-touch плёнка 30мкм)
      - band-charcoal (TAC 277% rich-black на льне)
      - mini-02-charcoal (то же)
[ ] Комментарий в заказе:
    «CMYK FOGRA39L coated. DIECUT = pure Magenta 100%, layer "CutContour".
     Резка по DIECUT = по TrimBox metadata. Шрифты embedded subset.
     Pure K=100 для тонкого текста (черный), rich-black для плашек.»
[ ] После пробы — confirm full тираж (см. tirage в MANIFEST §1-4)
```

---

## Версия гайда

**v1.0** · 26 апреля 2026
Source for truth: `_sketches-v5/build_prepress.py` (последняя стабильная итерация v5.4).

При следующих изменениях pipeline (новая партия, новый материал, etc) — обновить этот файл соответственно.
