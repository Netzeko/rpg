var g = new Game('save0');
var s = g;//retrocompat, a enlever
var m;



var ennemies = [];
var members = [];
//var idnext = 1;
var currentEnnemies = 0;
var currentMembers = 0;
var selectedChar = null;
var targetedChar = null;
var ennemyCards = [null,null,null,null,null,null,null];
var partyCards = [null,null,null,null,null,null,null];
var skills = [];
var knownItems = [];
//var idnextitem = 1;
var selectedItem = null;
//var items = [];
var currentGroup = null;
var l = new Language('French');

var renderanimation = 1;
function attackTarget(){
	if(selectedChar && targetedChar){
		let result = s.computeAttack(selectedChar,targetedChar);
	}
}

function addEnnemy(){
	let free = nextFreeCard(ennemyCards);
	if(free){
		let mob = new Monster('Kritikal',g._nextMonsterId++,g);
		mob.slot = free;
		ennemyCards[mob.slot] = mob;
		ennemies[mob._id] = mob;
		mob.showProperties();
		currentEnnemies++;
		mob.doAction();
		addEnnemyDiv(mob);
		
		g._inBattle = 1;
		showMainWindow('ennemiesWindow');
	}
}

function upgrade(id,attr){
	if(!members[id])return;
	members[id].upgrade(attr);
}

function nextFreeCard(cards){
	for(let i =1;i<cards.length;i++){
		if(cards[i] == null) return i;
	}
	return 0;
}

