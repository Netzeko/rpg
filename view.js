function showBars(entity){
	let maxw;
	let suffix = '';
	if(entity.isMonster){
		suffix = 'm';
		maxw = 198;
	}else{
		suffix = 'c';
		maxw = 99;
	}
	let whealth = Math.round(maxw * entity.health / entity.maxhealth);
	if(document.getElementById('healthbar'+suffix+entity._id) ){
		document.getElementById('healthbar'+suffix+entity._id).style.width = whealth+'px';
	}
	let wendurance = Math.round(maxw * entity.endurance / entity.maxendurance);
	if(document.getElementById('endurancebar'+suffix+entity._id) ){
		document.getElementById('endurancebar'+suffix+entity._id).style.width = wendurance+'px';
	}
	let wmana = Math.round(maxw * entity.mana / entity.maxmana);
	if(document.getElementById('manabar'+suffix+entity._id) ){
		document.getElementById('manabar'+suffix+entity._id).style.width = wmana+'px';
	}
	let wmind = Math.round(maxw * entity.mind / entity.maxmind);
	if(document.getElementById('mindbar'+suffix+entity._id) ){
		document.getElementById('mindbar'+suffix+entity._id).style.width = wmind+'px';
	}
}

function showLateralWindow(w){
	console.log('show lateralwindow '+w);
	hideChildren('lateralWindow');
	show(w);
}

function showMainWindow(w){
	//console.log('show mainwindow '+w);
	hideChildren('mainWindow');
	show(w);
}

function showSkills(){
	
}

