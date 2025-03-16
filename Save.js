class Save{
	constructor(savename) {
		this._nextCharId = 1;
		this._partyMembers = [null];
		this.listPartyMembers = 'zero,'
		this.savename = savename;
		this.gold = 0;
		this._numberMember = 0;
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
		console.log('Loading done');

	}
	
	//temporaire, le temps de mettre en place un input text
	_getMemberName(slot){
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
			var damages = attacker.attack - defenser.defense;
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
		console.log('End initialize');
	}
	
	startAutoAttack(){
		for(var i=1;i<this._partyMembers.length;i++){
			if(this._partyMembers[i]){
				this._partyMembers[i].doAction();
			}
		}
	}
}