function randomMonster(){
	let res = rand(1,currentEnnemies);// Math.ceil( Math.randm() * currentEnnemies);
	for(let i = 1;i<ennemyCards.length;i++){
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
	let res = rand(1,currentMembers); //Math.ceil( Math.randm() * currentMembers);
	for(let i = 1;i<members.length;i++){
		if(members[i] != null && !members[i].dead){
			res --;
			if(!res){
				return members[i];
			}
		}
	}
	return null;
}

function selectChar(id){
	if(!members[id]) return 0;
	selectedChar = members[id];
	charSelectSubWindow(charSubWindowShowed,selectedChar._id);
	
	changeSelectedDisplay(id);
}

function target(side,id,slot){
	let selected = document.getElementsByClassName('selected');

	for(let i =0;i<selected.length;i++){
		selected[i].classList.remove("selected");
	}
	//console.log(side+slot+'card');
	if(side=='party'){
		targetedChar = members[id];
	}else{
		targetedChar = ennemies[id];
	}
	
	if(!targetedChar) return;
	//console.log(targetedChar);
	document.getElementById(side+slot+'card').className += ' selected';

}

function removeEnnemy(id,slot){
	//console.log('removeennemy '+id+' '+slot);
	removeEnnemyDiv(id,slot);
	ennemies[id] = null;
	ennemyCards[slot] = null;
	currentEnnemies--;
	//Si la cible est morte, on en prend une autre au hasard
	if(targetedChar && targetedChar._id == id){
		let m = randomMonster();
		if(m){
			target('ennemy',m._id,m.slot)
		}else{
			target('ennemy',0,0);
		}
	}
	if(!currentEnnemies){
		endBattle();
	}
}

function addSkill(sk){
	if(typeof sk == 'function'){
		skills[skills.length] = sk;
		skills[sk.getClassName()] = sk;
	}
}

function initSkillbook(){
	let availableSkills = [];
	addSkill(Heal);
	addSkill(Fireball);
	addSkill(Meditate);

	addSkillBookWindow(skills);
}

var currentSave = 'save0';
function save(){
	lskeys = [];
	lsdatalength = 0;
	lsnamelength = 0;
	g.saveInCookie(currentSave);
	
	console.log('Saved '+lskeys.length+' objects, total size of '+lsdatalength+' + '+lsnamelength);
}

var l;
var inAnimation = 0;

function init(){
	initSkillbook();
	registerItem(HealPotion);
	registerItem(QuiltedArmor);
	registerItem(LeatherGloves);
	registerItem(CopperRing);
	registerItem(BloodSword);
	registerItem(RoughSaphire);
	

	g.init();
	
	//a changer par le niveau courant
	/*
	l = s._levels[0];
	showMap(l);
	moveMap(l);*/
	viewInit();
	
	g.addScene( new DungeonScene() );
	g._scene.addMaterial('sprite','sprite');
	g._scene.addMaterial('wall');
	g._scene.addMaterial('door');
	g._scene.addMaterial('door2','texture',true);
	g._scene.addMaterial('void','texture',true);
	g._scene.addMaterial('ground');
	g._scene.addMaterial('ceiling');
	g._scene.addMaterial('ceilingdark');
	g._scene.addMaterial('darkstone');
	g._scene.addMaterial('brownstone');
	
	document.onkeydown = function(e) {
		let oldSquare,newSquare,olddir,newdir;//Used for animation;
		e = e || window.event;
		//console.log(e.which || e.keyCode);
		switch(e.which || e.keyCode) {
			case 37: // left
				if(g._inBattle || !g._currentMap || inAnimation) return;
				
				oldSquare = g._currentMap.getCurrentSquare();
				olddir = g._currentMap.dir;
				
				g._currentMap.turnLeft();
				
				newSquare = g._currentMap.getCurrentSquare();
				newdir = g._currentMap.dir;
				
				moveMap(g._currentMap);
				actualizeMap(g._currentMap);
				inAnimation = true;
				g._currentMap.animationStart(oldSquare,newSquare);
				g._scene.initMovement(oldSquare.getPosition(),oldSquare.getDirection(olddir),new Date().getTime(),
															newSquare.getPosition(),newSquare.getDirection(newdir),new Date().getTime()+300);
				//g._scene.actualizePosition();
				break;

			case 38: // up
				if(g._inBattle || !g._currentMap || inAnimation) return;
				
				oldSquare = g._currentMap.getCurrentSquare();
				olddir = g._currentMap.dir;
				
				g._currentMap.moveForward(1);
				
				newSquare = g._currentMap.getCurrentSquare();
				newdir = g._currentMap.dir;
				
				moveMap(g._currentMap);
				actualizeMap(g._currentMap,1);
				//g._scene.actualizePosition();
				inAnimation = true;
				g._currentMap.animationStart(oldSquare,newSquare);
				g._scene.initMovement(oldSquare.getPosition(),oldSquare.getDirection(olddir),new Date().getTime(),
															newSquare.getPosition(),newSquare.getDirection(newdir),new Date().getTime()+400);
				break;

			case 39: // right
				if(g._inBattle || !g._currentMap || inAnimation) return;
				
				oldSquare = g._currentMap.getCurrentSquare();
				olddir = g._currentMap.dir;
				
				g._currentMap.turnRight();
				
				newSquare = g._currentMap.getCurrentSquare();
				newdir = g._currentMap.dir;
				
				moveMap(g._currentMap);
				actualizeMap(g._currentMap);
				
				inAnimation = true;
				g._currentMap.animationStart(oldSquare,newSquare);
				g._scene.initMovement(oldSquare.getPosition(),oldSquare.getDirection(olddir),new Date().getTime(),
															newSquare.getPosition(),newSquare.getDirection(newdir),new Date().getTime()+300);
				//g._scene.actualizePosition();
				break;

			case 40: // down
				if(g._inBattle || !g._currentMap || inAnimation) return;
				
				oldSquare = g._currentMap.getCurrentSquare();
				olddir = g._currentMap.dir;
				
				g._currentMap.moveForward(-1);
				
				newSquare = g._currentMap.getCurrentSquare();
				newdir = g._currentMap.dir;
				
				moveMap(g._currentMap);
				actualizeMap(g._currentMap,1);
				//g._scene.actualizePosition();
				inAnimation = true;
				g._currentMap.animationStart(oldSquare,newSquare);
				g._scene.initMovement(oldSquare.getPosition(),oldSquare.getDirection(olddir),new Date().getTime(),
															newSquare.getPosition(),newSquare.getDirection(newdir),new Date().getTime()+400);
				break;
			/* Anciens mouvements
			case 37: // left
				l.walk(-1,0);
				l.dir = 'left';
				moveMap(l);
				actualizeMap(l);
				break;

			case 38: // up
				l.walk(0,+1);
				l.dir = 'up';
				moveMap(l);
				actualizeMap(l);
				break;

			case 39: // right
				l.walk(+1,0);
				l.dir = 'right';
				moveMap(l);
				actualizeMap(l);
				break;

			case 40: // down
				l.walk(0,-1);
				l.dir = 'down';
				moveMap(l);
				actualizeMap(l);
				break;
				*/
			case 96: //numpad 0
				break;
			case 97: //numpad 1
				//target('party',partyCards[5]._id,5);
				selectChar(5);
				break;
			case 98: //numpad 2
				//target('party',partyCards[4]._id,4);
				selectChar(4);
				break;
			case 99: //numpad 3
				//target('party',partyCards[6]._id,6);
				selectChar(6);
				break;
			case 100: //numpad 4
				//target('party',partyCards[2]._id,2);
				selectChar(2);
				break;
			case 101: //numpad 5
				//target('party',partyCards[1]._id,1);
				selectChar(1);
				break;
			case 102: //numpad 6
				//target('party',partyCards[3]._id,3);
				selectChar(3);
				break;
				
			case 103: //numpad 7
				if(!selectedChar)break;
				charSelectSubWindow('charStats',selectedChar._id);
				break;
			case 104: //numpad 8
				if(!selectedChar)break;
				charSelectSubWindow('equip',selectedChar._id);
				break;
			case 105: //numpad 9
				if(!selectedChar)break;
				charSelectSubWindow('prio',selectedChar._id);
				break;
			case 32://space bar
				if(!g._currentMap) break;
				g._currentMap.interact(0);

			

			default: return; // exit this handler for other keys
		}
	}

	showPlace();

	for(let i=0;i<g._spawnareas.length;i++){
		g._spawnareas[i]._spawning = 1;
		g._spawnareas[i].spawn();
	}

}

function showPlace(){
	if(g._currentMap){
		g._scene.createScene(g._currentMap);
		showMainWindow('travelWindow');
	}else{
		showMainWindow('villageWindow');
	}
}

function learnSkill(skillname){
	let skill = skills[skillname];
	if(selectedChar){
		selectedChar.learnSkill(skill);
	}
}

function addPartyMember(){
	let next = nextFreeCard(partyCards);
	if(next){
		s.addPartyMember(next);
	}
}

function doAction(type,id){
	let user = null;
	if(type == 'm'){
		user = ennemies[id];
	}else if(type == 'c'){
		user = members[id];
	}
	if(user){
		user.doAction();
	}
}



function registerItem(itemClass){
	knownItems.push(itemClass);
	registerClass(itemClass);
}

//for test purpose only
function addPotion(){
	let p = new window['HealPotion'](g._nextItemId++);
	g.addItem(p);
	//items[p._id] = p;
	addItemDiv(p);
}

function addArmor(){
	let a = new window['QuiltedArmor'](g._nextItemId++);
	g.addItem(a);
	//items[a._id] = a;
	addItemDiv(a);
	
	
	let b = new window['LeatherGloves'](g._nextItemId++);
	g.addItem(b);
	//items[b._id] = b;
	addItemDiv(b);
	
	let b = new window['CopperRing'](g._nextItemId++);
	g.addItem(b);
	//items[b._id] = b;
	addItemDiv(b);
}

function addItemFromName(itemname){
	let item = new window[itemname](g._nextItemId++);
	s.addItem(item);
	//items[item._id] = item;
	addItemDiv(item);
}

//Appelé depuis la sauvegarde, lors du chargement
function addItem(item,container = 'inventoryWindow'){
	//items[item._id] = item;
	addItemDiv(item,container);
}

function selectItem(id){
	//selectedItem = items[id];
	showSelectionItem(id);
}

function useItem(){
	if(!selectedItem || !targetedChar || !selectedChar) return;
	if(selectedItem.use(selectedChar,targetedChar)){
		console.log('USED');
		removeItem(selectedItem);
	}
	document.getElementById('iteminfo').style.display = 'none';
}

function removeItem(item){
	item._character.removeItem(item);
	//items[item._id] = null;
	removeItemDiv(item._id);
	if(selectedItem && selectedItem._id == item._id){
		selectedItem = null;
	}
}

function resurrectMember(){
	if(!targetedChar || targetedChar.isMonster )return;
	targetedChar.resurrect();
	targetedChar.showProperties();
}


