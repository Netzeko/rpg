function showBars(entity){
	var maxw;
	var suffix = '';
	if(entity.isMonster){
		suffix = 'm';
		maxw = 150;
	}else{
		suffix = 'c';
		maxw = 99;
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
	show('charPanel'+id);
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
		'<span class="charName" id="char'+c._id+'name">'+c.name+'</span><br/>'+
		'<img src="charSample.jpg" alt="Member" class="charImg" id="imgchar'+c._id+'" onclick="target(\'party\','+c._id+','+slot+')">'+
		'<input type="button" value="select" onclick="selectChar('+c._id+')"/>'+
		'<div class="maxbarc"><div class="healthbar barc" id="healthbarc'+c._id+'"></div></div>'+
		'<div class="maxbarc"><div class="endurancebar barc" id="endurancebarc'+c._id+'"></div></div>'+
		'<div class="maxbarc"><div class="manabar barc" id="manabarc'+c._id+'"></div></div>'+
		'<div class="maxbarc"><div class="mindbar barc" id="mindbarc'+c._id+'"></div></div>';

		//divC.setAttribute('');
		document.getElementById('party'+slot+'card').appendChild(divC);
		
		partyCards[slot] = c;
		members[c._id] = c;
		currentMembers++;
		c.regenerate();
		
		let qslotdiv = '';
		for(let i=0;i<c.maxqslot;i++){
			qslotdiv += '<div id="qslot'+c._id+'_'+i+'" class="qslot" ondrop="dropItem(event)" ondragover="allowDrop(event)"></div>';
		}
		
		let equipdiv = '';
		for(let i=0;i<c.maxequip;i++){
			equipdiv += '<div class="equipmentrow">'+
			'<div id="equip'+c._id+'_'+i+'" class="equip" ondrop="dropItem(event)" ondragover="allowDrop(event)"></div>'+
			'<br/>['+c._equipSlotsNames[i]+']'+
			'</div>';
		}
		
		var divStatC = document.createElement('div');
		divStatC.id = 'charPanel'+c._id;
		divStatC.className = 'charPanel';
		divStatC.innerHTML = 
		'<input type="button" value="Characteritics & Skills" onclick="hideChildren(\'charPanel'+c._id+'\');show(\'charStats'+c._id+'\')"/>'+
		'<input type="button" value="Equipment" onclick="hideChildren(\'charPanel'+c._id+'\');show(\'equip'+c._id+'\')"/>'+
		'<hr class="clearFloat"/>'+
		'<div id="charStats'+c._id+'" class="charSubPanel">'+
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
		' <span class="modifier">(+<span id="modifier_strength'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'strength\')"/><br/>'+
		'	constitution : <span id="constitution'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_constitution'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'constitution\')"/><br/>'+
		'	dexterity : <span id="dexterity'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_dexterity'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'dexterity\')"/><br/>'+
		'	perception : <span id="perception'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_perception'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'perception\')"/><br/>'+
		'	spirit : <span id="spirit'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_spirit'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'spirit\')"/><br/>'+
		'	wisdom : <span id="wisdom'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_wisdom'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'wisdom\')"/><br/>'+
		'	luck : <span id="luck'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_luck'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'luck\')"/><br/>'+
		'	speed : <span id="speed'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_speed'+c._id+'"></span>)</span>'+
		'	<input type="button" value="+" onclick="upgrade('+c._id+',\'speed\')"/><br/>'+
		'</div>'+
		'<hr class="clearFloat"/>'+
		'<div id="skills'+c._id+'"></div>'+
		'<input type="button" value="use item" onclick="useItem()"/>'+
		'<hr class="clearFloat"/>'+
		qslotdiv+
		'</div>'+
		'<div id="equip'+c._id+'" class="charSubPanel" style="display:none;">'+
		equipdiv+
		'</div>';
		//var charSkills = c._skills;
		
		
		divStatC.style.display = 'none';
		document.getElementById('characterWindow').appendChild(divStatC);
		showSkillsChar(c._id);

		
		c.showProperties();
	
		for(let i=0;i<c._quickSlots.length;i++){
			if(!c._quickSlots[i]) continue;
			addItemDiv(c._quickSlots[i],'qslot'+c._id+'_'+i);
		}
		
		for(let i=0;i<c._equipSlots.length;i++){
			if(!c._equipSlots[i]) continue;
			addItemDiv(c._equipSlots[i],'equip'+c._id+'_'+i);
		}

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

function addItemDiv(item,target = 'inventoryWindow'){
	var e = document.createElement('div');
	e.className='item';
	//e.itemid = item._id;
	e.id = 'item'+item._id;
	e.draggable = 'true';
	e.ondragstart = dragItem;
	e.item = item;
	e.innerHTML = 
	'<img src="'+item.getClassName()+'.png" class="itemImg" onclick="selectItem('+item._id+')" draggable="false" ondrop="" id="itemImg'+item._id+'"/>';
	document.getElementById(target).appendChild(e);
}

function removeItemDiv(id){
	document.getElementById('item'+id).parentNode.removeChild(document.getElementById('item'+id));
}

function showSelectionItem(id){
	var selected = document.getElementsByClassName('selecteditem');
	for(var i =0;i<selected.length;i++){
		selected[i].classList.remove("selecteditem");
	}
	if(!id) return;

	document.getElementById('item'+id).className += ' selecteditem';
}

function showDead(id){
//A modifier
	document.getElementById('charStats'+id).className += ' dead';
	//document.getElementById('character').style='background-color:#900000;';
	//members[id] = null;
	currentMembers--;
	/*
	for(var i=1;i<ennemies.length;i++){
		if(ennemies[i] != null){
			removeEnnemy(i);
		}
	}
	*/
}

function showAlive(id){
//A modifier
	document.getElementById('charStats'+id).classList.remove('dead');
	//document.getElementById('character').style='background-color:#900000;';
	//members[id] = s.getMember(id);
	currentMembers++;
	
	/*
	for(var i=1;i<ennemies.length;i++){
		if(ennemies[i] != null){
			removeEnnemy(i);
		}
	}
	*/
}

function allowDrop(ev){
    ev.preventDefault();
}

function dragItem(ev){
  ev.dataTransfer.setData("id", ev.target.id);
  ev.dataTransfer.setData("type", 'item');
  ev.dataTransfer.setData("from", ev.target.parentNode.id);
}

function dropItem(ev){
    ev.preventDefault();
		let dtype = ev.dataTransfer.getData("type");
		if(dtype != 'item') return false;
console.log('drop');
		let target = ev.target;
		//Le node qui reçoit l'event peut être un enfant de la vraie cible
		while(target.className != 'equip' 
			&& target.className != 'qslot' 
			&& target.id != 'inventoryWindow' 
			&& target.parentNode){
			target = target.parentNode;
		}
		console.log('remonte au parent');
		if(target.children.length && target.id != 'inventoryWindow'){
			console.log('occupé');
			return false;
		}
		    
    let id = ev.dataTransfer.getData("id");
		let item = document.getElementById(id).item;
    let fromdiv = ev.dataTransfer.getData("from");
		if(fromdiv == target.id){
			console.log('source=cible');
			return false;
		}
		console.log('cherche cible');
		let targetObj = null;
		let targetSlot = 0;
		
		if(target.id.startsWith('qslot') ){
			console.log('consomable?');
			if(!item.usable) return 0;
			console.log('consomable!');
			let targetChar = target.id.substr(5).split('_');
			targetSlot = targetChar[1];
			targetObj = members[targetChar[0]];
			
		}
		else if(target.id.startsWith('equip') ){console.log('equipslot');
			console.log('equipement?');
			if(!item.equipment) return 0;
			console.log('equipement!');
			console.log('ok');
			let targetChar = target.id.substr(5).split('_');
			targetSlot = Number(targetChar[1])+100;
			targetObj = members[targetChar[0]];
			if(targetObj.isCharacter && item.armorSlot != targetObj._equipSlotsType[targetChar[1]]){
				console.log('wrong slot');
				return 0;
				
			}

		}
		else if(target.id == 'inventoryWindow'){
			console.log('inventaire');
			targetObj = s;
		}
		console.log('fin');
		console.log(item);
		item._character.removeItem(item);
		targetObj.addItem(item,targetSlot);
		target.appendChild(document.getElementById(id));
}







