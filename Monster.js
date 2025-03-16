class Monster{
	constructor(id) {
		this.strength = 5;
		this.constitution = 5;
		this.dexterity = 5;
		this.perception = 4;
		this.spirit = 5;
		this.wisdom = 5;
		this.luck = 5;
		
		this.exp = 200;
		this.id = id;
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
	}
	
	
	
	showProperty(prop){			
		var htmlout = document.getElementById('monster'+this.id+prop);
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
	
	attackChar(){
		if(this.health <=0){
			return;
		}
		s.computeAttack(this,s);
		console.log('attack '+this.id);
		this.nextAttack = setTimeout('attackChar('+this.id+')',1000);
	}
	
	computeDeath(attacker){
		attacker.exp += this.exp;
		attacker.totalexp += this.exp;
		attacker.levelUp();
		attacker.showProperty('exp');
		clearTimeout(this.nextAttack);
		return 2;
	}
}