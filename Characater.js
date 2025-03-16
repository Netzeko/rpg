class Character{
	constructor(id) {
		this.level = 1;
		this.gold = 0;
		this.id = id;
		
		//Attributes
		// https://en.wikipedia.org/wiki/Attribute_(role-playing_games)
		this.strength = 5;
		this.constitution = 5;
		this.dexterity = 5;
		this.perception = 5;
		this.spirit = 5;
		this.wisdom = 5;
		this.luck = 5;
		this.speed = 5;
		
		this.calculateStats();
		
		this.exp = 0;
		this.totalexp = 0;
		this.points = 0;
		this.playername = 'Zero';
		this.dead = 0;
		this.regeneration = 1;

	}
	
	calculateStats(refresh = false){
		this.maxhealth = 10+this.level+this.constitution*8;
		this.maxendurance = 10+this.level+this.strength*8;
		this.maxmana = 10+this.level+this.wisdom*8;
		this.maxmind = 10+this.level+this.spirit*8;
		
		if(refresh){
			this.health = this.maxhealth;
			this.endurance = this.maxendurance;
			this.mana = this.maxmana;
			this.mind = this.maxmind;
		}
		
		this.attack = (this.strength / 5)*10;//changer par l'attaque de l'arme
		this.defense = 5;//changer par l'armure
		this.precision = 10+this.dexterity*5;
		this.dodge = 10+this.perception*5;
		this.timeAttack = Math.floor(1000 * (50.0 / (10+this.speed)));
	}
	
	loadFromCookie(charname = 'zero'){
		var data = getCookie('save'+charname);
		if(data.length == 0){
			return false;
		}
		var dataArray = data.split('/');
		console.log('loading '+charname+', '+dataArray.length+' properties');
		for(var i = 0;i<dataArray.length;i++){
			
			var variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			
			console.log('prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2].localeCompare('number') == 0){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2].localeCompare('string') == 0){
				this[variable[0]] = variable[1];
			}
			//console.log('saved as '+typeof this[variable[0]]);
			
		}

	}
	
	saveInCookie(charname = ''){
		console.log('saving '+charname);
		var keys = Object.keys(this);
		var savetext = '';
		for(var i = 0;i<keys.length;i++){
			//console.log('prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+charname,savetext);
	}
	
	showProperty(prop){			
		var htmlout = document.getElementById(prop+this.id);
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	showProperties(){
		var keys = Object.keys(this);
		for(var i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
	}
	
	regenerate(){
		if( this.regeneration){
			
		
			if(this.health < this.maxhealth ){
				this.health += Math.floor(1+this.constitution/10);
				if(this.health > this.maxhealth){
					this.health = this.maxhealth;
				}
				this.showProperty('health');
			}
			if(this.endurance < this.maxendurance ){
				this.endurance += Math.floor(1+this.strength/10);
				if(this.endurance > this.maxendurance){
					this.endurance = this.maxendurance;
				}
				this.showProperty('endurance');
			}
			if(this.mana < this.maxmana ){
				this.mana += Math.floor(1+this.wisdom/10);
				if(this.mana > this.maxmana){
					this.mana = this.maxmana;
				}
				this.showProperty('mana');
			}
			if(this.mind < this.maxmind ){
				this.mind += Math.floor(1+this.spirit/10);
				if(this.mind > this.maxmind){
					this.mind = this.maxmind;
				}
				this.showProperty('mind');
			}
		}
		setTimeout("s.regenerate()",1000);
	}
	
	autoAttack(){
		console.log('autoAttack');
		var m = randomMonster();
		attackTarget(m);
		setTimeout("s.autoAttack()",this.timeAttack);
	}
	
	modStat(stat,value){
		var stats = ['health','endurance','mana','mind'];
		if(stats.indexOf(stat) != -1){
			this[stat] += value;
			if(this[stat] > this['max'+stat]){
				this[stat] = this['max'+stat];
			}
			if(this[stat] < 0){
				this[stat] = 0;
			}
			
			this.showProperty(stat);
			return 1;

		}
		return -1;
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

			console.log('hit!');
			defenser.modStat('health',- damages);

			showBars(defenser);
			//defenser.showProperty('health');
			
			if(defenser.health <= 0){
				console.log('dead');
				defenser.computeDeath(attacker);
				return 2;
			}
			return 1;
			
		}
		return -1;
	}
	
	
	computeDeath(){
		this.dead = 1;
		this.regeneration = 0;
		showDead();
		console.log('You are dead');
	}
	
	upgrade(attr){
		var attributes = ['strength','constitution','dexterity','perception','spirit','wisdom','luck','speed'];
		if(attributes.indexOf(attr) != -1){
			if(this.points >= this[attr] ){
				this.points -= this[attr];
				this[attr]++;
				this.calculateStats();
				this.showProperties();
				return 1;
			}
			return 0;
		}
		return -1;
	}
	
	neededExp(){
		return 100*this.level+500;
	}
	
	levelUp(){
		if(this.exp >= this.neededExp()){
			console.log('LEVEL UP !');
			this.exp -= this.neededExp();
			this.level ++;
			this.points += 20;
			this.calculateStats();
			this.showProperties();
			return 1;
		}
		return 0;
	}
	
	crit(){
		//luck > 285 => crit 100% (ça ne doit jamais arriver)
		return Math.random() * 300.0 < 15+this.luck;
	}
	
	
	init(){
		console.log('Initialize');
		this.showProperties();
		setTimeout(this.regenerate,2000);
		console.log('End initialize');
	}
}

