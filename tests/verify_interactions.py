from playwright.sync_api import sync_playwright, expect
from urllib.parse import unquote
import json, os, shutil
BASE_URL=os.environ.get("PARK_TEST_URL","http://127.0.0.1:4173").rstrip("/")
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 for width,height in [(1440,1000),(390,844),(768,1024)]:
  page=b.new_page(viewport={'width':width,'height':height},reduced_motion='reduce')
  errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
  page.route('https://esm.sh/**',lambda r:r.abort())
  page.goto(BASE_URL,wait_until='domcontentloaded')
  page.wait_for_function("document.querySelectorAll('.home-gallery-item').length>0")
  assert ' '.join(page.locator('#inicio h1').inner_text().split())=='PARK AVENTURA LLEIDA.'
  page.locator('.finder-disclosure > summary').click()
  for key in ['all','action','virtual','group','all']:
   page.locator('[data-plan="'+key+'"]').click()
   assert page.locator('[data-plan="'+key+'"]').get_attribute('aria-pressed')=='true'
   assert page.locator('.plan-match').count()=={'all':0,'action':4,'virtual':3,'group':5}[key]
  for key,value in [('paintball','Paintball'),('laser','Laser Tag'),('vr','Realidad virtual'),('humor','Humor Amarillo'),('team','Team Building'),('stress','Stress Room'),('battle','Battle Start')]:
   button=page.locator('[data-activity-info="'+key+'"]');button.click()
   assert page.locator('#activityInfoModal').get_attribute('aria-hidden')=='false'
   page.locator('#activityInfoPrices').wait_for(state='visible')
   page.wait_for_function("document.activeElement.classList.contains('activity-info-close')")
   expect(page.locator('#activityInfoPrices')).to_be_visible()
   assert page.locator('#activityInfoPrices').text_content()
   # Tab backward from close must wrap to reserve.
   page.keyboard.press('Shift+Tab')
   assert page.locator('#activityInfoModal a').evaluate('(el)=>el===document.activeElement')
   page.locator('#activityInfoModal a').click()
   assert page.locator('#activityInfoModal').get_attribute('aria-hidden')=='true'
   assert page.locator('#activity').input_value()==value
   assert page.evaluate('document.body.style.overflow')!='hidden'
  for button in page.locator('[data-pack]').all():
   expected=button.get_attribute('data-pack');button.click()
   assert page.locator('#activity').input_value()==expected,expected
  for title in ['Paintball','Laser Tag','Sala y merienda']:
   page.locator('[data-video-title="'+title+'"]').first.click()
   assert page.locator('#activityVideoModal').get_attribute('aria-hidden')=='false'
   assert page.locator('#experienceVideo').get_attribute('src')
   page.keyboard.press('Escape')
   assert page.locator('#activityVideoModal').get_attribute('aria-hidden')=='true'
   assert page.locator('#experienceVideo').get_attribute('src') is None
  for preview in page.locator('.real-video').all():
   preview.click()
   assert page.locator('#activityVideoModal').get_attribute('aria-hidden')=='false'
   assert page.locator('#experienceVideo').get_attribute('src')
   page.keyboard.press('Escape')
  assert page.locator('.pack-facts').count()==8
  assert page.locator('#people').count()==0
  assert page.locator('#phone').count()==0
  assert page.locator('.video-trigger:disabled').count()==0
  assert page.locator('.video-trigger').count()==6
  assert page.locator('#activity option').filter(has_text='Misión Galáctica').count()==0
  for button in page.locator('[data-gallery-category]').all():
   button.click()
   assert button.get_attribute('aria-pressed')=='true'
   assert page.locator('#homeGalleryGrid').inner_text() or page.locator('.home-gallery-item').count()
  page.locator('[data-gallery-category=all]').click()
  photo=page.locator('.home-gallery-item').first;photo.click()
  assert page.locator('#homeGalleryLightbox').get_attribute('aria-hidden')=='false'
  page.keyboard.press('Escape')
  assert page.locator('#homeGalleryLightbox').get_attribute('aria-hidden')=='true'
  page.evaluate('window.open=(url)=>{window.testBookingUrl=url}')
  page.locator('#name').fill('Prueba técnica')
  page.locator('#activity').select_option(label='Pack Completo')
  page.locator('#partySize').fill('10')
  page.locator('#bookingForm button[type=submit]').click()
  assert 'Pack Completo' in unquote(page.evaluate('window.testBookingUrl'))
  broken=page.evaluate("""[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)))""")
  assert not broken,broken
  if width==390:
   page.evaluate('scrollTo(0,0)');page.locator('#menu').click()
   assert page.locator('#menu').get_attribute('aria-expanded')=='true'
   page.keyboard.press('Escape')
   assert page.locator('#menu').get_attribute('aria-expanded')=='false'
   page.locator('#menu').click();page.locator('#links a[href="#packs"]').click()
   assert page.locator('#menu').get_attribute('aria-expanded')=='false'
  page.locator('#misiones').scroll_into_view_if_needed()
  page.screenshot(path=f'/tmp/park-interactive-{width}.png')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), 'overflow'
  assert not errors,errors
  print(json.dumps({'width':width,'prices':7,'packButtons':8,'videos':3,'gallery':'offline passed','booking':'passed','anchors':'passed','errors':errors}),flush=True)
  page.goto(BASE_URL+'/galeria.html',wait_until='domcontentloaded')
  page.wait_for_function("document.querySelectorAll('.item').length===17")
  page.locator('.item').first.click();initial=page.locator('#lightboxImage').get_attribute('src')
  page.locator('#galleryNext').click();assert page.locator('#lightboxImage').get_attribute('src')!=initial
  page.keyboard.press('ArrowLeft');assert page.locator('#lightboxImage').get_attribute('src')==initial
  page.keyboard.press('Escape');assert page.locator('#lightbox').get_attribute('aria-hidden')=='true'
  print(f'Gallery {width}: next, previous, keyboard, close passed',flush=True)
  page.close()
 # Test motion enabled and take a screenshot after reveals settle.
 page=b.new_page(viewport={'width':1440,'height':1000})
 page.route('https://esm.sh/**',lambda r:r.abort())
 page.goto(BASE_URL,wait_until='domcontentloaded')
 page.locator('#misiones').scroll_into_view_if_needed();page.wait_for_timeout(1800)
 page.locator('.finder-disclosure > summary').click()
 page.locator('[data-plan=virtual]').click();page.wait_for_timeout(500)
 assert page.locator('.plan-match').count()==3
 page.screenshot(path='/tmp/park-motion.png')
 
 for card in page.locator('.mission-card').all():
  card.scroll_into_view_if_needed();page.wait_for_timeout(700)
  assert card.evaluate('e=>Number(getComputedStyle(e).opacity)>.95'), 'Animation left a card invisible'
 print('Motion enabled: all cards visible and controls clickable',flush=True)
 b.close()
