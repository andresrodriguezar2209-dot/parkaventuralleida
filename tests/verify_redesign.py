"""Responsive visual regressions for the alternate model. No external writes."""
import os
import shutil
from playwright.sync_api import sync_playwright

base = os.environ.get('PARK_TEST_URL', 'http://127.0.0.1:4173')
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'), args=['--no-sandbox'])
    for width, height in [(1440, 900), (1024, 768), (820, 1180), (768, 1024), (390, 844), (320, 640)]:
        page = browser.new_page(viewport={'width': width, 'height': height}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.route('https://esm.sh/**', lambda route: route.abort())
        page.goto(base, wait_until='domcontentloaded')
        page.evaluate('document.fonts.ready')
        page.wait_for_function('document.documentElement.dataset.momentsReady === "2"')
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), (width, 'overflow')
        button = page.locator('#inicio .primary').bounding_box()
        assert button['y'] + button['height'] <= height, (width, 'hero action below fold')
        assert page.locator('[data-moment-failed]').count() == 0
        assert page.locator('.mission-card').count() == 7
        assert page.locator('[data-pack]').count() == 8
        for image in page.locator('.mission-photo img,.celebration-frame img,.location-photo img').all():
            image.scroll_into_view_if_needed()
            image.evaluate('(img)=>img.decode()')
            assert image.evaluate('(img)=>img.naturalWidth>0'), (width, image.get_attribute('src'))
        page.locator('.final-cta').scroll_into_view_if_needed()
        assert page.locator('.final-cta').evaluate('(el)=>getComputedStyle(el).backgroundColor') == 'rgb(194, 61, 18)'
        assert page.locator('.final-cta h2').evaluate('(el)=>getComputedStyle(el).color') == 'rgb(255, 255, 255)'
        assert not errors, errors
        print(f'{width}: fonts, hero action, overflow, 7 activities, 8 packs, real images and moments passed', flush=True)
        page.close()
    browser.close()
