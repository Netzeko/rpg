class Game{
	constructor(savename,saveslot = 1) {
		this._partyMembers = [null];
		this.savename = savename;
		this.gold = 0;
		this._numberMember = 0;
		this.itemList = '';
		this.isgame = 1;
		this._items = [];
		this._levels = [];
		this._allcharacters = [];//Contient tout les personnages, dans le groupe ou non, indexés par id
		this._scene = null;
		this._inBattle = 0;
		this._nextLevelId = 1;
		this._nextMonsterId = 1;
		this._nextCharId = 1;
		this._nextItemId = 1;
		this._nexteotId = 1;
		this._village = null;
		this._nextEntityId = 1;
		this._spawnareas = [];
		this.autoregen = 1;
		this.invisible = 0;
		this.saveslot = 1;
		this.timespent = 0;
		this._starttime  = new Date().getTime();
		this._oldtime = 0;
		this._priotargetcond = [
			['',''],
			['1m','At least 1 ennemy'],
			['am','All ennemies'],
			['tm','Targeted ennemy'],
			['1a','At least 1 ally'],
			['aa','All allies'],
			['ta','Targeted ally'],
			['s','Self']
		];

		this._cond = [
			['',''],
			['hp','Health >= '],
			['hm','Health <= '],
			['ep','Mana >='],
			['em','Mana <= '],
			['sp','Endurance >= '],
			['sm','Endurance <= '],
			['mp','Mind >= '],
			['mm','Mind <= '],
			['d','Dead'],
			['t','Always true'],
		];
		
		this._condtreshold = [
			['',''],
			['00','0%'],
			['20','20%'],
			['40','40%'],
			['60','60%'],
			['80','80%'],
			['100','100%']
		];
		
		this._targetprio = [
			['',''],
			['s','Self'],
			['ct','Condition target'],
			['rm','Random ennemy'],
			['ra','Random ally'],
			['tm','Targeted ennemy'],
			['ta','Targeted ally']
		];
	}
	
	
	addScene(ds){
		this._scene = ds;
	}
	
	newSave(){
		let l = new Underground('underground',this,this._nextLevelId++);
		this._levels.push(l);
		this._levels[l.name] = l;
		l.initMap();
		
		let l2 = new Sewers('sewers',this,this._nextLevelId++);
		this._levels.push(l2);
		this._levels[l2.name] = l2;
		l2.initMap();
		
		this._currentMap = null;
		this._village = new Village();
		
		this._village.addAccess(l,1,2,1,'right','gounderground');
		
		let bsmith = new Merchant('blacksmith',this._village);
		bsmith.addCash(700);
		bsmith.addAvailableItems(['PaddedVest','PlateVest','LeatherGloves','PatchedShoes']);
		this._village.addHouse(bsmith,'blacksmith','Blacksmith');
		
		let alche = new Merchant('alchemist',this._village);
		alche.addCash(300);
		alche.addAvailableItems(['HealPotion','SweetDrink']);
		this._village.addHouse(alche,'alchemist','Alchemist');
		
		let church = new Church('church',this._village);
		this._village.addHouse(church,'church','Church');
		
		let inn = new Inn('inn',this._village);
		let newc;
		if(window.charimage != 1){
			newc = new Character('Conrad',this._nextCharId++,this);
			this._allcharacters[newc._id] = newc;
			newc.initChar();
			newc.sprite = 1;
			inn.addAvailableCharacter(newc );
		}
		if(window.charimage != 2){
			newc = new Character('Betty',this._nextCharId++,this);
			this._allcharacters[newc._id] = newc;
			newc.initChar();
			newc.sprite = 2;
			inn.addAvailableCharacter(newc );
		}
		if(window.charimage != 3){
			newc = new Character('Katherine',this._nextCharId++,this);
			this._allcharacters[newc._id] = newc;
			newc.initChar();
			newc.sprite = 3;
			inn.addAvailableCharacter(newc );
		}
		if(window.charimage != 4){
			newc = new Character('Thordan',this._nextCharId++,this);
			this._allcharacters[newc._id] = newc;
			newc.initChar();
			newc.sprite = 4;
			inn.addAvailableCharacter(newc );
		}
		
		this._village.addHouse(inn,'inn','Inn');
		
		this._village.createMenu('villageWindow');
		
		let slot = 1;
		let c = new Character(window.charname,this._nextCharId ++);
		this._allcharacters[c._id] = c;

		c.initChar();
		c.mainchar = 1;
		c.sprite = window.charimage;
		c.inTeam = 2;//main character
		c.slot = slot;
		this.listPartyMembers = c.name+',';
		this._partyMembers[this._partyMembers.length] = c;
		this._numberMember++;
		addCharacter(c,slot++);
		
		this.savename = window.savename;
		this.gold = 2000;
	}
	
	addGold(amount){
		this.gold += Number(amount);
		showGold();
	}
	
	loadFromCookie(){
		console.log('Loading from cookie...');
		let data = getCookie('save'+this.saveslot);
		if(!data || data.length == 0){
			console.log('...no data');
			this.newSave();
			return;
		}else{
			let dataArray = data.split('/');
			console.log('loading '+this.saveslot+', '+dataArray.length+' properties');
			for(let i = 0;i<dataArray.length;i++){
				let variable = dataArray[i].split(':');
				if(variable[0].length ==0) continue;
				
				//console.log('prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
				if(variable[2] == 'number' || variable[2] == 'n'){
					this[variable[0]] = Number(variable[1]);
				}else if(variable[2] == 'string' || variable[2] == 's'){
					this[variable[0]] = variable[1];
					
					//Chargement des maps
					if(variable[0].startsWith('levelmap')){
						//Format 'levelmapnomdelamap:ClasseDeLaMap'
						console.log('loading map '+variable[1]);
						let l = new window[variable[1]](variable[0].substr(8),this,this._nextLevelId++);
						this._levels.push(l);
						this._levels[l.name] = l;
						l.loadFromCookie(this.saveslot);
					}
				}
			}
		}
		console.log('Loading party...');
		let listNames = this.listPartyMembers.split(',');
		let slot = 1;
		for(let i = 0;i<listNames.length;i++){
			if(listNames[i].length <= 0) continue;
			let c = new Character(listNames[i],this._nextCharId++,this);
			this._allcharacters[c._id] = c;
			this._partyMembers[this._partyMembers.length] = c;
			this._numberMember++;
			c.loadFromCookie(this.saveslot);
			addCharacter(c,slot++);
		}
		
		console.log('Loading items...');
		let listItems = this.itemList.split(',');
		for(let i = 0;i<listItems.length;i++){
			if(listItems[i].length <= 0) continue;
			let itemSave = listItems[i].split('_');
			let item = new window[itemSave[0]](this._nextItemId++);
			item._character = this;
			this._items[item._id] = item;
			
			item.loadFromCookie(this.saveslot,itemSave[1]);
			addItem(item);
		}
		
		if(this.currentMap){
			console.log('current map='+this.currentMap);
			console.log(this._levels);
			this._currentMap = this._levels[this.currentMap];
			delete this.currentMap;
			showMap(this._currentMap);

		}else{
			console.log('no current map found');
			this._currentMap = null;
		}
		
		
		console.log('Loading village...');
		this._village = new Village(this);
		this._village.loadFromCookie(this.saveslot);
		this._village.createMenu('villageWindow');
		
		this._oldtime = this.spenttime;
		console.log('Loading done');

	}
	
	/*
	let next = nextFreeCard(partyCards);
	if(next){
		g.addPartyMember(next);
	}
	*/
	
	hire(cid){
		let next = nextFreeCard(partyCards);
		let c = this._allcharacters[cid];
		if(next && this.gold >= c._price ){
			this.gold -= c._price;
			
			if(c.inTeam) return;
			this._partyMembers[next] = c;
			this._numberMember++;
			addCharacter(c,next);
			showGold();
			c.inTeam = 1;
			c.slot = next;
			setTimeout('doAction("c",'+c._id+')',c.timeAttack);

			window.inn[c.inn].hired(c);
		}
	}
	
	dismiss(cid){
		let c = this._allcharacters[cid];
		if(c.inTeam && c.inTeam != 2){
			delete this._partyMembers[c.slot];
			this._numberMember--;
			removeCharacter(c);
			showGold();
			c.inTeam = 0;
			window.inn[c.inn].dismissed(c);
		}
	}
	
	addPartyMember(slot){
		
		let c = new Character(this.getMemberName(slot),this._nextCharId ++);
		this._allcharacters[c._id] = newc;
		c.initChar();
		this._partyMembers[this._partyMembers.length] = c;
		this._numberMember++;
		addCharacter(c,slot);
		this.listPartyMembers += ''+c.name+',';
		c.doAction();
	}
	
	saveInCookie(){
		console.log('saving '+this.saveslot);
		this.spenttime = this._oldtime + (new Date().getTime() - this._starttime)/1000;
		
		this.listPartyMembers = '';
		for(let i=1;i<this._partyMembers.length;i++){
			if(!this._partyMembers[i]) continue;
			this.listPartyMembers += this._partyMembers[i].name+',';
		}
		
		//On commence par les objets pour générer la liste des cookies à charger
		console.log('saving items...');
		console.log(this._items);
		this.itemList = '';
		for(let i = 0;i<this._items.length;i++){
			if( !this._items[i]) continue;
			this.itemList += this._items[i].getClassName()+'_'+this._items[i]._id+',';
			this._items[i].saveInCookie(this.saveslot);
		}
		
		//Sauvegarde des maps
		for(let i = 0;i<this._levels.length;i++){
			if(!this._levels[i]) continue;
			//Format 'ClasseDeLaMap_nom de la map'
			this._levels[i].saveInCookie(this.saveslot);
			this['levelmap'+this._levels[i].name] = this._levels[i].getClassName();
		}
		if(this._currentMap){
			this.currentMap = this._currentMap.name;
		}else{
			this.currentMap = '';
		}
		
		let keys = Object.keys(this);
		let savetext = '';
		for(let i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+this.saveslot,savetext);
		
		for(let i = 1;i<this._partyMembers.length;i++){
			if( !this._partyMembers[i]) continue;
			this._partyMembers[i].saveInCookie(this.saveslot);
		}
		
		this._village.saveInCookie(this.saveslot);

		//Save pour l'accueil
		savetext = 'savename:'+this.savename+':s/'+'time:'+this.spenttime+':n/'+'level:'+this._partyMembers[1].level+':n/'+'sprite:'+this._partyMembers[1].sprite+':n/'+'name:'+this._partyMembers[1].name+':s/';
		setCookie('slot'+this.saveslot,savetext);
	}
	
	/*Retourne -1 si impossible, 0 si manqué, 1 si touché, 2 si mort*/
	/*
	computeAttack(attacker,defenser){
		if(attacker == null || defenser == null){
			return -1;
		}
		if(attacker.health > 0 && defenser.health > 0){
			attacker.triggerEvents('evattack',[attacker,defenser]);
			defenser.triggerEvents('evattacked',[attacker,defenser]);
			console.log(attacker.name+' attack '+defenser.name+' ('+attacker.precision+'/'+defenser.dodge+')');
			//var damages = Math.max(attacker.attack - defenser.defense,0);
			let damages = Math.floor( (10 * attacker.attack) / (10 + defenser.defense));
			let hit = (attacker.precision / defenser.dodge) *0.4;
			
			let res = 1.0-Math.random();
			if(res > hit){
				//console.log('miss!');
				defenser.triggerEvents('evmissed',[attacker,defenser]);
				return 0;
			}
			defenser.triggerEvents('evhit',[attacker,defenser]);
			console.log('>Deal '+damages+' damages ('+attacker.attack+' ATT - '+defenser.defense+' DEF)');
			defenser.modStat('health',- damages,attacker);
			if(damages){
				defenser.triggerEvents('evhurt',[attacker,defenser]);
			}

			showBars(defenser);

			if(attacker.health <= 0){
				//console.log('dead');
				attacker.computeDeath(attacker);
			}
			return 1;
			
		}
		return -1;
	}
	*/
	
	useSkill(attacker,skillname,defenser = null){
		if(!attacker || !skillname || !attacker._skills[skillname]) return;
		if(!defenser){
			if(attacker._skills[skillname].offensive()){
				defenser = targetedFoe;
			}else{
				defenser = targetedAlly;
				if(!defenser) defenser = selectedChar;
			}
		}
		if(!defenser) return;
		if(attacker._skills[skillname].use(attacker,defenser)){
			console.log(skillname+' used');
			if(defenser.health <= 0){
				defenser.computeDeath(attacker);
			}
			if(attacker.health <= 0){
				attacker.computeDeath(attacker);
			}
		}else{
				console.log('unable to use '+skillname+'');
		}
	}
	
	init(saveslot){
		console.log('Initialize');
		this.saveslot = saveslot;
		this.loadFromCookie();
		this.startAutoAttack();
		setTimeout("g.regenerate()",1000);
		showGold();
		this._village.refillShops();
		console.log('End initialize');
	}
	
	regenerate(){
		if(this.autoregen){
			for(let i =1;i<this._partyMembers.length;i++){
				if(this._partyMembers[i]){
					this._partyMembers[i].regenerate();
				}
			}
		}
		setTimeout("g.regenerate()",1000);
	}
	
	startAutoAttack(){
		for(let i=1;i<this._partyMembers.length;i++){
			if(this._partyMembers[i]){
				this._partyMembers[i].doAction();
			}
		}
	}
	
	addItem(item){
		item._character = this;
		this._items[item._id] = item;
		//a completer pour save
	}
	
	removeItem(item){
		this._items[item._id] = null;
		return 1;
	}
	
	getMember(id){
		for(let i = 0;i<this._partyMembers.length;i++){
			if( !this._partyMembers[i]) continue;
			if( this._partyMembers[i]._id == id){
				return this._partyMembers[i];
			}
		}
		return null;
	}

	getPartyLevel(countDead){
		let c = 0;
		for(let i = 0;i<this._partyMembers.length;i++){
			//console.log(i);
			if(this._partyMembers[i] && (!this._partyMembers[i].dead || countDead)){
				c+= this._partyMembers[i].level;
			}
		}
		return c;
	}
	
	giveExpToAll(xp,countDead = 0){
			console.log('give '+xp);
		for(let i = 0;i<this._partyMembers.length;i++){
			if(this._partyMembers[i] && (!this._partyMembers[i].dead || countDead)){
				this._partyMembers[i].exp += xp;
				this._partyMembers[i].totalexp += xp;
				this._partyMembers[i].levelUp();
				this._partyMembers[i].showProperty('exp');
			}
		}
	}

	travel(levelname,x,y,z,dir){
		//console.log('Travelling...');
		let reload = 0,actualize = 0;
		if(levelname){
			if(!this._currentMap){
				this._village.disposeItemsShops();
				save();
			}
			if(!this._currentMap || levelname != this._currentMap.name){
				console.log('travelling to '+levelname+' '+x+' '+y+' '+z+' '+dir);
				this._currentMap = this._levels[levelname];
				reload = 1;
			}else{
				actualize = 1;
			}
			this._currentMap.setPosition(Number(x),Number(y),Number(z));
			this._currentMap.dir = dir;
			this.autoregen = 0;
			if(actualize){
				this._scene.actualizePosition();
			}
		}else{
			this._village.refillShops();
			reload = 1;
			this.autoregen = 1;
			this._currentMap = null
			
		}
		showMap(this._currentMap);
		actualizeMap(this._currentMap);
		if(reload){
			showPlace();
		}
	}
}

/*
//o objet appelant
function saveArray(o,propName,arrayName,savename){
	console.log('saving '+propName+'...');
	o[propName] = '';
	for(let i=0;i<o.[arrayName].length;i++){
		if( !o.[arrayName][i]) continue;
		console.log('index'+i);
		o[propName] += o.[arrayName][i].getClassName()+'_'+this._quickSlots[i]._id+',';			
		this._quickSlots[i].saveInCookie(savename);
		
	}
}
*/
