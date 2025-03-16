function showBars(entity){
	let maxw;
	let suffix = '';
	if(entity.isMonster){
		suffix = 'm';
		maxw = 198;
	}else{
		suffix = 'c';
		maxw = 84;
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
	/*
	for(let i =0;i<skillbook.length;i++){
		divSB.innerHTML +=
		'<div class="skillrow">'+
			//'<div class="skilllearn" onclick="learnSkill(\''+skillbook[i].getName()+'\')">Learn</div>'+
			'<img style="cursor: pointer;" class="skillbookicon" onclick="learnSkill(\''+skillbook[i].getClassName()+'\')" src="../ressources/icons/skillbook.png"/>'+
			'<img class="skillbookicon" src="../ressources/skills/'+skillbook[i].getClassName()+'.png" onmousemove="showSkillInfo(event,this,'+skillbook[i].getClassName()+')" onmouseout="hideSkillInfo();"/> '+
			'<div class="skillname">'+skillbook[i].getName()+'</div>'+
		'</div><br class="clearFloat"/>';
	}
	*/
	divSB.style.display = 'none';
	document.getElementById('lateralWindow').appendChild(divSB);
	// document.getElementById('rightMenu').innerHTML += 
	// '<input type="button" value="skillbook" onclick="showLateralWindow(\'skillbookWindow\')"/>';
	
	
}

function changeSelectedDisplay(id){
	hideChildren('characterWindow');
	show('charPanel'+id);
	hideChildren('skillbookWindow');
	show('skillBook'+id);
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
	/*
	if(row[3] == 'Attack'){
		selected = ' selected="selected" ';
	}else{
		selected = '';
	}
	priodiv += '<option value="Attack" '+selected+'>Standard attack</option>';
	*/
	for(let j=0;j<c._skills.length;j++){
		if(row[3] == c._skills[j].getClassName()){
			selected = ' selected="selected" ';
		}else{
			selected = '';
		}
		if( !c._skills[j].passive() ){
			priodiv += '<option value="'+c._skills[j].getClassName()+'" '+selected+'>'+c._skills[j].getName()+'</option>';
		}
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
		priolist +='<input type="button" value="Update" onclick="updateprio('+c._id+','+i+')"/>'+
		'<img class="smallicon" src="../ressources/gui/up.png"   style="float:none;margin:1px;vertical-align:middle;cursor:pointer;" onclick="moveprio('+c._id+','+i+',\'up\')"/>'+
		'<img class="smallicon" src="../ressources/gui/down.png" style="float:none;margin:1px;vertical-align:middle;cursor:pointer;" onclick="moveprio('+c._id+','+i+',\'down\')"/>'+
		'<br/>';
	}
	priolist += characterPrioRow(c,['','','','',''],i)+'';
	priolist +='<input type="button" value="Add" onclick="updateprio('+c._id+','+i+')"/><br/>';
	return priolist;
}

function moveprio(cid,n,updown){
	let c = g._allcharacters[cid];
	if(!c) return;
	if(updown == 'up'){
		n--;
	}
	if(c.switchprio(n,n+1)){
		let div = document.getElementById('prio'+c._id);
		if(!div) return;
		div.innerHTML = characterPrioList(c);
	}
}

function updateprio(cid,row){
	let div = document.getElementById('prio'+cid);
	if(!div) return;
	let c = g._allcharacters[cid];
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
	div.innerHTML = characterPrioList(c);
}

function removeCharacter(c){
	let panel = document.getElementById('charPanel'+c._id);
	panel.parentNode.removeChild(panel);
	let divc = document.getElementById('char'+c._id);
	divc.parentNode.removeChild(divc);
	if(!c.dead){
		currentMembers--;
	}
	partyCards[c.slot] = null;

}

//c instance Character
function addCharacter(c,slot){
	
		let divC = document.createElement('div');
		divC.id = 'char'+c._id;
		divC.className = 'divcharacter';
		divC.character = c;
		divC.innerHTML = 
		'<span class="charName" id="char'+c._id+'name">'+c.name+'</span><br/>'+
		'<img src="../ressources/char/'+c.sprite+'.png" alt="Member" class="charImg" id="imgchar'+c._id+'" onclick="target(\'party\','+slot+')">'+
		//'<br/><input type="button" value="select" onclick="selectChar('+c._id+')"/>'+
		'<div class="maxbarc" style="left:0px;bottom:10px;"><div class="healthbar barc" id="healthbarc'+c._id+'"></div></div>'+
		'<div class="maxbarc" style="right:0px;bottom:10px;"><div class="endurancebar barc" id="endurancebarc'+c._id+'"></div></div>'+
		'<div class="maxbarc" style="left:0px;bottom:0px;"><div class="manabar barc" id="manabarc'+c._id+'"></div></div>'+
		'<div class="maxbarc" style="right:0px;bottom:0px;"><div class="mindbar barc" id="mindbarc'+c._id+'"></div></div>'+
		'<img class="roundselect" src="../ressources/gui/roundselect.png" onclick="selectChar('+c._id+')"/>'+
		'<div class="eot" id="eot'+c._id+'"></div>'+
		'<img class="mediumicon charsmile" id="smile'+c._id+'" src="../ressources/icons/moral'+c.getMoral()+'.png">';
		divC.validDropTarget = 1;
		divC.setAttribute('ondrop','dropItem(event)');
		divC.setAttribute('ondragover','allowDrop(event)');
		console.log(c);
		console.log(slot);
		document.getElementById('party'+slot+'card').appendChild(divC);
		
		partyCards[slot] = c;
		currentMembers++;
		
		let qslotdiv = '';
		for(let i=0;i<c.maxqslot;i++){
			qslotdiv += '<div id="qslot'+c._id+'_'+i+'" class="qslot" ondrop="dropItem(event)" ondragover="allowDrop(event)"></div>';
		}
		
		let qskilldiv = '';
		for(let i=0;i<c.maxqskill;i++){
			qskilldiv += '<div id="qskill'+c._id+'_'+i+'" class="qslot" ></div>';
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
		divStatC.style.backgroundImage = 'url("../ressources/char/'+c.sprite+'.png")';

		divStatC.innerHTML = 
		'<div class="transparentWhite" id="charChildPanel'+c._id+'">'+
		'<div class="buttonChar" onclick="charSelectSubWindow(\'charStats\','+c._id+')">'+l.text('buttonstatus',1)+'</div>'+
		'<div class="buttonChar" onclick="charSelectSubWindow(\'equip\','+c._id+')">'+l.text('buttonequip',1)+'</div>'+
		'<div class="buttonChar" onclick="charSelectSubWindow(\'prio\','+c._id+')">'+l.text('buttonorders',1)+'</div>'+
		'<div class="buttonChar" onclick="charSelectSubWindow(\'skills\','+c._id+')">'+l.text('buttonskills',1)+'</div>'+
		'<hr class="clearFloat"/>'+
		'<div id="charStats'+c._id+'" class="charSubPanel">'+
		'<div class="character">'+
		'	<span id="name'+c._id+'"></span>'+
		' <div class="subcaracteristicsWrapper" style="float:right;"> '+
		' <img class="mediumicon" src="../ressources/icons/level.png"/>&nbsp;'+
		'	<span id="level'+c._id+'" style="font-size:24px;"></span><br class="clearFloat"/>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/exp.png"/>'+
		'	<span id="exp'+c._id+'"></span><br class="clearFloat"/>'+
		'	</div><br class="clearFloat"/>'+
		' <div class="maincaracteristicsWrapper caracteristics"> '+
		' <img class="mediumicon" src="../ressources/icons/health.png"/>'+
		'	<span id="health'+c._id+'"></span> / <span id="maxhealth'+c._id+'"></span>'+
		'	</div>'+
		' <div class="subcaracteristicsWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/attack.png" />'+
		' <span id="attack'+c._id+'"></span>'+
		'	</div>'+
		' <div class="maincaracteristicsWrapper caracteristics"> '+
		' <img class="mediumicon" src="../ressources/icons/endurance.png"/>'+
		'	<span id="endurance'+c._id+'"></span> / <span id="maxendurance'+c._id+'"></span>'+
		'	</div>'+
		' <div class="subcaracteristicsWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/defense.png" />'+
		' <span id="defense'+c._id+'"></span>'+
		'	</div>'+
		' <div class="maincaracteristicsWrapper caracteristics"> '+
		' <img class="mediumicon" src="../ressources/icons/mana.png"/>'+
		'	<span id="mana'+c._id+'"></span> / <span id="maxmana'+c._id+'"></span>'+
		'	</div>'+
		' <div class="subcaracteristicsWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/precision.png" />'+
		' <span id="precision'+c._id+'"></span>'+
		'	</div>'+
		' <div class="maincaracteristicsWrapper caracteristics"> '+
		' <img class="mediumicon" src="../ressources/icons/mind.png"/>'+
		'	<span id="mind'+c._id+'"></span> / <span id="maxmind'+c._id+'"></span>'+
		'	</div>'+
		' <div class="subcaracteristicsWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/dodge.png" />'+
		' <span id="dodge'+c._id+'"></span>'+
		'	</div>'+
		' <div class="maincaracteristicsWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/skillpoints.png" onclick="showLateralWindow(\'skillbookWindow\')" style="cursor:pointer;"/>'+
		' <span id="skillpoints'+c._id+'"></span>'+
		'	</div>'+
		' <div class="subcaracteristicsWrapper"> '+
		' <img class="mediumicon" src="../ressources/icons/magicpower.png" />'+
		' <span id="magicpower'+c._id+'"></span>'+
		'	</div>'+
		'</div>'+
		'<div class="attributes">'+
		' <img class="mediumicon"  style="margin-left:50px;" src="../ressources/icons/rainbowplus.png"/>'+
		' <span class="attribute" id="points'+c._id+'" style="margin-right:30px;"></span>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'strength\')" style="cursor:pointer;" src="../ressources/icons/strength.png"/>'+
		' <span class="attribute" id="strength'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_strength'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'constitution\')" style="cursor:pointer;" src="../ressources/icons/constitution.png"/>'+
		'	<span class="attribute" id="constitution'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_constitution'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'dexterity\')" style="cursor:pointer;" src="../ressources/icons/dexterity.png"/>'+
		'	<span class="attribute" id="dexterity'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_dexterity'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'perception\')" style="cursor:pointer;" src="../ressources/icons/perception.png"/>'+
		'	<span class="attribute" id="perception'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_perception'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'spirit\')" style="cursor:pointer;" src="../ressources/icons/spirit.png"/>'+
		'	<span class="attribute" id="spirit'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_spirit'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'wisdom\')" style="cursor:pointer;" src="../ressources/icons/wisdom.png"/>'+
		'	<span class="attribute" id="wisdom'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_wisdom'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'luck\')" style="cursor:pointer;" src="../ressources/icons/luck.png"/>'+
		'	<span class="attribute" id="luck'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_luck'+c._id+'"></span>)</span>'+
		'	</div>'+
		' <div class="attributeWrapper"> '+
		'	<img class="mediumicon"  onclick="upgrade('+c._id+',\'speed\')" style="cursor:pointer;" src="../ressources/icons/speed.png"/>'+
		'	<span class="attribute" id="speed'+c._id+'"></span>'+
		' <span class="modifier">(+<span id="modifier_speed'+c._id+'"></span>)</span>'+
		'	</div>'+/////////////////****///////
		' <img src="../ressources/icons/elements.png" onmouseenter="show(\'elements'+c._id+'\')" onmouseleave="hide(\'elements'+c._id+'\')" class="largeicon elementsicon"/>'+
		' <div id="elements'+c._id+'" style="display:none;" class="elements">'+
		' 	<div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/fire.png"/>'+
		'		<span style="color:#009000;"><span id="boostfire'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;"><span id="_resfire'+c._id+'"></span> %</span>'+
		'		</div>'+
		' 	<div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/ice.png"/>'+
		'		<span style="color:#009000;"><span id="boostice'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;"><span id="_resice'+c._id+'"></span> %</span>'+
		'		</div>'+
		' 	<div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/thunder.png"/>'+
		'		<span style="color:#009000;"><span id="boostthunder'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;"><span id="_resthunder'+c._id+'"></span> %</span>'+
		'		</div>'+
		' 	<div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/water.png"/>'+
		'		<span style="color:#009000;" ><span id="boostwater'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;" ><span id="_reswater'+c._id+'"></span> %</span>'+
		'		</div>'+
		'	 <div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/earth.png"/>'+
		'		<span style="color:#009000;" ><span id="boostearth'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;" ><span id="_researth'+c._id+'"></span> %</span>'+
		'		</div>'+
		'	 <div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/wind.png"/>'+
		'		<span style="color:#009000;"><span id="boostwind'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;"><span id="_reswind'+c._id+'"></span> %</span>'+
		'		</div>'+
		'	 <div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/light.png"/>'+
		'		<span style="color:#009000;" ><span id="boostlight'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;" ><span id="_reslight'+c._id+'"></span> %</span>'+
		'		</div>'+
		'	 <div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/darkness.png"/>'+
		'		<span style="color:#009000;" ><span id="boostdarkness'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;" ><span id="_resdarkness'+c._id+'"></span> %</span>'+
		'		</div>'+
		' 	<div class="resistWrapper"> '+
		'		<img class="largeicon"  style="margin-right:4px;float:left;" src="../ressources/icons/life.png"/>'+
		'		<span style="color:#009000;"><span id="boostlife'+c._id+'"></span> %</span><br/>'+
		'		<span style="color:#900000;"><span id="_reslife'+c._id+'"></span> %</span>'+
		'		</div>'+
		'	</div>'+
		'</div>'+
		'<hr class="clearFloat"/>'+
		qskilldiv+
		'<hr class="clearFloat"/>'+
		qslotdiv+
		'</div>'+
		'<div id="equip'+c._id+'" class="charSubPanel" style="display:none;">'+
		equipdiv+
		'</div>'+
		'<div id="prio'+c._id+'" class="charSubPanel" style="display:none;">'+
		priodiv+
		'</div>'+
		'<div id="skills'+c._id+'" class="charSubPanel skillsPanel" style="display:none;">'+
		'<div class="knownSkills" id="knownSkills'+c._id+'"></div>'+
		// '<div class="knownSkills" id="skillBook'+c._id+'" style="display:none;"></div>'+
		// '<div class="buttonVillage" style="left:20px" onclick="hide(\'skillBook'+c._id+'\');show(\'knownSkills'+c._id+'\');">Compétences connues</div>'+
		// '<div class="buttonVillage" style="left:220px" onclick="hide(\'knownSkills'+c._id+'\');show(\'skillBook'+c._id+'\');">Apprendre compétences</div>'+
		'</div>'+
		'</div>';
		//var charSkills = c._skills;
		
		let sb = document.createElement('div');
		sb.id = 'skillBook'+c._id;
		sb.style.display = 'none';
		sb.innerHTML = 
			'<div id="availableSkills'+c._id+'" class="thirdpanel"></div>'+
			'<div id="almostAvailableSkills'+c._id+'" class="thirdpanel"></div>';
		document.getElementById('skillbookWindow').appendChild(sb);
		
		divStatC.style.display = 'none';
		document.getElementById('characterWindow').appendChild(divStatC);
		showSkillsChar(c._id);

		
		c.showProperties();
	
		for(let i=0;i<c._quickSlots.length;i++){
			if(!c._quickSlots[i]) continue;
			addItemDiv(c._quickSlots[i],'qslot'+c._id+'_'+i);
		}
		
		/*
		
		let qskilldiv = '';
		for(let i=0;i<c.maxqslot;i++){
			qskilldiv += '<div id="qskill'+c._id+'_'+i+'" class="qslot" ></div>';
		}
		*/
		for(let i=0;i<c._quickSkills.length;i++){
			if(!c._quickSkills[i]) continue;
			document.getElementById('qskill'+c._id+'_'+i).innerHTML = '<img onclick="g.useSkill(selectedChar,\''+c._quickSkills[i]+'\')" src="../ressources/skills/'+c._quickSkills[i]+'.png" class="skillicon" onmousemove="showSkillInfo(event,this,'+c._quickSkills[i]+')" onmouseout="hideSkillInfo();"/>';
			//addItemDiv(c._quickSlots[i],'qslot'+c._id+'_'+i);
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
	let div = document.getElementById('knownSkills'+id);
	if(!div)return;
	div.innerHTML = '';
	let c = g._allcharacters[id];
	for(let i=0;i<c._skills.length;i++){
		if(!c._skills[i].passive()){
			div.innerHTML +=
			'<img id="skill'+id+'_'+c._skills[i].getClassName()+'" onclick="g.useSkill(selectedChar,\''+c._skills[i].getClassName()+'\')" src="../ressources/skills/'+c._skills[i].getClassName()+'.png" class="skillicon" onmousemove="showSkillInfo(event,this,'+c._skills[i].getClassName()+')" onmouseout="hideSkillInfo();"/>';
		}else{
			div.innerHTML +=
			'<img id="skill'+id+'_'+c._skills[i].getClassName()+'" src="../ressources/skills/'+c._skills[i].getClassName()+'.png" class="skillicon" onmousemove="showSkillInfo(event,this,'+c._skills[i].getClassName()+')" onmouseout="hideSkillInfo();"/>';
		}
		
		
	}
	//Doit être a la fin, sinon la modification du innerHTML supprime les eventlistener
	for(let i=0;i<c._skills.length;i++){
		if(!c._skills[i].passive()){
			let img = document.getElementById('skill'+id+'_'+c._skills[i].getClassName() );
			img.addEventListener("contextmenu", skillrightclick, true); 
		}
		//console.log(img);
	}
	
	// console.log('Skills '+c.name);
	// console.log(c._skills);
	/*
	//for(let i =0;i<skills.length;i++){
	let availableSkills = []; 
	for(let i =0;i<c._skills.length;i++){
		let unlocked = c._skills[i].unlock();
		for(let j=0;j<unlocked.length;j++){
			if(c._skills.indexOf(unlocked[j]) < 0){
				//First check
				availableSkills.push(unlocked[j]);
			}
		}
	}*/
	
	//On vérifie que TOUS les prerequis sont remplis
	// let checkedAvailableSkills = availableSkills.slice(0);
	let checkedAvailableSkills = skills.slice(0);
	for(let i=0;i<checkedAvailableSkills.length;i++){
		if( c._skills.indexOf(checkedAvailableSkills[i]) >= 0 ){
			checkedAvailableSkills.splice(i,1);
			i--;
			continue;
		}
		let required = checkedAvailableSkills[i].require();
		for(let j=0;j<required.length;j++){
			if(c._skills.indexOf(required[j]) < 0 ){
				checkedAvailableSkills.splice(i,1);
				i--;
				break;
			}
		}
	}
	
	//On va chercher les skills qui vont être débloqués par ce qui peuvent être acquis
	let almostAvailableSkills = [];
	for(let i =0;i<checkedAvailableSkills.length;i++){
		let unlocked = checkedAvailableSkills[i].unlock();
		for(let j=0;j<unlocked.length;j++){
			if(checkedAvailableSkills.indexOf(unlocked[j]) < 0){
				almostAvailableSkills.push(unlocked[j]);
			}
		}
	}
	
	//Et on vérifie aussi pour eux qu'on a presque les prerequis
	let checkedAlmostAvailableSkills = almostAvailableSkills.slice(0);
	for(let i=0;i<checkedAlmostAvailableSkills.length;i++){
		if( c._skills.indexOf(checkedAlmostAvailableSkills[i]) >= 0 ){
			checkedAlmostAvailableSkills.splice(i,1);
			i--;
			continue;
		}
		let required = checkedAlmostAvailableSkills[i].require();
		for(let j=0;j<required.length;j++){
			//On vérifie qu'il soit absent des skills dispo ET des skills acquis
			if(c._skills.indexOf(required[j]) < 0 && checkedAvailableSkills.indexOf(required[j]) < 0){
				checkedAlmostAvailableSkills.splice(i,1);
				i--;
				break;
			}
		}
	}
	

	
	let asdiv = document.getElementById('availableSkills'+c._id);
	let aasdiv = document.getElementById('almostAvailableSkills'+c._id);
	if(!asdiv || !aasdiv) return;
	asdiv.innerHTML = '';
	aasdiv.innerHTML = '';
	for(let i=0;i<checkedAvailableSkills.length;i++){
		asdiv.innerHTML +=
		'<div class="skillrow">'+
			//'<div class="skilllearn" onclick="learnSkill(\''+skillbook[i].getName()+'\')">Learn</div>'+
			'<img style="cursor: pointer;" class="skillbookicon" onclick="learnSkill(\''+checkedAvailableSkills[i].getClassName()+'\')" src="../ressources/icons/skillbook.png"/>'+
			'<img class="skillbookicon" src="../ressources/skills/'+checkedAvailableSkills[i].getClassName()+'.png" onmousemove="showSkillInfo(event,this,'+checkedAvailableSkills[i].getClassName()+')" onmouseout="hideSkillInfo();"/> '+
			'<div class="skillname">'+l.text('skill'+checkedAvailableSkills[i].getClassName()+'name',1)+'</div>'+
		'</div><br class="clearFloat"/>';
	}
	//console.log(checkedAvailableSkills);
	for(let i=0;i<checkedAlmostAvailableSkills.length;i++){
		aasdiv.innerHTML +=
		'<div class="skillrow">'+
			//'<div class="skilllearn" onclick="learnSkill(\''+skillbook[i].getName()+'\')">Learn</div>'+
			'<img style="cursor: pointer;" class="skillbookicon" src="../ressources/icons/skillbookdisabled.png"/>'+
			'<img class="skillbookicon" src="../ressources/skills/'+checkedAlmostAvailableSkills[i].getClassName()+'.png" onmousemove="showSkillInfo(event,this,'+checkedAlmostAvailableSkills[i].getClassName()+')" onmouseout="hideSkillInfo();"/> '+
			'<div class="skillname">'+l.text('skill'+checkedAlmostAvailableSkills[i].getClassName()+'name',1)+'</div>'+
		'</div><br class="clearFloat"/>';
	}
	/*
	divSB.
	*/
	
}

//J'ai préféré dupliquer le code que de rajouter plein de flags en paramètres
function showSkillsCharInn(c){
	let div = document.getElementById('inncharskills'+c._id);
	if(!div)return;
	div.innerHTML = '';
	for(let i=0;i<c._skills.length;i++){
		div.innerHTML +=
			'<img src="../ressources/skills/'+c._skills[i].getClassName()+'.png" class="skillicon" onmousemove="showSkillInfo(event,this,'+c._skills[i].getClassName()+')" onmouseout="hideSkillInfo();"/>';
	}	
}


function addEnnemyDiv(m){
	let divE = document.createElement('div');
	divE.id = 'monster'+m._id;
	divE.className = 'divmonster';
	divE.character = m;
	divE.style = 'background-image:url("../ressources/textures/'+m.sprite+'.png");';
	divE.setAttribute('onclick','target("ennemy",'+m.slot+')');
	divE.validDropTarget = 1;
	divE.setAttribute('ondrop','dropItem(event)');
	divE.setAttribute('ondragover','allowDrop(event)');
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
	
	e.style = 'background-color:'+item.backColor()+';';
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
		//console.log(this.item);//this est l'itemdiv
    // your code goes here
    //console.log("right click on inputbox")
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

var nextskillloaded = null;
var prevskillloaded = null;

function skillrightclick(event){
	event.preventDefault();
	event.returnvalue = false; // IE <=9;
	
	//let e = document.getElementById('iteminfo');
	let x=event.clientX;
	let y=event.clientY;
	let posx = 'left:'+(x-200)+'px;';
	let posy = 'top:'+(y-260)+'px;';
	
	hideSkillInfo();
	let data = this.id.substr(5).split('_');
	
	if( nextskillloaded != skills[data[1]]){
		loadSkillInfo(skills[data[1]],'next');
		nextskillloaded = skills[data[1]];
	}
	let c = g._allcharacters[data[0]];
	for(let i=0;i<c.maxqskill;i++){
		let e = document.getElementById('qskill0_'+i);
		if(c._quickSkills[i]){
			e.innerHTML = '<img onclick="" src="../ressources/skills/'+c._quickSkills[i]+'.png" class="skillicon" onmousemove="showSkillInfo(event,this,'+skills[c._quickSkills[i]]+',\'prev\')" onmouseout="hidePrevSkillInfo();"/>';
		}else{
			e.innerHTML = '';
		}
	}
	
	
	document.getElementById('changeqskill').style = posx+posy+'display:block;';
}

function chargeqskill(slot){
	if(!selectedChar) return;
	selectedChar._quickSkills[slot] = nextskillloaded.getClassName();
	
	for(let i=0;i<selectedChar._quickSkills.length;i++){
		if(!selectedChar._quickSkills[i]) continue;
		document.getElementById('qskill'+selectedChar._id+'_'+i).innerHTML = '<img onclick="g.useSkill(selectedChar,\''+selectedChar._quickSkills[i]+'\')" src="../ressources/skills/'+selectedChar._quickSkills[i]+'.png" class="skillicon" onmousemove="showSkillInfo(event,this,'+selectedChar._quickSkills[i]+')" onmouseout="hideSkillInfo();"/>';
		//addItemDiv(c._quickSlots[i],'qslot'+c._id+'_'+i);
	}
	document.getElementById('changeqskill').style.display = 'none';
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
	currentMembers--;
	if(!currentMembers){
		document.getElementById('gameover').style.display = 'block';
	}
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
	&& target.className != 'itemsShopWindow'
	&& target.className != 'divcharacter'
	&& target.className != 'divmonster'){
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
	if(!item) return;
	let targetObj = null;
	let targetSlot = 0;
	let giveback = 0;
	
	if(target.id.startsWith('qslot') ){
		if(!item.usable) return 0;
		let targetChar = target.id.substr(5).split('_');
		targetSlot = targetChar[1];
		targetObj = g._allcharacters[targetChar[0]];
		
	}
	else if(target.id.startsWith('equip') ){
		if(!item.equipment) return 0;
		let targetChar = target.id.substr(5).split('_');
		targetSlot = Number(targetChar[1])+100;
		targetObj = g._allcharacters[targetChar[0]];
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
		if(targetObj.cash < Math.floor(item.price*0.4) || item.unsellable){
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
	else if(target.id.startsWith('npc') ){
		console.log('npc');
		targetObj = g._currentMap.getCurrentSquare()._entity;
		//giveback = 1;
		
	}
	else if(target.className == 'divcharacter' || target.className == 'divmonster'){
		if(item.usable){
			useItem(item,target.character);
		}
		return;
	}
	//console.log('fin');
	//console.log(item);
	if(!item._character.removeItem(item)){
		console.log('impossible to remove item');
		return;
	}
	if(targetObj){
		if(giveback){
			g.addItem(item,targetSlot);
			if(item.usable) target = document.getElementById('usableItems');
			else if(item.equipment) target = document.getElementById('equipItems');
			else target = document.getElementById('otherItems');
		}
		let itemd = document.getElementById('item'+item._id);
		if(!itemd){
			console.log('recreating item div');
			itemd = addItemDiv(item,target);
		}
		else{
			target.appendChild(itemd );
		}
		targetObj.addItem(item,targetSlot);
	}else{
		document.getElementById('item'+item._id).parentNode.removeChild(document.getElementById('item'+item._id));
	}
	document.getElementById('iteminfo').style.display = 'none';
}

var charSubWindowShowed = 'charStats';

function charSelectSubWindow(wname,charid){
	// console.log('charChildPanel'+charid);
	// console.log(document.getElementById('charChildPanel'+charid));
	if(!document.getElementById('charChildPanel'+charid)) return;
	hideChildren('charChildPanel'+charid);
	show(wname+charid);
	charSubWindowShowed = wname;
}

function showEquipmentName(id,slot,name){
	document.getElementById('equipname'+id+'_'+slot).innerHTML = name;
}

function removeEnnemyDiv(id,slot){
	if(!document.getElementById('monster'+id)) return;
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
			else if(square[alldir[i]].startsWith('grid')){
				border[i] = '1px dashed #808080';
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
			txt += '<span style="color:'+item.foreColor()+';">'+item[item._propertiesToDisplay[i][0]]+'</span>' + '<br/>';
		}else{
			txt += item._propertiesToDisplay[i][1] + ' : ' + item[item._propertiesToDisplay[i][0]] + '<br/>';
		}
	}
	e.innerHTML = txt;
	
}

function hideInfo(){
	document.getElementById('iteminfo').style.display = "none";
}

var loadedSkill = null;
function showSkillInfo(event,elem,skill,target = 'main'){
	
	if(target == 'main'){
		let e = document.getElementById('skillmaininfo');
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
		e.style =  'display : block;'+ posx+posy;
	}
	

	loadSkillInfo(skill,target);

	//console.log(skill);
}



function loadSkillInfo(skill,target){
	document.getElementById('icon'+target+'info').setAttribute('src','../ressources/skills/'+skill.getClassName()+'.png');
	document.getElementById('name'+target+'info').innerHTML = l.text('skill'+skill.getClassName()+'name',1);
	document.getElementById('desc'+target+'info').innerHTML = l.text('skill'+skill.getClassName()+'desc',1);
	document.getElementById('power'+target+'info').innerHTML = skill.potent();
	document.getElementById('endurance'+target+'info').innerHTML = skill.getEnduranceConsumption();
	document.getElementById('mana'+target+'info').innerHTML = skill.getManaConsumption();
	document.getElementById('mind'+target+'info').innerHTML = skill.getMindConsumption();
	document.getElementById('health'+target+'info').innerHTML = skill.getHealthConsumption();
	document.getElementById('active'+target+'info').style.display = 'inline';
	if(skill.passive()){
		document.getElementById('type'+target+'info').innerHTML = 'Passif';
		document.getElementById('active'+target+'info').style.display = 'none';
	}else if(skill.offensive()){
		document.getElementById('type'+target+'info').innerHTML = 'Offensif';
	}else{
		document.getElementById('type'+target+'info').innerHTML = 'Défensif';
	}
	if(skill.require()){
		
		/*
		
		*/
		
		document.getElementById('reqwrap'+target+'info').style.display = 'block';
		document.getElementById('reqwrap'+target+'info').innerHTML = '';
		let required = skill.require();
		for(let i=0;i<required.length;i++){
			document.getElementById('reqwrap'+target+'info').innerHTML += 'Req. <img class="smallicon" style="float:none" src="../ressources/skills/'+required[i].getClassName()+'.png"/>&nbsp;'+l.text('skill'+required[i].getClassName()+'name',1)+'<br/>';
		}
	}else{
		document.getElementById('reqwrap'+target+'info').style.display = 'none';
		//reqskilliconprevinfo
	}
}

function hideSkillInfo(){
	document.getElementById('skillmaininfo').style.display = 'none';
}

function hidePrevSkillInfo(){
	let target = 'prev';
	document.getElementById('icon'+target+'info').setAttribute('src','../ressources/skills/NoSkill.png');
	document.getElementById('name'+target+'info').innerHTML = '';
	document.getElementById('desc'+target+'info').innerHTML = '';
	document.getElementById('power'+target+'info').innerHTML = '0';
	document.getElementById('endurance'+target+'info').innerHTML = 0;
	document.getElementById('mana'+target+'info').innerHTML = 0;
	document.getElementById('mind'+target+'info').innerHTML = 0;
	document.getElementById('health'+target+'info').innerHTML = 0;
	document.getElementById('type'+target+'info').innerHTML = '';
	document.getElementById('active'+target+'info').style.display = 'none';
	document.getElementById('reqwrap'+target+'info').style.display = 'none';
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
		setTimeout('doAction("m",'+m._id+')',m.timeAttack*(rand(3,10)/10) );
		//m.doAction();
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

var answernumber = 0;
function showAnswer(str,onclick,linecount = 1){
	let answer = document.createElement('div');
	answer.className = 'answerDialog';
	answer.innerHTML = ' > '+str;
	answer.style  = 'top : '+(120+answernumber*20)+'px;right:10px;height:'+(20*linecount)+'px;';
	answernumber+=linecount;
	answer.setAttribute('onclick',onclick);
	document.getElementById('overWindow').appendChild(answer);
}

function clearOverWindow(){
	answernumber = 0;
	document.getElementById('overWindow').innerHTML = '';
}

function addEOT(eot){
	if(eot.target.isCharacter){
		if(!document.getElementById('eot'+eot.target._id)) return;
		document.getElementById('eot'+eot.target._id).innerHTML += '<img class="mediumicon" src="../ressources/skills/'+eot.skill.getClassName()+'.png" id="eoteffect'+eot._id+'"/>';
	}
}

function removeEOT(eot){
	if(!document.getElementById('eoteffect'+eot._id))return;
	document.getElementById('eoteffect'+eot._id).parentNode.removeChild(document.getElementById('eoteffect'+eot._id));
	if(window.eot[eot._id]){
		delete window.eot[eot._id];
		eot.over();
	}
	
}








