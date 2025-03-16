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
var targetedAlly = null;
var targetedFoe = null;
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

var currentSaveSlot = 1;
var savename = null;
var charname = null;
var charimage = null;
var shopmode = 0;
/*
function attackTarget(){
	if(selectedChar && targetedChar){
		let result = s.computeAttack(selectedChar,targetedChar);
	}
}
*/
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
	if(!g._allcharacters[id])return;
	g._allcharacters[id].upgrade(attr);
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
	for(let i = 1;i<g._partyMembers.length;i++){
		if(g._partyMembers[i] != null && !g._partyMembers[i].dead){
			res --;
			if(!res){
				return g._partyMembers[i];
			}
		}
	}
	return null;
}

function selectChar(cid){
	console.log('selectChar '+cid);
	if(!g._allcharacters[cid] || !g._allcharacters[cid].inTeam) return 0;
	selectedChar = g._allcharacters[cid];
	charSelectSubWindow(charSubWindowShowed,selectedChar._id);
	console.log('OK change select');
	changeSelectedDisplay(selectedChar._id);
}

function target(side,slot){
	
	
	//console.log(side+slot+'card');
	if(side=='party'){
		targetedChar = partyCards[slot];
		targetedAlly = partyCards[slot];
		let selected = document.getElementsByClassName('selectedally');
		for(let i =0;i<selected.length;i++){
			selected[i].classList.remove("selectedally");
		}
		if(!targetedChar) return;
		document.getElementById(side+slot+'card').className += ' selectedally';

	}else{
		targetedChar = ennemyCards[slot];
		targetedFoe = ennemyCards[slot];
		let selected = document.getElementsByClassName('selected');
		for(let i =0;i<selected.length;i++){
			selected[i].classList.remove("selected");
		}
		if(!targetedChar) return;
		document.getElementById(side+slot+'card').className += ' selected';
	}
	
	
	//console.log(targetedChar);

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
			target('ennemy',m.slot)
		}else{
			target('ennemy',0);
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
	addSkill(Firebolt);
	addSkill(Attack);
	addSkill(UseItem);
	addSkill(FireBasics);
	addSkill(Burn);
	addSkill(FireAdvanced);
	addSkill(FirePillar);
	addSkill(FireBarrier);
	addSkill(EndoFire);
	addSkill(FireRain);
	addSkill(Explosion);
	//addSkill(Bite);
	//addSkill(Meditate);

	addSkillBookWindow(skills);
}

var currentSave = 'save0';
function save(){
	document.getElementById('savediv').innerHTML = '';
	lskeys = [];
	lsdatalength = 0;
	lsnamelength = 0;
	saveasstring = 1;
	g.saveInCookie(currentSave);
	saveasstring = 0;
	console.log('Saved '+lskeys.length+' objects, total size of '+lsdatalength+' + '+lsnamelength);
}

function loadFromString(){
	let vars = document.getElementById('savediv').value.split('#\n');
	saveasstring = 0;
	for(let i=0;i<vars.length;i++){
		if(!vars[i])continue;
		let myvar = vars[i].split('=');
		console.log('settings '+myvar[0]);
		setCookie(myvar[0],myvar[1]);
	}
	saveasstring = 1;
}

var l;
var inAnimation = 0;
var CtrlDown = 0;
var ShiftDown = 0;
var AltDown = 0;

