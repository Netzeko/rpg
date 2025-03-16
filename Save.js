class Save{
	constructor(savename) {
		this._nextCharId = 1;
		this._partyMembers = [null];
		this.listPartyMembers = 'zero,'
		this.savename = savename;
		this.gold = 0;
		this._numberMember = 0;
		this.itemList = '';
		this._items = [];
	}
	
	
	loadFromCookie(){
		console.log('Loading from cookie...');
		var data = getCookie('save'+this.savename);
		if(data.length == 0){
			console.log('...no data');
			
		}else{
			var dataArray = data.split('/');
			console.log('loading '+this.savename+', '+dataArray.length+' properties');
			for(var i = 0;i<dataArray.length;i++){
				var variable = dataArray[i].split(':');
				if(variable[0].length ==0) continue;
				
				//console.log('prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
				if(variable[2].localeCompare('number') == 0){
					this[variable[0]] = Number(variable[1]);
				}else if(variable[2].localeCompare('string') == 0){
					this[variable[0]] = variable[1];
				}
			}
		}
		console.log('Loading party...');
		var listNames = this.listPartyMembers.split(',');
		var slot = 1;
		for(var i = 0;i<listNames.length;i++){
			if(listNames[i].length <= 0) continue;
			var c = new Character(listNames[i],this._nextCharId ++);
			this._partyMembers[this._partyMembers.length] = c;
			this._numberMember++;
			c.loadFromCookie(this.savename);
			addCharacter(c,slot++);
		}
		
		console.log('Loading items...');
		var listItems = this.itemList.split(',');
		for(var i = 0;i<listItems.length;i++){
			if(listItems[i].length <= 0) continue;
			var itemSave = listItems[i].split('_');
			var item = new window[itemSave[0]](idnextitem++);
			item._character = this;
			this._items[item._id] = item;
			
			item.loadFromCookie(this.savename,itemSave[1]);
			addItem(item);
		}
		console.log('Loading done');

	}
	
	//temporaire, le temps de mettre en place un input text
	getMemberName(slot){
		var arr = ['Zero','Kenshi','Leeroy','Rambo','Elminster','Alphonse','Tony'];
		return arr[slot];
	}

	addPartyMember(slot){
		
		var c = new Character(this._getMemberName(slot),this._nextCharId ++);
		this._partyMembers[this._partyMembers.length] = c;
		this._numberMember++;
		addCharacter(c,slot);
		this.listPartyMembers += ''+c.name+',';
		c.doAction();
	}
	
	saveInCookie(){
		console.log('saving '+this.savename);
		
		//On commence par les objets pour générer la liste des cookies à charger
		console.log('saving items...');
		console.log(this._items);
		this.itemList = '';
		for(var i = 0;i<this._items.length;i++){
			console.log('index'+i);
			if( !this._items[i]) continue;
			this.itemList += this._items[i].getClassName()+'_'+this._items[i]._id+',';
			this._items[i].saveInCookie(this.savename);
		}
		
		
		var keys = Object.keys(this);
		var savetext = '';
		for(var i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+this.savename,savetext);
		
		for(var i = 1;i<this._partyMembers.length;i++){
			if( !this._partyMembers[i]) continue;
			this._partyMembers[i].saveInCookie(this.savename);
		}
		
		
	}
	
	/*Retourne -1 si impossible, 0 si manqué, 1 si touché, 2 si mort*/
	computeAttack(attacker,defenser){
		if(attacker == null || defenser == null){
			return -1;
		}
		if(attacker.health > 0 && defenser.health > 0){
			var damages = Math.max(attacker.attack - defenser.defense,0);
			var hit = (attacker.precision / defenser.dodge) *0.4;
			
			var res = 1.0-Math.random();
			if(res > hit){
				console.log('miss!');
				return 0;
			}

			console.log(defenser.name+' hit! ('+damages+' damages)');
			defenser.modStat('health',- damages);

			showBars(defenser);
			//defenser.showProperty('health');
			
			if(defenser.health <= 0){
				console.log('dead');
				defenser.computeDeath(attacker);
			}
			if(attacker.health <= 0){
				console.log('dead');
				attacker.computeDeath(attacker);
			}
			return 1;
			
		}
		return -1;
	}
	
	useSkill(attacker,defenser,skillname){
		if(!defenser || !attacker) return;

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
	
	init(){
		console.log('Initialize');
		this.loadFromCookie();
		this.startAutoAttack();
		setTimeout("regenerate()",1000);

		console.log('End initialize');
	}
	
	startAutoAttack(){
		for(var i=1;i<this._partyMembers.length;i++){
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
		//a completer pour save
	}
	
	getMember(id){
		for(var i = 0;i<this._partyMembers.length;i++){
			if( !this._partyMembers[i]) continue;
			if( this._partyMembers[i]._id == id){
				return this._partyMembers[i];
			}
		}
		return null;
	}

	getPartyLevel(countDead){
		let c = 0;
		for(var i = 0;i<this._partyMembers.length;i++){
			//console.log(i);
			if(this._partyMembers[i] && (!this._partyMembers[i].dead || countDead)){
				c+= this._partyMembers[i].level;
			}
		}
		return c;
	}
	
	giveExpToAll(xp,countDead = 0){
			console.log('give '+xp);
		for(var i = 0;i<this._partyMembers.length;i++){
			if(this._partyMembers[i] && (!this._partyMembers[i].dead || countDead)){
				this._partyMembers[i].exp += xp;
				this._partyMembers[i].totalexp += xp;
				this._partyMembers[i].levelUp();
				this._partyMembers[i].showProperty('exp');
			}
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
