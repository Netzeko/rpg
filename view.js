function showBars(entity){
	var maxw;
	var suffix = '';
	if(entity.isMonster){
		suffix = 'm';
		maxw = 150;
	}else{
		suffix = 'c';
		maxw = 75;
	}
	var whealth = Math.round(maxw * entity.health / entity.maxhealth);
	if(document.getElementById('healthbar'+suffix+entity.id) ){
		document.getElementById('healthbar'+suffix+entity.id).style.width = whealth+'px';
	}
	var wendurance = Math.round(maxw * entity.endurance / entity.maxendurance);
	if(document.getElementById('endurancebar'+suffix+entity.id) ){
		document.getElementById('endurancebar'+suffix+entity.id).style.width = wendurance+'px';
	}
	var wmana = Math.round(maxw * entity.mana / entity.maxmana);
	if(document.getElementById('manabar'+suffix+entity.id) ){
		document.getElementById('manabar'+suffix+entity.id).style.width = wmana+'px';
	}
	var wmind = Math.round(maxw * entity.mind / entity.maxmind);
	if(document.getElementById('mindbar'+suffix+entity.id) ){
		document.getElementById('mindbar'+suffix+entity.id).style.width = wmind+'px';
	}
}

function showLateralWindow(w){
	console.log('show lateralwindow '+w);
	hideChildren('lateralWindow');
	show(w);
}

function showSkills(){
	
}

function addSkillBookWindow(skillbook){
	var divSB = document.createElement('div');
	divSB.id = 'skillbookWindow';
	
	for(var i =0;i<skillbook.length;i++){
		divSB.innerHTML +=
		' <input type="button" value="learn" onclick="learnSkill(\''+skillbook[i].getName()+'\')"/> '+skillbook[i].getName()+'<br/>'
	}
	divSB.style.display = 'none';
	document.getElementById('lateralWindow').appendChild(divSB);
	document.getElementById('rightMenu').innerHTML += 
	'<input type="button" value="skillbook" onclick="showLateralWindow(\'skillbookWindow\')"/>';
	
	
}

function changeSelectedDisplay(id){
	hideChildren('characterWindow');
	show('charStats'+id);
}

function hideChildren(parentNode){
	var children = document.getElementById(parentNode).children;
	for(var i =0;i<children.length;i++){
		hide(children[i].id);
	}
}



//c instance Character
function addCharacter(c,slot){
	
		var divC = document.createElement('div');
		divC.id = 'char'+c.id;
		divC.className = 'divcharacter';
		divC.innerHTML = 
		'<span id="char'+c.id+'name"></span><br/>'+
		'<img src="char.png" alt="Member" height="100" width="100" id="imgchar'+c.id+'" onclick="target(\'party\','+c.id+','+slot+')"><br/>'+
		'<div class="maxbarc"><div class="healthbar barc" id="healthbarc'+c.id+'"></div></div>'+
		'<div class="maxbarc"><div class="endurancebar barc" id="endurancebarc'+c.id+'"></div></div>'+
		'<div class="maxbarc"><div class="manabar barc" id="manabarc'+c.id+'"></div></div>'+
		'<div class="maxbarc"><div class="mindbar barc" id="mindbarc'+c.id+'"></div></div>'+
		'<input type="button" value="select" onclick="selectChar('+c.id+')"/>';

		//divC.setAttribute('');
		document.getElementById('party'+slot+'card').appendChild(divC);
		
		partyCards[slot] = c;
		members[c.id] = c;
		c.regenerate();
		
		var divStatC = document.createElement('div');
		divStatC.id = 'charStats'+c.id;
		divStatC.className = 'charStats';
		divStatC.innerHTML = 
		
		'<div class="character">'+
		'	name : <span id="name'+c.id+'"></span><br/>'+
		'	level : <span id="level'+c.id+'"></span><br/>'+
		'	health : <span id="health'+c.id+'"></span>/<span id="maxhealth'+c.id+'"></span><br/>'+
		'	endurance : <span id="endurance'+c.id+'"></span>/<span id="maxendurance'+c.id+'"></span><br/>'+
		'	mana : <span id="mana'+c.id+'"></span>/<span id="maxmana'+c.id+'"></span><br/>'+
		'	mind : <span id="mind'+c.id+'"></span>/<span id="maxmind'+c.id+'"></span><br/>'+
		'	exp : <span id="exp'+c.id+'"></span><br/>'+
		' skillpoints : <span id="skillpoints'+c.id+'"></span><br/>'+
		'</div>'+
		'<div class="attributes">'+
		'available points : <span id="points'+c.id+'"></span><br/>'+
		'	strength : <span id="strength'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'strength\')"/><br/>'+
		'	constitution : <span id="constitution'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'constitution\')"/><br/>'+
		'	dexterity : <span id="dexterity'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'dexterity\')"/><br/>'+
		'	perception : <span id="perception'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'perception\')"/><br/>'+
		'	spirit : <span id="spirit'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'spirit\')"/><br/>'+
		'	wisdom : <span id="wisdom'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'wisdom\')"/><br/>'+
		'	luck : <span id="luck'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'luck\')"/><br/>'+
		'	speed : <span id="speed'+c.id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c.id+',\'speed\')"/><br/>'+
		'</div>'+
		'<hr class="clearFloat"/>'+
		'<div id="skills'+c.id+'"></div>';
		
		//var charSkills = c._skills;
		
		
		divStatC.style.display = 'none';
		document.getElementById('characterWindow').appendChild(divStatC);
		showSkillsChar(c.id);

		
		c.showProperties();
	
}


function showSkillsChar(id){
	var div = document.getElementById('skills'+id);
	div.innerHTML = '';
	for(var i=0;i<members[id]._skills.length;i++){
		div.innerHTML +=
			'<input type="button" value="'+members[id]._skills[i].getName()+'" onclick="s.useSkill(selectedChar,targetedChar,\''+members[id]._skills[i].getClassName()+'\')"/>';
	}
}


function addEnnemy(){
	var free = nextFreeCard(ennemyCards);
	if(free && !s.dead){
		var divE = document.createElement('div');
		divE.id = 'monster'+idnext;
		divE.className = 'divmonster';
		divE.innerHTML = 
		'<span id="monster'+idnext+'name"></span><br/>'+
		'<img src="13.jpg" alt="Ennemy" height="150" width="150" id="imgennemy'+idnext+'" onclick="target(\'ennemy\','+idnext+','+free+')"><br/>'+
		'<div class="maxbarm"><div class="barm healthbar" id="healthbarm'+idnext+'"></div></div>';
		//'health : <span id="monster'+idnext+'health"></span>/<span id="monster'+idnext+'maxhealth"></span><br/>'+
		
		
		
		document.getElementById('ennemy'+free+'card').appendChild(divE);
		var newm = new Monster(idnext);
		ennemyCards[free] = newm;
		ennemies[idnext] = newm;
		newm.slot = free;
		newm.showProperties();
		//newm.attackChar();
		idnext ++;
		currentEnnemies++;
	}
}