function addSkillBookWindow(skillbook){
	let divSB = document.createElement('div');
	divSB.id = 'skillbookWindow';
	
	for(let i =0;i<skillbook.length;i++){
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
	let children = document.getElementById(parentNode).children;
	for(let i =0;i<children.length;i++){
		hide(children[i].id);
	}
}


function characterPrioRow(c,row,rownumber){
	let priodiv = '';
	let selected = '';

	priodiv += ' If <select name="priotargetcond" id="priotargetcond'+c._id+'_'+rownumber+'" class="prioselect">';
	for(let j=0;j<g._priotargetcond.length;j++){
		if(row[0] == g._priotargetcond[j][0]){
			selected = ' selected="selected" ';
		}else{
			selected = '';
		}
		priodiv += '<option value="'+g._priotargetcond[j][0]+'" '+selected+'>'+g._priotargetcond[j][1]+'</option>';
	}
	priodiv += '</select>';
	//
	priodiv += ' Have <select name="priocond" id="priocond'+c._id+'_'+rownumber+'" class="prioselect">';
	for(let j=0;j<g._cond.length;j++){
		if(row[1] == g._cond[j][0]){
			selected = ' selected="selected" ';
		}else{
			selected = '';
		}
		priodiv += '<option value="'+g._cond[j][0]+'" '+selected+'>'+g._cond[j][1]+'</option>';
	}
	priodiv += '</select>';
	//
	priodiv += '<select name="priotreshold" id="priotreshold'+c._id+'_'+rownumber+'" class="priotresh">';
	for(let j=0;j<g._condtreshold.length;j++){
		if(row[2] == g._condtreshold[j][0]){
			selected = ' selected="selected" ';
		}else{
			selected = '';
		}
		priodiv += '<option value="'+g._condtreshold[j][0]+'" '+selected+'>'+g._condtreshold[j][1]+'</option>';
	}
	priodiv += '</select>';
	//
	priodiv += '<br/> Do <select name="prioaction" id="prioaction'+c._id+'_'+rownumber+'" class="prioselect">';
	if(row[3] == ''){
		selected = ' selected="selected" ';
	}else{
		selected = '';
	}
	priodiv += '<option value="" '+selected+'></option>';
	if(row[3] == 'Attack'){
		selected = ' selected="selected" ';
	}else{
		selected = '';
	}
	priodiv += '<option value="Attack" '+selected+'>Standard attack</option>';
	for(let j=0;j<c._skills.length;j++){
		if(row[3] == c._skills[j].getClassName()){
			selected = ' selected="selected" ';
		}else{
			selected = '';
		}
		priodiv += '<option value="'+c._skills[j].getClassName()+'" '+selected+'>'+c._skills[j].getName()+'</option>';
	}
	if(row[3] == 'Nothing'){
		selected = ' selected="selected" ';
	}else{
		selected = '';
	}
	priodiv += '<option value="Nothing" '+selected+'>Do nothing</option>';
	priodiv += '</select>';
	//
	priodiv += ' On <select name="priotarget" id="priotarget'+c._id+'_'+rownumber+'" class="prioselect">';
	for(let j=0;j<g._targetprio.length;j++){
		if(row[4] == g._targetprio[j][0]){
			selected = ' selected="selected" ';
		}else{
			selected = '';
		}
		priodiv += '<option value="'+g._targetprio[j][0]+'" '+selected+'>'+g._targetprio[j][1]+'</option>';
	}
	priodiv += '</select>';
	
	return priodiv;
}

function characterPrioList(c){
	let priolist = '';
	let i;
		//let itemname = '';
	for(i=0;i<c._prio.length;i++){
		priolist += characterPrioRow(c,c._prio[i],i);
		priolist +='<input type="button" value="Update" onclick="updateprio('+c._id+','+i+')"/><br/>';
	}
	priolist += characterPrioRow(c,['','','','',''],i)+'';
	priolist +='<input type="button" value="Add" onclick="updateprio('+c._id+','+i+')"/><br/>';
	return priolist;
}

function updateprio(cid,row){
	let c = g._partyMembers[cid];
	if(row >=0){	//row == -1 => refresh list
		let targetcond = document.getElementById('priotargetcond'+cid+'_'+row).value;
		let cond = document.getElementById('priocond'+cid+'_'+row).value;
		let treshold = document.getElementById('priotreshold'+cid+'_'+row).value;
		let action = document.getElementById('prioaction'+cid+'_'+row).value;
		let ptarget = document.getElementById('priotarget'+cid+'_'+row).value;
		
		if(row >= c._prio.length){
			//new row
			c._prio.push([targetcond,cond,treshold,action,ptarget]);
		}
		else{
			c._prio[row] = [targetcond,cond,treshold,action,ptarget];
		}
	}
	document.getElementById('prio'+cid).innerHTML = characterPrioList(c);
}

//c instance Character
function addCharacter(c,slot){
	
		let divC = document.createElement('div');
		divC.id = 'char'+c._id;
		divC.className = 'divcharacter';
		divC.innerHTML = 
		'<span class="charName" id="char'+c._id+'name">'+c.name+'</span><br/>'+
		'<img src="../ressources/char/swordman1.png" alt="Member" class="charImg" id="imgchar'+c._id+'" onclick="target(\'party\','+c._id+','+slot+')">'+
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
		let itemname = '';
		for(let i=0;i<c.maxequip;i++){
			if(c._equipSlots[i] ){
				itemname = c._equipSlots[i].name;
			}else{
				itemname = '['+l.text(c._equipSlotsNames[i])+']';
			}
			equipdiv += '<div class="equipmentrow">'+
			'<div id="equip'+c._id+'_'+i+'" class="equip" ondrop="dropItem(event)" ondragover="allowDrop(event)"></div>'+
			'<br/><span id="equipname'+c._id+'_'+i+'">'+itemname+'</span>'+
			'</div>';
		}
		
		let priodiv = ''+characterPrioList(c)+'';
		
		
		let divStatC = document.createElement('div');
		divStatC.id = 'charPanel'+c._id;
		divStatC.className = 'charPanel';
		divStatC.style.backgroundImage = 'url("../ressources/char/swordman1.png")';

		divStatC.innerHTML = 
		'<div class="transparentWhite" id="charChildPanel'+c._id+'">'+
		'<input type="button" value="Characteritics & Skills" onclick="charSelectSubWindow(\'charStats\','+c._id+')"/>'+
		'<input type="button" value="Equipment" onclick="charSelectSubWindow(\'equip\','+c._id+')"/>'+
		'<input type="button" value="Priorities" onclick="charSelectSubWindow(\'prio\','+c._id+')"/>'+
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
		'</div>'+
		'<div id="prio'+c._id+'" class="charSubPanel" style="display:none;">'+
		priodiv+
		'</div>'+
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

		//Fin d'initialisation
		for(let i=0;i<c.maxqslot;i++){
			document.getElementById('qslot'+c._id+'_'+i).validDropTarget = 1;
		}
		for(let i=0;i<c.maxequip;i++){
			document.getElementById('equip'+c._id+'_'+i).validDropTarget = 1;
		}
}


function showSkillsChar(id){
	let div = document.getElementById('skills'+id);
	div.innerHTML = '';
	for(let i=0;i<members[id]._skills.length;i++){
		div.innerHTML +=
			'<input type="button" value="'+members[id]._skills[i].getName()+'" onclick="s.useSkill(selectedChar,targetedChar,\''+members[id]._skills[i].getClassName()+'\')"/>';
	}
}


function addEnnemyDiv(m){
	let divE = document.createElement('div');
	divE.id = 'monster'+m._id;
	divE.className = 'divmonster';
	divE.style = 'background-image:url("../ressources/textures/'+m.sprite+'.png");';
	divE.setAttribute('onclick','target("ennemy",'+m._id+','+m.slot+')');
	divE.innerHTML = 
	'<span class="monstername">'+m.name+'</span><br/>'+
	//'<img src="13.jpg" alt="Ennemy" height="198" width="198" id="imgennemy'+m._id+'" onclick="target(\'ennemy\','+m._id+','+m.slot+')"><br/>'+
	'<div class="maxbarm"><div class="barm healthbar" id="healthbarm'+m._id+'"></div></div>';
	
	document.getElementById('ennemy'+m.slot+'card').appendChild(divE);
}

function addItemDiv(item,target = 'inventoryWindow'){
	let e = document.createElement('div');
	e.className='item';
	//e.itemid = item._id;
	e.id = 'item'+item._id;
	e.draggable = 'true';
	e.ondragstart = dragItem;
	e.item = item;
	item._e = e;
	e.innerHTML = 
	'<img src="../ressources/items/'+item.getClassName()+'.png" class="itemImg" onclick="selectItem('+item._id+')" ondblclick="itemdblclick('+item._id+')" draggable="false" ondrop="" id="itemImg'+item._id+'" onmousemove="showInfo(event,this)" onmouseout="hideInfo()"  />';
	
	e.addEventListener("contextmenu", itemrightclick, true); // useCapture: true or false


	if(target == 'inventoryWindow'){
		if(item.usable) target = 'usableItems';
		else if(item.equipment) target = 'equipItems';
		else target = 'otherItems';
	}
	document.getElementById(target).appendChild(e);
}

function removeItemDiv(id){
	document.getElementById('item'+id).parentNode.removeChild(document.getElementById('item'+id));
}

//inputBox.attachEvent("oncontextmenu", handler); // IE <9; use attachEvent for IE <9 support.


function itemrightclick(event) {
	//console.log(event);
		console.log(this.item);//this est l'itemdiv
    // your code goes here
    console.log("right click on inputbox")
    event.preventDefault();
    event.returnvalue = false; // IE <=9;
		
		if(!selectedChar) return;
		let item = this.item;
		let target = null;
		if(item._character.isCharacter){
			target = document.getElementById('inventoryWindow');
		}else{
			if(item.usable){
				if(selectedChar.nextQuickslot() <= -1) return;
				target = document.getElementById('qslot'+selectedChar._id+'_'+selectedChar.nextQuickslot());
			}
			if(item.equipment){
				if(selectedChar.equipslot(item.armorSlot) <= -1) return;
				target = document.getElementById('equip'+selectedChar._id+'_'+selectedChar.equipslot(item.armorSlot));
			}
		}
		if(!target) return;
		moveItem(this.item,target);
		/*
		g.addItem(item,targetSlot);
				if(item.usable) target = document.getElementById('usableItems');
				else if(item.equipment) target = document.getElementById('equipItems');
				else target = document.getElementById('otherItems');*/
}

function itemdblclick(id){
	//let item = document.getElementById('item'+id).item;
	//console.log(item);
	if(selectedItem){
		useItem();
	}
}

function showSelectionItem(id){
	selectedItem = null;
	let selected = document.getElementsByClassName('selecteditem');
	for(let i =0;i<selected.length;i++){
		selected[i].classList.remove("selecteditem");
	}
	if(!id) return;

	itemdiv = document.getElementById('item'+id);
	if(itemdiv.item._character.isCharacter || itemdiv.item._character.isgame){
		itemdiv.className += ' selecteditem';
		selectedItem = itemdiv.item;
	}
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
	document.getElementById('charStats'+id).classList.remove('dead');
	
	currentMembers++;
	
}

function viewInit(){
	document.getElementById('inventoryWindow').validDropTarget = 1;
	document.getElementById('trash').validDropTarget = 1;
}

function allowDrop(ev){
    ev.preventDefault();
}

function dragItem(ev){
  ev.dataTransfer.setData("id", ev.target.id);
  ev.dataTransfer.setData("type", 'item');
  ev.dataTransfer.setData("from", ev.target.parentNode.id);
	console.log('Dragged');
}

function dropItem(ev){
	ev.preventDefault();
	let dtype = ev.dataTransfer.getData("type");
	if(dtype != 'item' || ev.dropped) return false;
	let target = ev.target;
	console.log('Dropped ' +  target.id);
	ev.dropped = 1;
	//Le node qui reçoit l'event peut être un enfant de la vraie cible
	while( !target.validDropTarget && target.parentNode){
		target = target.parentNode;
	}
	//console.log('remonte au parent');
	if(target.children.length 
	&& target.id != 'inventoryWindow'
	&& target.className != 'itemsShopWindow'){
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
	moveItem(item,target);
}

function moveItem(item,target){
	
	let targetObj = null;
	let targetSlot = 0;
	let giveback = 0;
	
	if(target.id.startsWith('qslot') ){
		if(!item.usable) return 0;
		let targetChar = target.id.substr(5).split('_');
		targetSlot = targetChar[1];
		targetObj = members[targetChar[0]];
		
	}
	else if(target.id.startsWith('equip') ){
		if(!item.equipment) return 0;
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
		if(item.usable) target = document.getElementById('usableItems');
		else if(item.equipment) target = document.getElementById('equipItems');
		else target = document.getElementById('otherItems');
		targetObj = g;
	}
	else if(target.id.startsWith('shop') ){
		console.log('shop');
		targetObj = target.shop;
		if(targetObj.cash < Math.floor(item.price*0.5) ){
			console.log('not enough cash');
			return;
		}
	}
	else if(target.id == 'trash'){
		console.log('trash');
		targetObj = null;
	}
	else if(target.id.startsWith('chest') ){
		console.log('keyslot');
		targetObj = g._currentMap.getCurrentSquare()._entity;
		if(target.id != 'chestitems'){
			giveback = 1;
		}
	}
	else if(target.id.startsWith('interact') ){
		console.log('interact');
		targetObj = g._currentMap;
		giveback = 1;
		
	}
	//console.log('fin');
	//console.log(item);
	if(!item._character.removeItem(item)){
		console.log('impossible to remove item');
		return;
	}
	if(targetObj){
		targetObj.addItem(item,targetSlot);
		if(!giveback){
			target.appendChild(document.getElementById('item'+item._id));
		}else{
			g.addItem(item,targetSlot);
			if(item.usable) target = document.getElementById('usableItems');
			else if(item.equipment) target = document.getElementById('equipItems');
			else target = document.getElementById('otherItems');
			target.appendChild(document.getElementById('item'+item._id));
		}
	}else{
		document.getElementById('item'+item._id).parentNode.removeChild(document.getElementById('item'+item._id));
	}
	document.getElementById('iteminfo').style.display = 'none';
}

var charSubWindowShowed = 'charStats';

function charSelectSubWindow(wname,charid){
	hideChildren('charChildPanel'+charid);
	show(wname+charid);
	charSubWindowShowed = wname;
}

function showEquipmentName(id,slot,name){
	document.getElementById('equipname'+id+'_'+slot).innerHTML = name;
}

function removeEnnemyDiv(id,slot){
	document.getElementById('ennemy'+slot+'card').removeChild(document.getElementById('monster'+id));
}

function createSquareDiv(level,square){
	//console.log('sq=');
	//console.log(square);
	if(!square) return [null,null];
	let tiletype = square.tiletype;
	if(tiletype == 'stairs' && square.stairs){
		if(square.minz == level.z){
			tiletype += 'down';
		}else{
			tiletype += 'up';
		}
		tiletype += square.stairsdirection;
	}
	
	let alldir = ['north','south','west','east'];
	let border = ['1px solid rgba(0,0,0,0)','1px solid rgba(0,0,0,0)','1px solid rgba(0,0,0,0)','1px solid rgba(0,0,0,0)'];
	for(let i=0;i<alldir.length;i++){
		if(square[alldir[i]]){
			if(square[alldir[i]].startsWith('wall')){
				border[i] = '1px solid black';
			}
			else if(square[alldir[i]].startsWith('door')){
				border[i] = '1px dashed #e68a00';
				//border[i] = '1px dashed #4d2e00';
			}
		}
	}
	
	let e = document.createElement('div');
	e.className = 'square';
	e.id = 'map'+level._id+'square'+square.x+'_'+square.y+'_'+square.z;
	e.style = ''+
		'left:'+(20*square.x)+'px;'+
		'bottom:'+(20*square.y)+'px;'+
		'background-image:url("../ressources/tiles/'+tiletype+'.png");'+
		'background-position:-1px -1px;'+
		'border-top:'+border[0]+';'+
		'border-bottom:'+border[1]+';'+
		'border-left:'+border[2]+';'+
		'border-right:'+border[3]+';';
	e.innerHTML = square.display();
	
	let u = null;
	if(square.unknown){
		let color='';
		if(square.unknown & 2){
			//Le joueur n'a aucune idée de l'existence de cette case
			color = 'rgba(0,0,0,1)';
		}else{
			//pas encore visité
			color = 'rgba(0,0,0,0.5)';
		}
		u = document.createElement('div');
		u.className = 'square';
		u.id = 'map'+level._id+'squarefog'+square.x+'_'+square.y+'_'+square.z;
		u.style = 'left:'+(20*square.x)+'px;bottom:'+(20*square.y)+'px;background-color:'+color+';';
		u.innerHTML = square.display();
	}
	
	let m = null;
	if(square._entity){
		
		m = document.createElement('div');
		m.className = 'square';
		m.id = 'map'+level._id+'squareentity'+square.x+'_'+square.y+'_'+square.z;
		m.style = 
			'left:'+(20*square.x)+'px;'+
			'bottom:'+(20*square.y)+'px;'+
			'background-image:url("../ressources/tiles/'+square._entity.sprite+'.png");';
		//e.innerHTML = square.display();
	}
	
	return [e,u,m];
}

function showGold(){
	document.getElementById('gold').innerHTML = g.gold;
}

function showInfo(event,elem){
	let e = document.getElementById('iteminfo');
	let x=event.clientX;
	let y=event.clientY;
	let posx,posy;
	
	
	let rectcenter = document.getElementById('mainWindow').getBoundingClientRect();
	let rectimg = elem.getBoundingClientRect();
	if(rectimg.bottom <= rectcenter.bottom){
		posy = 'top:'+(y +6)+'px;';
	}else{
		posy = 'bottom:'+(window.innerHeight - y +6)+'px;';
		
	}
	
	if(rectimg.right <= rectcenter.right){
		posx = 'left:'+(x +6)+'px;';
	}else{
		posx = 'right:'+(window.innerWidth - x +6)+'px;';
	}
	//console.log('x='+x+' y='+y);
	e.style = 
		'display : block;'+
		posx+posy+
		'background-image:url("'+elem.src+'");';
		
	let txt ='';
	let item = elem.parentNode.item;
	for(let i=0;i<item._propertiesToDisplay.length;i++){
		if(item._propertiesToDisplay[i][0] == 'name'){
			txt += item[item._propertiesToDisplay[i][0]] + '<br/>';
		}else{
			txt += item._propertiesToDisplay[i][1] + ' : ' + item[item._propertiesToDisplay[i][0]] + '<br/>';
		}
	}
	e.innerHTML = txt;
	
		//'left : '+(x+6)+'px;'+
		//'top :'+(y+6)+'px;';
		//console.log(e.style);
	
}

function hideInfo(){
	document.getElementById('iteminfo').style.display = "none";
}

function showMap(level){
	hideChildren('mapWindow');
	let mapview;
	
	if(!level) return;
	if(!document.getElementById('wrapMap'+level._id) ){
		let  wrap = document.createElement('div');
		wrap.id = 'wrapMap'+level._id;
		wrap.className='mapView';
		
		mapview = document.createElement('div');
		mapview.id = 'map'+level._id;
		mapview.className='mapView';
		wrap.appendChild(mapview);
		
		indicator = document.createElement('div');
		indicator.id = 'indicator'+level._id;
		indicator.className = 'indicator';
		indicator.innerHTML = 'Level '+level.z;
		wrap.appendChild(indicator);
		
		
		
		document.getElementById('mapWindow').appendChild(wrap);
		
		let c = document.createElement('div');
		c.className = 'cursor';
		c.id = 'cursor'+level._id;
		c.style.backgroundImage = 'url("../ressources/redarrow'+level.dir+'.png")';
		wrap.appendChild(c);
	}else{
		mapview = document.getElementById('map'+level._id);
	}
	hideChildren('map'+level._id);
		/*
		<div class="mapView" id="wrapMap1">
				<div class="mapView" id="map1">
		*/
	if(!document.getElementById('maplevel'+level._id+'_'+level.z) ){
		let  maplevel = document.createElement('div');
		maplevel.id = 'maplevel'+level._id+'_'+level.z;
		maplevel.className='mapView';
		mapview.appendChild(maplevel);
		
		let mapDataZ = level._mapData[level.z];
		if(!mapDataZ){
			console.log('ERROR');
			return;
		}
		for(let i=0;i<mapDataZ.length;i++){
			if(!mapDataZ[i]) continue;
			for(let j=0;j<mapDataZ[i].length;j++){
				if(mapDataZ[i][j]){
					//console.log(level._mapData[i][j]);
					let sqd = createSquareDiv(level,mapDataZ[i][j]);
					maplevel.appendChild(sqd[0]);
					if(sqd[2]){
						maplevel.appendChild(sqd[2]);
					}
					if(sqd[1]){
						maplevel.appendChild(sqd[1]);
					}
					
				}
			}
		}
	}
	
	moveMap(level);
	show('wrapMap'+level._id);
	show('maplevel'+level._id+'_'+level.z);
}

function moveMap(level){
	if(!level) return;
	document.getElementById('map'+level._id).style = 'bottom : '+(-200-level.y*20)+'px; left : '+(+200-level.x*20)+'px;';
	document.getElementById('cursor'+level._id).style.backgroundImage = 'url("../ressources/redarrow'+level.dir+'.png")';
	document.getElementById('indicator'+level._id).innerHTML = 'Level '+level.z;
	document.getElementById('viewInfo').innerHTML = l.text('area',1)+' : '+l.text('level_'+level.name,1)+' ; '+ l.text('coordinates',1)+' : x='+level.x+', y='+level.y+', '+l.text('depth',0)+'='+level.z;
}


function actualizeMap(level,force = 0){
	if(!level) return;
	if(!document.getElementById('wrapMap'+level._id) 
	|| !document.getElementById('maplevel'+level._id+'_'+level.z) ){
		showMap(level);
	}
	
	let now = new Date().getTime();
	if(level._lastactualize && now - level._lastactualize < 500 && !force) return;
	//console.log('actualize '+now+' childnodes='+document.getElementById('maplevel1_1').childNodes.length);

	
	let a = level._toActualize;
	let square = null;
	let squarefog = null;
	for(let i = 0;i<a.length;i++){
		square = document.getElementById('map'+level._id+'square'+a[i][0]+'_'+a[i][1]+'_'+a[i][2]);
		if(square){
			square.parentNode.removeChild(square);
			delete square;
		}
		squarefog = document.getElementById('map'+level._id+'squarefog'+a[i][0]+'_'+a[i][1]+'_'+a[i][2]);
		if(squarefog){
			squarefog.parentNode.removeChild(squarefog);
			delete squarefog;
		}
		squareentity = document.getElementById('map'+level._id+'squareentity'+a[i][0]+'_'+a[i][1]+'_'+a[i][2]);
		if(squareentity){
			squareentity.parentNode.removeChild(squareentity);
			delete squareentity;
		}
		
		
		let sqd = createSquareDiv(level,level.getSquare(a[i][0],a[i][1],a[i][2]) );
		if(sqd[0]){
			document.getElementById('maplevel'+level._id+'_'+a[i][2]).appendChild(sqd[0]);
			if(sqd[2]){
				document.getElementById('maplevel'+level._id+'_'+a[i][2]).appendChild(sqd[2]);
			}
			if(sqd[1]){
				document.getElementById('maplevel'+level._id+'_'+a[i][2]).appendChild(sqd[1]);
			}
		}
		
	}
	level._lastactualize = now;
	delete level._toActualize;
	level._toActualize = [];
}

function startBattle(group){
	for(let i=0;i<group._monsters.length;i++){
		let m = group._monsters[i];
		m.slot = i+1;
		ennemies[m._id] = m;
		ennemyCards[m.slot] = m;
		currentEnnemies++;
		m.doAction();
		addEnnemyDiv(m);
	}
	currentGroup = group;
	group._inBattle = 1;
	g._inBattle = 1;
	showMainWindow('ennemiesWindow');
}

function endBattle(){
	g._inBattle = 0;
	if(currentGroup){
		if(currentGroup._nextMove){
			clearTimeout(currentGroup._nextMove);
		}
		currentGroup._square._entity = null;
		currentGroup._spawnarea.removeGroup(currentGroup);
		delete window['entity'+currentGroup._id];
		currentGroup = null;
	}
	showMainWindow('travelWindow');
}

function showDialog(str){
	let dialogText = document.getElementById('dialogText');
	if(!dialogText){
		dialogText = document.createElement('div');
		dialogText.id= 'dialogText';
		dialogText.className = 'dialogDiv';
		dialogText.innerHTML = str;
		
		document.getElementById('overWindow').appendChild(dialogText);
	}else{
		dialogText.innerHTML = str;
	}
	
}

function showButton(str,right,bottom,onclick){
	let openbutton = document.createElement('div');
	openbutton.className = 'buttonVillage';
	openbutton.innerHTML = str;
	openbutton.style  = 'bottom : '+bottom+'px;right:'+right+'px;';
	openbutton.setAttribute('onclick',onclick);
	document.getElementById('overWindow').appendChild(openbutton);
}

function showKeySlot(id,right,bottom){
	let keyslot = document.createElement('div');
	keyslot.className = 'qslot';
	keyslot.style  = 'position : absolute;bottom : '+bottom+'px;right:'+right+'px;';
	keyslot.setAttribute('ondrop','dropItem(event)');
	keyslot.setAttribute('ondragover','allowDrop(event)');
	keyslot.validDropTarget = 1;
	keyslot.id = id;

	document.getElementById('overWindow').appendChild(keyslot);
}












