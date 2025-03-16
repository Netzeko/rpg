class Character extends Creature{
	constructor(name,id) {
		super(name,id);
		
		this.isCharacter = 1;
		this.exp = 0;
		this.totalexp = 0;
		this.skillpoints = 0;
		this.points = 0;
		
		this.dead = 0;
		this.regeneration = 1;
		this.skillsLearned = '';
		this._skills = [];
		this.maxqslot = 6;
		this._quickSlots = [null,null,null,null,null,null];
		this.maxequip = 12
		this._equipSlots = [null,null,null,null,null,null,
												null,null,null,null,null,null];
		this._equipSlotsNames = ['headgear','right hand','armor','left hand','gloves','necklace',
														'belt','bracelet','pants','ring','boots','ring' ];
		this._equipSlotsType = ['headgear','hand','armor','hand','gloves','necklace',
														'belt','bracelet','pants','ring','boots','ring' ];
		
		

		
	}
	
	loadFromCookie(savename=''){
		var data = getCookie('save'+savename+'char'+this.name);
		if(data.length == 0){
			return false;
		}
		var dataArray = data.split('/');
		console.log('loading '+this.name+', '+dataArray.length+' properties');
		for(var i = 0;i<dataArray.length;i++){
			
			var variable = dataArray[i].split(':');
			if(variable[0].length ==0) continue;
			if(variable.length < 3) continue;
			
			//console.log('loading prop '+variable[0]+'='+variable[1]+' ('+variable[2]+')');
			if(variable[2].localeCompare('number') == 0){
				this[variable[0]] = Number(variable[1]);
			}else if(variable[2].localeCompare('string') == 0){
				this[variable[0]] = variable[1];
			}
			//console.log('saved as '+typeof this[variable[0]]);
			
		}
		
		this.loadSkills();
		this.loadQuickSlots(savename);
		this.loadEquipments(savename);
	}
	
	loadQuickSlots(savename){
		console.log('Loading qslots...');
		//var listItems = this.itemList.split(',');
		for(var i = 0;i<this.maxqslot;i++){
			if(!this['qslot'+i]) continue;
			let itemSave = this['qslot'+i].split('_');
			let item = new window[itemSave[0]](idnextitem++);
			this._quickSlots[i] = item;
			items[item._id] = item;
			item._character = this;
			item.loadFromCookie(savename,itemSave[1]);
			this['qslot'+i] = null;
			//addItem(item);
		}
	}
	
	loadEquipments(savename){
		console.log('Loading equipments...');
		//var listItems = this.itemList.split(',');
		for(var i = 0;i<this.maxequip;i++){
			if(!this['equip'+i]) continue;
			let itemSave = this['equip'+i].split('_');
			let item = new window[itemSave[0]](idnextitem++);
			this._equipSlots[i] = item;
			items[item._id] = item;
			item._character = this;
			item.loadFromCookie(savename,itemSave[1]);
			this['equip'+i] = null;
			//addItem(item);
		}
	}
	
	saveInCookie(savename=''){
		console.log('saving '+this.name);
		
		this.saveQuickSlots(savename);
		this.saveEquipments(savename);

		var keys = Object.keys(this);
		var savetext = '';
		for(var i = 0;i<keys.length;i++){
			if(keys[i][0] == '_') continue;
			//console.log('saving prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+savename+'char'+this.name,savetext);
	}
	
	saveQuickSlots(savename){
		console.log('saving quickslots...');
		//this.qslotList = '';
		for(let i=0;i<this._quickSlots.length;i++){
			if( !this._quickSlots[i]) continue;
			console.log('index'+i);
			//this.qslotList += this._quickSlots[i].getClassName()+'_'+this._quickSlots[i]._id+',';			
			this._quickSlots[i].saveInCookie(savename);
			this['qslot'+i] = this._quickSlots[i].getClassName()+'_'+this._quickSlots[i]._id;
		}
	}
	
	saveEquipments(savename){
		console.log('saving equipments...');
		for(let i=0;i<this._equipSlots.length;i++){
			if( !this._equipSlots[i]) continue;
			console.log('index'+i);
			this._equipSlots[i].saveInCookie(savename);
			this['equip'+i] = this._equipSlots[i].getClassName()+'_'+this._equipSlots[i]._id;
		}
	}
	
	showProperty(prop){			
		var htmlout = document.getElementById(prop+this._id);
		if(htmlout){
			htmlout.innerHTML = this[prop];
		}
	}
	
	showProperties(){
		var keys = Object.keys(this);
		for(var i = 0;i<keys.length;i++){
			this.showProperty(keys[i]);
		}
		showSkillsChar(this._id);
		showBars(this);
	}
	
	regenerate(force = false){
		if( this.regeneration || force){		
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
			showBars(this);
		}
		
		//setTimeout("regenerate()",1000);
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
			showBars(this);
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
		showDead(this._id);
		console.log('You are dead');
	}
	
	resurrect(){
		if(!this.dead) return;
		this.dead = 0;
		this.health = 1;
		this.regeneration = 1;
		showAlive(this._id);
	}
	
	removeItem(item){
		console.log('character removeitem');
		if(item.usable && this._quickSlots.indexOf(item) > -1){
			this._quickSlots[this._quickSlots.indexOf(item)] = null;
			return 1;
		}else if(item.equipment && this._equipSlots.indexOf(item) > -1){
			console.log('character removeitem : found');
			item.unequip();
			//this._equipSlots[this._equipSlots.indexOf(item)] = null;
			return 1;
		}
		return 0;
	}
	
	addItem(item,slot){
		//console.log(item);
		//console.log(slot);
		if(slot <100 ){
			if(this._quickSlots[slot]) return 0;//TODO : inverser equipement si deja pris
			if(this._quickSlots.indexOf(item) > -1){
				this._quickSlots[this._quickSlots.indexOf(item)] = null;
			}
			else if(item._character){
				item._character.removeItem(item);
			}
			item._character = this;
			this._quickSlots[slot] = item;
			return 1;
		}else{ //Equipement
			slot -=100;
			if(this._equipSlots[slot]) return 0;
			item.unequip();
			item.equip(this,slot);
			item._character = this;
			return 1;

		}
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
			this.skillpoints += 1;
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
	
	learnSkill(skill){
		if(this._skills.indexOf(skill) != -1){
			console.log('skill already learned');
			return;
		}
		if(this.skillpoints <= 0){
			console.log('no skillpoint');
			return;
		}
		this._skills[this._skills.length] = skill;
		this._skills[skill.getClassName()] = skill;
		this.skillsLearned += skill.getClassName()+',';
		this.skillpoints--;
		this.showProperties();
	}
	
	loadSkills(){
		console.log('loading skills for '+this.name);
		this._skills = [];
		var listNames = this.skillsLearned.split(',');
		for(var i=0;i<listNames.length;i++){
			if(listNames[i].length <= 0) continue;
			console.log('-adding '+listNames[i]);
			this._skills[this._skills.length] = skills[listNames[i]];
			this._skills[listNames[i]] = skills[listNames[i]];
		}
	}
	
	doAction(){
		var m = randomMonster();
		if(m){
			console.log(this.name+' attack '+m.name);

			s.computeAttack(this,m);
		}else{
			//console.log(this.name+' : i don\'t know...');
		}
		setTimeout('doAction("c",'+this._id+')',this.timeAttack);
	}
	
	
	
	
	init(){
		console.log('Initialize');
		this.showProperties();
		setTimeout(this.regenerate,2000);
		console.log('End initialize');
	}
}