function init(){
	let sslot = getCookie('currentSaveSlot');
	if(sslot) currentSaveSlot = sslot;
	
	savename = getCookie('newsavename');
	if(!savename) savename = 'save'+currentSaveSlot;
	
	charname = getCookie('newcharname');
	if(!charname) charname = 'Zero';
	
	charimage = getCookie('charimage');
	if(!charimage) charimage = '1';
	
	initSkillbook();
	registerItem(HealPotion);
	//registerItem(QuiltedArmor);
	registerItem(LeatherGloves);
	registerItem(CopperRing);
	registerItem(BloodSword);
	registerItem(RoughSaphire);
	registerItem(Tooth);
	registerItem(Wing);
	registerItem(Crystaldark);
	registerItem(PaddedVest);
	registerItem(PlateVest);
	registerItem(PatchedShoes);
	registerItem(SweetDrink);
	registerItem(BloodDrink);
	

	g.init(currentSaveSlot);
	viewInit();
	
	g.addScene( new DungeonScene() );
	g._scene.addMaterial('sprite','sprite');
	g._scene.addMaterial('wall');
	g._scene.addMaterial('door');
	g._scene.addMaterial('door2','texture',true);
	g._scene.addMaterial('void','texture',true);
	g._scene.addMaterial('grid','texture',true);
	g._scene.addMaterial('ground');
	g._scene.addMaterial('ceiling');
	g._scene.addMaterial('ceilingdark');
	g._scene.addMaterial('darkstone');
	g._scene.addMaterial('brownstone');
	
	document.onkeyup = function(e) {
		//console.log('KEY UP');
		//console.log(e);
		e = e || window.event;
		//console.log(e.which || e.keyCode);
		switch(e.which || e.keyCode) {
			case 17: // Ctrl
				CtrlDown = 0;
				break;
			case 16: // Shift
				ShiftDown = 0;
				break;
			case 18: // Alt
				AltDown = 0;
				break;
				
		}
	}
	
	document.onkeydown = function(e) {
		let oldSquare,newSquare,olddir,newdir;//Used for animation;
		e = e || window.event;
		//console.log(e.which || e.keyCode);
		//console.log(e);
		//console.log('shift='+ShiftDown);
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
				console.log('pad1');
				if(partyCards[5])
					selectChar(partyCards[5]._id);
				break;
			case 98: //numpad 2
				console.log('pad2');
				if(partyCards[4])
					selectChar(partyCards[4]._id);
				break;
			case 99: //numpad 3
				console.log('pad3');
				if(partyCards[6])
					selectChar(partyCards[6]._id);
				break;
			case 100: //numpad 4
				console.log('pad4');
				if(partyCards[2])
					selectChar(partyCards[2]._id);
				break;
			case 101: //numpad 5
				console.log('pad5');
				if(partyCards[1])
					selectChar(partyCards[1]._id);
				break;
			case 102: //numpad 6
				console.log('pad6');
				if(partyCards[3])
					selectChar(partyCards[3]._id);
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
			case 107://numpad +
				if(!selectedChar)break;
				charSelectSubWindow('skills',selectedChar._id);
				break;
			case 17://Ctrl
				CtrlDown = 1;
				break;
			case 16://Shift
				ShiftDown = 1;
				break;
			case 18://Alt
				AltDown = 1;
				break;
			case 49://& 1
				if(!ShiftDown){
					target('ennemy',2);
				}else{
					target('party',2);
				}
				break;
			case 50://é 2
				if(!ShiftDown){
					target('ennemy',1);
				}else{
					target('party',1);
				}
				break;
			case 51://" 3
				if(!ShiftDown){
					target('ennemy',3);
				}else{
					target('party',3);
				}
				break;
			case 52://' 4
				if(!ShiftDown){
					target('ennemy',5);
				}else{
					target('party',5);
				}
				break;
			case 53://( 5
				if(!ShiftDown){
					target('ennemy',4);
				}else{
					target('party',4);
				}
				break;
			case 54://- 6
				if(!ShiftDown){
					target('ennemy',6);
				}else{
					target('party',6);
				}
				break;
			case 55://è 7
				if(ShiftDown){
					target('ennemy',2);
				}else{
					target('party',2);
				}
				break;
			case 56://_ 8
				if(ShiftDown){
					target('ennemy',1);
				}else{
					target('party',1);
				}
				break;
			case 57://ç 9
				if(ShiftDown){
					target('ennemy',3);
				}else{
					target('party',3);
				}
				break;
			case 48://à 0
				if(ShiftDown){
					target('ennemy',5);
				}else{
					target('party',5);
				}
				break;
			case 219://) °
				if(ShiftDown){
					target('ennemy',4);
				}else{
					target('party',4);
				}
				break;
			case 187://= +
				if(ShiftDown){
					target('ennemy',6);
				}else{
					target('party',6);
				}
				break;
				
				
			//1ere ligne de sorts
			case 65://a
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[0]);
				break;
			case 90://z
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[1]);
				break;
			case 69://e
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[2]);
				break;
			case 82://r
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[3]);
				break;
			case 84://t
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[4]);
				break;
			case 89://y
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[5]);
				break;
			case 85://u
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[6]);
				break;
			case 73://i
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[7]);
				break;
			case 79://o
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[8]);
				break;
			//Ligne 2
			case 81://q
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[9]);
				break;
			case 83://s
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[10]);
				break;
			case 68://d
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[11]);
				break;
			case 70://f
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[12]);
				break;
			case 71://g
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[13]);
				break;
			case 72://h
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[14]);
				break;
			case 74://j
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[15]);
				break;
			case 75://k
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[16]);
				break;
			case 76://l
				if(!selectedChar || !targetedChar) return;
				g.useSkill(selectedChar,selectedChar._quickSkills[17]);
				break;
			//quickslots
			
			case 87://w
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[0],targetedAlly || selectedChar);
				break;			
			case 88://x
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[1],targetedAlly || selectedChar);
				break;
			case 67://c
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[2],targetedAlly || selectedChar);
				break;
			case 86://v
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[3],targetedAlly || selectedChar);
				break;
			case 66://b
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[4],targetedAlly || selectedChar);
				break;
			case 78://n
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[5],targetedAlly || selectedChar);
				break;
			case 188://,
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[6],targetedAlly || selectedChar);
				break;
			case 190://;
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[7],targetedAlly || selectedChar);
				break;
			case 191://:
				if(!selectedChar) return;
				useItem(selectedChar._quickSlots[8],targetedAlly || selectedChar);
				break;
			
			default: return; // exit this handler for other keys
		}
	}

	showPlace();

	for(let i=0;i<g._spawnareas.length;i++){
		g._spawnareas[i]._spawning = 1;
		g._spawnareas[i].spawn();
	}

	showLateralWindow('inventoryWindow');
	
	
	let sel = '<select id="selectItemDebug">'
	for(let i=0;i<knownItems.length;i++){
		sel+= '<option value="'+knownItems[i].staticClassName()+'">'+knownItems[i].staticName()+'</option>';
	}
	sel+= '</select><input type="button" value="add item" onclick="addItemFromName(document.getElementById(\'selectItemDebug\').value)"/>';
	document.getElementById('addItemDebug').innerHTML = sel;
	
	window.onload = function() {document.getElementById("loadingScreen").style.display = "none"; };
	//setTimeout('document.getElementById("loadingScreen").style.display = "none";',2000);
}

