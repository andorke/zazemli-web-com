"""Подготовка списка получателей для разового письма о появившемся грунте.

Оператор отправляет утверждённое письмо из Sendsay и импортирует фактический
результат выпуска. Файлы со списками хранятся только в закрытой директории.
"""
import argparse
import csv
from datetime import datetime, timezone
import os
from pathlib import Path
import sqlite3


def prepare(db, request_id, batch_id):
    db.execute('BEGIN IMMEDIATE')
    db.execute('''CREATE TABLE IF NOT EXISTS plant_notices (
        request_id TEXT NOT NULL, email TEXT NOT NULL, batch_id TEXT NOT NULL,
        state TEXT NOT NULL DEFAULT 'prepared', sent_at TEXT,
        PRIMARY KEY(request_id, email))''')
    if db.execute("SELECT 1 FROM plant_requests WHERE request_id=?", (request_id,)).fetchone() is None:
        raise ValueError('Неизвестное растение')
    prior = db.execute('SELECT DISTINCT request_id FROM plant_notices WHERE batch_id=?', (batch_id,)).fetchall()
    if prior and prior != [(request_id,)]:
        raise ValueError('Этот выпуск уже используется для другого растения')
    if not prior:
        db.execute('''INSERT OR IGNORE INTO plant_notices (request_id, email, batch_id)
            SELECT request_id, email, ? FROM consent_records
            WHERE request_id=? AND purpose='waitlist' AND mode='live' AND delivery_state='delivered' ''',
            (batch_id, request_id))
    return db.execute('''SELECT email FROM plant_notices
        WHERE request_id=? AND batch_id=? AND state='prepared' ORDER BY email''',
        (request_id, batch_id)).fetchall()


def record_results(db, batch_id, rows):
    db.execute('BEGIN IMMEDIATE')
    for row in rows:
        state = row['state']
        if state not in ('sent', 'suppressed'):
            raise ValueError('Результат должен быть sent или suppressed из отчёта провайдера')
        result = db.execute('''UPDATE plant_notices SET state=?, sent_at=?
            WHERE batch_id=? AND email=? AND (state='prepared' OR state=?)''',
            (state, datetime.now(timezone.utc).isoformat() if state == 'sent' else None,
             batch_id, row['email'], state))
        if not result.rowcount:
            raise ValueError('В отчёте адрес вне выпуска или уже есть другой результат')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--db', type=Path, required=True)
    sub = parser.add_subparsers(dest='action', required=True)
    export = sub.add_parser('prepare')
    export.add_argument('request_id')
    export.add_argument('batch_id')
    export.add_argument('file', type=Path)
    confirm = sub.add_parser('record')
    confirm.add_argument('batch_id')
    confirm.add_argument('file', type=Path)
    args = parser.parse_args()
    os.umask(0o077)
    with sqlite3.connect(args.db.resolve().as_uri() + '?mode=rw', uri=True) as db:
        if args.action == 'prepare':
            rows = prepare(db, args.request_id, args.batch_id)
            with args.file.open('x', encoding='utf-8', newline='') as output:
                writer = csv.writer(output)
                writer.writerow(['email'])
                writer.writerows(rows)
            print(f'Адресов в выпуске: {len(rows)}')
        else:
            with args.file.open(encoding='utf-8-sig', newline='') as source:
                record_results(db, args.batch_id, csv.DictReader(source))
            print('Результат выпуска сохранён')


if __name__ == '__main__':
    main()
