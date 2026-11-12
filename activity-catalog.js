/* Public tariffs and conditions already published by Park Aventura Lleida. */
(() => {
 'use strict';
 const session = (id,label,price,minutes,extra={}) => ({id,label,price,minutes,...extra});
 const groupSessions = [
  session('team01','Pack 01 · 1 h–1 h 15 min',40,null,{minPeople:10,maxPeople:30}),
  session('team02','Pack 02 · 2 horas',50,120,{minPeople:10,maxPeople:45}),
  session('team03','Pack 03 · 2 h 30 min–3 h',60,null,{minPeople:10,maxPeople:45})
 ];
 const activities = [
  {id:'paintball',name:'Paintball',value:'Paintball',href:'#detalle-paintball',minAge:14,minPeople:10,maxPeople:null,tags:['action','group'],priceLabel:'Desde 25 € / persona',conditions:'Desde 14 años · mínimo 10 personas. Equipamiento incluido. Cada recarga de 100 bolas: 5 €.',sessions:[session('p100','Entrada · 100 bolas',25,null),session('p200','Entrada · 200 bolas en total',30,null),session('p300','Entrada · 300 bolas en total',35,null),session('p400','Entrada · 400 bolas en total',40,null)]},
  {id:'laser',name:'Laser Tag',value:'Laser Tag',href:'#detalle-laser',minAge:7,minPeople:8,maxPeople:20,tags:['action','group'],priceLabel:'Desde 20 € / persona',conditions:'Desde 7 años · de 8 a 20 personas.',sessions:[session('short','30 minutos',20,30),session('long','1 hora',30,60)]},
  {id:'vr',name:'Realidad virtual',value:'Realidad virtual',href:'#detalle-vr',minAge:6,minPeople:null,maxPeople:16,tags:['virtual'],priceLabel:'Desde 20 € / persona',conditions:'Desde 6 años · hasta 16 jugadores. El Escape Room de terror VR tiene condiciones propias.',sessions:[session('short','30 minutos',20,30),session('long','1 hora',30,60)]},
  {id:'humor',name:'Humor Amarillo',value:'Humor Amarillo',href:'#detalle-humor',minAge:null,minPeople:null,maxPeople:null,tags:['group'],priceLabel:'Consultar tarifa',conditions:'Consulta disponibilidad, edades y condiciones para tu grupo.',sessions:[]},
  {id:'team',name:'Team Building',value:'Team Building',href:'#detalle-team',minAge:null,minPeople:10,maxPeople:45,tags:['group','action','virtual'],priceLabel:'Desde 40 € / persona',conditions:'Pack 01: de 10 a 30 jugadores. Packs 02 y 03: de 10 a 45 jugadores, divididos en grupos cuando sea necesario. Consulta las edades del grupo.',sessions:groupSessions},
  {id:'stress',name:'Stress Room',value:'Stress Room',href:'#detalle-stress',minAge:16,minPeople:2,maxPeople:2,tags:['action'],priceLabel:'30 € / persona',conditions:'Desde 16 años · 2 jugadores · sesión de 30 minutos.',sessions:[session('stress30','30 minutos',30,30)]},
  {id:'battle',name:'Battle Start',value:'Battle Start',href:'#detalle-battle',minAge:6,minPeople:8,maxPeople:16,tags:['virtual','group'],priceLabel:'Desde 20 € / persona',conditions:'Desde 6 años · de 8 a 16 personas.',sessions:[session('short','30 minutos',20,30),session('long','1 hora',30,60)]}
 ];
 const packages = {
  'Escape Room VR':{name:'Escape Room de terror VR',minAge:14,minPeople:8,maxPeople:16,conditions:'Desde 14 años · de 8 a 16 personas · 1 hora.',sessions:[session('escape60','1 hora',30,60)]},
  'Pack Básico':{name:'Pack Básico',minAge:null,minAgeFloor:6,maxAge:14,minPeople:10,maxPeople:16,conditions:'De 10 a 16 participantes. Edad publicada: de 6–7 a 14 años; confirma la edad mínima según la actividad. 30 min de Laser Tag o Battle Start, merienda y hasta 30 min de sala. Duración total aproximada: 1 hora. Lunes a jueves: 25 €; viernes a domingo: 30 € por persona.',sessions:[session('birthday-basic','Pack Básico · actividad y merienda',null,null,{priceRange:[25,30],priceByDay:{weekday:25,weekend:30}})]},
  'Pack Completo':{name:'Pack Completo',minAge:null,minAgeFloor:6,maxAge:14,minPeople:8,maxPeople:null,conditions:'Viernes a domingo · mínimo 8 participantes. Edad publicada: de 6–7 a 14 años; confirma la edad mínima según la actividad. 30 min Laser Tag + 30 min Battle Start, merienda y 30 min de sala. Duración aproximada: 1 h 30 min–2 h. Extras sujetos a disponibilidad.',sessions:[session('birthday-full','Pack Completo · actividades y merienda',45,null)]},
  'Pack 1':{name:'Láser + Battle · Esencial',conditions:'Laser Tag + Battle Start · duración aproximada de 1 h–1 h 15 min. Consulta las condiciones para tu grupo.',sessions:[session('combo01','Pack 1 · Laser Tag + Battle Start',40,null)]},
  'Pack 2':{name:'Láser + Battle · 2 horas',conditions:'Laser Tag + Battle Start · duración de 2 horas. Consulta las condiciones para tu grupo.',sessions:[session('combo02','Pack 2 · Laser Tag + Battle Start',50,120)]},
  'Pack 3':{name:'Battle + Escape VR',conditions:'Battle Start + Escape Room de terror virtual · duración de 1 h 30 min. Consulta las condiciones para tu grupo.',sessions:[session('combo03','Pack 3 · Battle Start + Escape Room VR',45,90)]},
  'Team Building 01':{name:'Equipo · Esencial',minPeople:10,maxPeople:30,conditions:'De 10 a 30 jugadores · Laser Tag + Battle Start. Duración aproximada: 1 h–1 h 15 min. Se divide en grupos según participantes; consulta edades.',sessions:[groupSessions[0]]},
  'Team Building 02':{name:'Equipo · 2 horas',minPeople:10,maxPeople:45,conditions:'De 10 a 45 jugadores · Battle Start + Laser Tag + realidad virtual. Duración: 2 horas. Se divide en grupos según participantes; consulta edades.',sessions:[groupSessions[1]]},
  'Team Building 03':{name:'Equipo · Experiencia completa',minPeople:10,maxPeople:45,conditions:'De 10 a 45 jugadores · Battle Start + Laser Tag + realidad virtual. Duración aproximada: 2 h 30 min–3 h. Se divide en grupos según participantes; pica-pica opcional no incluido: +20 € por persona. Consulta edades.',sessions:[groupSessions[2]]}
 };
 window.ParkAdventure = {activities,packages};
})();
