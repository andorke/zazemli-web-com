"""Создаёт консистентную резервную копию SQLite и проверяет её целостность."""
import argparse
from contextlib import closing
import os
from pathlib import Path
import sqlite3


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('database', type=Path)
    parser.add_argument('backup', type=Path)
    args = parser.parse_args()

    source_uri = args.database.resolve().as_uri() + '?mode=ro'
    os.umask(0o077)
    with args.backup.open('xb'):
        pass
    try:
        with closing(sqlite3.connect(source_uri, uri=True)) as source, closing(sqlite3.connect(args.backup)) as backup:
            source.backup(backup)
            if backup.execute('PRAGMA integrity_check').fetchone() != ('ok',):
                raise RuntimeError('Копия не прошла проверку целостности')
    except BaseException:
        args.backup.unlink()
        raise
    print('Резервная копия прошла проверку целостности')


if __name__ == '__main__':
    main()
