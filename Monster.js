class Monster{
	constructor(id) {
		this.strength = 2;
		this.constitution = 2;
		this.dexterity = 10;
		this.perception = 4;
		this.spirit = 5;
		this.wisdom = 5;
		this.luck = 5;
		this.speed = 8;
		
		this.isMonster = 1;
		this.exp = 200;
		this._id = id;
		this.name = 'sampleMonster';
		this.calculateStats();
		
	}
	
	calculateStats(){
		//console.log('calcStats');
		this.maxhealth = 10+this.constitution*8;
		this.health = this.maxhealth;
		this.maxendurance = 10+this.strength*8;
		this.endurance = this.maxendurance;
		this.maxmana = 10+this.wisdom*8;
		this.mana = this.maxmana;
		this.maxmind = 10+this.spirit*8;
		this.mind = this.maxmind;
		
		this.attack = (this.strength / 5)*10;//changer par l'attaque de l'arme
		this.defense = 5;//changer par l'armure
		this.precision = 10+this.perception*5;
		this.dodge = 10+this.perception*5;
		this.timeAttack = Math.floor(1000 * (50.0 / (10+this.speed)));
	}
	
	
	
	showProperty(prop){			
		var htmlout = document.getElementById('monster'+this._id+prop);
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
	
	/*
	attackChar(){
		if(this.health <=0){
			return;
		}
		s.computeAttack(this,s);
		console.log('attack '+this.id);
		this.nextAttack = setTimeout('attackChar('+this.id+')',this.timeAttack);
	}
	*/
	
	doAction(){
		
		var c = randomCharacter();
		if(c){
			console.log(this.name+this._id+' attack '+c.name);
			s.computeAttack(this,c);
		}else{
			console.log(this.name+' : i\'m hungry !');
		}
		setTimeout('doAction("m",'+this._id+')',this.timeAttack);
	}
	
	computeDeath(attacker){
		//Todo:gerer si un monstre en tue un autre
		//donner l'exp au groupe, pas au perso
		attacker.exp += this.exp;
		attacker.totalexp += this.exp;
		attacker.levelUp();
		attacker.showProperty('exp');
		clearTimeout(this.nextAttack);
		removeEnnemy(this._id);
		return 2;
	}
}