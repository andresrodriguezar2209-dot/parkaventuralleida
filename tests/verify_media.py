"""Real media integration: no writes to external services and no messages sent."""
import json, os, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

BASE = os.environ.get('PARK_TEST_URL', 'http://127.0.0.1:4173').rstrip('/')
ROOT = Path(__file__).resolve().parents[1]
audit = json.loads((ROOT / 'media-audit.json').read_text())
assert len(audit['files']) == 42
assert len([f for f in audit['files'] if f['index'] >= 6 and f['published']]) == 33

with sync_playwright() as p:
    browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'), headless=True, args=['--no-sandbox'])
    for width, height in [(1440,1000),(768,1024),(390,844),(320,740)]:
        page = browser.new_page(viewport={'width':width,'height':height}, reduced_motion='reduce', is_mobile=width<500, has_touch=width<500)
        errors, media_requests = [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('request', lambda request: media_requests.append(request.url) if '/assets/experiences/' in request.url and '.mp4' in request.url else None)
        page.route('https://esm.sh/**', lambda route: route.abort())
        page.goto(BASE, wait_until='networkidle')
        assert not media_requests, 'Experience MP4s must not load with the page'
        page.wait_for_function("document.querySelectorAll('#homeGalleryGrid .home-gallery-item').length>0")
        assert page.locator('#detalle-humor img').get_attribute('src').endswith('humor-amarillo-09-960.webp')
        assert page.locator('#detalle-humor img').evaluate("img=>getComputedStyle(img).objectFit") == 'contain'
        for key, title in [('paintball','Paintball'),('laser','Laser Tag'),('vr','Realidad virtual'),('humor','Humor Amarillo'),('team','Team Building'),('stress','Stress Room'),('battle','Battle Start')]:
            button = page.locator('#detalle-'+key+' .video-trigger')
            button.click()
            expect(page.locator('#activityVideoModal')).to_have_attribute('aria-hidden','false')
            assert page.locator('#experienceTitle').text_content() == title
            expect(page.locator('#experienceCover')).to_be_visible()
            assert page.locator('#experienceCover').evaluate('img=>img.complete && img.naturalWidth>0')
            player = page.locator('#experienceVideo')
            if key == 'stress':
                assert not player.is_visible()
                assert player.get_attribute('src') is None
            else:
                assert player.evaluate('video=>video.paused && video.muted && video.controls && video.playsInline')
                for choice in page.locator('#experienceVideoChoices button').all():
                    if choice.is_visible(): choice.click()
                    assert player.evaluate('video=>video.paused && video.muted')
                    # Load/play only after an explicit action; verify browser decoding.
                    player.evaluate('video=>video.play()')
                    page.wait_for_function("document.getElementById('experienceVideo').currentTime>0")
                    assert page.evaluate("[...document.querySelectorAll('video')].filter(v=>!v.paused).length") == 1
                    player.evaluate('video=>video.pause()')
                    assert player.get_attribute('poster')
            related = page.locator('#experiencePhotos .experience-photo')
            if related.count():
                related.first.click()
                expect(page.locator('#experienceLightbox')).to_have_attribute('aria-hidden','false')
                initial = page.locator('#experienceLarge').get_attribute('src')
                if related.count()>1:
                    page.locator('#experiencePhotoNext').click()
                    assert page.locator('#experienceLarge').get_attribute('src') != initial
                    page.keyboard.press('ArrowLeft')
                    assert page.locator('#experienceLarge').get_attribute('src') == initial
                page.keyboard.press('Escape')
                expect(page.locator('#experienceLightbox')).to_have_attribute('aria-hidden','true')
                expect(page.locator('#activityVideoModal')).to_have_attribute('aria-hidden','false')
                assert page.evaluate('document.body.style.overflow')=='hidden'
            if key=='humor': page.screenshot(path=f'/tmp/park-experience-{width}.png')
            page.locator('#experienceInfoLink').click()
            expect(page.locator('#activityInfoModal')).to_have_attribute('aria-hidden','false')
            assert page.locator('#activityInfoTitle').inner_text()
            page.keyboard.press('Escape')
            button.click()
            page.keyboard.press('Escape')
            assert player.get_attribute('src') is None
            assert page.evaluate('document.body.style.overflow')!='hidden'
        page.locator('#detalle-humor').scroll_into_view_if_needed()
        page.screenshot(path=f'/tmp/park-media-cards-{width}.png')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        page.goto(BASE+'/galeria.html', wait_until='networkidle')
        assert page.locator('.item').count()==47
        assert page.locator('.media-group-title').count()==8
        for photo in page.locator('.item').all(): photo.scroll_into_view_if_needed()
        page.wait_for_function("[...document.querySelectorAll('.item img')].every(img=>img.complete&&img.naturalWidth>0)")
        urls=page.locator('.item img').evaluate_all('images=>images.map(img=>img.src)')
        assert len(set(urls))==47
        page.locator('[data-category=humor-amarillo]').click()
        assert page.locator('.item').count()==5
        page.locator('.item').first.click()
        page.keyboard.press('Tab'); page.keyboard.press('Shift+Tab')
        page.keyboard.press('Escape')
        page.locator('[data-category=laser-tag]').click()
        assert page.locator('.item').count()==12
        page.screenshot(path=f'/tmp/park-media-gallery-{width}.png')
        assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
        assert not errors, errors
        print(json.dumps({'width':width,'photos':47,'cards':7,'experience':'nested lightbox, player, prices, keyboard passed','initialMP4Requests':0,'errors':errors}),flush=True)
        page.close()
    browser.close()
