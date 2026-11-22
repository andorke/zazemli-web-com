"""Приём заявок ЗАЗЕМЛИ. Python/SQLite и исходные контракты передачи eb3276d."""
import argparse
from contextlib import contextmanager
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from ipaddress import ip_address
import json
import os
from pathlib import Path
import re
import sqlite3
import sys
from threading import Event, Thread
from time import time
import unicodedata
from urllib.error import URLError
from urllib.parse import quote, urlsplit
from urllib.request import Request, urlopen
from uuid import UUID, uuid4

ROOT = Path(__file__).resolve().parent
DEFAULT_COPY = ROOT.parent.parent / 'src/content/paper/launch-copy.json'
MAX_ATTEMPTS = 6
LEASE_SECONDS = 30
MAX_BODY = 8192
CONSENT_VERSION = '2026-11-16'
LOCAL_ORIGINS = {f'http://{host}:{port}' for host in ('localhost', '127.0.0.1') for port in (8422, 8433, 8766)}
EMAIL_ROUTES = {'/api/waitlist/email': 'waitlist', '/api/diary/subscribe': 'diary'}
API_ROUTES = {'/api/status', '/api/waitlist/plant', *EMAIL_ROUTES}
REQUIRED_ENV = ('ZAZEMLI_SENDSAY_ACCOUNT', 'ZAZEMLI_SENDSAY_API_KEY', 'ZAZEMLI_SENDSAY_DIARY_LIST', 'ZAZEMLI_SENDSAY_WAITLIST_LIST')


def default_db_path(site_root):
    public_parent = Path(site_root).resolve().parent
    if (public_parent / 'START.html').is_file():
        public_parent = public_parent.parent
    return public_parent / 'feedback-private' / 'plant-wishes.sqlite3'


def utc_now():
    return datetime.now(timezone.utc).isoformat(timespec='seconds')


def sendsay_transport(url, headers, payload, timeout):
    request = Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
    with urlopen(request, timeout=timeout) as response:
        return json.loads(response.read(1024 * 1024).decode('utf-8'))


def normalize_email(value):
    if not isinstance(value, str):
        raise ValueError('email')
    value = value.strip()
    if len(value) > 254 or value.count('@') != 1 or any(c.isspace() or ord(c) < 32 for c in value):
        raise ValueError('email')
    local, domain = value.rsplit('@', 1)
    if not 1 <= len(local) <= 64 or not re.fullmatch(r"[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+", local):
        raise ValueError('email')
    if local.startswith('.') or local.endswith('.') or '..' in local:
        raise ValueError('email')
    domain = domain.encode('idna').decode('ascii').lower()
    labels = domain.split('.')
    if len(labels) < 2 or any(not re.fullmatch(r'[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?', label) for label in labels):
        raise ValueError('email')
    if len(labels[-1]) < 2 or labels[-1].isdigit():
        raise ValueError('email')
    result = local + '@' + domain
    if len(result) > 254:
        raise ValueError('email')
    return result


