var s = new Save('save0');
var m;



var ennemies = [];
var members = [];
var idnext = 1;
var currentEnnemies = 0;
var currentMembers = 0;
var selectedChar = null;
var targetedChar = null;
var ennemyCards = [null,null,null,null,null,null,null];
var partyCards = [null,null,null,null,null,null,null];
var skills = [];
var knownItems = [];
var idnextitem = 1;
var selectedItem = null;
var items = [];

function attackTarget(){
	if(selectedChar && targetedChar){
		var result = s.computeAttack(selectedChar,targetedChar);
	}
}

function upgrade(id,attr){
	if(!members[id])return;
	members[id].upgrade(attr);
}

function nextFreeCard(cards){
	for(var i =1;i<cards.length;i++){
		if(cards[i] == null) return i;
	}
	return 0;
}

function randomMonster(){
	var res = Math.ceil( Math.random() * currentEnnemies);
	for(var i = 1;i<ennemyCards.length;i++){
		if(ennemyCards[i] != null){
			res --;
			if(!res){
				return ennemyCards[i];
			}
		}
	}
	return null;
}

function randomCharacter(){
	var res = Math.ceil( Math.random() * currentMembers);
	for(var i = 1;i<members.length;i++){
		if(members[i] != null){
			res --;
			if(!res){
				return members[i];
			}
		}
	}
	return null;
}

function testrandm(){
	var results = [];
	for(var j=0;j<10000;j++){
		var m  =randomMonster();
		var id;
		if(m == null){
			id = 0;
		}else{
			id = m._id;
		}
		if(results[id]){
			results[id]++;
		}else{
			results[id] = 1;
		}
	}
	console.log(results);
}

function selectChar(id){
	selectedChar = members[id];
	changeSelectedDisplay(id);
}

function target(side,id,slot){
	var selected = document.getElementsByClassName('selected');

	for(var i =0;i<selected.length;i++){
		selected[i].classList.remove("selected");
	}
	console.log(side+slot+'card');
	if(side=='party'){
		targetedChar = members[id];
	}else{
		targetedChar = ennemies[id];
	}
	
	if(!targetedChar) return;
	console.log(targetedChar);
	document.getElementById(side+slot+'card').className += ' selected';

}

function getCard(monsterId){
	for(var i =1;i<ennemyCards.length;i++){
		if(ennemyCards[i] != null
		&& ennemyCards[i]._id == monsterId) return i;
	}
	return 0;
}

function removeEnnemy(id){
	document.getElementById('ennemy'+getCard(id)+'card').removeChild(document.getElementById('monster'+id));
	ennemies[id] = null;
	ennemyCards[getCard(id)] = null;
	currentEnnemies--;
	//Si la cible est morte, on en prend une autre au hasard
	if(targetedChar && targetedChar._id == id){
		var m = randomMonster();
		if(m){
			target('ennemy',m._id,m.slot)
		}else{
			target('ennemy',0,0);
		}
	}
}

function showDead(id){
//A modifier
	document.getElementById('charStats'+id).className += ' dead';
	//document.getElementById('character').style='background-color:#900000;';
	members[id] = null;
	currentMembers--;
	/*
	for(var i=1;i<ennemies.length;i++){
		if(ennemies[i] != null){
			removeEnnemy(i);
		}
	}
	*/
}

function addSkill(sk){
	if(typeof sk == 'function'){
		skills[skills.length] = sk;
		skills[sk.getClassName()] = sk;
	}
}

function initSkillbook(){
	var availableSkills = [];
	addSkill(Heal);
	addSkill(Fireball);
	addSkill(Meditate);

	addSkillBookWindow(skills);
}

function init(){
	initSkillbook();
	registerItem(HealPotion);
	s.init();
}

function learnSkill(skillname){
	var skill = skills[skillname];
	if(selectedChar){
		selectedChar.learnSkill(skill);
	}
}

function regenerate(){
	for(var i =1;i<members.length;i++){
		if(members[i] != null ){
			members[i].regenerate();
		}
	}
	setTimeout("regenerate()",1000);
}

function addPartyMember(){
	var next = nextFreeCard(partyCards);
	if(next){
		s.addPartyMember(next);
	}
}

function doAction(type,id){
	var user = null;
	if(type == 'm'){
		user = ennemies[id];
	}else if(type == 'c'){
		user = members[id];
	}
	if(user){
		user.doAction();
	}
}

function registerClass(cl){
	window[cl.staticClassName()] = cl;
	//maintenant on peut instancier en faisant o = new window['MyClass']
}

function registerItem(itemClass){
	knownItems.push(itemClass);
	registerClass(itemClass);
}

//for test purpose only
function addPotion(){
	var p = new window['HealPotion'](idnextitem++);
	s.addItem(p);
	items[p._id] = p;
	addItemDiv(p._id);
}

//Appelé depuis la sauvegarde, lors du chargement
function addItem(item){
	items[item._id] = item;
	addItemDiv(item._id);
}

function selectItem(id){
	selectedItem = items[id];
	showSelectionItem(id);
}

function useItem(){
	if(!selectedItem || !targetedChar || !selectedChar) return;
	if(selectedItem.use(selectedChar,targetedChar)){
		console.log('USED');
		removeItem(selectedItem);
	}
}

function removeItem(item){
	s.removeItem(item);
	items[item._id] = null;
	removeItemDiv(item._id);
	if(selectedItem && selectedItem._id == item._id){
		selectedItem = null;
	}
}



