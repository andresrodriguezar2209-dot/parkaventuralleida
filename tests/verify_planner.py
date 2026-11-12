"""Pruebas de decisiones y reserva; no envía mensajes ni escribe en servicios externos.

Ejecutar con el servidor de tests/README.md. PARK_TEST_URL y CHROMIUM_PATH son opcionales.
"""
from datetime import date, timedelta
import json
import os
import re
import shutil
from urllib.parse import parse_qs, urlparse
from playwright.sync_api import sync_playwright, expect

BASE_URL = os.environ.get('PARK_TEST_URL', 'http://127.0.0.1:4173').rstrip('/')


def tomorrow_weekday(today, weekday):
    candidate = today + timedelta(days=1)
    while candidate.weekday() != weekday:
        candidate += timedelta(days=1)
    return candidate.isoformat()


def amount_in(text, amount):
    """Allow normal and non-breaking spaces in currency formatting."""
    compact = re.sub(r'\s+', '', text)
    return re.search(r'(?<!\d)' + str(amount) + r'(?:[,.]00)?€', compact) is not None


def set_finder(page, age, people, preference):
    page.locator('#finderAge').fill(str(age) if age is not None else '')
    page.locator('#finderPeople').fill(str(people) if people is not None else '')
    page.locator('[data-plan="' + preference + '"]').click()
    expect(page.locator('[data-plan="' + preference + '"]')).to_have_attribute('aria-pressed', 'true')
    return page.locator('[data-finder-activity]').evaluate_all(
        "els=>els.map(e=>({id:e.dataset.finderActivity,status:e.dataset.finderStatus,session:e.dataset.sessionId}))"
    )


def activity_ids(results):
    return {result['id'] for result in results}


def compatible_ids(results):
    return {result['id'] for result in results if result['status'] == 'compatible'}


def choose_booking(page, activity, people, session=None):
    page.locator('#activity').select_option(label=activity)
    page.locator('#partySize').fill(str(people) if people is not None else '')
    if session is not None:
        page.locator('#bookingSession').select_option(session)
    page.locator('#date').fill('')


def exact_is_valid(page):
    return page.locator('#partySize').evaluate('(el)=>el.checkValidity()')


