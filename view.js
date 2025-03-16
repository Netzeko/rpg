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
	if(document.getElementById('healthbar'+suffix+entity._id) ){
		document.getElementById('healthbar'+suffix+entity._id).style.width = whealth+'px';
	}
	var wendurance = Math.round(maxw * entity.endurance / entity.maxendurance);
	if(document.getElementById('endurancebar'+suffix+entity._id) ){
		document.getElementById('endurancebar'+suffix+entity._id).style.width = wendurance+'px';
	}
	var wmana = Math.round(maxw * entity.mana / entity.maxmana);
	if(document.getElementById('manabar'+suffix+entity._id) ){
		document.getElementById('manabar'+suffix+entity._id).style.width = wmana+'px';
	}
	var wmind = Math.round(maxw * entity.mind / entity.maxmind);
	if(document.getElementById('mindbar'+suffix+entity._id) ){
		document.getElementById('mindbar'+suffix+entity._id).style.width = wmind+'px';
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
		divC.id = 'char'+c._id;
		divC.className = 'divcharacter';
		divC.innerHTML = 
		'<span id="char'+c._id+'name"></span><br/>'+
		'<img src="char.png" alt="Member" height="100" width="100" id="imgchar'+c._id+'" onclick="target(\'party\','+c._id+','+slot+')"><br/>'+
		'<div class="maxbarc"><div class="healthbar barc" id="healthbarc'+c._id+'"></div></div>'+
		'<div class="maxbarc"><div class="endurancebar barc" id="endurancebarc'+c._id+'"></div></div>'+
		'<div class="maxbarc"><div class="manabar barc" id="manabarc'+c._id+'"></div></div>'+
		'<div class="maxbarc"><div class="mindbar barc" id="mindbarc'+c._id+'"></div></div>'+
		'<input type="button" value="select" onclick="selectChar('+c._id+')"/>';

		//divC.setAttribute('');
		document.getElementById('party'+slot+'card').appendChild(divC);
		
		partyCards[slot] = c;
		members[c._id] = c;
		currentMembers++;
		c.regenerate();
		
		var divStatC = document.createElement('div');
		divStatC.id = 'charStats'+c._id;
		divStatC.className = 'charStats';
		divStatC.innerHTML = 
		
		'<div class="character">'+
		'	name : <span id="name'+c._id+'"></span><br/>'+
		'	level : <span id="level'+c._id+'"></span><br/>'+
		'	health : <span id="health'+c._id+'"></span>/<span id="maxhealth'+c._id+'"></span><br/>'+
		'	endurance : <span id="endurance'+c._id+'"></span>/<span id="maxendurance'+c._id+'"></span><br/>'+
		'	mana : <span id="mana'+c._id+'"></span>/<span id="maxmana'+c._id+'"></span><br/>'+
		'	mind : <span id="mind'+c._id+'"></span>/<span id="maxmind'+c._id+'"></span><br/>'+
		'	exp : <span id="exp'+c._id+'"></span><br/>'+
		' skillpoints : <span id="skillpoints'+c._id+'"></span><br/>'+
		'</div>'+
		'<div class="attributes">'+
		'available points : <span id="points'+c._id+'"></span><br/>'+
		'	strength : <span id="strength'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'strength\')"/><br/>'+
		'	constitution : <span id="constitution'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'constitution\')"/><br/>'+
		'	dexterity : <span id="dexterity'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'dexterity\')"/><br/>'+
		'	perception : <span id="perception'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'perception\')"/><br/>'+
		'	spirit : <span id="spirit'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'spirit\')"/><br/>'+
		'	wisdom : <span id="wisdom'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'wisdom\')"/><br/>'+
		'	luck : <span id="luck'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'luck\')"/><br/>'+
		'	speed : <span id="speed'+c._id+'"></span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'speed\')"/><br/>'+
		'</div>'+
		'<hr class="clearFloat"/>'+
		'<div id="skills'+c._id+'"></div>'+
		'<input type="button" value="use item" onclick="useItem()"/>';
		
		//var charSkills = c._skills;
		
		
		divStatC.style.display = 'none';
		document.getElementById('characterWindow').appendChild(divStatC);
		showSkillsChar(c._id);

		
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
		newm.doAction();
	}
}

function addItemDiv(id){
	var e = document.createElement('div');
	e.className='item';
	e.id = 'item'+id;
	e.innerHTML = 
	'<img src="potion.png" class="itemImg" onclick="selectItem('+id+')"/>';
	document.getElementById('inventoryWindow').appendChild(e);
}

function removeItemDiv(id){
	document.getElementById('inventoryWindow').removeChild(document.getElementById('item'+id));
}

function showSelectionItem(id){
	var selected = document.getElementsByClassName('selecteditem');
	for(var i =0;i<selected.length;i++){
		selected[i].classList.remove("selecteditem");
	}
	if(!id) return;

	document.getElementById('item'+id).className += ' selecteditem';
}






