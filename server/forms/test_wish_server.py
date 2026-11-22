"""Receiver contract tests. All storage is temporary; Sendsay transport is replaced."""
import importlib.util
from contextlib import closing
import json
from pathlib import Path
import sqlite3
import tempfile
import unittest
from uuid import UUID
from notification_batch import prepare, record_results

SPEC = importlib.util.spec_from_file_location('wish_server', Path(__file__).with_name('wish-server.py'))
server = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(server)
ORIGIN = 'http://127.0.0.1:8766'
COPY = {'version': '2026-11-16', 'consents': {'pdn': 'Fixed PDN consent', 'diary': 'Fixed diary consent', 'waitlist': 'Fixed one-letter consent'}}
LIVE = {'ZAZEMLI_LIVE_EMAIL': '1', 'ZAZEMLI_SENDSAY_ACCOUNT': 'test-account', 'ZAZEMLI_SENDSAY_API_KEY': 'synthetic-test-key', 'ZAZEMLI_SENDSAY_DIARY_LIST': 'diary-test', 'ZAZEMLI_SENDSAY_WAITLIST_LIST': 'waitlist-test'}

class ReceiverTests(unittest.TestCase):
    def setUp(self):
        self.assertTrue(hasattr(server, 'Receiver'), 'Receiver API is not implemented')
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.site = Path(self.tmp.name) / 'site'
        self.site.mkdir()
        (self.site / 'launch-copy.json').write_text(json.dumps(COPY), encoding='utf-8')
        self.db = Path(self.tmp.name) / 'feedback-private' / 'plant-wishes.sqlite3'
        self.calls = []
        self.provider_result = {}
        self.provider_error = None
        self.app = self.make_app()

    def transport(self, url, headers, payload, timeout):
        self.calls.append((url, headers, payload, timeout))
        if self.provider_error:
            raise self.provider_error
        return self.provider_result

    def make_app(self, env=None):
        return server.Receiver(self.site, self.db, env={} if env is None else env, transport=self.transport)

    def post(self, path, payload, app=None, origin=ORIGIN, content_type='application/json', headers=None):
        body = json.dumps(payload).encode('utf-8')
        request_headers = {'Origin': origin, 'Content-Type': content_type, 'Content-Length': str(len(body))}
        request_headers.update(headers or {})
        return (app or self.app).handle('POST', path, request_headers, body, '192.0.2.10')

    def plant(self, app=None):
        status, payload, _ = self.post('/api/waitlist/plant', {'plant': '  Калатея  '}, app)
        self.assertEqual(status, 201)
        self.assertTrue(payload['saved'])
        UUID(payload['requestId'])
        return payload['requestId']

    def test_live_storage_is_committed_before_provider_call(self):
        app = self.make_app(LIVE)
        def check_committed(url, headers, payload, timeout):
            records = self.rows('consent_records')
            self.assertEqual(len(records), 1)
            self.assertEqual(records[0]['delivery_state'], 'pending')
            return {}
        app.transport = check_committed
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), app)[0], 201)

    def test_one_address_can_wait_for_two_plants_without_a_sendable_field(self):
        app = self.make_app({**LIVE, 'ZAZEMLI_SENDSAY_PLANT_FIELD': 'custom.requestedPlant'})
        first = self.plant(app)
        other = self.post('/api/waitlist/plant', {'plant': 'Алоказия'}, app)[1]['requestId']
        for request in (first, other):
            self.assertEqual(self.post('/api/waitlist/email', self.email_payload(request), app)[0], 201)
        self.assertEqual({row['request_id'] for row in self.rows('consent_records')}, {first, other})
        self.assertTrue(all('custom.requestedPlant' not in str(call[2]) for call in self.calls))
        with closing(sqlite3.connect(self.db)) as db, db:
            self.assertEqual(prepare(db, first, 'first'), [('Owner+plant@example.com',)])
        with closing(sqlite3.connect(self.db)) as db, db:
            record_results(db, 'first', [{'email': 'Owner+plant@example.com', 'state': 'sent'}])
        with closing(sqlite3.connect(self.db)) as db, db:
            self.assertEqual(prepare(db, first, 'repeat'), [])
        with closing(sqlite3.connect(self.db)) as db, db:
            self.assertEqual(prepare(db, other, 'other'), [('Owner+plant@example.com',)])

    def test_periodic_retry_resumes_failed_request_after_restart(self):
        app = self.make_app(LIVE)
        self.provider_error = TimeoutError('timeout')
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), app)[0], 503)
        with closing(sqlite3.connect(self.db)) as db, db:
            db.execute('UPDATE provider_jobs SET next_at=0')
        self.provider_error = None
        restarted = self.make_app(LIVE)
        restarted.sync_due()
        self.assertEqual(self.rows('consent_records')[0]['delivery_state'], 'delivered')
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), restarted)[1]['duplicate'], True)
        self.assertEqual(len(self.calls), 2)

    def email_payload(self, request_id=None):
        payload = {'email': ' Owner+plant@Example.COM ', 'consent_pdn': True, 'consent_mail': True, 'consent_version': '2026-11-16'}
        if request_id:
            payload['requestId'] = request_id
        return payload

    def rows(self, table):
        with closing(sqlite3.connect(self.db)) as conn, conn:
            conn.row_factory = sqlite3.Row
            return [dict(row) for row in conn.execute('SELECT * FROM ' + table)]

    def test_plant_is_saved_before_any_email_and_duplicate_reuses_request(self):
        first = self.plant()
        second = self.post('/api/waitlist/plant', {'plant': 'калатея'})[1]['requestId']
        self.assertEqual(first, second)
        self.assertEqual([r['plant'] for r in self.rows('wishes')], ['Калатея'])
        self.assertEqual(self.rows('consent_records'), [])
        self.assertEqual(self.calls, [])

    def test_preview_saves_fixed_consents_server_time_and_direct_ip(self):
        request_id = self.plant()
        status, payload, _ = self.post('/api/waitlist/email', self.email_payload(request_id), headers={'X-Forwarded-For': '203.0.113.44'})
        self.assertEqual((status, payload), (202, {'saved': True, 'mode': 'preview', 'delivered': False}))
        records = self.rows('consent_records')
        self.assertEqual(len(records), 1)
        record = records[0]
        self.assertEqual((record['purpose'], record['email'], record['request_id']), ('waitlist', 'Owner+plant@example.com', request_id))
        self.assertEqual((record['pdn_text'], record['mail_text'], record['consent_version']), ('Fixed PDN consent', 'Fixed one-letter consent', '2026-11-16'))
        self.assertEqual(record['ip'], '192.0.2.10')
        self.assertRegex(record['created_utc'], r'^\d{4}-\d\d-\d\dT.*(?:Z|\+00:00)$')
        self.assertEqual(self.calls, [])
        self.assertNotIn('owner', json.dumps(payload))

    def test_preview_with_credentials_still_never_calls_provider(self):
        app = self.make_app({**LIVE, 'ZAZEMLI_LIVE_EMAIL': '0'})
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), app)[0], 202)
        self.assertEqual(self.calls, [])

    def test_purposes_have_distinct_texts_and_do_not_implicitly_subscribe(self):
        request_id = self.plant()
        self.post('/api/waitlist/email', self.email_payload(request_id))
        self.assertEqual([r['purpose'] for r in self.rows('consent_records')], ['waitlist'])
        self.post('/api/diary/subscribe', self.email_payload())
        self.assertEqual([(r['purpose'], r['mail_text']) for r in self.rows('consent_records')], [('waitlist', 'Fixed one-letter consent'), ('diary', 'Fixed diary consent')])

    def test_repeat_submission_is_idempotent_in_preview_and_live(self):
        for live in (False, True):
            with self.subTest(live=live):
                app = self.make_app(LIVE if live else {})
                payload = {**self.email_payload(), 'email': ('live' if live else 'preview') + '@example.com'}
                a = self.post('/api/diary/subscribe', payload, app)
                b = self.post('/api/diary/subscribe', payload, app)
                self.assertEqual(a[0], b[0])
                self.assertTrue(b[1]['duplicate'])
                self.assertEqual(a[1], {k: v for k, v in b[1].items() if k != 'duplicate'})
        self.assertEqual(len(self.rows('consent_records')), 2)
        self.assertEqual(len(self.calls), 1)

    def test_email_preserves_local_part_case(self):
        app = self.make_app(LIVE)
        for address in ('CaseSensitive@EXAMPLE.COM', 'casesensitive@example.com'):
            status, payload, _ = self.post('/api/diary/subscribe', {**self.email_payload(), 'email': address}, app)
            self.assertEqual(status, 201)
            self.assertNotIn('duplicate', payload)
        self.assertEqual([call[2]['email'] for call in self.calls], ['CaseSensitive@example.com', 'casesensitive@example.com'])

    def test_preview_bundle_database_is_outside_the_start_page_root(self):
        (self.site.parent / 'START.html').touch()
        self.assertEqual(server.default_db_path(self.site), self.site.resolve().parent.parent / 'feedback-private' / 'plant-wishes.sqlite3')

    def test_live_uses_server_auth_separate_lists_and_no_send_action(self):
        app = self.make_app(LIVE)
        request_id = self.plant(app)
        self.assertEqual(self.post('/api/waitlist/email', self.email_payload(request_id), app)[0], 201)
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), app)[0], 201)
        self.assertEqual(len(self.calls), 2)
        first, second = self.calls
        self.assertEqual(first[0], 'https://api.sendsay.ru/general/api/v100/json/test-account')
        self.assertIn('Authorization', first[1])
        self.assertEqual(first[2]['action'], 'member.set')
        self.assertEqual(first[2]['addr_type'], 'email')
        self.assertEqual(first[2]['datakey'], [['-group.waitlist-test', 'set', '1']])
        self.assertEqual(second[2]['datakey'], [['-group.diary-test', 'set', '1']])
        self.assertNotIn('apikey', first[2])
        self.assertGreater(first[3], 0)
        self.assertLessEqual(first[3], 15)
        self.assertTrue(all(r['delivery_state'] == 'delivered' for r in self.rows('consent_records')))

    def test_incomplete_live_configuration_is_not_false_success(self):
        for missing in ('ZAZEMLI_SENDSAY_ACCOUNT', 'ZAZEMLI_SENDSAY_API_KEY', 'ZAZEMLI_SENDSAY_DIARY_LIST', 'ZAZEMLI_SENDSAY_WAITLIST_LIST'):
            with self.subTest(missing=missing):
                env = dict(LIVE)
                del env[missing]
                status, payload, _ = self.post('/api/diary/subscribe', self.email_payload(), self.make_app(env))
                self.assertEqual((status, payload), (503, {'error': 'email_unconfigured'}))
        self.assertEqual(self.calls, [])

    def test_same_live_list_cannot_mix_waitlist_and_diary(self):
        app = self.make_app({**LIVE, 'ZAZEMLI_SENDSAY_DIARY_LIST': 'waitlist-test'})
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), app)[:2], (503, {'error': 'email_unconfigured'}))
        self.assertEqual(self.calls, [])

    def test_http_200_provider_errors_are_failures_and_retry_can_succeed(self):
        app = self.make_app(LIVE)
        self.provider_result = {'errors': [{'id': 'auth/failed', 'explain': 'private-provider-detail'}]}
        status, payload, _ = self.post('/api/diary/subscribe', self.email_payload(), app)
        self.assertEqual((status, payload), (502, {'error': 'email_provider_error'}))
        self.assertNotIn('private', json.dumps(payload))
        self.assertEqual(self.rows('consent_records')[0]['delivery_state'], 'failed')
        self.provider_result = {}
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), app)[0], 201)
        self.assertEqual(len(self.rows('consent_records')), 1)

    def test_provider_timeout_is_not_success(self):
        self.provider_error = TimeoutError('synthetic timeout')
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload(), self.make_app(LIVE))[:2], (503, {'error': 'email_provider_unavailable'}))

    def test_both_boolean_consents_and_current_version_are_required(self):
        for field, value in [('consent_pdn', False), ('consent_mail', False), ('consent_pdn', 'true'), ('consent_mail', 1), ('consent_version', '2026-07-14'), ('consent_version', None)]:
            with self.subTest(field=field, value=value):
                self.assertEqual(self.post('/api/diary/subscribe', {**self.email_payload(), field: value})[0], 400)
        self.assertEqual(self.rows('consent_records'), [])

    def test_email_validation_rejects_ambiguous_or_injected_addresses(self):
        for email in ['', None, 3, 'a@b', 'a..b@example.com', 'x\r\nBcc:y@example.com', 'a@-bad.example', 'a b@example.com', 'x<y@example.com']:
            with self.subTest(email=email):
                self.assertEqual(self.post('/api/diary/subscribe', {**self.email_payload(), 'email': email})[0], 400)

    def test_unknown_request_or_malformed_uuid_cannot_attach_email(self):
        for invalid in ('invalid', 3, None, []):
            try:
                status = self.post('/api/waitlist/email', {**self.email_payload(), 'requestId': invalid})[0]
            except Exception as error:
                self.fail('Malformed requestId escaped validation: ' + type(error).__name__)
            self.assertEqual(status, 400)
        self.assertEqual(self.post('/api/waitlist/email', self.email_payload('00000000-0000-4000-8000-000000000001'))[0], 404)
        self.assertEqual(self.rows('consent_records'), [])

    def test_plant_validation_prevents_pii_in_name_only_step(self):
        for data in ({'plant': ''}, {'plant': 3}, {'plant': 'x' * 71}, {'plant': '123'}, {'plant': 'a@example.com'}, {'plant': 'Калатея', 'email': 'x@example.com'}):
            with self.subTest(data=data):
                self.assertEqual(self.post('/api/waitlist/plant', data)[0], 400)
        self.assertEqual(self.rows('wishes'), [])

    def test_bad_cors_and_null_origin_are_rejected_without_allow_header(self):
        for origin in ('null', 'https://evil.example', 'http://localhost:9999', None):
            status, _, headers = self.post('/api/waitlist/plant', {'plant': 'Калатея'}, origin=origin)
            self.assertEqual(status, 403)
            self.assertNotIn('Access-Control-Allow-Origin', headers)
        status, _, headers = self.post('/api/waitlist/plant', {'plant': 'Калатея'})
        self.assertEqual(status, 201)
        self.assertEqual(headers['Access-Control-Allow-Origin'], ORIGIN)

    def test_explicit_production_origin_and_preflight_are_supported(self):
        app = self.make_app({'ZAZEMLI_ALLOWED_ORIGINS': 'https://zazemli.com'})
        self.assertEqual(self.post('/api/waitlist/plant', {'plant': 'Калатея'}, app, origin='https://zazemli.com')[0], 201)
        status, _, headers = app.handle('OPTIONS', '/api/diary/subscribe', {'Origin': ORIGIN, 'Access-Control-Request-Method': 'POST', 'Access-Control-Request-Headers': 'content-type'}, b'', '127.0.0.1')
        self.assertEqual(status, 204)
        self.assertIn('POST', headers['Access-Control-Allow-Methods'])

    def test_json_only_body_limit_and_malformed_input(self):
        self.assertEqual(self.post('/api/waitlist/plant', {'plant': 'Калатея'}, content_type='text/plain')[0], 415)
        for body in (b'not json', b'[]', b'null', b'"text"'):
            self.assertEqual(self.app.handle('POST', '/api/waitlist/plant', {'Origin': ORIGIN, 'Content-Type': 'application/json', 'Content-Length': str(len(body))}, body, '127.0.0.1')[0], 400)
        body = b'x' * 8193
        self.assertEqual(self.app.handle('POST', '/api/waitlist/plant', {'Origin': ORIGIN, 'Content-Type': 'application/json', 'Content-Length': str(len(body))}, body, '127.0.0.1')[0], 413)

    def test_status_contains_no_secrets_and_default_database_is_outside_site(self):
        self.assertEqual(self.app.handle('GET', '/api/status', {}, b'', '127.0.0.1')[:2], (200, {'mode': 'preview', 'emailConfigured': False}))
        live = self.make_app(LIVE)
        status = live.handle('GET', '/api/status', {}, b'', '127.0.0.1')[1]
        self.assertEqual(status, {'mode': 'live', 'emailConfigured': True})
        self.assertNotIn('synthetic', json.dumps(status))
        self.assertEqual(server.default_db_path(self.site), self.site.resolve().parent / 'feedback-private' / 'plant-wishes.sqlite3')

    def test_missing_copy_does_not_log_invented_consent_text(self):
        (self.site / 'launch-copy.json').unlink()
        self.assertEqual(self.post('/api/diary/subscribe', self.email_payload())[:2], (503, {'error': 'consent_unconfigured'}))
        self.assertEqual(self.rows('consent_records'), [])

    def test_legacy_name_only_wishes_schema_remains_readable(self):
        legacy_db = self.db.parent / 'legacy.sqlite3'
        with closing(sqlite3.connect(legacy_db)) as conn, conn:
            conn.execute('CREATE TABLE wishes (id INTEGER PRIMARY KEY, plant TEXT NOT NULL, created_utc TEXT DEFAULT CURRENT_TIMESTAMP)')
            conn.execute('INSERT INTO wishes (plant) VALUES (?)', ('Фикус',))
        app = server.Receiver(self.site, legacy_db, env={}, transport=self.transport)
        self.plant(app)
        with closing(sqlite3.connect(legacy_db)) as conn, conn:
            self.assertEqual(conn.execute('SELECT plant FROM wishes ORDER BY id').fetchall(), [('Фикус',), ('Калатея',)])

if __name__ == '__main__':
    unittest.main()
