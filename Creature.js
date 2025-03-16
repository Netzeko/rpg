class Creature{
	constructor(name,id,game) {
		this.level = 1;
		this._id = id;
		this._game = game;
		this.name = name;
		//Attributes
		// https://en.wikipedia.org/wiki/Attribute_(role-playing_games)
		this.strength = 10;
		this.constitution = 10;
		this.dexterity = 10;
		this.perception = 10;
		this.spirit = 10;
		this.wisdom = 10;
		this.luck = 10;
		this.speed = 10;
		
		this.weaponAttack = 5;
		this.armor = 0;
		
		this.modifier_strength = 0;
		this.modifier_constitution = 0;
		this.modifier_dexterity = 0;
		this.modifier_perception = 0;
		this.modifier_spirit = 0;
		this.modifier_wisdom = 0;
		this.modifier_luck = 0;
		this.modifier_speed = 0;
		this.modifier_maxhealth = 0;
		this.modifier_maxendurance = 0;
		this.modifier_maxmana = 0;
		this.modifier_maxmind = 0;
		
		
		this.calculateStats(true);
		this.initEvents();

	}
	
	calculateStats(refresh = false){
		this.maxhealth = 10+this.level+(this.constitution+this.modifier_constitution)*8 + this.modifier_maxhealth;
		this.maxendurance = 10+this.level+(this.strength+this.modifier_strength)*8 + this.modifier_maxendurance;
		this.maxmana = 10+this.level+(this.wisdom+this.modifier_wisdom)*8 + this.modifier_maxmana;
		this.maxmind = 10+this.level+(this.spirit+this.modifier_spirit)*8 + this.modifier_maxmind;
		
		if(refresh){
			this.health = this.maxhealth;
			this.endurance = this.maxendurance;
			this.mana = this.maxmana;
			this.mind = this.maxmind;
		}else{
			if(this.health > this.maxhealth) this.health = this.maxhealth;
			if(this.endurance > this.maxendurance) this.endurance = this.maxendurance;
			if(this.mana > this.maxmana) this.mana = this.maxmana;
			if(this.mind > this.maxmind) this.mind = this.maxmind;
		}
		
		this.attack = Math.floor( ((2+this.strength+this.modifier_strength) / 5)*this.weaponAttack );//changer par l'attaque de l'arme
		this.defense = this.armor;//changer par l'armure
		this.precision = 10+(this.dexterity+this.modifier_dexterity)*5;
		this.dodge = 10+(this.perception+this.modifier_perception)*5;
		this.timeAttack = Math.floor(1000 * (100.0 / (15+this.speed+this.modifier_speed)));
	}
	
	getAttribute(i){
		switch(i){
			case 0:
			 return 'strength';
		 case 1:
			 return 'constitution';
		 case 2:
			 return 'dexterity';
		 case 3:
			 return 'perception';
		 case 4:
			 return 'spirit';
		 case 5:
			 return 'wisdom';
		 case 6:
			 return 'luck';
		 case 7:
			 return 'speed';
		}
		return '';
	}

	//Crée les attributs pour les evenements, a modifier pour ajouter de nouveaux evenements
	initEvents(){
		this._onKill = [];//Lorsque la creature tue quelqu'un
	}
	
	triggerEvents(eventName,params){
		if(!this['_'+eventName]) return 0;
		for(let i = 0; i < this['_'+eventName].length;i++){
			let ev = this['_'+eventName][i];
			ev.src[ev.f](params);
		}
	}
	
	addEvent(eventName,src,f){
		
		if(!this['_'+eventName] ){
			this['_'+eventName] = [];
		}
		let arr = [];
		arr.src = src;
		arr.f = f;
		this['_'+eventName].push(arr);
	}
	
	removeEvent(eventName,src,f){
		if(!this['_'+eventName] ){
			return;
		}
		for(let i = 0; i < this['_'+eventName].length;i++){
			let ev = this['_'+eventName][i];
			if(ev.src == src && ev.f == f){
				this['_'+eventName].splice(i,1);
			}
		}
		
	}
	
	computeDeath(attacker){
		this.dead = 1;
		attacker.triggerEvents('evonkill',[attacker,this]);
		this.triggerEvents('evdeath',[attacker,this]);
	}
}