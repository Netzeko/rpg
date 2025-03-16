class Creature{
	constructor(name,id,game) {
		this.level = 1;
		this._id = id;
		this._game = game;
		this.name = name;
		//Attributes
		// https://en.wikipedia.org/wiki/Attribute_(role-playing_games)
		this.strength = 8;
		this.constitution = 8;
		this.dexterity = 8;
		this.perception = 8;
		this.spirit = 8;
		this.wisdom = 8;
		this.luck = 8;
		this.speed = 8;
		
		this.weaponAttack = 5;
		this.magicAttack = 5;
		this.armor = 0;
		//Dégâts magiques * 1/(1+resist/50)
		this.resistfire = 0;
		this.resistthunder = 0;
		this.resistice = 0;
		this.resistwater = 0;
		this.resistwind = 0;
		this.resistearth = 0;
		this.resistlight = 0;
		this.resistdarkness = 0;
		this.resistlife = 0;
		//En %
		this.boostfire = 0;
		this.boostthunder = 0;
		this.boostice = 0;
		this.boostwater = 0;
		this.boostwind = 0;
		this.boostearth = 0;
		this.boostlight = 0;
		this.boostdarkness = 0;
		this.boostlife = 0;
		
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
		
		this.modifier_resistfire = 0;
		this.modifier_resistthunder = 0;
		this.modifier_resistice = 0;
		this.modifier_resistwater = 0;
		this.modifier_resistwater = 0;
		this.modifier_resistwind = 0;
		this.modifier_resistearth = 0;
		this.modifier_resistlight = 0;
		this.modifier_resistdarkness = 0;
		this.modifier_resistlife = 0;
		
		
		this._tmp_modifier_strength = 0;
		this._tmp_modifier_constitution = 0;//Unused
		this._tmp_modifier_dexterity = 0;
		this._tmp_modifier_perception = 0;
		this._tmp_modifier_spirit = 0;
		this._tmp_modifier_wisdom = 0;//Unused
		this._tmp_modifier_luck = 0;
		this._tmp_modifier_speed = 0;
		this._tmp_modifier_maxhealth = 0;
		this._tmp_modifier_maxendurance = 0;
		this._tmp_modifier_maxmana = 0;
		this._tmp_modifier_maxmind = 0;
		
		this._tmp_modifier_attack = 0;
		this._tmp_modifier_defense = 0;
		this._tmp_modifier_precision = 0;
		this._tmp_modifier_dodge = 0;
		this._tmp_modifier_magicpower = 0;
		
		this._tmp_modifier_resistfire = 0;
		this._tmp_modifier_resistthunder = 0;
		this._tmp_modifier_resistice = 0;
		this._tmp_modifier_resistwater = 0;
		this._tmp_modifier_resistwater = 0;
		this._tmp_modifier_resistwind = 0;
		this._tmp_modifier_resistearth = 0;
		this._tmp_modifier_resistlight = 0;
		this._tmp_modifier_resistdarkness = 0;
		this._tmp_modifier_resistlife = 0;
		
		this.bonushuman = 0;
		this.bonusinsect = 0;
		this.bonusdemon = 0;
		this.bonusether = 0;
		this.bonusbeast = 0;
		this.bonusmaterial = 0;
		
		this.calculateStats(true);
		//this.initEvents();

	}
	
	calculateStats(refresh = false){
		this.maxhealth = 10+this.level+(this.constitution+this.modifier_constitution)*8 + this.modifier_maxhealth + this._tmp_modifier_maxhealth;
		this.maxendurance = 10+this.level+(this.strength+this.modifier_strength)*8 + this.modifier_maxendurance + this._tmp_modifier_maxendurance;
		this.maxmana = 10+this.level+(this.wisdom+this.modifier_wisdom)*8 + this.modifier_maxmana + this._tmp_modifier_maxmana;
		this.maxmind = 10+this.level+(this.spirit+this.modifier_spirit)*8 + this.modifier_maxmind + this._tmp_modifier_maxmind;
		
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
		
		this.attack = Math.floor( ((2+this.strength+this.modifier_strength+this._tmp_modifier_strength) / 10)*this.weaponAttack ) + this._tmp_modifier_attack;
		this.magicpower = Math.floor( ((2+this.spirit+this.modifier_spirit+this._tmp_modifier_spirit) / 10)*this.magicAttack ) + this._tmp_modifier_magicpower;
		this.defense = this.armor + this._tmp_modifier_defense;
		this.precision = 10+(this.dexterity+this.modifier_dexterity+this._tmp_modifier_dexterity)*5 + this._tmp_modifier_precision;
		this.dodge = 10+(this.perception+this.modifier_perception+this._tmp_modifier_perception)*5 + this._tmp_modifier_dodge;
		this.timeAttack = Math.floor(1000 * (100.0 / (15+this.speed+this.modifier_speed+this._tmp_modifier_speed)));
		
		{
			if(this.resistfire    +this.modifier_resistfire    +this._tmp_modifier_resistfire    < 0){
				this._resfire = this.resistfire    +this.modifier_resistfire    +this._tmp_modifier_resistfire;
			}else{
				this._resfire     = 100 - 100/(1+(this.resistfire    +this.modifier_resistfire    +this._tmp_modifier_resistfire    )/50);
			}
			
			if(this.resistthunder +this.modifier_resistthunder +this._tmp_modifier_resistthunder < 0){
				this._resthunder = this.resistthunder +this.modifier_resistthunder +this._tmp_modifier_resistthunder;
			}else{
				this._resthunder  = 100 - 100/(1+(this.resistthunder +this.modifier_resistthunder +this._tmp_modifier_resistthunder )/50);
			}
			
			if(this.resistice     +this.modifier_resistice     +this._tmp_modifier_resistice     ){
				this._resice = this.resistice     +this.modifier_resistice     +this._tmp_modifier_resistice;
			}else{
				this._resice      = 100 - 100/(1+(this.resistice     +this.modifier_resistice     +this._tmp_modifier_resistice     )/50);
			}
			
			if(this.resistwater   +this.modifier_resistwater   +this._tmp_modifier_resistwater   < 0){
				this._reswater = this.resistwater   +this.modifier_resistwater   +this._tmp_modifier_resistwater;
			}else{
				this._reswater    = 100 - 100/(1+(this.resistwater   +this.modifier_resistwater   +this._tmp_modifier_resistwater   )/50);
			}
			
			if(this.resistwind    +this.modifier_resistwind    +this._tmp_modifier_resistwind    < 0){
				this._reswind = this.resistwind    +this.modifier_resistwind    +this._tmp_modifier_resistwind;
			}else{
				this._reswind     = 100 - 100/(1+(this.resistwind    +this.modifier_resistwind    +this._tmp_modifier_resistwind    )/50);
			}
			
			if(this.resistearth   +this.modifier_resistearth   +this._tmp_modifier_resistearth   < 0){
				this._researth = this.resistearth   +this.modifier_resistearth   +this._tmp_modifier_resistearth;
			}else{
				this._researth    = 100 - 100/(1+(this.resistearth   +this.modifier_resistearth   +this._tmp_modifier_resistearth   )/50);
			}
			
			if(this.resistlight   +this.modifier_resistlight   +this._tmp_modifier_resistlight   < 0){
				this._reslight = this.resistlight   +this.modifier_resistlight   +this._tmp_modifier_resistlight;
			}else{
				this._reslight    = 100 - 100/(1+(this.resistlight   +this.modifier_resistlight   +this._tmp_modifier_resistlight   )/50);
			}
			
			if(this.resistdarkness+this.modifier_resistdarkness+this._tmp_modifier_resistdarkness< 0){
				this._resdarkness = this.resistdarkness+this.modifier_resistdarkness+this._tmp_modifier_resistdarkness;
			}else{
				this._resdarkness = 100 - 100/(1+(this.resistdarkness+this.modifier_resistdarkness+this._tmp_modifier_resistdarkness)/50);
			}
			
			if(this.resistlife    +this.modifier_resistlife    +this._tmp_modifier_resistlife    < 0){
				this._reslife = this.resistlife    +this.modifier_resistlife    +this._tmp_modifier_resistlife;
			}else{
				this._reslife     = 100 - 100/(1+(this.resistlife    +this.modifier_resistlife    +this._tmp_modifier_resistlife    )/50);
			}
		}
		
		this.showProperties();
	}
	
	throwcrit(){
		let couragemod = 1;
		if(this.moral != undefined ){
			if(this.moral <=0 ) couragemod += 0.1*(Math.max(-this.moral,5) );
			else if(this.moral >=4 ) couragemod -= 0.1*(this.moral-4);
		}
		let threshold = 30 * ( (this.luck+this.modifier_luck+this._tmp_modifier_luck)/10) * couragemod;
		return rand(1,1000) < threshold;
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
	/*
	initEvents(){
		this._onKill = [];//Lorsque la creature tue quelqu'un
		this._onStrike = [];//Lorsque la creature touche quelqu'un
	}
	*/
	
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
		if(this.dead) return 0;
		this.dead = 1;
		if(attacker){
			attacker.triggerEvents('evonkill',[attacker,this]);
		}
		this.triggerEvents('evdeath',[attacker,this]);
		return 1;
	}
	
	
	modStat(stat,value,attacker = null){
		let stats = ['health','endurance','mana','mind'];
		if(stats.indexOf(stat) != -1){
			this[stat] += value;
			if(this[stat] > this['max'+stat]){
				this[stat] = this['max'+stat];
			}
			if(this[stat] <= 0){
				this[stat] = 0;
				if(stat == 'health'){
					this.computeDeath(attacker);
				}
			}
			
			this.showProperty(stat);
			showBars(this);
			return 1;

		}
		return -1;
	}
	
	
}