function playerFalling(){
	/*
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
	*/
	let oldSquare =  g._currentMap.getCurrentSquare();
	let olddir =  g._currentMap.dir;
	
	g._currentMap.fall();
	
	let newSquare = g._currentMap.getCurrentSquare();
	let newdir = olddir;
	
	moveMap(g._currentMap);
	actualizeMap(g._currentMap,1);
	//g._scene.actualizePosition();
	inAnimation = true;
	g._currentMap.animationStart(oldSquare,newSquare);
	console.log('animation ?');
	g._scene.initMovement(oldSquare.getPosition(),oldSquare.getDirection(olddir),new Date().getTime(),
												newSquare.getPosition(),newSquare.getDirection(newdir),new Date().getTime()+250);
	console.log('animation !');
	return 1;
	
}

function interact(n,item = null){
	if(g._currentMap){
		g._currentMap.interact(n,item);
	}else{
		//comment relayer l'interaction avec le npc courant ?
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
		g.addPartyMember(next);
	}
}

function doAction(type,id){
	let user = null;
	if(type == 'm'){
		user = ennemies[id];
	}else if(type == 'c'){
		user = g._allcharacters[id];
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
	let a = new window['PaddedVest'](g._nextItemId++);
	g.addItem(a);
	//items[a._id] = a;
	addItemDiv(a);
	
	
	let b = new window['LeatherGloves'](g._nextItemId++);
	g.addItem(b);
	//items[b._id] = b;
	addItemDiv(b);
	
	let c = new window['CopperRing'](g._nextItemId++);
	g.addItem(c);
	//items[b._id] = b;
	addItemDiv(c);
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
	if(CtrlDown && shopmode){
		item = document.getElementById('item'+id).item;
		let target;
		if(item._character.shop){
			target = document.getElementById('inventoryWindow');
		}else{
			target = document.getElementById('shop'+shopmode);
		}
		moveItem(item,target);

	}else{
		showSelectionItem(id);
	}
}

function useItem(item = null,target = null){
	if(!selectedItem && !item || !selectedChar) return;
	if(!item){
		item = selectedItem;
	}
	if(!targetedChar && !target){
		target = selectedChar;
	}else if(!target){
		target = targetedChar;
	}
	if(item.use(selectedChar,target)){
		removeItem(item);
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

function resurrectMember(price = 0){
	if(!targetedChar && !selectedChar || targetedChar.isMonster )return;
	let target;
	if(!targetedChar){
		target = selectedChar;
	}
	else{
		target = targetedChar;
	}
	
	if(target.dead && g.gold >= price){
		g.gold-= price;
		showGold();
		target.resurrect();
		target.showProperties();
	}
}