def submit(page):
    page.evaluate('() => { window.plannerOpened=[]; window.open=(url)=>{window.plannerOpened.push(url)}; }')
    page.locator('#bookingForm button[type=submit]').click()
    return page.evaluate('window.plannerOpened')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(
        executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),
        headless=True,
        args=['--no-sandbox'],
    )
    for width, height in [(1440, 1000), (390, 844)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        # Offline gallery must never prevent the planner from working.
        page.route('https://esm.sh/**', lambda route: route.abort())
        page.goto(BASE_URL, wait_until='domcontentloaded')
        page.locator('.finder-disclosure > summary').click()
        expect(page.locator('#finderAge')).to_be_visible()
        expect(page.locator('#bookingSummary')).to_be_attached()
        assert page.locator('#inicio h1').inner_text() == 'PARK\nAVENTURA\nLLEIDA.'
        assert 'SIN LÍMITES.' in page.locator('#inicio .hero-slogan').inner_text()

        # Invalid input does not produce a compatible recommendation.
        set_finder(page, 6, 0, 'all')
        assert not page.locator('#finderPeople').evaluate('(el)=>el.checkValidity()')
        assert page.locator('[data-finder-status="compatible"]').count() == 0

        # Actual eligibility boundaries: no recommendation may silently ignore age/group.
        assert not activity_ids(set_finder(page, 6, 8, 'action'))
        assert activity_ids(set_finder(page, 7, 8, 'action')) == {'laser'}
        assert compatible_ids(set_finder(page, 14, 10, 'action')) == {'paintball', 'laser'}
        assert activity_ids(set_finder(page, 6, 8, 'virtual')) == {'vr', 'battle'}
        assert activity_ids(set_finder(page, 6, 1, 'virtual')) == {'vr'}
        assert not compatible_ids(set_finder(page, 6, 17, 'virtual'))
        assert 'stress' not in activity_ids(set_finder(page, 14, 2, 'all'))
        stress_results = set_finder(page, 16, 2, 'all')
        assert 'stress' in activity_ids(stress_results)
        assert 'stress' not in activity_ids(set_finder(page, 16, 3, 'all'))
        assert 'paintball' not in activity_ids(set_finder(page, 14, 9, 'action'))
        assert 'laser' not in activity_ids(set_finder(page, 14, 21, 'action'))
        assert 'team' not in activity_ids(set_finder(page, 16, 46, 'group'))
        group_results = set_finder(page, 16, 45, 'group')
        assert 'team' in activity_ids(group_results)
        for result in group_results:
            if result['id'] in ('team', 'humor'):
                assert result['status'] == 'consult', 'Unpublished age rules must require consultation'
        set_finder(page, 6, 46, 'virtual')
        expect(page.locator('#finderEmpty')).to_be_visible()

        # A recommendation carries the selected activity and exact group into booking.
        set_finder(page, 14, 10, 'action')
        page.locator('[data-prepare-activity="paintball"]').click()
        expect(page.locator('#activity')).to_have_value('Paintball')
        expect(page.locator('#partySize')).to_have_value('10')
        assert '9–15' in page.locator('#people').input_value()
        assert amount_in(page.locator('#bookingSummaryTotal').inner_text(), 250)

        # Clear the optional age through the finder before isolated booking checks.
        set_finder(page, None, 10, 'action')
        page.locator('[data-prepare-activity="paintball"]').click()

        # Public min/max boundaries must prevent a misleading quote or valid-looking request.
        for activity, session, invalid, valid in [
            ('Paintball', 'p100', [9], [10]),
            ('Laser Tag', 'short', [7, 21], [8, 20]),
            ('Realidad virtual', 'short', [17], [1, 16]),
            ('Battle Start', 'short', [7, 17], [8, 16]),
            ('Stress Room', None, [1, 3], [2]),
            ('Team Building', 'team01', [9, 31], [10, 30]),
            ('Team Building', 'team02', [9, 46], [10, 45]),
        ]:
            for count in invalid:
                choose_booking(page, activity, count, session)
                assert not exact_is_valid(page), (activity, session, count)
            for count in valid:
                choose_booking(page, activity, count, session)
                assert exact_is_valid(page), (activity, session, count)

        # A revised people range cannot retain a contradictory exact count.
        choose_booking(page, 'Laser Tag', 10, 'short')
        page.locator('#people').select_option(label='1–4 personas')
        expect(page.locator('#partySize')).to_have_value('')
        choose_booking(page, 'Team Building', 31, 'team01')
        assert not exact_is_valid(page)
        page.locator('#bookingSession').select_option('team02')
        assert exact_is_valid(page), 'A compatible session must clear the previous validity error'

        # Session changes update the quote, rather than keeping a stale low-price total.
        choose_booking(page, 'Laser Tag', 8, 'short')
        assert amount_in(page.locator('#bookingSummaryTotal').inner_text(), 160)
        page.locator('#bookingSession').select_option('long')
        assert amount_in(page.locator('#bookingSummaryTotal').inner_text(), 240)
        choose_booking(page, 'Laser Tag', None, 'short')
        assert not amount_in(page.locator('#bookingSummaryTotal').inner_text(), 160)
        choose_booking(page, 'Humor Amarillo', 10)
        assert not re.search(r'\d\s*€', page.locator('#bookingSummaryTotal').inner_text()), 'Unknown tariff must not become a quote'

        # An editable age must validate the chosen activity and release stale restrictions.
        choose_booking(page, 'Stress Room', 2)
        page.locator('#youngestAge').fill('14')
        assert not page.locator('#youngestAge').evaluate('(el)=>el.checkValidity()')
        assert not amount_in(page.locator('#bookingSummaryTotal').inner_text(), 60)
        page.locator('#youngestAge').fill('16')
        assert page.locator('#youngestAge').evaluate('(el)=>el.checkValidity()')
        assert amount_in(page.locator('#bookingSummaryTotal').inner_text(), 60)
        choose_booking(page, 'Pack Básico', 10, 'birthday-basic')
        assert not page.locator('#youngestAge').evaluate('(el)=>el.checkValidity()')
        page.locator('#name').fill('Prueba del planificador')
        assert not submit(page), 'Birthday pack must not accept a participant age above14'
        page.locator('#youngestAge').fill('7')
        assert page.locator('#youngestAge').evaluate('(el)=>el.checkValidity()')

        # Birthday pricing changes with the requested day; blank date retains a range.
        today = date.fromisoformat(page.evaluate("new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10)"))
        monday, friday = tomorrow_weekday(today, 0), tomorrow_weekday(today, 4)
        choose_booking(page, 'Pack Básico', 10, 'birthday-basic')
        assert not amount_in(page.locator('#bookingSummaryTotal').inner_text(), 250)
        page.locator('#date').fill(monday)
        assert amount_in(page.locator('#bookingSummaryTotal').inner_text(), 250)
        page.locator('#date').fill(friday)
        assert amount_in(page.locator('#bookingSummaryTotal').inner_text(), 300)

        # The final message matches what the visitor reviewed. No WhatsApp window is opened.
        page.locator('#name').fill('Prueba del planificador')
        page.locator('#details').fill('Revisar opciones para nuestro grupo')
        opened = submit(page)
        assert len(opened) == 1, {'opened': opened, 'invalid': page.locator('#bookingForm :invalid').evaluate_all('els=>els.map(e=>({id:e.id,value:e.value,message:e.validationMessage}))')}
        parsed = urlparse(opened[0])
        assert parsed.scheme == 'https' and parsed.netloc == 'wa.me' and parsed.path == '/34722146640'
        message = parse_qs(parsed.query)['text'][0]
        assert 'Pack Básico' in message and '300' in message and '10' in message
        assert 'Revisar opciones para nuestro grupo' in message
        assert 'confirm' in message.lower()

        # Invalid requests are blocked before any URL is handed to WhatsApp.
        page.locator('#date').fill((today - timedelta(days=1)).isoformat())
        assert not page.locator('#date').evaluate('(el)=>el.checkValidity()')
        assert not submit(page), 'Past-date request should not open WhatsApp'
        choose_booking(page, 'Paintball', 9, 'p100')
        assert not submit(page), 'Below-minimum group should not open WhatsApp'
        page.locator('#bookingAdvice').click()
        expect(page.locator('#activity')).to_have_value('Quiero asesoramiento')
        assert exact_is_valid(page), 'Advice flow must release activity-specific restrictions'
        assert len(submit(page)) == 1

        # Four activity cards use real repository photographs, not the old text collages.
        for activity_id in ['paintball', 'laser', 'vr', 'battle']:
            photo=page.locator('#detalle-' + activity_id + ' .mission-photo img')
            photo.scroll_into_view_if_needed()
            assert 'PHOTO-2026-11-07-' in photo.get_attribute('src')
            page.wait_for_function('(id)=>{const img=document.querySelector("#detalle-"+id+" .mission-photo img");return img.complete&&img.naturalWidth>0}', arg=activity_id)

        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), 'Horizontal overflow'
        assert not errors, errors
        print(json.dumps({'width': width, 'finder': 'age/group boundaries passed', 'pricing': 'sessions/day/unknown passed', 'handoff': 'passed', 'validation': 'passed', 'errors': errors}), flush=True)
        page.close()
    browser.close()
