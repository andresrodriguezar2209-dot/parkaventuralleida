/* The plan finder uses only the park's published ages, group limits and prices. */
(() => {
  'use strict';
  const grid = document.querySelector('.mission-list');
  const catalog = window.ParkAdventure;
  if (!grid || !Array.isArray(catalog?.activities)) return;

  const money = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const state = { preference: 'all' };
  const preferences = [ ['all', 'Explorar todo'], ['action', 'Quiero acción'], ['virtual', 'Quiero otro mundo'], ['group', 'Voy en grupo'] ];

  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const finder = el('section', 'adventure-finder plan-finder');
  finder.setAttribute('aria-labelledby', 'adventureFinderTitle');
  const header = el('div', 'finder-header');
  const heading = el('div');
  heading.append(el('span', 'plan-finder-label', 'TU GRUPO. TU AVENTURA.'));
  const title = el('h3', 'finder-title', 'ENCUENTRA VUESTRO PLAN.');
  title.id = 'adventureFinderTitle';
  heading.append(title, el('p', 'finder-intro', 'Dinos quién viene y qué os apetece. Te mostramos opciones con sus condiciones publicadas.'));
  header.append(heading);
  const reset = el('button', 'finder-reset', 'Empezar de nuevo');
  reset.type = 'button';
  reset.id = 'finderReset';
  header.append(reset);
  finder.append(header);

  const fields = el('div', 'finder-fields');
  function addNumber(id, label, placeholder, min, max, hint) {
    const field = el('div', 'finder-field');
    const name = el('label', '', label);
    name.htmlFor = id;
    const input = el('input');
    Object.assign(input, { id, type: 'number', inputMode: 'numeric', min: String(min), max: String(max), step: '1', placeholder, autocomplete: 'off' });
    const note = el('span', 'finder-field-note', hint);
    note.id = id + 'Hint';
    input.setAttribute('aria-describedby', note.id + ' finderInputError');
    field.append(name, input, note);
    fields.append(field);
    return input;
  }
  const ageInput = addNumber('finderAge', 'Edad del participante más joven', 'Por ejemplo, 14', 0, 120, 'Opcional · en años cumplidos');
  const peopleInput = addNumber('finderPeople', '¿Cuántas personas vais a jugar?', 'Por ejemplo, 10', 1, 500, 'Opcional · participantes, sin acompañantes');
  finder.append(fields);
  const choices = el('div', 'plan-choices finder-choices');
  choices.setAttribute('role', 'group');
  choices.setAttribute('aria-label', '¿Qué os apetece vivir?');
  preferences.forEach(([value, text]) => {
    const button = el('button', '', text);
    button.type = 'button';
    button.dataset.plan = value;
    button.setAttribute('aria-pressed', String(value === 'all'));
    button.addEventListener('click', () => {
      state.preference = value;
      choices.querySelectorAll('button').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      render();
    });
    choices.append(button);
  });
  finder.append(choices);
  const error = el('p', 'finder-input-error');
  error.id = 'finderInputError';
  error.setAttribute('role', 'status');
  error.hidden = true;
  const status = el('p', 'finder-status');
  status.id = 'finderStatus';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  const results = el('div', 'finder-results');
  results.id = 'finderResults';
  const assistance = el('div', 'finder-assistance');
  const assistanceCopy = el('p', '', '¿Preferís que os ayudemos a organizarlo?');
  const assistanceLink = el('a', 'finder-assistance-link', 'Pedir asesoramiento →');
  assistanceLink.href = '#reservar';
  assistanceLink.id = 'finderAdvice';
  assistanceLink.addEventListener('click', event => {
    event.preventDefault();
    transferToBooking({ id: 'advice', value: 'Quiero asesoramiento' }, null);
  });
  assistance.append(assistanceCopy, assistanceLink);
  finder.append(error, status, results, assistance);
  document.getElementById('planFinderHost').append(finder);

  const hasNumber = value => typeof value === 'number' && Number.isFinite(value);
  const typedNumber = input => input.value === '' ? null : input.valueAsNumber;
  const firstNumber = (...values) => values.find(hasNumber) ?? null;
  function validationMessage() {
    const errors = [];
    [[ageInput, 'Indica una edad entera entre 0 y 120 años.'], [peopleInput, 'Indica entre 1 y 500 participantes, sin decimales.']].forEach(([input, message]) => {
      const invalid = !input.validity.valid;
      input.setAttribute('aria-invalid', String(invalid));
      if (invalid) errors.push(message);
    });
    return errors.join(' ');
  }
  function eligibleSessions(activity, people) {
    return (activity.sessions || []).filter(session => {
      const min = firstNumber(session.minPeople, activity.minPeople);
      const max = firstNumber(session.maxPeople, activity.maxPeople);
      return people === null || ((!hasNumber(min) || people >= min) && (!hasNumber(max) || people <= max));
    });
  }
  function assess(activity, age, people) {
    if (age !== null && hasNumber(activity.minAge) && age < activity.minAge) return null;
    const sessions = eligibleSessions(activity, people);
    if (activity.sessions?.length && !sessions.length) return null;
    if (!activity.sessions?.length && people !== null) {
      if (hasNumber(activity.minPeople) && people < activity.minPeople) return null;
      if (hasNumber(activity.maxPeople) && people > activity.maxPeople) return null;
    }
    const session = sessions[0] || null;
    // A missing age rule is not an assurance that a child can participate.
    const unknown = activity.id === 'humor' || !hasNumber(activity.minAge);
    const fullySpecified = age !== null && people !== null;
    return { activity, session, status: !unknown && fullySpecified ? 'compatible' : 'consult' };
  }
  function priceText(activity, session) {
    if (session && hasNumber(session.price)) return money.format(session.price) + ' / persona';
    return activity.priceLabel || 'Precio a consultar';
  }
  function cardFor(item) {
    const { activity, session } = item;
    const card = el('article', 'finder-option');
    card.dataset.finderActivity = activity.id;
    card.dataset.finderStatus = item.status;
    card.dataset.sessionId = session?.id || '';
    const badge = el('span', 'finder-option-badge', item.status === 'compatible' ? 'COINCIDE CON VUESTRO GRUPO' : 'CONDICIONES POR CONFIRMAR');
    const heading = el('div', 'finder-option-heading');
    heading.append(el('h4', '', activity.name), el('strong', 'finder-price', priceText(activity, session)));
    card.append(badge, heading);
    if (session) card.append(el('p', 'finder-session', session.label));
    const rules = el('p', 'finder-conditions', activity.conditions || 'Consulta las condiciones para vuestro grupo.');
    if (session && (hasNumber(session.minPeople) || hasNumber(session.maxPeople))) {
      const min = firstNumber(session.minPeople, activity.minPeople);
      const max = firstNumber(session.maxPeople, activity.maxPeople);
      const group = min === max && hasNumber(min) ? min + ' participantes' : hasNumber(max) ? (hasNumber(min) ? min + '–' : 'Hasta ') + max + ' participantes' : hasNumber(min) ? 'Desde ' + min + ' participantes' : '';
      if (group) rules.append(document.createTextNode(' Esta opción: ' + group + '.'));
    }
    card.append(rules);
    if (!hasNumber(activity.minAge)) card.append(el('p', 'finder-confirm-note', 'La edad adecuada debe confirmarse con el parque.'));
    const actions = el('div', 'finder-option-actions');
    const details = el('a', 'finder-details', 'Ver actividad →');
    details.href = activity.href || '#detalle-' + activity.id;
    const choose = el('button', 'finder-prepare', item.status === 'compatible' ? 'Preparar este plan →' : 'Consultar este plan →');
    choose.type = 'button';
    choose.dataset.prepareActivity = activity.id;
    choose.dataset.sessionId = session?.id || '';
    choose.addEventListener('click', () => transferToBooking(activity, session));
    actions.append(details, choose);
    card.append(actions);
    return card;
  }

  function transferToBooking(activity, session) {
    if (validationMessage()) { render(); return; }
    const target = document.getElementById('activity');
    if (!target || ![...target.options].some(option => option.value === activity.value)) return;
    const people = typedNumber(peopleInput);
    const age = typedNumber(ageInput);
    target.value = activity.value;
    target.dispatchEvent(new Event('change', { bubbles: true }));
    const partySize = document.getElementById('partySize');
    if (people !== null) {
      if (partySize) {
        partySize.value = String(people);
        partySize.dispatchEvent(new Event('input', { bubbles: true }));
      }
    } else if (partySize) {
      partySize.value = '';
      partySize.dispatchEvent(new Event('input', { bubbles: true }));
    }
    const sessionField = document.getElementById('bookingSession');
    if (sessionField && session && [...sessionField.options].some(option => option.value === session.id)) {
      sessionField.value = session.id;
      sessionField.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const form = document.getElementById('bookingForm');
    if (form) {
      if (age === null) delete form.dataset.finderAge;
      else form.dataset.finderAge = String(age);
    }
    (form || document).dispatchEvent(new CustomEvent('park:plan-selected', { bubbles: true, detail: { activity: activity.value, activityId: activity.id, sessionId: session?.id || '', age, people } }));
    const booking = document.getElementById('reservar');
    booking?.scrollIntoView({ behavior: reduced.matches ? 'auto' : 'smooth', block: 'start' });
    document.getElementById('name')?.focus({ preventScroll: true });
  }

  function render() {
    const message = validationMessage();
    error.textContent = message;
    error.hidden = !message;
    results.replaceChildren();
    const age = typedNumber(ageInput);
    const people = typedNumber(peopleInput);
    const engaged = age !== null || people !== null || state.preference !== 'all';
    if (message) {
      status.textContent = 'Revisa los datos para ver opciones para vuestro grupo.';
      grid.querySelectorAll('.mission-card').forEach(card => card.classList.remove('plan-match'));
      return;
    }
    if (!engaged) {
      status.textContent = 'Añade edad y participantes para comprobar las condiciones, o empieza por lo que os apetece.';
      results.hidden = true;
      grid.querySelectorAll('.mission-card').forEach(card => card.classList.remove('plan-match'));
      return;
    }
    results.hidden = false;
    const candidates = catalog.activities.filter(activity => state.preference === 'all' || activity.tags?.includes(state.preference));
    const options = candidates.map(activity => assess(activity, age, people)).filter(Boolean);
    const matching = options.filter(item => item.status === 'compatible');
    const consulting = options.filter(item => item.status === 'consult');
    const activeIds = new Set(options.map(item => item.activity.id));
    grid.querySelectorAll('.mission-card').forEach(card => card.classList.toggle('plan-match', activeIds.has(card.id.replace('detalle-', ''))));
    if (!options.length) {
      status.textContent = 'No encontramos una opción que encaje con todos los datos indicados.';
      const empty = el('div', 'finder-empty', 'Podemos ayudarte a preparar una alternativa. Revisa la edad, el tamaño del grupo o consulta al parque.');
      empty.id = 'finderEmpty';
      results.append(empty);
    } else {
      status.textContent = matching.length ? matching.length + (matching.length === 1 ? ' experiencia coincide' : ' experiencias coinciden') + ' con la edad y el grupo indicados. Disponibilidad y precio final sujetos a confirmación.' : 'Estas opciones necesitan confirmar los datos o condiciones que faltan. Aún no son una reserva.';
      if (matching.length) {
        const list = el('div', 'finder-option-list');
        matching.forEach(item => list.append(cardFor(item)));
        results.append(list);
      }
      if (consulting.length) {
        const consult = el('div', 'finder-consultation');
        consult.append(el('p', 'finder-consultation-label', matching.length ? 'OTRAS OPCIONES A CONSULTAR' : 'PARA EXPLORAR Y CONSULTAR'));
        const list = el('div', 'finder-option-list');
        consulting.forEach(item => list.append(cardFor(item)));
        consult.append(list);
        results.append(consult);
      }
    }
    finder.classList.remove('changed');
    if (!reduced.matches) {
      void finder.offsetWidth;
      finder.classList.add('changed');
    }
  }
  let timer;
  [ageInput, peopleInput].forEach(input => {
    input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(render, 120); });
    input.addEventListener('change', () => { clearTimeout(timer); render(); });
  });
  reset.addEventListener('click', () => {
    clearTimeout(timer);
    ageInput.value = '';
    peopleInput.value = '';
    state.preference = 'all';
    choices.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.plan === 'all')));
    render();
    ageInput.focus();
  });
  render();
})();
