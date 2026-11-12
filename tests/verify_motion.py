"""Verify cinematic motion and native interactions; never sends a WhatsApp message."""
import json
import os
import re
import shutil
from playwright.sync_api import sync_playwright, expect

BASE_URL = os.environ.get('PARK_TEST_URL', 'http://127.0.0.1:4173').rstrip('/')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'), headless=True, args=['--no-sandbox'])
    for width, height in [(1440, 1000), (390, 844), (320, 740)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, reduced_motion='no-preference')
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.route('https://esm.sh/**', lambda r: r.abort())
        page.goto(BASE_URL, wait_until='networkidle')
        expect(page.locator('body')).to_have_class(re.compile(r'scroll-fx'))
        expect(page.locator('#inicio')).to_have_class(re.compile(r'motion-running'))
        expect(page.locator('#inicio h1')).to_be_visible()
        assert page.locator('.experience-frame').count() == 7
        assert page.locator('.hero-embers i').count() == 26
        assert page.locator('.hero-embers i').first.evaluate('e=>getComputedStyle(e).animationPlayState') == 'running'
        if width == 1440:
            page.mouse.move(1160, 450)
            page.wait_for_function("parseFloat(document.querySelector('#inicio').style.getPropertyValue('--aim-x')) > 0")
        page.screenshot(path=f'/tmp/park-cinematic-hero-{width}.png')

        page.locator('.adventure-ticker').scroll_into_view_if_needed()
        page.wait_for_function("document.querySelector('.adventure-ticker').classList.contains('motion-running')")
        before = page.locator('.adventure-ticker-track').evaluate('e=>getComputedStyle(e).transform')
        page.wait_for_timeout(120)
        after = page.locator('.adventure-ticker-track').evaluate('e=>getComputedStyle(e).transform')
        assert before != after, 'Ticker is not moving'

        # The restored section transition is visible but never captures clicks.
        page.locator('#misiones').scroll_into_view_if_needed()
        page.wait_for_function("document.querySelector('.fx-scene-title').textContent==='TU MISIÓN EMPIEZA'")
        assert page.locator('.fx-scene-overlay').evaluate('e=>getComputedStyle(e).pointerEvents') == 'none'
        assert page.locator('.hero-embers i').first.evaluate('e=>getComputedStyle(e).animationPlayState') == 'paused'
        for card in page.locator('.mission-card').all():
            card.scroll_into_view_if_needed()
            page.wait_for_function('(id)=>Number(getComputedStyle(document.getElementById(id)).opacity)>.98', arg=card.get_attribute('id'))
        card = page.locator('#detalle-laser')
        card.scroll_into_view_if_needed()
        if width == 1440:
            card.hover(position={'x': 80, 'y': 70})
            page.wait_for_function("document.querySelector('#detalle-laser').style.getPropertyValue('--tilt-x') !== ''")
        page.locator('[data-activity-info=laser]').click()
        expect(page.locator('#activityInfoModal')).to_have_attribute('aria-hidden', 'false')
        page.locator('#activityInfoModal a').click()
        expect(page.locator('#activity')).to_have_value('Laser Tag')
        page.locator('#name').fill('Prueba de animaciones')
        page.locator('#partySize').fill('8')
        assert '160' in page.locator('#bookingSummaryTotal').inner_text()
        page.evaluate('window.open=url=>window.motionTestUrl=url')
        page.locator('#bookingForm button[type=submit]').click()
        assert 'wa.me/34722146640' in page.evaluate('window.motionTestUrl')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'Horizontal overflow'
        assert not errors, errors
        print(json.dumps({'width': width, 'hero': 'particles and depth passed', 'ticker': 'moving', 'activities': '7 animated overlays', 'visibility': 'all cards visible', 'booking': 'passed', 'errors': errors}), flush=True)

        # Changing the OS preference while the page is open stops decorative loops.
        page.emulate_media(reduced_motion='reduce')
        page.evaluate('scrollTo(0,0)')
        expect(page.locator('#inicio h1')).to_be_visible()
        assert page.locator('.hero-atmosphere').evaluate('e=>getComputedStyle(e).display') == 'none'
        assert page.locator('.fx-scene-overlay').evaluate('e=>getComputedStyle(e).display') == 'none'
        assert page.locator('.adventure-ticker-track').evaluate('e=>getComputedStyle(e).animationName') == 'none'
        page.close()
    browser.close()
