/* A live, browser-local plan summary before opening a WhatsApp enquiry. */
(() => {
 'use strict';
 const form=document.getElementById('bookingForm');
 const catalog=window.ParkAdventure;
 if(!form||!catalog)return;
 const activity=form.querySelector('#activity'),date=form.querySelector('#date'),time=form.querySelector('#time');
 if(!activity||!date||!time)return;
 const money=new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR',maximumFractionDigits:0});
 const sessionField=document.createElement('div');sessionField.className='field booking-session-field';
 const sessionLabel=document.createElement('label');sessionLabel.htmlFor='bookingSession';sessionLabel.textContent='Sesión o modalidad';
 const sessionSelect=document.createElement('select');sessionSelect.id='bookingSession';sessionSelect.name='session';sessionSelect.setAttribute('aria-describedby','bookingSummaryConditions');
 sessionField.append(sessionLabel,sessionSelect);activity.closest('.field').after(sessionField);
 const partyField=document.createElement('div');partyField.className='field booking-party-field';
 const partyLabel=document.createElement('label');partyLabel.htmlFor='partySize';partyLabel.textContent='¿Cuántas personas sois? (opcional)';
 const partyInput=document.createElement('input');partyInput.id='partySize';partyInput.name='partySize';partyInput.type='number';partyInput.min='1';partyInput.step='1';partyInput.inputMode='numeric';partyInput.placeholder='Ej.: 12';partyInput.setAttribute('aria-describedby','partySizeHelp bookingSummaryStatus');
 const partyHelp=document.createElement('span');partyHelp.id='partySizeHelp';partyHelp.className='booking-field-help';partyHelp.textContent='Calculamos el total al indicar participantes. Si aún no lo sabéis, déjalo en blanco.';
 partyField.append(partyLabel,partyInput,partyHelp);sessionField.after(partyField);
 const ageField=document.createElement('div');ageField.className='field booking-age-field';
 const ageLabel=document.createElement('label');ageLabel.htmlFor='youngestAge';ageLabel.textContent='Edad del más joven (opcional)';
 const ageInput=document.createElement('input');ageInput.id='youngestAge';ageInput.name='youngestAge';ageInput.type='number';ageInput.min='0';ageInput.max='120';ageInput.step='1';ageInput.inputMode='numeric';ageInput.placeholder='Años cumplidos';ageInput.setAttribute('aria-describedby','bookingSummaryStatus');
 ageField.append(ageLabel,ageInput);
 const extras=document.createElement('details');extras.className='booking-extras field full';
 const extrasHeading=document.createElement('summary');extrasHeading.textContent='Añadir edades, horario o comentarios';
 const extrasFields=document.createElement('div');extrasFields.className='booking-extras-fields';
 extrasFields.append(ageField,time.closest('.field'),form.querySelector('#details').closest('.field'));
 extras.append(extrasHeading,extrasFields);date.closest('.field').after(extras);
 const summary=document.createElement('section');summary.id='bookingSummary';summary.className='booking-summary field full';summary.setAttribute('aria-labelledby','bookingSummaryTitle');
 const heading=document.createElement('h3');heading.id='bookingSummaryTitle';heading.textContent='Vuestro plan, de un vistazo';
 const subtitle=document.createElement('p');subtitle.className='booking-summary-intro';subtitle.textContent='Revisa los detalles antes de consultar por WhatsApp.';
 const rows=document.createElement('dl');rows.className='booking-summary-rows';
 const rowValues={};
 for(const [key,label] of [['activity','Experiencia'],['session','Modalidad'],['people','Participantes'],['age','Participante más joven'],['date','Fecha'],['time','Franja'],['rate','Tarifa por persona']]){
  const row=document.createElement('div'),term=document.createElement('dt'),value=document.createElement('dd');term.textContent=label;row.append(term,value);rows.append(row);rowValues[key]=value;
 }
 const total=document.createElement('div');total.className='booking-summary-total';
 const totalLabel=document.createElement('span');totalLabel.textContent='Total orientativo';
 const totalValue=document.createElement('strong');totalValue.id='bookingSummaryTotal';totalValue.setAttribute('aria-live','polite');total.append(totalLabel,totalValue);
 const conditions=document.createElement('p');conditions.id='bookingSummaryConditions';conditions.className='booking-summary-conditions';
 const status=document.createElement('p');status.id='bookingSummaryStatus';status.className='booking-summary-status';status.setAttribute('aria-live','polite');
 const advice=document.createElement('button');advice.type='button';advice.id='bookingAdvice';advice.className='booking-advice';advice.textContent='Necesito ayuda para organizar el grupo →';
 const note=document.createElement('p');note.className='booking-summary-note';note.textContent='Importe orientativo según las tarifas publicadas. Extras no incluidos. El parque confirma disponibilidad, condiciones y precio final.';
 summary.append(heading,subtitle,rows,total,conditions,status,advice,note);
 const submit=form.querySelector('[type="submit"]');submit.before(summary);
 let selectedActivity=null;
 let state={price:null,count:null,total:null,conditionIssue:'',session:null,record:null};
 function getRecord(){return catalog.activities.find(item=>item.value===activity.value)||catalog.packages[activity.value]||null;}
 function validDay(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const [year,month,day]=value.split('-').map(Number),parsed=new Date(year,month-1,day);
  return parsed.getFullYear()===year&&parsed.getMonth()===month-1&&parsed.getDate()===day?parsed:null;
 }
 function sessionPrice(session){
  if(!session)return null;
  if(session.priceByDay){const day=validDay(date.value)?.getDay();if(day===undefined)return null;return (day===0||day>=5)?session.priceByDay.weekend:session.priceByDay.weekday;}
  return Number.isFinite(session.price)?session.price:null;
 }
 function populateSessions(){
  const record=getRecord(),sessions=record?.sessions||[];
  sessionSelect.replaceChildren();
  for(const session of sessions){
   const option=document.createElement('option');option.value=session.id;
   const rate=sessionPrice(session),range=session.priceRange;
   option.textContent=session.label+(rate!==null?' · '+money.format(rate)+'/persona':range?' · '+range.map(value=>money.format(value)).join('–')+'/persona':'');sessionSelect.append(option);
  }
  sessionField.hidden=sessions.length<=1;
  sessionSelect.disabled=sessions.length===0;
 }
 function describeDate(){const parsed=validDay(date.value);return parsed?new Intl.DateTimeFormat('es-ES',{day:'numeric',month:'long',year:'numeric'}).format(parsed):'Fecha flexible';}
 function update(){
  summary.hidden=!activity.value;
  if(activity.value!==selectedActivity){selectedActivity=activity.value;populateSessions();}
  const record=getRecord(),session=record?.sessions?.find(item=>item.id===sessionSelect.value)||null;
  const rawCount=partyInput.value.trim(),count=rawCount!==''&&Number.isSafeInteger(Number(rawCount))&&Number(rawCount)>0?Number(rawCount):null;
  const price=sessionPrice(session),min=session?.minPeople??record?.minPeople??null,max=session?.maxPeople??record?.maxPeople??null;
  let conditionIssue='';
  partyInput.setCustomValidity('');date.setCustomValidity('');activity.setCustomValidity('');ageInput.setCustomValidity('');
  if(count!==null){
   if(min!==null&&count<min)conditionIssue='Esta modalidad requiere al menos '+min+' personas.';
   if(max!==null&&count>max)conditionIssue=min===max?'Esta experiencia está publicada para '+max+' jugadores.':'Esta modalidad admite hasta '+max+' personas.';
   partyInput.setCustomValidity(conditionIssue);
  }else if(rawCount!==''){
   conditionIssue='Indica un número entero de personas mayor que cero.';partyInput.setCustomValidity(conditionIssue);
  }
  const rawAge=ageInput.value,age=rawAge!==''&&Number.isInteger(Number(rawAge))&&Number(rawAge)>=0&&Number(rawAge)<=120?Number(rawAge):null;
  if(rawAge!==''&&age===null){const ageIssue='Indica una edad entera entre 0 y 120 años.';conditionIssue=conditionIssue||ageIssue;ageInput.setCustomValidity(ageIssue);}
  const minAge=session?.minAge??record?.minAge??null,maxAge=session?.maxAge??record?.maxAge??null;
  if(age!==null&&minAge!==null&&age<minAge){const ageIssue='Esta experiencia está publicada desde '+minAge+' años.';conditionIssue=conditionIssue||ageIssue;ageInput.setCustomValidity(ageIssue);}
  if(age!==null&&record?.minAgeFloor!==undefined&&age<record.minAgeFloor){const ageIssue='Este pack está publicado desde 6–7 años, según la actividad. Consulta otra opción para esta edad.';conditionIssue=conditionIssue||ageIssue;ageInput.setCustomValidity(ageIssue);}
  if(age!==null&&maxAge!==null&&age>maxAge){const ageIssue='Este pack está publicado para participantes de hasta '+maxAge+' años.';conditionIssue=conditionIssue||ageIssue;ageInput.setCustomValidity(ageIssue);}
  if(date.value&&date.min&&date.value<date.min){conditionIssue=conditionIssue||'Elige una fecha de hoy en adelante.';date.setCustomValidity('Elige una fecha de hoy en adelante.');}
  if(activity.value==='Pack Completo'&&validDay(date.value)&&![0,5,6].includes(validDay(date.value).getDay())){
   conditionIssue=conditionIssue||'El Pack Completo está publicado para viernes, sábado y domingo.';date.setCustomValidity('El Pack Completo está publicado para viernes, sábado y domingo.');
  }
  rowValues.activity.textContent=record?.name||activity.value||'Elige una actividad';
  rowValues.session.textContent=session?.label||'A concretar con el parque';
  rowValues.people.textContent=count!==null?count+' personas':'Participantes por confirmar';
  rowValues.age.textContent=age!==null?age+' años':'Por confirmar';rowValues.age.parentElement.hidden=age===null;rowValues.time.parentElement.hidden=!time.value;
  rowValues.date.textContent=describeDate();rowValues.time.textContent=time.value||'Horario flexible';
  rowValues.rate.textContent=price!==null?money.format(price):session?.priceRange?session.priceRange.map(value=>money.format(value)).join('–')+' según el día':'A consultar';
  const calculatedTotal=count!==null&&price!==null&&!conditionIssue?count*price:null;
  totalValue.textContent=calculatedTotal!==null?money.format(calculatedTotal):conditionIssue?'Revisa el grupo':price===null?'A consultar':'Por confirmar';
  conditions.textContent=record?.conditions||(activity.value?'Consulta las tarifas y condiciones de esta opción con el parque.':'Las condiciones aparecerán al elegir la experiencia.');
  if(session&&(session.minPeople!==undefined||session.maxPeople!==undefined)){
   const sessionGroup=session.minPeople===session.maxPeople&&session.minPeople!==undefined?session.minPeople+' jugadores':session.minPeople!==undefined&&session.maxPeople!==undefined?session.minPeople+'–'+session.maxPeople+' jugadores':session.minPeople!==undefined?'desde '+session.minPeople+' jugadores':session.maxPeople!==undefined?'hasta '+session.maxPeople+' jugadores':'grupo a consultar';
   conditions.textContent+=' Modalidad elegida: '+sessionGroup+'.';
  }
  status.textContent=conditionIssue||(count===null&&price!==null?'Añade las personas exactas para calcular el total y comprobar el grupo.':session?.priceByDay&&price===null?'Elige una fecha para aplicar la tarifa de ese día.':activity.value?'La solicitud necesita confirmación del parque.':'Selecciona una experiencia para preparar vuestro plan.');
  if(ageInput.validationMessage)extras.open=true;
  status.classList.toggle('has-issue',Boolean(conditionIssue));summary.classList.toggle('has-issue',Boolean(conditionIssue));
  advice.hidden=!conditionIssue&&activity.value!=='Quiero asesoramiento';
  state={price,count,age,total:calculatedTotal,conditionIssue,session,record};
 }
 partyInput.addEventListener('input',update);
 partyInput.addEventListener('change',update);
 form.addEventListener('park:plan-selected',event=>{const age=event.detail?.age;if(age!==null&&age!==undefined&&age!==''){form.dataset.finderAge=String(age);ageInput.value=String(age);}else{delete form.dataset.finderAge;ageInput.value='';}update();});
 ageInput.addEventListener('input',()=>{if(ageInput.value==='')delete form.dataset.finderAge;else form.dataset.finderAge=ageInput.value;update();});
 ageInput.addEventListener('change',update);
 activity.addEventListener('change',update);sessionSelect.addEventListener('change',update);
 date.addEventListener('change',()=>{const selection=sessionSelect.value;populateSessions();if([...sessionSelect.options].some(option=>option.value===selection))sessionSelect.value=selection;update();});
 date.addEventListener('input',update);time.addEventListener('change',update);
 advice.addEventListener('click',()=>{activity.value='Quiero asesoramiento';activity.dispatchEvent(new Event('change',{bubbles:true}));activity.focus();});
 form.addEventListener('submit',event=>{
  event.preventDefault();update();if(!form.reportValidity())return;
  const fields=new FormData(form),lines=['Hola, quiero consultar una reserva en Park Aventura Lleida.','','Nombre: '+fields.get('name'),'Actividad/pack: '+(state.record?.name||fields.get('activity')),'Modalidad: '+(state.session?.label||'A concretar'),'Personas: '+(state.count!==null?state.count:'Por confirmar'),'Fecha preferida: '+(fields.get('date')||'Flexible'),'Horario: '+(fields.get('time')||'Flexible')];
  if(state.age!==null)lines.push('Participante más joven: '+state.age+' años');
  if(state.price!==null)lines.push('Tarifa orientativa por persona: '+money.format(state.price));
  if(state.total!==null)lines.push('Total orientativo: '+money.format(state.total)+' (extras no incluidos)');
  if(state.record?.conditions)lines.push('Condiciones publicadas: '+state.record.conditions);
  lines.push('Detalles: '+(fields.get('details')||'Ninguno'),'','¿Podéis confirmarme disponibilidad, condiciones y precio final?');
  window.open('https://wa.me/34722146640?text='+encodeURIComponent(lines.join('\n')),'_blank','noopener,noreferrer');
 });
 update();
})();
