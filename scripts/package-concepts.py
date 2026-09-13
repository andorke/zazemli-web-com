#!/usr/bin/env python3
"""Собирает автономную копию визуальных концептов для /rubinovoe-more/."""
import argparse
import shutil
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path, help='content/ локального прототипа')
parser.add_argument('output', type=Path, help='Новый каталог сборки')
args = parser.parse_args()
source = args.source.resolve()
output = args.output.resolve()
if not (source / 'redesign.html').is_file():
    parser.error('В source отсутствует redesign.html')
if output.exists():
    parser.error('Каталог output уже существует; выберите новый, чтобы сохранить прошлую сборку')
assets = output / 'files'
assets.mkdir(parents=True)
allowed = {'.css', '.js', '.woff2', '.png', '.jpg', '.jpeg', '.webp', '.svg'}
for path in sorted(source.iterdir()):
    if not path.is_file() or path.is_symlink():
        continue
    if path.suffix in {'.css', '.js'}:
        (assets / path.name).write_text(path.read_text().replace('/files/', '/rubinovoe-more/files/'))
    elif path.suffix in allowed or path.name in {'canonical-content.json', 'photos-manifest.json'}:
        shutil.copyfile(path, assets / path.name)
html = (source / 'redesign.html').read_text().replace('/files/', '/rubinovoe-more/files/')
html = html.replace('<head>', '<head>\n<meta name="robots" content="noindex,nofollow,noarchive">')
html = html.replace('редакция 6 · бокс становится экспонатом', 'редакция 7 · экспериментальная площадка')
html = html.replace('Макеты сохранены локально в .superpowers/brainstorm/20987-1789208257/content/', 'Экспериментальная площадка /rubinovoe-more/ · покупка демонстрационная')
(output / 'index.html').write_text(html)
print(f'Собрано: {output} ({len(list(assets.iterdir()))} файлов ассетов)')
