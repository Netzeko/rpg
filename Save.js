class Save{
	constructor() {
		this.level = 1;
		
		
		
		//Attributes
		// https://en.wikipedia.org/wiki/Attribute_(role-playing_games)
		this.strength = 5;
		this.constitution = 5;
		this.dexterity = 5;
		this.perception = 5;
		this.spirit = 5;
		this.wisdom = 5;
		this.luck = 5;
		
		this.calculateStats();
		
		this.exp = 0;
		this.totalexp = 0;
		this.points = 0;
		this.playername = 'Zero';
	}
	
	calculateStats(refresh = false){
		this.maxhealth = 10+this.level+this.constitution*5;
		this.maxendurance = 10+this.level+this.strength*5;
		this.maxmana = 10+this.level+this.wisdom*5;
		this.maxmind = 10+this.level+this.spirit*5;
		
		if(refresh){
			this.health = this.maxhealth;
			this.endurance = this.maxendurance;
			this.mana = this.maxmana;
			this.mind = this.maxmind;
		}
		
		this.attack = (this.strength / 5)*10;//changer par l'attaque de l'arme
		this.defense = 5;//changer par l'armure
		this.precision = 10+this.perception*5;
		this.dodge = 10+this.perception*5;
	}
	
	
	loadFromCookie(savename = ''){
		var data = getCookie('save'+savename);
		if(data.length == 0){
			return false;
		}
		var dataArray = data.split('/');
		console.log('loading '+savename+', '+dataArray.length+' properties');
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
	
	
	saveInCookie(savename = ''){
		console.log('saving '+savename);
		var keys = Object.keys(this);
		var savetext = '';
		for(var i = 0;i<keys.length;i++){
			//console.log('prop '+keys[i]);
			savetext+=''+keys[i]+':'+this[keys[i]]+':'+(typeof this[keys[i]])+'/';
		}
		setCookie('save'+savename,savetext);
	}
	
	showProperty(prop){			
		var htmlout = document.getElementById(prop);
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
		if(this.health < this.maxhealth){
			this.health += 1;
			this.showProperty('health');
		}
		setTimeout("s.regenerate()",2000);
	}
	
	/*Retourne -1 si impossible, 0 si manqué, 1 si touché, 2 si mort*/
	attackTarget(monster){
		if(this.health > 0){
			var result = monster.attacked(this);
			//console.log(xp);return;
			if(result < 2){
				return result;
			}
			
			this.exp += monster.exp;
			this.totalexp += monster.exp;
			this.showProperty('exp');
			this.levelUp();
			return 2;
			
			/*
			this.health -= 1;
			this.exp += 1;
			this.showProperty('health');
			this.showProperty('exp');*/
		}
		return -1;
	}
	
	upgrade(attr){
		var attributes = ['strength','constitution','dexterity','perception','spirit','wisdom','luck'];
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
	
	
	init(){
		console.log('Initialize');
		this.showProperties();
		setTimeout(this.regenerate,2000);
		console.log('End initialize');
	}
}