class Receiver:
    def __init__(self, site_root=ROOT, db_path=None, env=None, transport=None, copy_path=None):
        self.site_root = Path(site_root).resolve()
        self.db_path = Path(db_path) if db_path is not None else default_db_path(self.site_root)
        self.copy_path = Path(copy_path) if copy_path else self.site_root / 'launch-copy.json'
        self.env = dict(os.environ if env is None else env)
        self.mode = 'live' if self.env.get('ZAZEMLI_LIVE_EMAIL') == '1' else 'preview'
        self.email_configured = (self.mode == 'live'
            and all(self.env.get(key, '').strip() for key in REQUIRED_ENV)
            and self.env.get('ZAZEMLI_SENDSAY_DIARY_LIST', '').strip() != self.env.get('ZAZEMLI_SENDSAY_WAITLIST_LIST', '').strip())
        self.transport = transport or sendsay_transport
        self.origins = set(LOCAL_ORIGINS)
        for origin in self.env.get('ZAZEMLI_ALLOWED_ORIGINS', '').split(','):
            origin = origin.strip().rstrip('/')
            parts = urlsplit(origin)
            if parts.scheme == 'https' and parts.netloc and not parts.username and not parts.password and not parts.path and not parts.query and not parts.fragment:
                self.origins.add(origin)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        with self.connection() as db:
            # Keep the original table unchanged, including pre-existing name-only rows.
            db.execute('CREATE TABLE IF NOT EXISTS wishes (id INTEGER PRIMARY KEY, plant TEXT NOT NULL, created_utc TEXT DEFAULT CURRENT_TIMESTAMP)')
            db.execute('''CREATE TABLE IF NOT EXISTS plant_requests (
                request_id TEXT PRIMARY KEY, plant TEXT NOT NULL,
                plant_key TEXT NOT NULL UNIQUE, created_utc TEXT NOT NULL)''')
            db.execute('''CREATE TABLE IF NOT EXISTS consent_records (
                id INTEGER PRIMARY KEY, purpose TEXT NOT NULL, email TEXT NOT NULL,
                request_id TEXT NOT NULL DEFAULT '', consent_version TEXT NOT NULL,
                pdn_text TEXT NOT NULL, mail_text TEXT NOT NULL,
                created_utc TEXT NOT NULL, ip TEXT NOT NULL,
                mode TEXT NOT NULL, delivery_state TEXT NOT NULL,
                UNIQUE(purpose, email, request_id, consent_version))''')
            db.execute('''CREATE TABLE IF NOT EXISTS provider_jobs (
                record_id INTEGER PRIMARY KEY REFERENCES consent_records(id),
                attempts INTEGER NOT NULL DEFAULT 0, next_at REAL NOT NULL DEFAULT 0,
                lease_until REAL NOT NULL DEFAULT 0)''')
            db.execute('''INSERT OR IGNORE INTO provider_jobs (record_id)
                SELECT id FROM consent_records
                WHERE mode='live' AND delivery_state IN ('pending', 'failed')''')

    @contextmanager
    def connection(self):
        db = sqlite3.connect(self.db_path, timeout=15)
        db.row_factory = sqlite3.Row
        db.execute('PRAGMA foreign_keys=ON')
        try:
            with db:
                yield db
        finally:
            db.close()

    def handle(self, method, path, headers, body, client_ip):
        path = urlsplit(path).path
        headers = {key.lower(): value for key, value in headers.items()}
        origin = headers.get('origin')
        response_headers = {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Vary': 'Origin', 'X-Content-Type-Options': 'nosniff'}
        if origin in self.origins:
            response_headers['Access-Control-Allow-Origin'] = origin
        def reply(status, payload):
            return status, payload, response_headers
        if path not in API_ROUTES:
            return reply(404, {'error': 'not_found'})
        if origin is not None and origin not in self.origins or method in ('POST', 'OPTIONS') and origin not in self.origins:
            return reply(403, {'error': 'origin_forbidden'})
        if method == 'OPTIONS':
            requested = headers.get('access-control-request-method', '')
            allowed = 'GET' if path == '/api/status' else 'POST'
            requested_headers = {part.strip().lower() for part in headers.get('access-control-request-headers', '').split(',') if part.strip()}
            if requested != allowed or requested_headers - {'content-type'}:
                return reply(403, {'error': 'preflight_forbidden'})
            response_headers.update({'Access-Control-Allow-Methods': allowed, 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600'})
            return reply(204, {})
        if path == '/api/status':
            return reply(200, {'mode': self.mode, 'emailConfigured': bool(self.email_configured)}) if method == 'GET' else reply(405, {'error': 'method_not_allowed'})
        if method != 'POST':
            return reply(405, {'error': 'method_not_allowed'})
        if headers.get('content-type', '').split(';', 1)[0].strip().lower() != 'application/json':
            return reply(415, {'error': 'json_required'})
        try:
            length = int(headers.get('content-length', '0'))
        except (TypeError, ValueError):
            return reply(400, {'error': 'invalid_body'})
        if length > MAX_BODY or len(body) > MAX_BODY:
            return reply(413, {'error': 'body_too_large'})
        if length <= 0 or length != len(body):
            return reply(400, {'error': 'invalid_body'})
        try:
            data = json.loads(body.decode('utf-8'))
            if not isinstance(data, dict):
                raise ValueError('object required')
        except (UnicodeError, ValueError):
            return reply(400, {'error': 'invalid_body'})
        try:
            if path == '/api/waitlist/plant':
                status, payload = self.save_plant(data) if self.ready else (503, {'error': 'email_unconfigured'})
            else:
                status, payload = self.save_email(EMAIL_ROUTES[path], data, client_ip)
            return reply(status, payload)
        except (ValueError, TypeError, UnicodeError):
            return reply(400, {'error': 'invalid_input'})
        except sqlite3.Error:
            return reply(503, {'error': 'storage_unavailable'})

    def save_plant(self, data):
        if set(data) - {'plant', 'ts'} or not isinstance(data.get('plant'), str):
            raise ValueError('plant')
        plant = ' '.join(unicodedata.normalize('NFC', data['plant']).split())
        if not 2 <= len(plant) <= 70 or not any(c.isalpha() for c in plant) or '@' in plant or '://' in plant:
            raise ValueError('plant')
        key = plant.casefold().replace('ё', 'е')
        with self.connection() as db:
            db.execute('BEGIN IMMEDIATE')
            row = db.execute('SELECT request_id FROM plant_requests WHERE plant_key = ?', (key,)).fetchone()
            duplicate = row is not None
            request_id = row['request_id'] if duplicate else str(uuid4())
            if not duplicate:
                db.execute('INSERT INTO wishes (plant) VALUES (?)', (plant,))
                db.execute('INSERT INTO plant_requests VALUES (?, ?, ?, ?)', (request_id, plant, key, utc_now()))
        result = {'saved': True, 'requestId': request_id, 'mode': self.mode}
        if duplicate:
            result['duplicate'] = True
        return 201, result

    def consent_copy(self):
        try:
            data = json.loads(self.copy_path.read_text(encoding='utf-8-sig'))
            if data['version'] != CONSENT_VERSION or not all(isinstance(data['consents'][key], str) and data['consents'][key].strip() for key in ('pdn', 'diary', 'waitlist')):
                return None
            return data
        except (OSError, ValueError, TypeError, KeyError):
            return None

    @property
    def ready(self):
        return self.mode == 'preview' or (self.email_configured and self.consent_copy() is not None)

    def save_email(self, purpose, data, client_ip):
        expected = {'email', 'consent_pdn', 'consent_mail', 'consent_version'}
        if purpose == 'waitlist':
            expected.add('requestId')
        if set(data) - expected or data.get('consent_pdn') is not True or data.get('consent_mail') is not True or data.get('consent_version') != CONSENT_VERSION:
            raise ValueError('consent')
        email = normalize_email(data.get('email'))
        request_id = ''
        if purpose == 'waitlist':
            if not isinstance(data.get('requestId'), str):
                raise ValueError('requestId')
            request_id = str(UUID(data['requestId']))
        copy = self.consent_copy()
        if copy is None:
            return 503, {'error': 'consent_unconfigured'}
        if self.mode == 'live' and not self.email_configured:
            return 503, {'error': 'email_unconfigured'}
        with self.connection() as db:
            db.execute('BEGIN IMMEDIATE')
            plant = None
            if request_id:
                plant = db.execute('SELECT plant FROM plant_requests WHERE request_id = ?', (request_id,)).fetchone()
                if plant is None:
                    return 404, {'error': 'request_not_found'}
            row = db.execute('SELECT id, delivery_state FROM consent_records WHERE purpose=? AND email=? AND request_id=? AND consent_version=?', (purpose, email, request_id, CONSENT_VERSION)).fetchone()
            duplicate = row is not None
            if row is None:
                cur = db.execute('''INSERT INTO consent_records
                    (purpose,email,request_id,consent_version,pdn_text,mail_text,created_utc,ip,mode,delivery_state)
                    VALUES (?,?,?,?,?,?,?,?,?,?)''', (purpose, email, request_id, CONSENT_VERSION, copy['consents']['pdn'], copy['consents'][purpose], utc_now(), client_ip, self.mode, 'preview' if self.mode == 'preview' else 'pending'))
                record_id = cur.lastrowid
            else:
                record_id = row['id']
            result = {'saved': True, 'mode': self.mode}
            if duplicate:
                result['duplicate'] = True
            if self.mode == 'preview':
                result['delivered'] = False
                return 202, result
            if row is not None and row['delivery_state'] == 'delivered':
                return 201, result
            db.execute('INSERT OR IGNORE INTO provider_jobs (record_id) VALUES (?)', (record_id,))
        status = self.sync_record(record_id, immediate=duplicate)
        if status == 201:
            return status, result
        return status, {'error': 'email_provider_error' if status == 502 else 'email_provider_unavailable'}

    def sync_record(self, record_id, immediate=False):
        now = time()
        lease = now + LEASE_SECONDS
        with self.connection() as db:
            db.execute('BEGIN IMMEDIATE')
            record = db.execute(
                'SELECT email, purpose, delivery_state FROM consent_records WHERE id=?', (record_id,)
            ).fetchone()
            if record is None:
                return 404
            if record['delivery_state'] == 'delivered':
                return 201
            claim = db.execute('''UPDATE provider_jobs
                SET attempts=attempts+1, lease_until=?
                WHERE record_id=? AND lease_until<=? AND attempts<? AND (next_at<=? OR ?)''',
                (lease, record_id, now, MAX_ATTEMPTS, now, int(immediate)))
            if not claim.rowcount:
                return 503
            attempt = db.execute('SELECT attempts FROM provider_jobs WHERE record_id=?', (record_id,)).fetchone()[0]

        # Запись и аренда видны из другого процесса до сетевого вызова.
        # Установка уже установленной принадлежности к группе повторяема.
        # Ключ растения остаётся в SQLite, где один email может иметь несколько заявок.
        group = self.env['ZAZEMLI_SENDSAY_DIARY_LIST' if record['purpose'] == 'diary'
                         else 'ZAZEMLI_SENDSAY_WAITLIST_LIST']
        payload = {'action': 'member.set', 'addr_type': 'email', 'email': record['email'],
                   'datakey': [['-group.' + group, 'set', '1']]}
        url = 'https://api.sendsay.ru/general/api/v100/json/' + quote(self.env['ZAZEMLI_SENDSAY_ACCOUNT'], safe='')
        headers = {'Content-Type': 'application/json', 'Accept': 'application/json',
                   'Authorization': 'sendsay apikey=' + quote(self.env['ZAZEMLI_SENDSAY_API_KEY'], safe='')}
        try:
            response = self.transport(url, headers, payload, 8)
            status = 201 if isinstance(response, dict) and not response.get('errors') else 502
        except (TimeoutError, OSError, URLError):
            status = 503
        except (ValueError, UnicodeError):
            status = 502

        with self.connection() as db:
            db.execute('BEGIN IMMEDIATE')
            updated = db.execute('''UPDATE provider_jobs SET lease_until=0, next_at=?
                WHERE record_id=? AND lease_until=?''', (time() + min(900, 15 * 2 ** attempt), record_id, lease))
            if not updated.rowcount:
                return 503
            # «delivered» здесь значит, что провайдер принял контакт, как в старой базе.
            # Доставка письма проверяется по отчёту Sendsay отдельно.
            db.execute('UPDATE consent_records SET delivery_state=? WHERE id=?',
                       ('delivered' if status == 201 else 'failed', record_id))
        return status

    def sync_due(self):
        if self.mode != 'live' or not self.ready:
            return
        now = time()
        with self.connection() as db:
            rows = db.execute('''SELECT j.record_id FROM provider_jobs j
                JOIN consent_records c ON c.id=j.record_id
                WHERE c.delivery_state IN ('pending', 'failed')
                AND j.attempts<? AND j.next_at<=? AND j.lease_until<=?
                ORDER BY j.next_at LIMIT 10''', (MAX_ATTEMPTS, now, now)).fetchall()
        for row in rows:
            self.sync_record(row['record_id'])


def make_handler(receiver, trust_proxy=False):
    class Handler(BaseHTTPRequestHandler):
        def setup(self):
            self.request.settimeout(12)
            super().setup()

        def respond(self, result):
            status, payload, headers = result
            body = b'' if status == 204 else json.dumps(payload, ensure_ascii=False).encode('utf-8')
            self.send_response(status)
            for key, value in headers.items():
                self.send_header(key, value)
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)

        def dispatch(self):
            body = b''
            try:
                length = int(self.headers.get('Content-Length', '0'))
            except ValueError:
                length = 0
            if self.command == 'POST' and 0 < length <= MAX_BODY:
                body = self.rfile.read(length)
            peer = self.client_address[0]
            if trust_proxy and ip_address(peer).is_loopback:
                supplied = self.headers.get('X-Real-IP')
                if supplied:
                    try:
                        peer = str(ip_address(supplied))
                    except ValueError:
                        pass
            self.respond(receiver.handle(self.command, self.path, dict(self.headers), body, peer))

        do_GET = do_POST = do_OPTIONS = do_HEAD = dispatch

        def log_message(self, format, *args):
            pass
    return Handler


def main():
    parser = argparse.ArgumentParser(description='Loopback API форм ЗАЗЕМЛИ')
    parser.add_argument('--port', type=int, default=8433)
    parser.add_argument('--db', type=Path, required=True)
    parser.add_argument('--copy', type=Path, default=DEFAULT_COPY)
    parser.add_argument('--live', action='store_true')
    parser.add_argument('--preview-origin')
    args = parser.parse_args()
    os.umask(0o077)
    environment = dict(os.environ)
    environment['ZAZEMLI_LIVE_EMAIL'] = '1' if args.live else '0'
    app = Receiver(db_path=args.db, copy_path=args.copy, env=environment)
    if args.live and not app.ready:
        parser.exit(1, 'Live: нужны два различных списка Sendsay, ключ, аккаунт и согласия этой версии.\n')
    if not args.live:
        app.origins.update(f'http://{host}:{args.port}' for host in ('localhost', '127.0.0.1'))
        app.origins.update(f'http://{host}:28300' for host in ('localhost', '127.0.0.1'))
        if args.preview_origin:
            if not re.fullmatch(r'http://(?:127\.0\.0\.1|localhost):[1-9][0-9]{0,4}', args.preview_origin):
                parser.error('Предпросмотр доступен только через loopback')
            app.origins.add(args.preview_origin)
    stop = Event()

    def retry():
        while not stop.wait(15):
            try:
                app.sync_due()
            except sqlite3.Error:
                sys.stderr.write('Не удалось прочитать очередь форм\n')

    with ThreadingHTTPServer(('127.0.0.1', args.port), make_handler(app, trust_proxy=args.live)) as server:
        if args.live:
            Thread(target=retry, daemon=True, name='sendsay-retry').start()
        print(f'Forms API ({app.mode}) on 127.0.0.1:{args.port}', flush=True)
        try:
            server.serve_forever()
        finally:
            stop.set()


if __name__ == '__main__':
    main()
